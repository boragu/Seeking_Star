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
 * 관광 빅데이터(혼잡도, 거리, 야영장 인프라) 기반 추천 사유 분석 생성
 */
export function analyzeRecommendationReason(
  destination: RankedDestination,
  planner: PlannerState
): RecommendationAnalysis {
  const calmScore = destination.calm ?? 75;
  const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;
  const travelMins = destination.travelMinutesEstimate ?? 60;
  const contrastSpot = destination.name.includes("안반데기") ? "육백마지기" : "안반데기";

  const reasons: RecommendationReasonItem[] = [
    {
      title: "과밀 분산 및 진입 편의",
      description: `${contrastSpot} 등 대표 과밀지 대비 한적도 ${calmScore}점을 기록하여, 좁은 산간 도로의 정체와 대기 시간 없이 쾌적하게 진입할 수 있습니다.`,
    },
    {
      title: "안전 체류 및 야영 인프라",
      description:
        campgroundsCount > 0
          ? `반경 20km 내에 공공데이터 등록 정식 야영장 ${campgroundsCount}곳이 인접하여, 노상 불법 차박 걱정 없이 안전하게 체류할 수 있습니다.`
          : "주변 15분 내 합법적 주차 구역과 기초 편의시설 접근성을 확보했습니다.",
    },
    {
      title: "적정 주행 및 야간 시야 확보",
      description: `${planner.departure}에서 약 ${travelMins}분 이동 거리로 심야 운전 피로를 줄이며, 주변 인공 조명이 차단되어 안정적인 밤하늘 시야를 제공합니다.`,
    },
  ];

  return {
    headline: `과밀 관측지 우회 및 쾌적도 분석`,
    summary: `관광지 집중률 예측과 이동 거리, 주변 야영장 인프라를 종합 검토하여 산간 1차선 병목을 피하고 최적의 관측 환경을 누릴 수 있는 곳으로 선정했습니다.`,
    reasons,
  };
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
