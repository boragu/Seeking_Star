import { getCurrentDateTime } from "../lib/currentContext";
import type { PlannerState } from "./types";

export function createDefaultPlanner(): PlannerState {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const current = getCurrentDateTime(tomorrow);
  return {
    departure: "서울역 (기본 설정)",
    date: current.date,
    time: current.time,
    people: "2",
    transport: "car",
    accessibility: false,
    latitude: 37.5559,
    longitude: 126.9723,
    locationAccuracy: 100,
    locationSource: "manual",
  };
}
