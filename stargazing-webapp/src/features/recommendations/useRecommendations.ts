import { useCallback, useEffect, useRef, useState } from "react";
import { ApiRequestError, type RecommendationResponse } from "../../api/contracts";
import { fetchRecommendations } from "../../api/recommendations";
import type { PlannerState } from "../../domain/types";

export type RecommendationStatus = "idle" | "loading" | "success" | "error";

export function useRecommendations(planner: PlannerState, enabled: boolean) {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [status, setStatus] = useState<RecommendationStatus>("idle");
  const [error, setError] = useState<ApiRequestError | null>(null);
  const requested = useRef(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const controller = new AbortController();
    try {
      const next = await fetchRecommendations(planner, controller.signal);
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
    if (!enabled || requested.current) return;
    requested.current = true;
    void load();
  }, [enabled, load]);

  return { data, status, error, reload: load };
}
