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
