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
    address: compactAddress(firstValue(item, ["addr1"]), firstValue(item, ["addr2"])),
    region: compactAddress(firstValue(item, ["doNm"]), firstValue(item, ["sigunguNm"])),
    latitude: point.latitude,
    longitude: point.longitude,
    imageUrl: firstValue(item, ["firstImageUrl", "firstimage", "firstImage"]),
    homepage: firstValue(item, ["homepage"]),
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
    source: "TarRlteTarService1",
  };
}

const comparableName = (value) => String(value ?? "")
  .toLowerCase()
  .replace(/\s+/g, "")
  .replace(/[()\[\]{}·・,.\-_/]/g, "");

function matchingConcentration(destination, concentrationItems) {
  const destinationName = comparableName(destination.name);
  const matches = concentrationItems.filter((item) => {
    const concentrationName = comparableName(item.name);
    return destinationName.includes(concentrationName) || concentrationName.includes(destinationName);
  });
  const dated = matches.filter((item) => item.concentrationRate !== null);
  return dated.at(-1) ?? matches.at(-1) ?? null;
}

export function buildLiveDestinations({ tourismItems, concentrationItems, campingItems, relatedItems, origin }) {
  const seen = new Set();
  return tourismItems
    .map(normalizeTourismItem)
    .filter(Boolean)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((destination) => {
      const concentration = matchingConcentration(destination, concentrationItems.map(normalizeConcentrationItem).filter(Boolean));
      const directDistanceKm = distanceKm(origin, destination);
      const nearbyCampgrounds = campingItems
        .map(normalizeCampingItem)
        .filter(Boolean)
        .map((campground) => ({ ...campground, distanceKm: distanceKm(destination, campground) }))
        .filter((campground) => campground.distanceKm !== null && campground.distanceKm <= 20)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5);
      const nearbyRelated = relatedItems
        .map(normalizeRelatedItem)
        .filter(Boolean)
        .map((related) => ({ ...related, distanceKm: distanceKm(destination, related) }))
        .filter((related) => related.distanceKm === null || related.distanceKm <= 40)
        .sort((a, b) => (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER))
        .slice(0, 5);

      return {
        ...destination,
        concentrationRate: concentration?.concentrationRate ?? null,
        concentrationDate: concentration?.date ?? null,
        calm: concentration?.concentrationRate === null || concentration?.concentrationRate === undefined
          ? null
          : Math.round(100 - concentration.concentrationRate),
        distanceKm: directDistanceKm,
        travelMinutesEstimate: directDistanceKm === null ? null : Math.max(15, Math.round((directDistanceKm / 62) * 60)),
        travelEstimateMethod: directDistanceKm === null ? null : "직선거리 기반 참고 추정",
        nearbyCampgrounds,
        relatedPlaces: nearbyRelated,
        accessible: null,
        cloud: null,
        parkingMinutes: null,
        observingWindow: null,
      };
    });
}
