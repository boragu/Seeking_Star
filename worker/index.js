import { getRecommendations } from "./api/recommendations.js";
import { createPublicDataClient, PublicDataError } from "./lib/public-data-client.js";
import { publicCatalog } from "./lib/public-data-registry.js";
import { createOpenApiDocument } from "./openapi.js";

function jsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", init.status && init.status >= 400
    ? "no-store"
    : "public, max-age=180, stale-while-revalidate=600");
  return new Response(JSON.stringify(payload), { ...init, headers });
}

function errorResponse(error) {
  const publicError = error instanceof PublicDataError
    ? error
    : new PublicDataError("서버에서 요청을 처리하지 못했습니다.", {
      code: "INTERNAL_ERROR",
      status: 500,
    });
  return jsonResponse({
    error: {
      code: publicError.code,
      message: publicError.message,
      details: publicError.details,
    },
  }, { status: publicError.status });
}

async function routeApi(request, env) {
  const url = new URL(request.url);
  if (request.method !== "GET") {
    return errorResponse(new PublicDataError("GET 요청만 지원합니다.", { code: "METHOD_NOT_ALLOWED", status: 405 }));
  }

  if (url.pathname === "/api/recommendations") {
    return jsonResponse(await getRecommendations(request, env));
  }
  if (url.pathname === "/api/catalog") {
    return jsonResponse({ services: publicCatalog() });
  }
  if (url.pathname === "/api/openapi.json") {
    return jsonResponse(createOpenApiDocument(url.origin));
  }
  if (url.pathname === "/api/health") {
    return jsonResponse({
      ok: true,
      publicDataConfigured: Boolean(env.DATA_GO_KR_SERVICE_KEY),
      generatedAt: new Date().toISOString(),
    });
  }

  const match = url.pathname.match(/^\/api\/public-data\/([^/]+)\/([^/]+)$/);
  if (match) {
    const [, serviceId, operationId] = match;
    const client = createPublicDataClient({
      serviceKey: env.DATA_GO_KR_SERVICE_KEY,
      fetchImpl: env.PUBLIC_DATA_FETCH ?? fetch,
    });
    const result = await client.call(serviceId, operationId, Object.fromEntries(url.searchParams));
    return jsonResponse(result);
  }

  return errorResponse(new PublicDataError("API 경로를 찾을 수 없습니다.", {
    code: "API_NOT_FOUND",
    status: 404,
    details: { path: url.pathname },
  }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await routeApi(request, env);
      } catch (error) {
        return errorResponse(error);
      }
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) return response;

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
