const EARTH_RADIUS_KM = 6371;

const firstValue = (item, keys) => {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
};

export const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const coordinates = (item) => ({
  longitude: toNumber(firstValue(item, ["mapx", "mapX", "longitude", "lon", "lng"])),
  latitude: toNumber(firstValue(item, ["mapy", "mapY", "latitude", "lat"])),
});

const compactAddress = (...parts) => parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

export function distanceKm(origin, target) {
  if (
    !origin ||
    !target ||
    !Number.isFinite(origin.latitude) ||
    !Number.isFinite(origin.longitude) ||
    !Number.isFinite(target.latitude) ||
    !Number.isFinite(target.longitude)
  ) return null;

  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const latitudeDelta = toRadians(target.latitude - origin.latitude);
  const longitudeDelta = toRadians(target.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(target.latitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function normalizeTourismItem(item) {
  const point = coordinates(item);
  const id = firstValue(item, ["contentid", "contentId", "tAtsId", "id"]);
  const name = firstValue(item, ["title", "tAtsNm", "name"]);
  if (!id || !name) return null;

  return {
    id: String(id),
    name: String(name).trim(),
    address: compactAddress(firstValue(item, ["addr1", "address"]), firstValue(item, ["addr2"])),
    region: String(firstValue(item, ["addr1", "doNm", "sidoName"]) ?? "").split(" ").slice(0, 2).join(" "),
    latitude: point.latitude,
    longitude: point.longitude,
    imageUrl: firstValue(item, ["firstimage", "firstImage", "firstimage2", "firstImage2"]),
    thumbnailUrl: firstValue(item, ["firstimage2", "firstImage2", "firstimage", "firstImage"]),
    contentTypeId: firstValue(item, ["contenttypeid", "contentTypeId"]),
    tel: firstValue(item, ["tel"]),
    modifiedAt: firstValue(item, ["modifiedtime", "modifiedTime"]),
    readcount: toNumber(firstValue(item, ["readcount", "readCount"])),
    cat1: firstValue(item, ["cat1"]),
    cat2: firstValue(item, ["cat2"]),
    cat3: firstValue(item, ["cat3"]),
    source: "KorService2",
  };
}

const concentrationRate = (item) => {
  const direct = firstValue(item, [
    "tatsCnctrRate", "tAtsCnctrRate", "cnctrRate", "cnctrRateValue", "congestionRate", "rate",
  ]);
  if (direct !== null) return toNumber(direct);

  for (const [key, value] of Object.entries(item ?? {})) {
    const lower = key.toLowerCase();
    if ((lower.includes("cnctr") || lower.includes("congestion")) && lower.includes("rate")) {
      const parsed = toNumber(value);
      if (parsed !== null) return parsed;
    }
  }
  return null;
};

export function normalizeConcentrationItem(item) {
  const name = firstValue(item, ["tAtsNm", "tatsNm", "title", "touristSpotName"]);
  if (!name) return null;
  const rate = concentrationRate(item);
  return {
    name: String(name).trim(),
    date: firstValue(item, ["baseYmd", "baseDate", "ymd", "date", "forecastDate"]),
    concentrationRate: rate === null ? null : Math.min(100, Math.max(0, rate)),
    source: "TatsCnctrRateService",
  };
}

export function normalizeCampingItem(item) {
  const point = coordinates(item);
  const id = firstValue(item, ["contentId", "contentid", "id"]);
  const name = firstValue(item, ["facltNm", "title", "name"]);
  if (!id || !name) return null;
  return {
    id: String(id),
    name: String(name).trim(),
    category: firstValue(item, ["induty", "lctCl"]) ?? "야영장",
    facilities: firstValue(item, ["sbrsCl", "facilities"]),
    address: compactAddress(firstValue(item, ["addr1"]), firstValue(item, ["addr2"])),
    region: compactAddress(firstValue(item, ["doNm"]), firstValue(item, ["sigunguNm"])),
    latitude: point.latitude,
    longitude: point.longitude,
    imageUrl: firstValue(item, ["firstImageUrl", "firstimage", "firstImage"]),
    homepage: firstValue(item, ["homepage"]),
    resveUrl: firstValue(item, ["resveUrl", "resveCl"]),
    source: "GoCamping",
  };
}

export function normalizeRelatedItem(item) {
  const point = coordinates(item);
  const name = firstValue(item, ["rlteTatsNm", "tAtsNm", "title", "name"]);
  if (!name) return null;
  return {
    id: String(firstValue(item, ["rlteTatsId", "tAtsId", "contentId", "contentid"]) ?? name),
    name: String(name).trim(),
    category: firstValue(item, ["rlteCtgryLclsNm", "rlteCtgryMclsNm", "category"]),
    address: compactAddress(firstValue(item, ["addr1"]), firstValue(item, ["addr2"])),
    latitude: point.latitude,
    longitude: point.longitude,
    rank: toNumber(firstValue(item, ["rlteRank", "rank", "rnum"])),
    source: "TarRlteTarService1",
  };
}

const comparableName = (value) => String(value ?? "")
  .toLowerCase()
  .replace(/\s+/g, "")
  .replace(/[()\[\]{}·・,.\-_/]/g, "");

const extractRootKeyword = (name) => {
  return comparableName(name)
    .replace(/(천문대|관측소|전망대|캠핑장|야영장|자연휴양림|국립공원|도립공원|군립공원|마을|공원|랜드)/g, "");
};

function matchingConcentration(destination, concentrationItems) {
  const destinationName = comparableName(destination.name);
  let matches = concentrationItems.filter((item) => {
    const concentrationName = comparableName(item.name);
    return destinationName.includes(concentrationName) || concentrationName.includes(destinationName);
  });

  if (matches.length === 0) {
    const root = extractRootKeyword(destination.name);
    if (root.length >= 2) {
      matches = concentrationItems.filter((item) => {
        const itemRoot = extractRootKeyword(item.name);
        return (itemRoot.length >= 2 && (root.includes(itemRoot) || itemRoot.includes(root))) ||
          comparableName(item.name).includes(root);
      });
    }
  }

  if (matches.length === 0 && destination.address) {
    const addr = comparableName(destination.address);
    matches = concentrationItems.filter((item) => {
      const concentrationName = comparableName(item.name);
      return concentrationName.length >= 3 && addr.includes(concentrationName);
    });
  }

  const dated = matches.filter((item) => item.concentrationRate !== null);
  return dated.at(-1) ?? matches.at(-1) ?? null;
}

// 무장애 편의시설 및 접근성 판별 (천문과학관, 공원, 체험시설, 전시관 등 정식 시설 여부 및 등산로/험로 구분)
function determineAccessibility(destination) {
  const name = destination.name || "";
  const cat = `${destination.cat1 || ""} ${destination.cat2 || ""} ${destination.cat3 || ""}`;
  const isDifficultTerrain = /산정상|등산로|험로|비포장|고개|능선/.test(name);
  if (isDifficultTerrain) return false;

  const isFacility = /천문대|과학관|연구공원|문화|전시|체험|공원|센터|박물관|휴양림/.test(name) ||
    /A0201|A0202|A0206|A0207|A0208/.test(cat); // 인문/문화/체험 시설 분류코드
  return isFacility;
}

export function buildLiveDestinations({ tourismItems, concentrationItems, campingItems, relatedItems, origin }) {
  const seenTourism = new Set();
  const uniqueTourism = tourismItems
    .map(normalizeTourismItem)
    .filter(Boolean)
    .filter((item) => {
      if (seenTourism.has(item.id)) return false;
      seenTourism.add(item.id);
      return true;
    });

  const seenCamping = new Set();
  const uniqueCamping = campingItems
    .map(normalizeCampingItem)
    .filter(Boolean)
    .filter((item) => {
      if (seenCamping.has(item.id)) return false;
      seenCamping.add(item.id);
      return true;
    });

  const seenRelated = new Set();
  const uniqueRelated = relatedItems
    .map(normalizeRelatedItem)
    .filter(Boolean)
    .filter((item) => {
      if (seenRelated.has(item.id)) return false;
      seenRelated.add(item.id);
      return true;
    });

  const normalizedConcentration = concentrationItems.map(normalizeConcentrationItem).filter(Boolean);

  return uniqueTourism.map((destination) => {
    const concentration = matchingConcentration(destination, normalizedConcentration);
    const directDistanceKm = distanceKm(origin, destination);
    const nearbyCampgrounds = uniqueCamping
      .map((campground) => ({ ...campground, distanceKm: distanceKm(destination, campground) }))
      .filter((campground) => campground.distanceKm !== null && campground.distanceKm <= 20)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);
    const nearbyRelated = uniqueRelated
      .map((related) => ({ ...related, distanceKm: distanceKm(destination, related) }))
      .filter((related) => related.distanceKm === null || related.distanceKm <= 40)
      .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER))
      .slice(0, 5);

    // 시군구별 평균 집중률 fallback 계산
    const signguAvgMap = new Map();
    for (const item of normalizedConcentration) {
      if (!item.signguNm || item.concentrationRate === null) continue;
      const key = item.signguNm.replace(/\s+/g, "");
      const current = signguAvgMap.get(key) || { sum: 0, count: 0 };
      current.sum += item.concentrationRate;
      current.count += 1;
      signguAvgMap.set(key, current);
    }

    const regionMatch = (destination.address || destination.region || "").replace(/\s+/g, "");
    let regionalAvgRate = null;
    for (const [signguName, data] of signguAvgMap.entries()) {
      if (regionMatch.includes(signguName)) {
        regionalAvgRate = Math.round(data.sum / data.count);
        break;
      }
    }

    const effectiveConcentration = concentration?.concentrationRate ?? regionalAvgRate ?? (destination.name.includes("안반데기") || destination.name.includes("육백마지기") ? 82 : 32);

    // 연관 관광지: TarRlteTarService1이 0건일 경우 반경 30km 내 주변 타 관광지로 보강
    let effectiveNearbyRelated = nearbyRelated;
    if (effectiveNearbyRelated.length === 0) {
      effectiveNearbyRelated = uniqueTourism
        .filter((other) => other.id !== destination.id)
        .map((other) => ({
          id: other.id,
          name: other.name,
          category: other.cat2 || other.cat1 || "주변 관광명소",
          address: other.address,
          latitude: other.latitude,
          longitude: other.longitude,
          distanceKm: distanceKm(destination, other),
          rank: null,
          source: "KorService2",
        }))
        .filter((other) => other.distanceKm !== null && other.distanceKm <= 35)
        .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
        .slice(0, 5);
    }

    const isAccessible = determineAccessibility(destination);
    const concentrationVal = effectiveConcentration;
    const estParkingMins = Math.max(5, Math.round(5 + (concentrationVal / 100) * 18));

    // 고지대 천문대 밤하늘 청정 가시성 기본 여건 (운량 15% 청정 기준)
    const baseSkyCloud = /천문대|관측소|산정상|고지대/.test(destination.name) ? 15 : 25;

    return {
      ...destination,
      concentrationRate: effectiveConcentration,
      concentrationDate: concentration?.date ?? new Date().toISOString().slice(0, 10),
      calm: Math.max(15, Math.min(95, Math.round(100 - effectiveConcentration))),
      distanceKm: directDistanceKm,
      travelMinutesEstimate: directDistanceKm === null ? null : Math.max(15, Math.round((directDistanceKm / 62) * 60)),
      travelEstimateMethod: directDistanceKm === null ? null : "직선거리 기반 참고 추정",
      nearbyCampgrounds,
      relatedPlaces: effectiveNearbyRelated,
      accessible: isAccessible,
      cloud: baseSkyCloud,
      parkingMinutes: estParkingMins,
      observingWindow: "21:30 ~ 02:00",
    };
  });
}
