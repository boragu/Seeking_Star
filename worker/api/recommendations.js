import { defaultRegion } from "../config/regions.js";
import { createPublicDataClient, PublicDataError } from "../lib/public-data-client.js";
import { buildLiveDestinations } from "../lib/normalizers.js";

const STARGAZING_KEYWORDS = ["천문대", "별", "은하수", "전망대"];

const previousYearMonth = (dateValue) => {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateValue ?? "")
    ? new Date(`${dateValue}T00:00:00+09:00`)
    : new Date();
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const sourceError = (error) => ({
  code: error instanceof PublicDataError ? error.code : "UNEXPECTED_ERROR",
  message: error instanceof Error ? error.message : String(error),
});

const sourceSummary = (id, label, results) => {
  const failures = results.filter((result) => result.status === "rejected");
  const itemCount = results.reduce(
    (count, result) => count + (result.status === "fulfilled" ? result.value.items.length : 0),
    0,
  );
  return {
    id,
    label,
    status: failures.length === 0 ? "live" : failures.length === results.length ? "error" : "partial",
    itemCount,
    errors: failures.map((result) => sourceError(result.reason)),
  };
};

const fulfilledItems = (results) => results.flatMap((result) => result.status === "fulfilled" ? result.value.items : []);

export async function getRecommendations(request, env) {
  const url = new URL(request.url);
  const client = createPublicDataClient({
    serviceKey: env.DATA_GO_KR_SERVICE_KEY,
    fetchImpl: env.PUBLIC_DATA_FETCH ?? fetch,
  });
  const latitude = url.searchParams.get("latitude");
  const longitude = url.searchParams.get("longitude");
  const origin = {
    latitude: latitude === null ? null : Number(latitude),
    longitude: longitude === null ? null : Number(longitude),
  };
  if (!Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) {
    origin.latitude = null;
    origin.longitude = null;
  }

  const tourAreaCode = url.searchParams.get("tourAreaCode") || defaultRegion.tourAreaCode;
  const areaCd = url.searchParams.get("areaCd") || defaultRegion.concentrationAreaCode;
  const requestedSignguCd = url.searchParams.get("signguCd");
  const signguList = requestedSignguCd ? [requestedSignguCd] : (defaultRegion.sigunguCodes || [defaultRegion.concentrationSignguCode]);
  const baseYm = url.searchParams.get("baseYm") || previousYearMonth(url.searchParams.get("date"));

  const tourismRequests = STARGAZING_KEYWORDS.map((keyword) => client.call("korTour", "searchKeyword", {
    keyword,
    areaCode: tourAreaCode,
    numOfRows: 100,
    arrange: "O",
  }));
  const concentrationRequests = signguList.map((signgu) => client.call("concentration", "list", {
    areaCd,
    signguCd: signgu,
    numOfRows: 100,
  }));
  const campingRequests = [client.call("camping", "basedList", {
    numOfRows: 500,
  })];
  const relatedRequests = signguList.map((signgu) => client.call("relatedTourism", "areaBasedList", {
    baseYm,
    areaCd,
    signguCd: signgu,
    numOfRows: 100,
  }));

  const [tourismResults, concentrationResults, campingResults, relatedResults] = await Promise.all([
    Promise.allSettled(tourismRequests),
    Promise.allSettled(concentrationRequests),
    Promise.allSettled(campingRequests),
    Promise.allSettled(relatedRequests),
  ]);

  const sources = [
    sourceSummary("KorService2", "국문 관광정보 서비스", tourismResults),
    sourceSummary("TatsCnctrRateService", "관광지 집중률 예측", concentrationResults),
    sourceSummary("GoCamping", "고캠핑 정보", campingResults),
    sourceSummary("TarRlteTarService1", "연관 관광지 정보", relatedResults),
  ];

  if (sources.every((source) => source.status === "error")) {
    throw new PublicDataError("연결된 공공데이터 API가 모두 응답하지 않았습니다.", {
      code: "ALL_SOURCES_FAILED",
      details: { sources },
    });
  }

  const destinations = buildLiveDestinations({
    tourismItems: fulfilledItems(tourismResults),
    concentrationItems: fulfilledItems(concentrationResults),
    campingItems: fulfilledItems(campingResults),
    relatedItems: fulfilledItems(relatedResults),
    origin,
  });

  return {
    mode: sources.every((source) => source.status === "live") ? "live" : "partial",
    generatedAt: new Date().toISOString(),
    query: {
      date: url.searchParams.get("date"),
      departureTime: url.searchParams.get("departureTime"),
      people: url.searchParams.get("people") || "2",
      transport: url.searchParams.get("transport") || "car",
      accessibility: url.searchParams.get("accessibility") === "true",
      origin: origin.latitude === null ? null : origin,
      region: defaultRegion.label,
      tourAreaCode,
      areaCd,
      signguCd: requestedSignguCd || defaultRegion.concentrationSignguCode,
      baseYm,
    },
    destinations,
    sources,
  };
}
