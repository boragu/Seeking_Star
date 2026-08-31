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
  { name: "서울 잠실", latitude: 37.5133, longitude: 127.1001 },
  { name: "서울 도심", latitude: 37.5665, longitude: 126.978 },
  { name: "인천", latitude: 37.4563, longitude: 126.7052 },
  { name: "수원", latitude: 37.2636, longitude: 127.0286 },
  { name: "평택", latitude: 36.9921, longitude: 127.1129 },
  { name: "춘천", latitude: 37.8813, longitude: 127.7298 },
  { name: "원주", latitude: 37.3422, longitude: 127.9202 },
  { name: "평창", latitude: 37.3705, longitude: 128.3903 },
  { name: "영월", latitude: 37.1837, longitude: 128.4618 },
  { name: "강릉", latitude: 37.7519, longitude: 128.8761 },
  { name: "대전", latitude: 36.3504, longitude: 127.3845 },
  { name: "전주", latitude: 35.8242, longitude: 127.148 },
  { name: "광주", latitude: 35.1595, longitude: 126.8526 },
  { name: "대구", latitude: 35.8714, longitude: 128.6014 },
  { name: "부산", latitude: 35.1796, longitude: 129.0756 },
  { name: "제주", latitude: 33.4996, longitude: 126.5312 },
];

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
