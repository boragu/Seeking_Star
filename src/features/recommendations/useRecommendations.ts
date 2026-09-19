import { useCallback, useEffect, useRef, useState } from "react";
import { ApiRequestError, type RecommendationResponse } from "../../api/contracts";
import { fetchRecommendations } from "../../api/recommendations";
import type { PlannerState } from "../../domain/types";

export type RecommendationStatus = "idle" | "loading" | "success" | "error";

export function useRecommendations(planner: PlannerState, autoFetch: boolean = false) {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [status, setStatus] = useState<RecommendationStatus>("idle");
  const [error, setError] = useState<ApiRequestError | null>(null);
  const lastQueryRef = useRef<string | null>(null);

  const load = useCallback(async (customPlanner?: PlannerState) => {
    const targetPlanner = customPlanner ?? planner;
    setStatus("loading");
    setError(null);
    const controller = new AbortController();
    try {
      const next = await fetchRecommendations(targetPlanner, controller.signal);
      setData(next);
      setStatus("success");
      return next;
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return null;
      const nextError = cause instanceof ApiRequestError
        ? cause
        : new ApiRequestError("공공데이터를 불러오지 못했습니다.", "REQUEST_FAILED", 0);
      setError(nextError);
      setStatus("error");
      return null;
    }
  }, [planner]);

  useEffect(() => {
    if (!autoFetch) return;
    const currentQueryKey = `${planner.date}_${planner.time}_${planner.latitude}_${planner.longitude}`;
    if (lastQueryRef.current === currentQueryKey) return;
    lastQueryRef.current = currentQueryKey;
    void load();
  }, [autoFetch, planner.date, planner.time, planner.latitude, planner.longitude, load]);

  return { data, status, error, reload: () => load() };
}
