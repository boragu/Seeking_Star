const commonParameters = {
  pageNo: { type: "integer", required: false, default: 1, description: "페이지 번호" },
  numOfRows: { type: "integer", required: false, default: 20, description: "한 페이지 결과 수" },
  MobileOS: { type: "string", required: false, default: "WEB", description: "OS 구분" },
  MobileApp: { type: "string", required: false, default: "ByeolBoreoganda", description: "서비스명" },
  _type: { type: "string", required: false, default: "json", description: "응답 형식" },
};

const operation = (path, summary, parameters = {}) => ({
  method: "GET",
  path,
  summary,
  parameters: { ...commonParameters, ...parameters },
});

export const publicDataRegistry = {
  korTour: {
    name: "한국관광공사 국문 관광정보 서비스",
    dataGoKrUrl: "https://www.data.go.kr/data/15101578/openapi.do",
    baseUrl: "https://apis.data.go.kr/B551011/KorService2",
    operations: {
      areaCode: operation("/areaCode2", "지역코드 조회", { areaCode: { type: "string", required: false } }),
      categoryCode: operation("/categoryCode2", "서비스 분류코드 조회", {
        contentTypeId: { type: "string", required: false },
        cat1: { type: "string", required: false },
        cat2: { type: "string", required: false },
        cat3: { type: "string", required: false },
      }),
      areaBasedList: operation("/areaBasedList2", "지역기반 관광정보 조회", {
        areaCode: { type: "string", required: false },
        sigunguCode: { type: "string", required: false },
        contentTypeId: { type: "string", required: false },
        cat1: { type: "string", required: false },
        cat2: { type: "string", required: false },
        cat3: { type: "string", required: false },
        arrange: { type: "string", required: false, default: "O" },
        modifiedtime: { type: "string", required: false },
      }),
      locationBasedList: operation("/locationBasedList2", "위치기반 관광정보 조회", {
        mapX: { type: "number", required: true },
        mapY: { type: "number", required: true },
        radius: { type: "integer", required: true },
        contentTypeId: { type: "string", required: false },
        arrange: { type: "string", required: false, default: "E" },
        modifiedtime: { type: "string", required: false },
      }),
      searchKeyword: operation("/searchKeyword2", "키워드 검색 조회", {
        keyword: { type: "string", required: true },
        areaCode: { type: "string", required: false },
        sigunguCode: { type: "string", required: false },
        contentTypeId: { type: "string", required: false },
        arrange: { type: "string", required: false, default: "O" },
        modifiedtime: { type: "string", required: false },
      }),
      searchFestival: operation("/searchFestival2", "행사정보 조회", {
        eventStartDate: { type: "string", required: true },
        eventEndDate: { type: "string", required: false },
        areaCode: { type: "string", required: false },
        sigunguCode: { type: "string", required: false },
        arrange: { type: "string", required: false, default: "O" },
        modifiedtime: { type: "string", required: false },
      }),
      searchStay: operation("/searchStay2", "숙박정보 조회", {
        areaCode: { type: "string", required: false },
        sigunguCode: { type: "string", required: false },
        arrange: { type: "string", required: false, default: "O" },
      }),
      detailCommon: operation("/detailCommon2", "공통정보 조회", { contentId: { type: "string", required: true } }),
      detailIntro: operation("/detailIntro2", "소개정보 조회", {
        contentId: { type: "string", required: true },
        contentTypeId: { type: "string", required: true },
      }),
      detailInfo: operation("/detailInfo2", "반복정보 조회", {
        contentId: { type: "string", required: true },
        contentTypeId: { type: "string", required: true },
      }),
      detailImage: operation("/detailImage2", "이미지정보 조회", {
        contentId: { type: "string", required: true },
        imageYN: { type: "string", required: false },
        subImageYN: { type: "string", required: false },
      }),
      detailPetTour: operation("/detailPetTour2", "반려동물 동반 여행정보 조회", { contentId: { type: "string", required: true } }),
      areaBasedSyncList: operation("/areaBasedSyncList2", "관광정보 동기화 목록 조회", {
        showflag: { type: "integer", required: false },
        modifiedtime: { type: "string", required: false },
        areaCode: { type: "string", required: false },
        sigunguCode: { type: "string", required: false },
        contentTypeId: { type: "string", required: false },
        cat1: { type: "string", required: false },
        cat2: { type: "string", required: false },
        cat3: { type: "string", required: false },
      }),
      legalDongCode: operation("/ldongCode2", "법정동 코드 조회", {
        lDongRegnCd: { type: "string", required: false },
        lDongSignguCd: { type: "string", required: false },
      }),
      classificationCode: operation("/lclsSystmCode2", "분류체계 코드 조회", {
        lclsSystm1: { type: "string", required: false },
        lclsSystm2: { type: "string", required: false },
        lclsSystm3: { type: "string", required: false },
      }),
    },
  },
  concentration: {
    name: "한국관광공사 관광지 집중률 방문자 추이 예측",
    dataGoKrUrl: "https://www.data.go.kr/data/15128555/openapi.do",
    baseUrl: "https://apis.data.go.kr/B551011/TatsCnctrRateService",
    operations: {
      list: operation("/tatsCnctrRatedList", "향후 30일 관광지 집중률 조회", {
        areaCd: { type: "string", required: true },
        signguCd: { type: "string", required: true },
        tAtsNm: { type: "string", required: false },
      }),
    },
  },
  camping: {
    name: "한국관광공사 고캠핑 정보 조회서비스",
    dataGoKrUrl: "https://www.data.go.kr/data/15101933/openapi.do",
    baseUrl: "https://apis.data.go.kr/B551011/GoCamping",
    operations: {
      basedList: operation("/basedList", "캠핑장 기본정보 목록 조회"),
      locationBasedList: operation("/locationBasedList", "위치기반 캠핑장 조회", {
        mapX: { type: "number", required: true },
        mapY: { type: "number", required: true },
        radius: { type: "integer", required: true },
      }),
      searchList: operation("/searchList", "캠핑장 키워드 검색", { keyword: { type: "string", required: true } }),
      imageList: operation("/imageList", "캠핑장 이미지 조회", { contentId: { type: "string", required: true } }),
      syncList: operation("/basedSyncList", "캠핑장 동기화 목록 조회", {
        syncStatus: { type: "string", required: false },
        modifiedtime: { type: "string", required: false },
      }),
    },
  },
  relatedTourism: {
    name: "한국관광공사 관광지별 연관 관광지 정보",
    dataGoKrUrl: "https://www.data.go.kr/data/15128560/openapi.do",
    baseUrl: "https://apis.data.go.kr/B551011/TarRlteTarService1",
    operations: {
      areaBasedList: operation("/areaBasedList1", "지역기반 연관 관광지 조회", {
        baseYm: { type: "string", required: true },
        areaCd: { type: "string", required: true },
        signguCd: { type: "string", required: true },
      }),
      searchKeyword: operation("/searchKeyword1", "키워드 기반 연관 관광지 조회", {
        baseYm: { type: "string", required: true },
        keyword: { type: "string", required: true },
      }),
    },
  },
};

export function getPublicDataOperation(serviceId, operationId) {
  const service = publicDataRegistry[serviceId];
  const selectedOperation = service?.operations?.[operationId];
  if (!service || !selectedOperation) return null;
  return { service, operation: selectedOperation };
}

export function publicCatalog() {
  return Object.entries(publicDataRegistry).map(([id, service]) => ({
    id,
    name: service.name,
    dataGoKrUrl: service.dataGoKrUrl,
    baseUrl: service.baseUrl,
    operations: Object.entries(service.operations).map(([operationId, item]) => ({ id: operationId, ...item })),
  }));
}
