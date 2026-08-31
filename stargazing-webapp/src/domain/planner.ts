import { getCurrentDateTime } from "../lib/currentContext";
import type { PlannerState } from "./types";

export function createDefaultPlanner(): PlannerState {
  const current = getCurrentDateTime();
  return {
    departure: "현재 위치 미설정",
    date: current.date,
    time: current.time,
    people: "2",
    transport: "car",
    accessibility: false,
    latitude: null,
    longitude: null,
    locationAccuracy: null,
    locationSource: "unset",
  };
}
