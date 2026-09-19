import type { Destination, PlannerState } from "../domain/types";

const EARTH_RADIUS_KM = 6371;

/** 강원특별자치도 및 전국 주요 관측지/공원 기본 좌표 사전 (공공데이터 좌표 누락 시의 안전망) */
export const KNOWN_DESTINATION_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  // 1. 강원권 주요 별 관측 명소 및 공원
  "자연환경연구공원": { latitude: 37.7553, longitude: 127.8867 },
  "강원특별자치도 자연환경연구공원": { latitude: 37.7553, longitude: 127.8867 },
  "강원도 자연환경연구공원": { latitude: 37.7553, longitude: 127.8867 },
  "별마로천문대": { latitude: 37.2006, longitude: 128.4900 },
  "조경철천문대": { latitude: 38.1075, longitude: 127.4811 },
  "국토정중앙천문대": { latitude: 38.0833, longitude: 128.0264 },
  "안반데기": { latitude: 37.6258, longitude: 128.7478 },
  "육백마지기": { latitude: 37.3197, longitude: 128.4114 },
  "태기산": { latitude: 37.5689, longitude: 128.2436 },
  "화악산": { latitude: 37.9875, longitude: 127.5383 },
  "구룡령": { latitude: 37.8489, longitude: 128.5303 },
  "미시령": { latitude: 38.2239, longitude: 128.4239 },
  "대관령": { latitude: 37.6833, longitude: 128.7561 },
  "선자령": { latitude: 37.7011, longitude: 128.7497 },
  "소양강댐": { latitude: 37.9511, longitude: 127.8189 },
  "화천 평화의댐": { latitude: 38.2458, longitude: 127.8389 },
  "평창 송어축제장": { latitude: 37.6433, longitude: 128.5911 },
  "바람의언덕": { latitude: 37.1912, longitude: 128.9888 },
  "태백 바람의언덕": { latitude: 37.1912, longitude: 128.9888 },
  "매봉산": { latitude: 37.1912, longitude: 128.9888 },

  // 2. 수도권 및 중부권 주요 관측지
  "중미산천문대": { latitude: 37.5855, longitude: 127.4852 },
  "송암스페이스센터": { latitude: 37.7476, longitude: 126.9452 },
  "연천 당포성": { latitude: 38.0163, longitude: 126.9934 },
  "충주고구려천문과학관": { latitude: 36.9912, longitude: 127.8654 },
  "보은 보은첨성대": { latitude: 36.4883, longitude: 127.7188 },
  "단양 소백산천문대": { latitude: 36.9348, longitude: 128.4578 },
  "소백산천문대": { latitude: 36.9348, longitude: 128.4578 },

  // 3. 영남/호남권 주요 관측지
  "영양 반딧불이천문대": { latitude: 36.8122, longitude: 129.1352 },
  "영양반딧불이천문대": { latitude: 36.8122, longitude: 129.1352 },
  "영천 보현산천문대": { latitude: 36.1627, longitude: 128.9768 },
  "보현산천문대": { latitude: 36.1627, longitude: 128.9768 },
  "합천 황매산": { latitude: 35.4952, longitude: 127.9782 },
  "황매산": { latitude: 35.4952, longitude: 127.9782 },
  "지리산 정령치": { latitude: 35.3789, longitude: 127.5342 },
  "정령치": { latitude: 35.3789, longitude: 127.5342 },
  "장흥 정남진천문과학관": { latitude: 34.6811, longitude: 126.9067 },
  "무주 반디별천문과학관": { latitude: 35.9456, longitude: 127.7689 },

  // 시·군 중심 좌표
  "홍천": { latitude: 37.6972, longitude: 127.8886 },
  "홍천군": { latitude: 37.6972, longitude: 127.8886 },
  "춘천": { latitude: 37.8813, longitude: 127.7298 },
  "춘천시": { latitude: 37.8813, longitude: 127.7298 },
  "원주": { latitude: 37.3422, longitude: 127.9202 },
  "원주시": { latitude: 37.3422, longitude: 127.9202 },
  "강릉": { latitude: 37.7519, longitude: 128.8761 },
  "강릉시": { latitude: 37.7519, longitude: 128.8761 },
  "동해": { latitude: 37.5247, longitude: 129.1143 },
  "동해시": { latitude: 37.5247, longitude: 129.1143 },
  "태백": { latitude: 37.1641, longitude: 128.9856 },
  "태백시": { latitude: 37.1641, longitude: 128.9856 },
  "속초": { latitude: 38.2070, longitude: 128.5918 },
  "속초시": { latitude: 38.2070, longitude: 128.5918 },
  "삼척": { latitude: 37.4499, longitude: 129.1653 },
  "삼척시": { latitude: 37.4499, longitude: 129.1653 },
  "횡성": { latitude: 37.4919, longitude: 127.9850 },
  "횡성군": { latitude: 37.4919, longitude: 127.9850 },
  "영월": { latitude: 37.1838, longitude: 128.4618 },
  "영월군": { latitude: 37.1838, longitude: 128.4618 },
  "평창": { latitude: 37.3705, longitude: 128.3900 },
  "평창군": { latitude: 37.3705, longitude: 128.3900 },
  "정선": { latitude: 37.3806, longitude: 128.6608 },
  "정선군": { latitude: 37.3806, longitude: 128.6608 },
  "철원": { latitude: 38.1468, longitude: 127.3134 },
  "철원군": { latitude: 38.1468, longitude: 127.3134 },
  "화천": { latitude: 38.1062, longitude: 127.7082 },
  "화천군": { latitude: 38.1062, longitude: 127.7082 },
  "양구": { latitude: 38.1095, longitude: 127.9897 },
  "양구군": { latitude: 38.1095, longitude: 127.9897 },
  "인제": { latitude: 38.0697, longitude: 128.1704 },
  "인제군": { latitude: 38.0697, longitude: 128.1704 },
  "고성": { latitude: 38.3806, longitude: 128.4678 },
  "고성군": { latitude: 38.3806, longitude: 128.4678 },
  "양양": { latitude: 38.0754, longitude: 128.6189 },
  "양양군": { latitude: 38.0754, longitude: 128.6189 },
  "서울": { latitude: 37.5665, longitude: 126.9780 },
  "경기": { latitude: 37.4138, longitude: 127.5183 },
  "충북": { latitude: 36.6357, longitude: 127.4912 },
  "충남": { latitude: 36.5184, longitude: 126.8000 },
  "경북": { latitude: 36.5760, longitude: 128.5056 },
  "경남": { latitude: 35.2383, longitude: 128.6924 },
  "전북": { latitude: 35.8203, longitude: 127.1088 },
  "전남": { latitude: 34.8161, longitude: 126.4629 },
  "제주": { latitude: 33.4996, longitude: 126.5312 },
};

