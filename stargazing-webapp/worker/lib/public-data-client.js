import { getPublicDataOperation } from "./public-data-registry.js";

export class PublicDataError extends Error {
  constructor(message, { code = "PUBLIC_DATA_ERROR", status = 502, details = null } = {}) {
    super(message);
    this.name = "PublicDataError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function normalizeItems(payload) {
  const body = payload?.response?.body ?? payload?.body;
  const items = body?.items?.item ?? body?.items ?? [];
  return Array.isArray(items) ? items : items ? [items] : [];
}

function readHeader(payload) {
  return payload?.response?.header ?? payload?.header ?? {};
}

function readBody(payload) {
  return payload?.response?.body ?? payload?.body ?? {};
}

function assertRequiredParameters(operation, parameters) {
  const missing = Object.entries(operation.parameters)
    .filter(([, definition]) => definition.required)
    .map(([name]) => name)
    .filter((name) => parameters[name] === undefined || parameters[name] === null || parameters[name] === "");
  if (missing.length) {
    throw new PublicDataError(`필수 파라미터가 없습니다: ${missing.join(", ")}`, {
      code: "INVALID_PARAMETERS",
      status: 400,
      details: { missing },
    });
  }
}

export function createPublicDataClient({ serviceKey, fetchImpl = fetch }) {
  if (!serviceKey) {
    throw new PublicDataError("공공데이터포털 서비스키가 설정되지 않았습니다.", {
      code: "SERVICE_KEY_REQUIRED",
      status: 503,
    });
  }

  let normalizedServiceKey = serviceKey;
  if (/%[0-9a-f]{2}/i.test(serviceKey)) {
    try { normalizedServiceKey = decodeURIComponent(serviceKey); } catch { /* Keep the provided key unchanged. */ }
  }

  return {
    async call(serviceId, operationId, parameters = {}) {
      const definition = getPublicDataOperation(serviceId, operationId);
      if (!definition) {
        throw new PublicDataError("등록되지 않은 공공데이터 API입니다.", {
          code: "OPERATION_NOT_FOUND",
          status: 404,
          details: { serviceId, operationId },
        });
      }

      assertRequiredParameters(definition.operation, parameters);
      const url = new URL(`${definition.service.baseUrl}${definition.operation.path}`);
      url.searchParams.set("serviceKey", normalizedServiceKey);
      for (const [name, parameter] of Object.entries(definition.operation.parameters)) {
        const value = parameters[name] ?? parameter.default;
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(name, String(value));
      }

      let response;
      try {
        response = await fetchImpl(url, {
          headers: { accept: "application/json" },
          cf: { cacheTtl: 300, cacheEverything: true },
        });
      } catch (error) {
        throw new PublicDataError("공공데이터 제공기관에 연결하지 못했습니다.", {
          code: "UPSTREAM_NETWORK_ERROR",
          details: { serviceId, operationId, cause: String(error) },
        });
      }

      if (!response.ok) {
        throw new PublicDataError(`공공데이터 API가 HTTP ${response.status}를 반환했습니다.`, {
          code: response.status === 401 ? "UNAUTHORIZED" : "UPSTREAM_HTTP_ERROR",
          status: response.status === 401 ? 401 : 502,
          details: { serviceId, operationId, upstreamStatus: response.status },
        });
      }

      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new PublicDataError("공공데이터 API 응답이 JSON 형식이 아닙니다.", {
          code: "INVALID_UPSTREAM_RESPONSE",
          details: { serviceId, operationId },
        });
      }

      const header = readHeader(payload);
      const resultCode = String(header.resultCode ?? header.resultCd ?? "0000");
      if (!["0000", "00", "0"].includes(resultCode)) {
        throw new PublicDataError(header.resultMsg ?? header.resultMessage ?? "공공데이터 API 오류", {
          code: "UPSTREAM_RESULT_ERROR",
          details: { serviceId, operationId, resultCode, header },
        });
      }

      const body = readBody(payload);
      return {
        serviceId,
        operationId,
        items: normalizeItems(payload),
        page: Number(body.pageNo ?? parameters.pageNo ?? 1),
        pageSize: Number(body.numOfRows ?? parameters.numOfRows ?? 0),
        totalCount: Number(body.totalCount ?? 0),
        raw: payload,
      };
    },
  };
}
