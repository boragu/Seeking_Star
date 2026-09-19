import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

const missingAssets = { fetch: async () => new Response("missing", { status: 404 }) };

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: { fetch: async (request) => { calls.push(new URL(request.url).pathname); return new Response("asset"); } },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/flow/step-two?source=share", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async (request) => { const url = new URL(request.url); calls.push(url.pathname + url.search); return new Response(url.pathname === "/index.html" ? "app" : "missing", { status: url.pathname === "/index.html" ? 200 : 404 }); } },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("returns a JSON 404 for unknown API paths without hitting static assets", async () => {
  let assetCalls = 0;
  const response = await worker.fetch(new Request("https://example.test/api/missing"), { ASSETS: { fetch: async () => { assetCalls += 1; return new Response("missing", { status: 404 }); } } });
  assert.equal(response.status, 404);
  assert.equal(assetCalls, 0);
  assert.equal((await response.json()).error.code, "API_NOT_FOUND");
});

test("does not fabricate recommendations when the service key is missing", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/recommendations"), { ASSETS: missingAssets });
  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.equal(payload.error.code, "SERVICE_KEY_REQUIRED");
  assert.equal("destinations" in payload, false);
  assert.equal(JSON.stringify(payload).includes("demo"), false);
});

test("exposes every registered operation through catalog and OpenAPI", async () => {
  const catalogResponse = await worker.fetch(new Request("https://example.test/api/catalog"), { ASSETS: missingAssets });
  const catalog = await catalogResponse.json();
  assert.equal(catalog.services.length, 4);
  assert.equal(catalog.services.reduce((count, service) => count + service.operations.length, 0), 23);

  const openApiResponse = await worker.fetch(new Request("https://example.test/api/openapi.json"), { ASSETS: missingAssets });
  const document = await openApiResponse.json();
  assert.equal(document.openapi, "3.1.0");
  assert.equal(Object.keys(document.paths).length, 27);
  assert.ok(document.paths["/api/public-data/korTour/searchKeyword"]);
});

test("builds recommendations exclusively from live upstream responses", async () => {
  const publicDataFetch = async (url) => {
    let items = [];
    if (url.pathname.includes("searchKeyword2")) items = [{ contentid: "tour-1", title: "테스트 별빛 천문대", addr1: "강원특별자치도 영월군", mapx: "128.46", mapy: "37.19" }];
    if (url.pathname.includes("tatsCnctrRatedList")) items = [{ tAtsNm: "테스트 별빛 천문대", tatsCnctrRate: "27", baseYmd: "20260804" }];
    if (url.pathname.includes("basedList")) items = [{ contentId: "camp-1", facltNm: "별빛 캠핑장", addr1: "강원 영월", mapX: "128.47", mapY: "37.20" }];
    if (url.pathname.includes("areaBasedList1")) items = [{ rlteTatsId: "related-1", rlteTatsNm: "밤 산책길", mapX: "128.48", mapY: "37.21" }];
    return Response.json({ response: { header: { resultCode: "0000", resultMsg: "OK" }, body: { items: { item: items }, pageNo: 1, numOfRows: 100, totalCount: items.length } } });
  };
  const response = await worker.fetch(new Request("https://example.test/api/recommendations?latitude=37.5&longitude=127.1&date=2026-08-04"), {
    ASSETS: missingAssets,
    DATA_GO_KR_SERVICE_KEY: "test-key",
    PUBLIC_DATA_FETCH: publicDataFetch,
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.mode, "live");
  assert.equal(payload.destinations.length, 1);
  assert.equal(payload.destinations[0].name, "테스트 별빛 천문대");
  assert.equal(payload.destinations[0].calm, 73);
  assert.equal(payload.destinations[0].nearbyCampgrounds.length, 1);
  assert.equal(payload.destinations[0].relatedPlaces.length, 1);
  assert.equal(payload.sources.every((source) => source.status === "live"), true);
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/server/lib/public-data-client.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
