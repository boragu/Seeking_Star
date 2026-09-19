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
  planner: PlannerState,
  rankIndex: number = 0
): RecommendationAnalysis {
  const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
  const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;
  const relatedCount = destination.relatedPlaces?.length ?? 0;
  const travelMins = destination.travelMinutesEstimate ?? (destination.distanceKm ? Math.round((destination.distanceKm / 70) * 60) : 60);
  const distance = destination.distanceKm ? `${destination.distanceKm}km` : `약 ${travelMins}분`;
  const isHighDensity = calmScore < 50;
  
  const isRecommended = rankIndex < 5 && (destination.analysis.total ?? 0) >= 60;

  let headline = `${destination.name} 추천 이유`;
  let summary = "";

  if (!isRecommended) {
    headline = `${destination.name} 관측 보류/주의 안내`;
    summary = `데이터 종합 분석 결과 추천 순위가 다소 낮게 산출되었습니다. 혼잡도나 이동 거리, 야영 인프라 등의 측면에서 다음 요소들을 고려하여 방문을 신중히 결정해 주세요.`;
  } else if (isHighDensity) {
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

  // 1. 혼잡 분산 & 진입 여유 (비추천/추천 분기)
  if (!isRecommended && isHighDensity) {
    reasons.push({
      title: "혼잡도 초과 우려",
      description: `현재 한적도 ${calmScore}점으로 야간 방문객 집중률이 매우 높게 예측됩니다. 좁은 산간 도로 진입 시 장시간 정체가 발생할 수 있습니다.`,
    });
  } else if (isHighDensity) {
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

  // 2. 이동 효율 & 안전 주행 (비추천/추천 분기)
  if (!isRecommended && travelMins > 150) {
    reasons.push({
      title: "장거리 심야 운전 주의",
      description: `${planner.departure}에서 편도 ${distance}(약 ${travelMins}분)가 소요되어, 야간/새벽 시간대 왕복 운전 시 피로도 누적이 우려됩니다.`,
    });
  } else if (travelMins <= 90) {
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

  // 3. 합법 체류 & 야영 인프라 (비추천/추천 분기)
  if (!isRecommended && campgroundsCount === 0) {
    reasons.push({
      title: "정식 체류 인프라 부족",
      description: `반경 20km 내에 공공데이터에 등록된 정식 캠핑장이 부족합니다. 무단 차박이나 불법 야영을 피하기 위한 숙박 대안 확인이 필요합니다.`,
    });
  } else if (campgroundsCount > 0) {
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

export interface AiJourneyBriefingResult {
  personaSummary: string;
  goldenKeyPoints: string[];
  safetyAndComfortTips: string[];
  departureTimingAdvice: string;
}

/**
 * 사용자 여행 플래너 조건(출발지, 날짜, 배려/접근성, 테마)과
 * 관광공사/기상청 공공데이터를 결합한 초개인화 AI 여정 브리핑 생성
 */
export function generateAiJourneyBriefing(
  destination: Destination,
  planner: PlannerState
): AiJourneyBriefingResult {
  const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
  const isAccessible = planner.accessibility;
  const isWeekend = planner.date ? [0, 5, 6].includes(new Date(planner.date).getDay()) : false;
  const travelMins = destination.travelMinutesEstimate ?? 60;
  const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;

  // 1. 개인화 여행 페르소나 브리핑 요약
  let personaSummary = `${planner.departure}에서 출발하여 ${destination.name}으로 향하는 밤하늘 여정입니다. `;
  if (calmScore >= 75) {
    personaSummary += `대도시 근교의 인파 과밀을 피해 고요하고 깨끗한 밤하늘을 만끽할 수 있는 안심 관측 코스입니다.`;
  } else {
    personaSummary += `전국적인 인기로 야간 방문객이 많으므로 진입로 병목과 주차 여건을 고려한 스마트 분산 이동이 필요합니다.`;
  }

  // 2. 핵심 안심 관측 포인트 (3개)
  const goldenKeyPoints: string[] = [];

  if (travelMins <= 90) {
    goldenKeyPoints.push(`편도 약 ${travelMins}분대의 가벼운 주행으로 심야 귀가 운전 피로를 최소화할 수 있습니다.`);
  } else {
    goldenKeyPoints.push(`편도 약 ${travelMins}분의 중장거리 코스로, 중간 휴게소 경유와 졸음운전 방지 휴식이 권장됩니다.`);
  }

  if (campgroundsCount > 0) {
    goldenKeyPoints.push(`인근 20km 내 등록 야영장(${campgroundsCount}곳)이 있어 무단 차박 없이 합법적 체류가 가능합니다.`);
  } else {
    goldenKeyPoints.push(`주변 지정 야영 인프라가 제한적이므로 당일 야간 관측 후 안전 복귀 일정을 권장합니다.`);
  }

  if (isAccessible) {
    goldenKeyPoints.push(
      destination.accessible
        ? "휠체어·유아차 진입로와 평지 주차 공간이 확보된 무장애(Barrier-Free) 안심 관측지입니다."
        : "비포장 산간 진입로나 계단이 있을 수 있으니 사전 이동 동선 확인을 권장합니다."
    );
  } else {
    goldenKeyPoints.push(
      calmScore >= 75
        ? "주변 광공해가 차단된 고지대로 은하수 및 계절 별자리 관측 선명도가 높습니다."
        : "차량 헤드라이트 간섭을 피해 주차장 안쪽 관측 포인트 선점을 추천합니다."
    );
  }

  // 3. 출발 및 이동 타이밍 조언
  let departureTimingAdvice = "";
  if (isWeekend) {
    departureTimingAdvice = `주말 야간 정체를 피해 ${destination.name} 도착 기준 22:30 이후 또는 일몰 직후(19:30 전후) 빠른 도착을 추천합니다.`;
  } else {
    departureTimingAdvice = `평일 야간은 진입로가 비교적 한적하므로 21:00~23:00 사이 여유로운 출발이 최적입니다.`;
  }

  // 4. 안전 및 체류 팁
  const safetyAndComfortTips = [
    "산간 고지대는 평지 대비 기온이 5~8℃ 낮으므로 계절 무관 방한 외투 필수",
    "야간 관측 시 타인 시야 방해 방지를 위해 적색 라이트 또는 스마트폰 밝기 최소화",
    "국립공원 및 지자체 조례에 따라 지정 구역 외 취사/야영/불멍 엄격 금지",
  ];

  return {
    personaSummary,
    goldenKeyPoints,
    safetyAndComfortTips,
    departureTimingAdvice,
  };
}
