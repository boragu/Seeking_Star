import { publicDataRegistry } from "./lib/public-data-registry.js";

const parameterSchema = (definition) => {
  const schema = { type: definition.type || "string" };
  if (definition.default !== undefined) schema.default = definition.default;
  return schema;
};

const jsonResponse = (description) => ({
  description,
  content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
});

export function createOpenApiDocument(origin = "") {
  const paths = {
    "/api/recommendations": {
      get: {
        tags: ["별보기 추천"],
        summary: "현재 조건에 맞는 별 관측 후보 통합 조회",
        description: "관광정보·관광지 집중률·고캠핑·연관 관광지를 병렬 조회하고 실데이터만 정규화합니다.",
        parameters: [
          ["date", "string", "date"],
          ["departureTime", "string", "time"],
          ["latitude", "number"],
          ["longitude", "number"],
          ["tourAreaCode", "string"],
          ["areaCd", "string"],
          ["signguCd", "string"],
          ["baseYm", "string"],
        ].map(([name, type, format]) => ({ name, in: "query", required: false, schema: { type, ...(format ? { format } : {}) } })),
        responses: { 200: jsonResponse("실데이터 추천 결과"), 503: jsonResponse("서비스키 미설정") },
      },
    },
    "/api/catalog": {
      get: { tags: ["개발자 도구"], summary: "허용된 공공데이터 API 전체 카탈로그", responses: { 200: jsonResponse("API 카탈로그") } },
    },
    "/api/openapi.json": {
      get: { tags: ["개발자 도구"], summary: "OpenAPI 3.1 문서", responses: { 200: jsonResponse("OpenAPI 문서") } },
    },
    "/api/health": {
      get: { tags: ["개발자 도구"], summary: "서버와 서비스키 설정 상태", responses: { 200: jsonResponse("상태") } },
    },
  };

  for (const [serviceId, service] of Object.entries(publicDataRegistry)) {
    for (const [operationId, operation] of Object.entries(service.operations)) {
      paths[`/api/public-data/${serviceId}/${operationId}`] = {
        get: {
          tags: [service.name],
          summary: operation.summary,
          description: `공공데이터포털 원본 엔드포인트 ${service.baseUrl}${operation.path}의 서버 측 프록시입니다. 서비스키는 브라우저에 노출되지 않습니다.`,
          operationId: `${serviceId}_${operationId}`,
          externalDocs: { description: "공공데이터포털 명세", url: service.dataGoKrUrl },
          parameters: Object.entries(operation.parameters).map(([name, definition]) => ({
            name,
            in: "query",
            required: Boolean(definition.required),
            description: definition.description,
            schema: parameterSchema(definition),
          })),
          responses: {
            200: jsonResponse("공공데이터 응답과 정규화된 items"),
            400: jsonResponse("필수 파라미터 누락"),
            502: jsonResponse("공공데이터 API 오류"),
            503: jsonResponse("서비스키 미설정"),
          },
        },
      };
    }
  }

  return {
    openapi: "3.1.0",
    info: {
      title: "별보러간다 Public Data Gateway",
      version: "1.0.0",
      description: "브라우저에 서비스키를 노출하지 않고 한국관광공사 공공데이터 API를 조회하는 등록형 게이트웨이입니다. 가짜 응답이나 더미 폴백을 제공하지 않습니다.",
    },
    servers: [{ url: origin || "/", description: "현재 앱 서버" }],
    paths,
    tags: [
      { name: "별보기 추천" },
      { name: "개발자 도구" },
      ...Object.values(publicDataRegistry).map((service) => ({ name: service.name, externalDocs: { url: service.dataGoKrUrl } })),
    ],
  };
}