/** 두 좌표 사이의 하버사인 구면 거리(km) 계산 */
export function calculateDistanceKm(
  origin: { latitude: number | null; longitude: number | null } | null,
  target: { latitude: number | null; longitude: number | null } | null
): number | null {
  if (
    !origin ||
    !target ||
    origin.latitude === null ||
    origin.longitude === null ||
    target.latitude === null ||
    target.longitude === null ||
    !Number.isFinite(origin.latitude) ||
    !Number.isFinite(origin.longitude) ||
    !Number.isFinite(target.latitude) ||
    !Number.isFinite(target.longitude)
  ) {
    return null;
  }

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const latDelta = toRadians(target.latitude - origin.latitude);
  const lngDelta = toRadians(target.longitude - origin.longitude);
  const startLat = toRadians(origin.latitude);
  const endLat = toRadians(target.latitude);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

/** 거리(km)를 기반으로 한 예상 이동 시간(분) 추정 */
export function estimateTravelMinutes(km: number | null): number | null {
  if (km === null || km <= 0) return null;
  // 평균 시속 65km/h 가정 + 시내/산길 가중치 15분
  return Math.round((km / 65) * 60 + 15);
}

/** 관측지 객체의 유효 좌표를 추출하거나 폴백 좌표를 매핑하여 보정 */
export function resolveDestinationCoordinates(
  destination: Partial<Destination> | null | undefined
): { latitude: number | null; longitude: number | null } {
  if (!destination) {
    return { latitude: null, longitude: null };
  }

  // 1. 이미 유효한 숫자로 위경도가 지정된 경우
  if (
    typeof destination.latitude === "number" &&
    typeof destination.longitude === "number" &&
    Number.isFinite(destination.latitude) &&
    Number.isFinite(destination.longitude) &&
    destination.latitude > 0 &&
    destination.longitude > 0
  ) {
    return {
      latitude: destination.latitude,
      longitude: destination.longitude,
    };
  }

  const name = destination.name || "";
  const address = destination.address || "";
  const region = destination.region || "";

  // 2. 명칭 직접 매칭
  for (const [key, coords] of Object.entries(KNOWN_DESTINATION_COORDINATES)) {
    if (name.includes(key) || key.includes(name)) {
      return coords;
    }
  }

  // 3. 주소 또는 지역 내 시·군 매칭
  for (const [key, coords] of Object.entries(KNOWN_DESTINATION_COORDINATES)) {
    if (address.includes(key) || region.includes(key)) {
      return coords;
    }
  }

  // 4. 강원도 기본 중심 좌표
  return { latitude: 37.7553, longitude: 127.8867 };
}
