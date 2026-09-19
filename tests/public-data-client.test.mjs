import assert from "node:assert/strict";
import test from "node:test";
import { createPublicDataClient, PublicDataError } from "../worker/lib/public-data-client.js";

test("requires a server-side public data service key", () => {
  assert.throws(() => createPublicDataClient({ serviceKey: "" }), (error) => {
    assert.ok(error instanceof PublicDataError);
    assert.equal(error.code, "SERVICE_KEY_REQUIRED");
    assert.equal(error.status, 503);
    return true;
  });
});

test("rejects missing required operation parameters before network access", async () => {
  const client = createPublicDataClient({ serviceKey: "key", fetchImpl: async () => { throw new Error("must not run"); } });
  await assert.rejects(client.call("korTour", "searchKeyword", {}), (error) => {
    assert.equal(error.code, "INVALID_PARAMETERS");
    assert.deepEqual(error.details.missing, ["keyword"]);
    return true;
  });
});

test("normalizes official response items and decodes an encoded service key once", async () => {
  let requestedUrl;
  const client = createPublicDataClient({
    serviceKey: "A%2BB%2FC",
    fetchImpl: async (url) => {
      requestedUrl = url;
      return Response.json({ response: { header: { resultCode: "0000", resultMsg: "OK" }, body: { items: { item: { contentid: "1", title: "테스트 천문대" } }, pageNo: 1, numOfRows: 20, totalCount: 1 } } });
    },
  });
  const result = await client.call("korTour", "searchKeyword", { keyword: "천문대" });
  assert.equal(requestedUrl.searchParams.get("serviceKey"), "A+B/C");
  assert.equal(result.items[0].title, "테스트 천문대");
  assert.equal(result.totalCount, 1);
});

test("only registered services and operations can be proxied", async () => {
  const client = createPublicDataClient({ serviceKey: "key", fetchImpl: fetch });
  await assert.rejects(client.call("unknown", "anything"), (error) => {
    assert.equal(error.code, "OPERATION_NOT_FOUND");
    assert.equal(error.status, 404);
    return true;
  });
});
