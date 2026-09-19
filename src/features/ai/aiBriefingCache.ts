import type { Destination, PlannerState } from "../../domain/types";

const CACHE_PREFIX = "stargazing-ai-briefing:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24시간 유효

interface CachedBriefing {
  text: string;
  timestamp: number;
}

export function getAiBriefingCacheKey(destination: Destination, planner: PlannerState): string {
  const dep = planner.departure.trim();
  const date = planner.date || "nodate";
  const people = planner.people || "2";
  const transport = planner.transport || "car";
  const access = planner.accessibility ? "acc1" : "acc0";
  return `${CACHE_PREFIX}${destination.id}:${dep}:${date}:${people}:${transport}:${access}`;
}

export function getCachedAiBriefing(destination: Destination, planner: PlannerState): string | null {
  try {
    const key = getAiBriefingCacheKey(destination, planner);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data: CachedBriefing = JSON.parse(raw);
    if (!data.text || typeof data.text !== "string") return null;
    if (Date.now() - data.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return data.text;
  } catch {
    return null;
  }
}

export function setCachedAiBriefing(destination: Destination, planner: PlannerState, text: string): void {
  try {
    const key = getAiBriefingCacheKey(destination, planner);
    const data: CachedBriefing = {
      text,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or private browsing
  }
}

export function invalidateCachedAiBriefing(destination: Destination, planner: PlannerState): void {
  try {
    const key = getAiBriefingCacheKey(destination, planner);
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
