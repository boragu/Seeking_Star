import type { Destination, PlannerState, RouteEstimate } from "../../domain/types";
import { calculateAstronomicalConditions, calculateMoonPhase } from "../../lib/currentContext";
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
  transportAdvice: string;
  peopleAdvice: string;
  fieldEtiquette: string[];
}

/**
 * 관광 빅데이터(혼잡도, 거리, 야영장 인프라) + 인원/이동수단/무장애 설정 기반 맞춤 추천 사유 분석
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
  const people = planner.people || "2";
  const transport = planner.transport || "car";
  const accessibility = planner.accessibility;

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
    summary = `대표 과밀 명소의 좁은 산간 병목과 주차 대기를 피해, 한적하고 쾌적하게 별을 관측할 수 있는 대안 장소입니다.`;
  } else {
    headline = `이동 거리와 체류 편의의 균형 잡힌 관측지`;
    summary = `출발지 이동 소요시간과 현장 체류 인프라가 고르게 갖추어져 있어 심야에도 안전하게 다녀올 수 있는 관측지입니다.`;
  }

  const reasons: RecommendationReasonItem[] = [];

  // 1. 혼잡 분산 & 진입 여유
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

  // 2. 이동 효율 & 교통 수단 맞춤 주행
  if (transport === "rental") {
    reasons.push({
      title: "렌터카 운행 적합성",
      description: `${planner.departure}에서 편도 ${distance}(약 ${travelMins}분) 소요되며, 주요 간선도로 및 포장 진입로가 확보되어 렌터카로도 안전하게 접근할 수 있습니다.`,
    });
  } else if (!isRecommended && travelMins > 150) {
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

  // 3. 인원별 체류 및 무장애 인프라
  if (accessibility && destination.accessible) {
    reasons.push({
      title: "무장애(Barrier-Free) 편의 시설",
      description: "휠체어·유아차 이용이 가능한 평지 진입로와 장애인 전용 주차구역 등 편의 인프라가 확보된 관측지입니다.",
    });
  } else if (people === "3" || people === "4") {
    if (campgroundsCount > 0) {
      reasons.push({
        title: "가족·단체 체류 캠핑 인프라",
        description: `동행 인원(${people === "4" ? "4인 이상" : `${people}인`})이 함께 머물 수 있는 등록 캠핑장 ${campgroundsCount}곳이 반경 20km 내에 인접해 있습니다.`,
      });
    } else {
      reasons.push({
        title: "단체 편의시설 및 주차 여건",
        description: "다인원 관측에 필요한 주차 공간과 기초 편의시설 접근성을 확보하여 안전한 관측을 지원합니다.",
      });
    }
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
 * 일시, 천문학적 월령, 관측지 좌표 및 사용자 조건 기반 정밀 관측 가이드 생성
 */
export function generateObservationGuide(
  destination: Destination,
  planner: PlannerState,
  _route: RouteEstimate | null
): StargazingObservationGuide {
  const moonInfo = calculateMoonPhase(planner.date);
  const seasonalInfo = calculateAstronomicalConditions(planner.date);
  const people = planner.people || "2";
  const transport = planner.transport || "car";
  const isAccessible = planner.accessibility;

  // 카메라 설정 (월령에 따른 노출 차등화)
  let cameraSetting = "";
  if (moonInfo.interferenceLevel === "none") {
    cameraSetting = "스마트폰: 야간 모드(삼각대 거치 후 10~30초) · 미러리스/DSLR: 셔터 15초, ISO 3200~6400, F2.8 이하 최대개방";
  } else if (moonInfo.interferenceLevel === "low") {
    cameraSetting = "스마트폰: 야간 모드 5~10초 · 미러리스/DSLR: 셔터 10~13초, ISO 1600~3200, F2.8 이하 (달빛 반대편 하늘 촬영)";
  } else {
    cameraSetting = "스마트폰: 프로/전문가 모드(달 표면 확대 촬영) · 미러리스/DSLR: 셔터 1/125~1/250초, ISO 100~400 (달 크레이터 중심)";
  }

  // 인원수 맞춤 조언
  let peopleAdvice = "";
  if (people === "1") {
    peopleAdvice = "나홀로 관측: 고지대 통신 음영 지역에 대비해 지인에게 출발/도착 시간을 공유하고, 개인용 방한 핫팩과 헤드랜턴을 지참하세요.";
  } else if (people === "2") {
    peopleAdvice = "2인 관측: 방한 블랭킷과 접이식 캠핑 체어를 준비하여 계절 별자리 어플리케이션과 함께 편안히 관측해 보세요.";
  } else {
    peopleAdvice = `가족/그룹(${people === "4" ? "4인 이상" : `${people}인`}): 야간 고지대 아동·동행자 안전을 위해 발밑 유도 조명을 준비하고, 돗자리와 보온 음료를 챙기세요.`;
  }

  // 이동 수단 맞춤 조언
  let transportAdvice = "";
  if (transport === "rental") {
    transportAdvice = "렌터카 주행: 산간 진입로에 가로등이 드물고 야생동물이 출현할 수 있으니 하향등을 유지하고 서행 운전하세요.";
  } else {
    transportAdvice = "자가용 주행: 고지대 야간 시동 정지 시 배터리 방전에 유의하시고, 타이어 공기압 및 비상등 작동 상태를 사전 점검하세요.";
  }

  const etiquette = [
    "야간 암적응 및 타인 관측 배려를 위해 붉은색 조명(또는 붉은 셀로판지) 사용",
    "고지대 야간 기온 급강하(평지 대비 5~8℃ 낮음)에 대비한 두터운 방한 외투 필수",
    "쓰레기 전량 회수 및 지정된 정식 야영장 외 무단 차박/취사 금지",
  ];

  if (isAccessible) {
    etiquette.push("교통약자를 위해 무장애 관측 데크와 전용 주차구역 통행로를 항시 비워두세요.");
  }

  return {
    summary: `${destination.name}의 ${planner.date} 관측 환경: ${moonInfo.phaseIcon} ${moonInfo.phaseName}(월령 ${moonInfo.age}일)로 ${moonInfo.optimalViewingAdvice}`,
    targetConstellation: seasonalInfo.targetConstellations,
    viewingDirection: seasonalInfo.milkyWayDirection,
    optimalTime: `${seasonalInfo.optimalTimeWindow} (${seasonalInfo.astronomicalTwilight})`,
    moonCondition: `${moonInfo.phaseIcon} ${moonInfo.phaseName} · 광도율 ${moonInfo.illumination}% (${moonInfo.interferenceLabel})`,
    cameraSetting,
    transportAdvice,
    peopleAdvice,
    fieldEtiquette: etiquette,
  };
}

