export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationHub {
  name: string;
  latitude: number;
  longitude: number;
}

const locationHubs: LocationHub[] = [
  { name: "서울역", latitude: 37.5559, longitude: 126.9723 },
  { name: "서울 잠실", latitude: 37.5133, longitude: 127.1001 },
  { name: "서울 강남", latitude: 37.4979, longitude: 127.0276 },
  { name: "서울", latitude: 37.5665, longitude: 126.978 },
  { name: "인천", latitude: 37.4563, longitude: 126.7052 },
  { name: "수원", latitude: 37.2636, longitude: 127.0286 },
  { name: "성남", latitude: 37.4200, longitude: 127.1265 },
  { name: "춘천", latitude: 37.8813, longitude: 127.7298 },
  { name: "원주", latitude: 37.3422, longitude: 127.9202 },
  { name: "강릉", latitude: 37.7519, longitude: 128.8761 },
  { name: "평창", latitude: 37.3705, longitude: 128.3903 },
  { name: "영월", latitude: 37.1837, longitude: 128.4618 },
  { name: "속초", latitude: 38.2070, longitude: 128.5918 },
  { name: "홍천", latitude: 37.6970, longitude: 127.8887 },
  { name: "화천", latitude: 38.1062, longitude: 127.7082 },
  { name: "철원", latitude: 38.1468, longitude: 127.3134 },
  { name: "양구", latitude: 38.1097, longitude: 127.9897 },
  { name: "인제", latitude: 38.0697, longitude: 128.1704 },
  { name: "횡성", latitude: 37.4916, longitude: 127.9850 },
  { name: "정선", latitude: 37.3806, longitude: 128.6608 },
  { name: "태백", latitude: 37.1641, longitude: 128.9856 },
  { name: "동해", latitude: 37.5247, longitude: 129.1143 },
  { name: "삼척", latitude: 37.4499, longitude: 129.1653 },
  { name: "고성", latitude: 38.3806, longitude: 128.4678 },
  { name: "양양", latitude: 38.0754, longitude: 128.6189 },
  { name: "대전", latitude: 36.3504, longitude: 127.3845 },
  { name: "대구", latitude: 35.8714, longitude: 128.6014 },
  { name: "부산", latitude: 35.1796, longitude: 129.0756 },
  { name: "광주", latitude: 35.1595, longitude: 126.8526 },
  { name: "제주", latitude: 33.4996, longitude: 126.5312 },
];

export function findHubCoordinates(query: string): { latitude: number; longitude: number; name: string } | null {
  const normalized = query.trim().replace(/\s+/g, "");
  if (!normalized) return null;
  const match = locationHubs.find(
    (hub) => normalized.includes(hub.name.replace(/\s+/g, "")) || hub.name.replace(/\s+/g, "").includes(normalized)
  );
  return match ? { latitude: match.latitude, longitude: match.longitude, name: match.name } : null;
}

const pad = (value: number): string => String(value).padStart(2, "0");

export function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toTimeInputValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getCurrentDateTime(date = new Date()): { date: string; time: string } {
  return { date: toDateInputValue(date), time: toTimeInputValue(date) };
}

