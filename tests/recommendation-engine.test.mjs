import assert from "node:assert/strict";
import test from "node:test";
import { parseMinutes, rankDestinations, scoreDestination } from "../src/lib/recommendationEngine.ts";

const destination = (overrides = {}) => ({
  id: "spot", name: "관측지", address: "", region: "강원", latitude: null, longitude: null,
  imageUrl: null, thumbnailUrl: null, contentTypeId: null, tel: null, modifiedAt: null, source: "KorService2",
  concentrationRate: 30, concentrationDate: null, calm: 70, distanceKm: 120, travelMinutesEstimate: 140,
  travelEstimateMethod: "테스트", nearbyCampgrounds: [], relatedPlaces: [], accessible: null,
  cloud: null, parkingMinutes: null, observingWindow: null, ...overrides,
});

test("parses Korean travel durations", () => {
  assert.equal(parseMinutes("2시간 46분"), 166);
  assert.equal(parseMinutes("10분"), 10);
});

test("uses only fields that are actually available", () => {
  const scored = scoreDestination(destination());
  assert.deepEqual(Object.keys(scored.breakdown).sort(), ["crowd", "travel"]);
  assert.equal(scored.dataCompleteness, 40);
  assert.ok(scored.total !== null);
});

test("does not invent a score when every source value is missing", () => {
  const scored = scoreDestination(destination({ calm: null, travelMinutesEstimate: null }));
  assert.equal(scored.total, null);
  assert.deepEqual(scored.breakdown, {});
});

test("accessibility preference changes ranking only when the API has that field", () => {
  const ranked = rankDestinations([
    destination({ id: "stairs", calm: 80, accessible: false }),
    destination({ id: "ramp", calm: 70, accessible: true }),
  ], { accessibility: true });
  assert.equal(ranked[0].id, "ramp");
});