export interface AiJourneyBriefingResult {
  personaSummary: string;
  goldenKeyPoints: string[];
  safetyAndComfortTips: string[];
  departureTimingAdvice: string;
}

/**
 * 사용자 여행 플래너 조건(출발지, 날짜, 인원, 이동수단, 배려/접근성)과
 * 관광공사/천문 빅데이터를 결합한 초개인화 여정 브리핑 생성
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
  const people = planner.people || "2";
  const transport = planner.transport || "car";
  const moon = calculateMoonPhase(planner.date);

  // 1. 여행 일정 요약
  let personaSummary = `${planner.departure}에서 ${transport === "rental" ? "렌터카로" : "자가용으로"} 이동하는 일정입니다. `;
  if (calmScore >= 75) {
    personaSummary += `${destination.name}은 주변 빛공해가 적고 방문객이 붐비지 않아 여유롭게 밤하늘을 관측하기 좋습니다. (${moon.phaseIcon} ${moon.phaseName})`;
  } else {
    personaSummary += `${destination.name}은 야간 방문객이 집중되는 명소이므로, 진입로 정체와 주차 대기를 피해 심야 시간대 분산 방문을 권장합니다.`;
  }

  // 2. 핵심 안심 관측 포인트 (3개)
  const goldenKeyPoints: string[] = [];

  if (travelMins <= 90) {
    goldenKeyPoints.push(`편도 약 ${travelMins}분 소요로 심야 귀가 운전 부담이 적습니다.`);
  } else {
    goldenKeyPoints.push(`편도 약 ${travelMins}분 거리로, 야간 운전 피로를 줄이기 위한 중간 휴식을 권장합니다.`);
  }

  if (campgroundsCount > 0) {
    goldenKeyPoints.push(`반경 20km 내 등록 야영장(${campgroundsCount}곳)이 있어 무단 차박 없이 안전하게 체류할 수 있습니다.`);
  } else {
    goldenKeyPoints.push(`주변 지정 야영 시설이 부족하므로 관측 후 당일 복귀 일정을 권장합니다.`);
  }

  if (isAccessible) {
    goldenKeyPoints.push(
      destination.accessible
        ? "휠체어 및 유아차 진입로와 평지 주차 공간이 확보되어 있습니다."
        : "비포장 산간 진입로나 계단이 있을 수 있으니 이동 동선 확인이 필요합니다."
    );
  } else {
    goldenKeyPoints.push(
      calmScore >= 75
        ? `고지대 특성상 탁 트인 시야를 제공하며 ${moon.interferenceLabel} 여건입니다.`
        : "차량 조명 간섭을 피하기 위해 주차장 안쪽 관측 지점을 이용하세요."
    );
  }

  // 3. 출발 및 이동 타이밍 조언
  let departureTimingAdvice = "";
  if (isWeekend) {
    departureTimingAdvice = `주말 정체를 피해 ${destination.name}에 22:30 이후 또는 일몰 직후 도착하는 것이 원활합니다.`;
  } else {
    departureTimingAdvice = `평일 야간은 도로가 한적하므로 21:00~23:00 사이 여유롭게 이동하기 좋습니다.`;
  }

  // 4. 안전 및 체류 팁
  const safetyAndComfortTips = [
    "산간 고지대는 평지보다 기온이 5~8℃ 낮으므로 방한 외투 필수 지참",
    "야간 관측 시 타인 시야 방해를 줄이기 위해 붉은색 조명 사용 권장",
    "국립공원 및 지자체 조례에 따라 지정 구역 외 취사/야영 금지",
  ];

  return {
    personaSummary,
    goldenKeyPoints,
    safetyAndComfortTips,
    departureTimingAdvice,
  };
}

/**
 * 백엔드 AI 엔드포인트(/api/ai/guide)를 통한 vLLM 실시간 AI 여정 브리핑 요청 (실패 시 로컬 스마트 가이드로 자동 폴백)
 */
