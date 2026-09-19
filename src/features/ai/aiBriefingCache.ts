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

// -------------------------------------------------------------
// 1. AI 야간 천문 촬영 가이드 캐시
// -------------------------------------------------------------
const PHOTO_CACHE_PREFIX = "stargazing-ai-photo:";

export function getCachedAiPhotoGuide(
  destination: Destination,
  planner: PlannerState,
  deviceType: "smartphone" | "camera"
): string | null {
  try {
    const date = planner.date || "nodate";
    const key = `${PHOTO_CACHE_PREFIX}${destination.id}:${date}:${deviceType}`;
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

export function setCachedAiPhotoGuide(
  destination: Destination,
  planner: PlannerState,
  deviceType: "smartphone" | "camera",
  text: string
): void {
  try {
    const date = planner.date || "nodate";
    const key = `${PHOTO_CACHE_PREFIX}${destination.id}:${date}:${deviceType}`;
    const data: CachedBriefing = { text, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function invalidateCachedAiPhotoGuide(
  destination: Destination,
  planner: PlannerState,
  deviceType: "smartphone" | "camera"
): void {
  try {
    const date = planner.date || "nodate";
    const key = `${PHOTO_CACHE_PREFIX}${destination.id}:${date}:${deviceType}`;
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// 2. AI 오버투어리즘 대체 스토리 캐시
// -------------------------------------------------------------
const STORY_CACHE_PREFIX = "stargazing-ai-story:";

export function getCachedAiOvertourismStory(destination: Destination): string | null {
  try {
    const key = `${STORY_CACHE_PREFIX}${destination.id}`;
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

export function setCachedAiOvertourismStory(destination: Destination, text: string): void {
  try {
    const key = `${STORY_CACHE_PREFIX}${destination.id}`;
    const data: CachedBriefing = { text, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// 3. AI 맞춤 출발 알림 메시지 캐시
// -------------------------------------------------------------
const ALERT_CACHE_PREFIX = "stargazing-ai-alert:";

export function getCachedAiAlertMessage(destination: Destination, planner: PlannerState): string | null {
  try {
    const key = `${ALERT_CACHE_PREFIX}${destination.id}:${planner.departure}:${planner.date}:${planner.time}`;
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

export function setCachedAiAlertMessage(destination: Destination, planner: PlannerState, text: string): void {
  try {
    const key = `${ALERT_CACHE_PREFIX}${destination.id}:${planner.departure}:${planner.date}:${planner.time}`;
    const data: CachedBriefing = { text, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}
