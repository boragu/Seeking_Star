import assert from "node:assert/strict";
import test from "node:test";
import {
  addMinutesToTime,
  getCurrentDateTime,
  resolveLocationLabel,
} from "../src/lib/currentContext.ts";

test("creates planner values from the actual local date and time", () => {
  assert.deepEqual(getCurrentDateTime(new Date(2026, 7, 4, 16, 7)), {
    date: "2026-08-04",
    time: "16:07",
  });
});

test("calculates route arrival across midnight", () => {
  assert.equal(addMinutesToTime("23:20", 166), "02:06");
});

test("turns device coordinates into a readable nearby departure", () => {
  assert.equal(
    resolveLocationLabel({ latitude: 37.5133, longitude: 127.1001, accuracy: 30 }),
    "서울 잠실 인근",
  );
});