export async function requestAiEnhancedGuide(
  destination: Destination,
  planner: PlannerState,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
    const travelMins = destination.travelMinutesEstimate ?? 60;
    const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;
    const relatedCount = destination.relatedPlaces?.length ?? 0;
    const relatedNames = destination.relatedPlaces?.slice(0, 2).map((r) => r.name).join(", ");
    const moon = calculateMoonPhase(planner.date);

    const prompt = `[여행자 및 천문/관광 공공데이터 컨텍스트]
- 출발지: ${planner.departure}
- 목적지: ${destination.name} (${destination.address || destination.region || "위치 정보"})
- 여행 일자: ${planner.date} (${planner.time} 출발 예정)
- 동행 인원: ${planner.people || 2}명, 이동 수단: ${planner.transport === "rental" ? "렌터카" : "자가용"}
- 무장애/배려 여행 옵션: ${planner.accessibility ? "적용됨 (완만한 진입로 및 편의시설 필요)" : "미적용"}
- 천문 월령 상태: ${moon.phaseName} (월령 ${moon.age}일, 광도율 ${moon.illumination}%, 달빛 간섭 ${moon.interferenceLabel})
- 공공데이터 한적도: ${calmScore}점 / 100점 (대표 과밀 명소 대비 여유도)
- 예상 이동 소요시간: 편도 약 ${travelMins}분
- 인근 정식 등록 야영장: 반경 20km 내 ${campgroundsCount}곳 (합법 체류 인프라)
- 인근 연계 관광지: ${relatedCount}곳${relatedNames ? ` (예: ${relatedNames})` : ""}

[작성 지침]
당신은 한국관광공사 관광빅데이터와 천문 역학 데이터를 결합해 여행자에게 실질적인 도움을 주는 전문 여행 컨설턴트입니다.
위의 출발지, 소요시간, 월령(달빛 여건), 한적도, 야영/연계지 데이터를 모두 자연스럽게 종합하여, 여행자가 현장에서 즉시 참고할 수 있는 담백하고 신뢰감 있는 맞춤 브리핑을 2~3문장으로 작성하세요.
(기계적인 AI 말투나 과장된 홍보성 문구는 배제하고, 마크다운 기호 없이 자연스러운 한국어 문단으로 작성하세요.)`;

    const res = await fetch("/api/ai/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "당신은 한국관광공사 관광 빅데이터 및 천문 관측 데이터를 분석하여 과밀 분산과 안전한 밤하늘 여정을 안내하는 전문 여행 가이드입니다.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * 1. AI 밤하늘 촬영 가이드 요청 (스마트폰 야간/프로 모드 vs 미러리스/DSLR 세팅)
 */
export async function requestAiAstrophotographyGuide(
  destination: Destination,
  planner: PlannerState,
  deviceType: "smartphone" | "camera",
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const moon = calculateMoonPhase(planner.date);
    const astro = calculateAstronomicalConditions(planner.date);
    const calmScore = destination.calm ?? 75;

    const devicePrompt =
      deviceType === "smartphone"
        ? `[촬영 기기]: 스마트폰 (아이폰 야간 모드 / 갤럭시 Pro 모드)
[요구사항]:
1. 권장 촬영 모드 및 삼각대 거치 팁
2. 최적 노출 시간(초), ISO 범위, 초점 고정(AF/MF) 팁
3. 달빛 밝기(${moon.phaseName}, 광도율 ${moon.illumination}%)를 고려한 밤하늘/달 분리 촬영 꿀팁`
        : `[촬영 기기]: 미러리스 / DSLR 카메라
[요구사항]:
1. 렌즈 조리개(F값), 셔터스피드(별 흐름 방지 500법칙 기준 초단위), ISO 감도, 화이트밸런스(K값)
2. 무한대 수동 초점(MF) 및 라이브뷰 확대 맞춤법
3. 달빛 간섭(${moon.interferenceLabel})을 최소화하는 구도 및 노출 브라케팅 팁`;

    const prompt = `[천문 및 환경 데이터]
- 관측지: ${destination.name} (${destination.region})
- 관측 일자: ${planner.date} (${planner.time} 기준)
- 월령 위상: ${moon.phaseIcon} ${moon.phaseName} (월령 ${moon.age}일, 광도 ${moon.illumination}%, 간섭도 ${moon.interferenceLabel})
- 천문학적 박명/골든타임: ${astro.optimalTimeWindow} (${astro.astronomicalTwilight})
- 주요 관측 대상/방향: ${astro.targetConstellations}, 은하수 방향: ${astro.milkyWayDirection}
- 주변 광공해 차단 수준: 한적도 ${calmScore}점 기반 청정 고지대

${devicePrompt}

[작성 지침]
당신은 천체사진 전문가입니다. 위의 실시간 천문 조건(월령, 골든타임, 광공해)을 정확히 반영하여, 초보자도 현장에서 바로 따라 할 수 있는 구체적인 수치(ISO, 셔터스피드 등)와 핵심 촬영 팁을 3~4개의 명확하고 정갈한 불릿 포인트(• 기호)로 작성해 주세요. 불필요한 서론이나 인사말은 생략하고 바로 본론만 작성하세요.`;

    const res = await fetch("/api/ai/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "당신은 천체사진 및 스마트폰/미러리스 야간 촬영 전문 테크니컬 가이드입니다. 실시간 천문 조건에 맞는 정밀 세팅값을 제공합니다.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * 2. 오버투어리즘 대체 스토리텔링 ("왜 유명 과밀지 대신 이곳인가?")
 */
export async function requestAiOvertourismStory(
  destination: Destination,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const calmScore = destination.calm ?? (destination.concentrationRate !== null ? Math.round(100 - destination.concentrationRate) : 75);
    const campgroundsCount = destination.nearbyCampgrounds?.length ?? 0;
    const relatedCount = destination.relatedPlaces?.length ?? 0;

    const prompt = `[관측지 데이터]
- 관측지명: ${destination.name} (${destination.address || destination.region})
- 공공데이터 한적도: ${calmScore}점 / 100점 (높을수록 붐비지 않고 여유로움)
- 반경 20km 내 등록 야영장: ${campgroundsCount}곳
- 인근 연계 관광지: ${relatedCount}곳

[작성 지침]
당신은 지속 가능한 여행과 과밀 분산을 연구하는 여행 에디터입니다.
양평 두물머리, 강릉 안반데기 같은 대표적인 야간 과밀 명소의 극심한 산간 병목과 소음 스트레스와 대비하여,
'${destination.name}'이 여행자에게 선사하는 '고요한 밤하늘의 쉼과 여유로운 접근성'을 한눈에 와닿게 1~2문장의 감성적이면서도 담백한 문구로 작성하세요. (마크다운 기호 없이 순수 텍스트만 출력)`;

    const res = await fetch("/api/ai/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "당신은 오버투어리즘 문제를 해결하고 숨은 청정 여행지의 가치를 발굴하는 여행 에디터입니다.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * 3. 감성적인 AI 맞춤 출발 알림 카피 생성
 */
export async function requestAiAlertMessage(
  destination: Destination,
  planner: PlannerState,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const moon = calculateMoonPhase(planner.date);
    const astro = calculateAstronomicalConditions(planner.date);
    const travelMins = destination.travelMinutesEstimate ?? 60;

    const prompt = `[출발 조건 및 천문 골든타임 데이터]
- 출발지: ${planner.departure}
- 목적지: ${destination.name} (소요시간: 편도 약 ${travelMins}분)
- 관측 일자: ${planner.date}
- 최적 관측 골든타임: ${astro.optimalTimeWindow}
- 월령 상태: ${moon.phaseName} (달빛 간섭: ${moon.interferenceLabel})
- 동행 인원: ${planner.people || 2}인

[작성 지침]
여행자에게 전송할 감성적이면서도 실용적인 스마트폰 푸시 알림 문구를 작성하세요.
- 출발 권장 시각, 목적지의 밤하늘 특징(월령/골든타임), 필수 준비물(방한 외투 등)을 포함해 1~2문장의 정중하고 설레는 문체로 작성하세요. (특수 마크다운 없이 텍스트만 출력)`;

    const res = await fetch("/api/ai/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "당신은 밤하늘 여행자를 위한 실시간 스마트 천문 알리미입니다.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.trim() || null;
  } catch {
    return null;
  }
}
