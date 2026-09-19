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

export type ScoreKey = keyof typeof scoringWeights;
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

export function scoreDestination(
  destination: Destination,
  preferences: Pick<PlannerState, "accessibility"> | { accessibility?: boolean } = {},
): DestinationAnalysis {
  const breakdown: ScoreBreakdown = {};

  // 1. 혼잡 분산도 (한적도)
  if (destination.calm !== null) {
    breakdown.crowd = Math.round(clamp(destination.calm));
  }

  // 2. 이동 효율성
  if (destination.travelMinutesEstimate !== null) {
    breakdown.travel = Math.round(clamp(100 - (destination.travelMinutesEstimate / 240) * 45));
  }

  // 3. 인근 캠핑/차박 편의 (반경 20km 내 캠핑장 수 + 근접 거리 보너스)
  if (destination.nearbyCampgrounds && destination.nearbyCampgrounds.length > 0) {
    const closestKm = Math.min(...destination.nearbyCampgrounds.map((c) => c.distanceKm ?? 20));
    const proximityBonus = closestKm <= 5 ? 10 : closestKm <= 10 ? 5 : 0;
    breakdown.camping = Math.round(clamp(60 + Math.min(5, destination.nearbyCampgrounds.length) * 6 + proximityBonus));
  }

  // 4. 연관 관광 연계성 (연관 관광지 수 + 빅데이터 상위 연계 순위 보너스)
  if (destination.relatedPlaces && destination.relatedPlaces.length > 0) {
    const hasTopRank = destination.relatedPlaces.some((p) => p.rank !== undefined && p.rank !== null && p.rank <= 3);
    const rankBonus = hasTopRank ? 8 : 0;
    breakdown.sightseeing = Math.round(clamp(60 + Math.min(5, destination.relatedPlaces.length) * 6 + rankBonus));
  }

  if (destination.cloud !== null) breakdown.sky = Math.round(clamp(100 - destination.cloud));
  if (destination.parkingMinutes !== null) breakdown.parking = Math.round(clamp(100 - destination.parkingMinutes * 1.65));

  if (preferences.accessibility && destination.accessible !== null) {
    breakdown.accessibility = destination.accessible ? 100 : 20;
  }

  const available = (Object.entries(breakdown) as [ScoreKey, number][]).filter(([key]) => (scoringWeights[key] ?? 0) > 0);
  const availableWeight = available.reduce((sum, [key]) => sum + (scoringWeights[key] ?? 0), 0);
  const total = availableWeight === 0
    ? null
    : Math.round(available.reduce((sum, [key, value]) => sum + value * (scoringWeights[key] ?? 0), 0) / availableWeight);
  const strongest = [...available].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key]) => key);
  const dataCompleteness = Math.round((available.length / 5) * 100);

  return { total, breakdown, strongest, dataCompleteness };
}

export function rankDestinations(
  items: Destination[],
  preferences: Pick<PlannerState, "accessibility"> | { accessibility?: boolean } = {},
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
