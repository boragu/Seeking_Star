import type { Destination, PlannerState } from "../domain/types";

export const scoringWeights = Object.freeze({
  crowd: 0.35,
  travel: 0.25,
  camping: 0.20,
  sightseeing: 0.10,
  accessibility: 0.10,
  sky: 0.05,
  parking: 0.05,
});

export type ScoreKey = "crowd" | "travel" | "camping" | "sightseeing" | "accessibility" | "sky" | "parking";
export type ScoreBreakdown = Partial<Record<ScoreKey, number>>;

export interface DestinationAnalysis {
  total: number | null;
  breakdown: ScoreBreakdown;
  strongest: ScoreKey[];
  dataCompleteness: number;
}

export type RankedDestination = Destination & { analysis: DestinationAnalysis };

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value));

export function parseMinutes(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  const text = String(value ?? "");
  const hours = Number(text.match(/(\d+)시간/)?.[1] ?? 0);
  const minutes = Number(text.match(/(\d+)분/)?.[1] ?? 0);
  return hours * 60 + minutes;
}

export function getScoringWeights(preferences: Partial<PlannerState> = {}): Record<ScoreKey, number> {
  const people = preferences.people || "2";
  const transport = preferences.transport || "car";
  const accessibility = Boolean(preferences.accessibility);

  // 기본 가중치
  const weights: Record<ScoreKey, number> = {
    crowd: 0.35,
    travel: 0.25,
    camping: 0.20,
    sightseeing: 0.10,
    accessibility: 0.05,
    sky: 0.05,
    parking: 0.05,
  };

  // 1. 인원수에 따른 가중치 조정
  if (people === "1") {
    // 솔로 관측: 고요한 밤하늘과 안전 운전 중심
    weights.crowd = 0.40;
    weights.travel = 0.25;
    weights.camping = 0.10;
    weights.sky = 0.15;
  } else if (people === "3" || people === "4") {
    // 3인 이상 가족/그룹: 캠핑 체류 편의, 연계 관광 및 주차 인프라 최우선
    weights.crowd = 0.25;
    weights.camping = 0.30;
    weights.sightseeing = 0.15;
    weights.parking = 0.10;
  }

  // 2. 이동 수단에 따른 가중치 조정
  if (transport === "rental") {
    // 렌터카: 초행길 안전 및 정비된 도로/체류지 우선
    weights.travel += 0.05;
    weights.parking += 0.05;
  }

  // 3. 무장애 편의시설 옵션 활성화 시
  if (accessibility) {
    weights.accessibility = 0.30;
    weights.crowd = Math.max(0.15, weights.crowd - 0.10);
    weights.camping = Math.max(0.10, weights.camping - 0.10);
  }

  return weights;
}

export function scoreDestination(
  destination: Destination,
  preferences: Partial<PlannerState> = {},
): DestinationAnalysis {
  const breakdown: ScoreBreakdown = {};
  const currentWeights = getScoringWeights(preferences);

  // 1. 혼잡 분산도 (한적도)
  if (destination.calm !== null) {
    breakdown.crowd = Math.round(clamp(destination.calm));
  }

  // 2. 이동 효율성
  if (destination.travelMinutesEstimate !== null) {
    const travelPenalty = preferences.transport === "rental" ? 50 : 45;
    breakdown.travel = Math.round(clamp(100 - (destination.travelMinutesEstimate / 240) * travelPenalty));
  }

  // 3. 인근 캠핑/차박 편의 (인원수 맞춤 보너스)
  if (destination.nearbyCampgrounds && destination.nearbyCampgrounds.length > 0) {
    const closestKm = Math.min(...destination.nearbyCampgrounds.map((c) => c.distanceKm ?? 20));
    const proximityBonus = closestKm <= 5 ? 12 : closestKm <= 10 ? 6 : 0;
    const capacityBonus = (preferences.people === "3" || preferences.people === "4") ? 10 : 0;
    breakdown.camping = Math.round(clamp(60 + Math.min(5, destination.nearbyCampgrounds.length) * 6 + proximityBonus + capacityBonus));
  }

  // 4. 연관 관광 연계성
  if (destination.relatedPlaces && destination.relatedPlaces.length > 0) {
    const hasTopRank = destination.relatedPlaces.some((p) => p.rank !== undefined && p.rank !== null && p.rank <= 3);
    const rankBonus = hasTopRank ? 8 : 0;
    breakdown.sightseeing = Math.round(clamp(60 + Math.min(5, destination.relatedPlaces.length) * 6 + rankBonus));
  }

  if (destination.cloud !== null) breakdown.sky = Math.round(clamp(100 - destination.cloud));
  if (destination.parkingMinutes !== null) breakdown.parking = Math.round(clamp(100 - destination.parkingMinutes * 2));

  // 5. 무장애 편의시설 점수
  if (destination.accessible !== null && destination.accessible !== undefined) {
    breakdown.accessibility = destination.accessible ? 100 : 25;
  } else if (preferences.accessibility) {
    breakdown.accessibility = 50;
  }

  const available = (Object.entries(breakdown) as [ScoreKey, number][]).filter(([key]) => (currentWeights[key] ?? 0) > 0);
  const availableWeight = available.reduce((sum, [key]) => sum + (currentWeights[key] ?? 0), 0);
  const total = availableWeight === 0
    ? null
    : Math.round(available.reduce((sum, [key, value]) => sum + value * (currentWeights[key] ?? 0), 0) / availableWeight);
  const strongest = [...available].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key]) => key);
  const dataCompleteness = Math.round((available.length / 5) * 100);

  return { total, breakdown, strongest, dataCompleteness };
}

export function rankDestinations(
  items: Destination[],
  preferences: Partial<PlannerState> = {},
): RankedDestination[] {
  return items
    .map((destination) => ({ ...destination, analysis: scoreDestination(destination, preferences) }))
    .sort((a, b) => {
      if (a.analysis.total === null && b.analysis.total === null) return a.name.localeCompare(b.name, "ko");
      if (a.analysis.total === null) return 1;
      if (b.analysis.total === null) return -1;
      return b.analysis.total - a.analysis.total;
    });
}
