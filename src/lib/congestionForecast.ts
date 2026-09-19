import type { Destination } from "../domain/types";

export interface HourlyForecast {
  timeLabel: string;
  hour: number;
  congestionScore: number; // 0 ~ 100
  level: "원활" | "보통" | "혼잡" | "매우혼잡";
  bottleneckRisk: boolean;
  recommendation: string;
}

export interface CongestionForecastResult {
  destinationName: string;
  targetDate: string;
  isWeekend: boolean;
  baseDensity: number;
  goldenTime: string;
  goldenTimeReason: string;
  forecasts: HourlyForecast[];
}

/**
 * 시간대별 일몰/심야 관측 인파 피크 가중치 곡선 (18:00 ~ 04:00)
 */
const TIME_WEIGHTS: Record<number, number> = {
  18: 0.35, // 일몰 직전/도착 시작
  20: 0.75, // 일몰 후 1차 집중
  22: 1.00, // 천체 최고 고도 / 야간 피크
  24: 0.80, // 심야 2차 관측
  2: 0.35,  // 새벽 분산
  4: 0.15,  // 박명 직전 한적
};

/**
 * 관광 빅데이터(방문자 집중률) + 요일 계수 + 시간대별 피크 곡선 + 산간 도로 특성을 결합한
 * 시간대별 혼잡도 및 병목 예측 모델
 */
export function calculateCongestionForecast(
  destination: Destination,
  dateString?: string
): CongestionForecastResult {
  const date = dateString ? new Date(dateString) : new Date();
  const dayOfWeek = date.getDay(); // 0: 일, 5: 금, 6: 토
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const weekendMultiplier = dayOfWeek === 6 ? 1.35 : dayOfWeek === 5 ? 1.2 : dayOfWeek === 0 ? 1.1 : 0.85;

  // 기본 혼잡 밀도 (0 ~ 100)
  const baseDensity = destination.concentrationRate !== null && destination.concentrationRate !== undefined
    ? destination.concentrationRate
    : destination.calm !== null
    ? Math.max(10, 100 - destination.calm)
    : 35;

  // 산간 1차선 험로 또는 대표 과밀 스팟 여부 (병목 민감도 계수)
  const isMountainNarrowRoad =
    destination.name.includes("안반데기") ||
    destination.name.includes("육백마지기") ||
    destination.name.includes("화악산") ||
    destination.name.includes("별마로");

  const roadSensitivity = isMountainNarrowRoad ? 1.3 : 0.9;

  const hours = [18, 20, 22, 24, 2, 4];
  const forecasts: HourlyForecast[] = hours.map((hour) => {
    const timeWeight = TIME_WEIGHTS[hour] ?? 0.5;
    const rawScore = baseDensity * timeWeight * weekendMultiplier * roadSensitivity;
    const score = Math.min(100, Math.max(10, Math.round(rawScore)));

    let level: HourlyForecast["level"] = "원활";
    if (score >= 75) level = "매우혼잡";
    else if (score >= 55) level = "혼잡";
    else if (score >= 35) level = "보통";

    const bottleneckRisk = isMountainNarrowRoad && score >= 60;

    let recommendation = "진입 원활";
    if (bottleneckRisk) {
      recommendation = "산간 병목 및 주차 대기 주의";
    } else if (level === "매우혼잡") {
      recommendation = "방문객 밀집, 우회 권장";
    } else if (level === "혼잡") {
      recommendation = "주차장 서행 진입";
    } else if (hour >= 23 || hour <= 3) {
      recommendation = "광공해 최소화 최적 관측";
    }

    return {
      timeLabel: `${String(hour).padStart(2, "0")}:00`,
      hour,
      congestionScore: score,
      level,
      bottleneckRisk,
      recommendation,
    };
  });

  // 골든 타임 (혼잡도가 45 이하이면서 심야 22시~03시 사이 관측 조건 우수 시간대)
  const bestHour = forecasts.find((f) => f.hour >= 23 || f.hour === 2) || forecasts[forecasts.length - 2];
  const goldenTime = `${bestHour.timeLabel} ~ 03:00`;
  const goldenTimeReason = isMountainNarrowRoad
    ? "초저녁 진입 병목이 해소되고 밤하늘 투명도가 최고조에 달하는 시간대입니다."
    : "주변 조명이 모두 소등되고 방문객 간섭 없이 쾌적하게 관측할 수 있습니다.";

  return {
    destinationName: destination.name,
    targetDate: dateString || date.toISOString().slice(0, 10),
    isWeekend,
    baseDensity: Math.round(baseDensity),
    goldenTime,
    goldenTimeReason,
    forecasts,
  };
}