export function formatLiveClock(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatShortKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function formatDateInputKorean(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return formatShortKoreanDate(new Date(year, month - 1, day));
}

export function addMinutesToTime(value: string, minutes: number): string {
  const [hours, currentMinutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(currentMinutes)) return value;
  const total = (hours * 60 + currentMinutes + minutes + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

function distanceInKilometers(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6371;
  const deltaLatitude = radians(latitudeB - latitudeA);
  const deltaLongitude = radians(longitudeB - longitudeA);
  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(radians(latitudeA)) *
      Math.cos(radians(latitudeB)) *
      Math.sin(deltaLongitude / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function resolveLocationLabel(location: DeviceLocation): string {
  const nearest = locationHubs
    .map((hub) => ({
      ...hub,
      distance: distanceInKilometers(
        location.latitude,
        location.longitude,
        hub.latitude,
        hub.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  if (nearest && nearest.distance <= 45) return `${nearest.name} 인근`;
  return `현재 위치 ${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
}

export function formatAccuracy(accuracy: number): string {
  if (accuracy < 1000) return `약 ${Math.max(10, Math.round(accuracy / 10) * 10)}m 정확도`;
  return `약 ${(accuracy / 1000).toFixed(1)}km 정확도`;
}

export interface MoonPhaseInfo {
  age: number; // 월령 일수 (0.0 ~ 29.5)
  phaseName: string; // 삭, 초승달, 상현달, 보름달, 하현달, 그믐달
  phaseIcon: string; // 🌑, 🌒, 🌓, 🌕, 🌗, 🌘
  illumination: number; // 광도율 % (0 ~ 100)
  interferenceLevel: "none" | "low" | "medium" | "high";
  interferenceLabel: string;
  optimalViewingAdvice: string;
}

/** Julian Day 기반 천문 정밀 월령 및 달빛 간섭도 계산 */
export function calculateMoonPhase(dateInput: Date | string = new Date()): MoonPhaseInfo {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T12:00:00+09:00`) : dateInput;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day 계산
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  // 2000-01-06 18:14 UTC 기준 신월 (JD 2451549.5)
  const synodicMonth = 29.53058867;
  const daysSinceNew = (jd - 2451549.5) % synodicMonth;
  const age = (daysSinceNew < 0 ? daysSinceNew + synodicMonth : daysSinceNew);

  // 달빛 조도율 (0 ~ 100%)
  const illumination = Math.round(0.5 * (1 - Math.cos((2 * Math.PI * age) / synodicMonth)) * 100);

  let phaseName = "삭(신월)";
  let phaseIcon = "🌑";
  let interferenceLevel: MoonPhaseInfo["interferenceLevel"] = "none";
  let interferenceLabel = "달빛 간섭 없음 (최적 관측)";
  let optimalViewingAdvice = "달빛이 없어 은하수와 성운·성단을 관측하기에 최고의 날입니다.";

  if (age < 1.5 || age >= 28.2) {
    phaseName = "삭(신월)";
    phaseIcon = "🌑";
    interferenceLevel = "none";
    interferenceLabel = "달빛 간섭 없음 (최적)";
    optimalViewingAdvice = "월광이 전혀 없어 어두운 밤하늘과 은하수 중심부 촬영에 최적기입니다.";
  } else if (age < 6.5) {
    phaseName = "초승달";
    phaseIcon = "🌒";
    interferenceLevel = "low";
    interferenceLabel = "달빛 간섭 낮음 (초저녁 후 최적)";
    optimalViewingAdvice = "초저녁 서쪽으로 달이 지므로, 밤 21시 이후부터 쾌적한 암흑 밤하늘이 펼쳐집니다.";
  } else if (age < 8.5) {
    phaseName = "상현달";
    phaseIcon = "🌓";
    interferenceLevel = "medium";
    interferenceLabel = "달빛 간섭 보통 (자정 이후 최적)";
    optimalViewingAdvice = "자정 무렵 달이 지므로, 자정 이후 심야 시간대 은하수 관측을 권장합니다.";
  } else if (age < 13.5) {
    phaseName = "차오르는 달(상현망간)";
    phaseIcon = "🌔";
    interferenceLevel = "high";
    interferenceLabel = "달빛 간섭 다소 높음";
    optimalViewingAdvice = "달빛이 밝아 행성(목성·토성) 및 달 표면 관측에 유리하며, 딥스카이는 새벽 달 진 후 권장합니다.";
  } else if (age < 16.5) {
    phaseName = "보름달(만월)";
    phaseIcon = "🌕";
    interferenceLevel = "high";
    interferenceLabel = "달빛 간섭 높음 (만월)";
    optimalViewingAdvice = "밤새 달빛이 밝아 달·행성 중심 관측을 추천하며, 은하수 촬영은 빛 차단 후드가 필요합니다.";
  } else if (age < 21.5) {
    phaseName = "이지러지는 달(하현망간)";
    phaseIcon = "🌖";
    interferenceLevel = "medium";
    interferenceLabel = "달빛 간섭 보통 (초저녁 최적)";
    optimalViewingAdvice = "달이 밤 23시 이후 늦게 뜨므로, 일몰 후부터 밤 23시까지의 골든아워 관측을 권장합니다.";
  } else if (age < 23.5) {
    phaseName = "하현달";
    phaseIcon = "🌗";
    interferenceLevel = "low";
    interferenceLabel = "달빛 간섭 낮음 (자정 전 최적)";
    optimalViewingAdvice = "자정 무렵 달이 동쪽에서 뜨기 전, 초저녁부터 밤 23시 사이에 별빛 관측이 쾌적합니다.";
  } else {
    phaseName = "그믐달";
    phaseIcon = "🌘";
    interferenceLevel = "none";
    interferenceLabel = "달빛 간섭 미미 (새벽 전 최적)";
    optimalViewingAdvice = "새벽 동트기 직전까지 달빛 없는 고요한 밤하늘을 온전히 누릴 수 있습니다.";
  }

  return {
    age: Math.round(age * 10) / 10,
    phaseName,
    phaseIcon,
    illumination,
    interferenceLevel,
    interferenceLabel,
    optimalViewingAdvice,
  };
}

export interface SeasonalConstellationInfo {
  season: "봄" | "여름" | "가을" | "겨울";
  targetConstellations: string;
  milkyWayDirection: string;
  optimalTimeWindow: string;
  astronomicalTwilight: string;
}

/** 계절 및 시간 기반 밤하늘 관측 대상 및 천문박명 시간 계산 */
export function calculateAstronomicalConditions(dateInput: Date | string = new Date()): SeasonalConstellationInfo {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T12:00:00+09:00`) : dateInput;
  const month = date.getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return {
      season: "봄",
      targetConstellations: "사자자리 · 처녀자리 · 목동자리 (봄의 대곡선)",
      milkyWayDirection: "새벽 03시경 남동쪽 지평선 위 은하수 등장",
      optimalTimeWindow: "밤 21:00 ~ 익일 01:30",
      astronomicalTwilight: "일몰 후 약 1시간 40분 뒤 (완전 암전)",
    };
  } else if (month >= 6 && month <= 8) {
    return {
      season: "여름",
      targetConstellations: "백조자리 · 거문고자리 · 독수리자리 (여름철 대삼각형) & 궁수자리 은하수 중심부",
      milkyWayDirection: "남동쪽~남서쪽 하늘을 가로지르는 짙은 은하수 아치",
      optimalTimeWindow: "밤 22:30 ~ 익일 02:30 (은하수 최고 고도)",
      astronomicalTwilight: "밤 21:40경 천문박명 종료 (완전 암전)",
    };
  } else if (month >= 9 && month <= 11) {
    return {
      season: "가을",
      targetConstellations: "페가수스자리 · 안드로메다 은하(M31) · 카시오페이아자리 · 페르세우스 이중성단",
      milkyWayDirection: "초저녁 서남쪽에서 북동쪽으로 이어지는 가을 은하수",
      optimalTimeWindow: "밤 20:30 ~ 익일 01:00",
      astronomicalTwilight: "밤 20:00경 천문박명 종료 (빠른 밤하늘 형성)",
    };
  } else {
    return {
      season: "겨울",
      targetConstellations: "오리온자리(M42 대성운) · 황소자리(플레이아데스 성단) · 큰개자리(시리우스) (겨울철 대육각형)",
      milkyWayDirection: "천정을 가로지르는 맑고 투명한 겨울 은하수",
      optimalTimeWindow: "밤 19:30 ~ 익일 00:30",
      astronomicalTwilight: "밤 19:10경 천문박명 종료 (가장 긴 관측 시간)",
    };
  }
}
