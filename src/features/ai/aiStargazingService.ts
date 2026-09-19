import type { Destination, PlannerState, RouteEstimate } from "../../domain/types";
import type { RankedDestination } from "../../lib/recommendationEngine";

export interface RecommendationReasonItem {
  title: string;
  description: string;
}

export interface RecommendationAnalysis {
  headline: string;
  summary: string;
  reasons: RecommendationReasonItem[];
}

export interface StargazingObservationGuide {
  summary: string;
  targetConstellation: string;
  viewingDirection: string;
  optimalTime: string;
  moonCondition: string;
  cameraSetting: string;
  fieldEtiquette: string[];
}

/**
 * 관광 빅데이터(혼잡도, 거리, 야영장 인프라) 기반 장소별 맞춤 추천 사유 분석 생성
 */
export function analyzeRecommendationReason(
  destination: RankedDestination,
  planner: PlannerState
): RecommendationAnalysis {
  const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
  const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;
  const relatedCount = destination.relatedPlaces?.length ?? 0;
  const travelMins = destination.travelMinutesEstimate ?? (destination.distanceKm ? Math.round((destination.distanceKm / 70) * 60) : 60);
  const distance = destination.distanceKm ? `${destination.distanceKm}km` : `약 ${travelMins}분`;
  const isHighDensity = calmScore < 50;

  let headline = `${destination.name} 추천 이유`;
  let summary = "";

  if (isHighDensity) {
    headline = `${destination.name} 관측 및 방문 유의 안내`;
    summary = `전국적 인지도로 야간 방문객 집중률이 높은 명소입니다. 산간 진입로 정체와 주차 대기 시간을 고려하여 심야 시간대 분산 방문을 권장합니다.`;
  } else if (calmScore >= 80) {
    headline = `과밀 명소 우회: 한적한 밤하늘과 여유로운 진입`;
    summary = `대표 과밀 명소(안반데기·육백마지기 등)의 좁은 산간 병목과 주차 대기를 피해, 한적하고 쾌적하게 별을 관측할 수 있는 대안 장소입니다.`;
  } else {
    headline = `이동 거리와 체류 편의의 균형 잡힌 관측지`;
    summary = `출발지 이동 소요시간과 현장 체류 인프라가 고르게 갖추어져 있어 심야에도 안전하게 다녀올 수 있는 관측지입니다.`;
  }

  const reasons: RecommendationReasonItem[] = [];

  // 1. 혼잡 분산 & 진입 여유
  if (isHighDensity) {
    reasons.push({
      title: "혼잡 분산 권장",
      description: `현재 한적도 ${calmScore}점으로 야간 방문객이 많습니다. 진입로 정체를 피해 밤 22시 이후 또는 평일 방문을 권장합니다.`,
    });
  } else {
    const contrast = destination.name.includes("안반데기") ? "주요 과밀지" : "안반데기 등 과밀 명소";
    reasons.push({
      title: "과밀 분산 & 원활한 진입",
      description: `${contrast} 대비 한적도 ${calmScore}점으로, 산간 1차선 병목이나 장시간 주차 대기 없이 여유롭게 진입할 수 있습니다.`,
    });
  }

  // 2. 이동 효율 & 안전 주행
  if (travelMins <= 90) {
    reasons.push({
      title: "적정 주행 & 심야 운전 안전",
      description: `${planner.departure}에서 편도 ${distance}(약 ${travelMins}분) 소요로 심야 왕복 운전 피로를 크게 줄일 수 있습니다.`,
    });
  } else {
    reasons.push({
      title: "광공해 차단 & 탁 트인 시계",
      description: `${planner.departure} 기준 ${distance} 떨어진 청정 고지대로, 도심 인공 조명이 차단되어 안정적인 밤하늘 시야를 제공합니다.`,
    });
  }

  // 3. 합법 체류 & 야영 인프라
  if (campgroundsCount > 0) {
    reasons.push({
      title: "합법 체류 & 안전 야영 인프라",
      description: `반경 20km 내에 공공데이터 등록 정식 캠핑장 ${campgroundsCount}곳이 있어, 노상 불법 차박 없이 안전하게 머무를 수 있습니다.`,
    });
  } else if (relatedCount > 0) {
    reasons.push({
      title: "주변 연계 관광 인프라",
      description: `인근에 ${relatedCount}곳의 문화·자연 관광지가 연계되어 있어 주간 여행과 야간 관측 일정을 함께 구성할 수 있습니다.`,
    });
  } else {
    reasons.push({
      title: "기초 편의시설 접근성",
      description: "합법적 주차 공간과 기초 편의시설 접근성을 확보하여 야간 체류의 안전을 지원합니다.",
    });
  }

  return { headline, summary, reasons };
}



/**
 * 일시 및 관측지 좌표 기반 현장 관측 가이드 생성
 */
export function generateObservationGuide(
  destination: Destination,
  planner: PlannerState,
  _route: RouteEstimate | null
): StargazingObservationGuide {
  const dateObj = new Date(planner.date || Date.now());
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  let targetConstellation = "페르세우스자리 & 카시오페이아";
  let viewingDirection = "동북쪽 하늘 45°";
  if (month >= 5 && month <= 9) {
    targetConstellation = "전갈자리 & 궁수자리 (은하수 중심부)";
    viewingDirection = "남동쪽 지평선 위 30~50°";
  } else if (month >= 10 || month <= 2) {
    targetConstellation = "오리온자리 & 플레이아데스 성단";
    viewingDirection = "남쪽 하늘 고고도";
  }

  const moonPhaseDay = (day + month * 2) % 30;
  const isMoonLow = moonPhaseDay <= 7 || moonPhaseDay >= 23;

  return {
    summary: `${destination.name}의 ${planner.date} 관측 환경: 광공해가 적고 시계가 트여 ${targetConstellation} 관측에 유리합니다.`,
    targetConstellation,
    viewingDirection,
    optimalTime: "밤 22:30 ~ 익일 02:00 (천체 최고 고도 시간대)",
    moonCondition: isMoonLow
      ? "월령 조건 우수 (달빛 간섭이 적어 미세 성운 관측에 최적)"
      : "달빛 간섭 보통 (달이 진 후 심야 시간대 관측 권장)",
    cameraSetting: "셔터 15초 · ISO 1600~3200 · F2.8 이하 최대개방 (삼각대 필수)",
    fieldEtiquette: [
      "야간 암적응 및 타인 관측 배려를 위해 붉은색 조명 사용",
      "고지대 야간 기온 급강하에 대비한 방한 외투 준비",
      "쓰레기 전량 수거 및 지정된 정식 야영장 외 취사 금지",
    ],
  };
}
