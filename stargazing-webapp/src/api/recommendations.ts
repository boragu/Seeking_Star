import type { PlannerState } from "../domain/types";
import { ApiRequestError, type ApiErrorPayload, type RecommendationResponse } from "./contracts";

export async function fetchRecommendations(planner: PlannerState, signal?: AbortSignal): Promise<RecommendationResponse> {
  const query = new URLSearchParams({
    date: planner.date,
    departureTime: planner.time,
  });
  if (planner.latitude !== null && planner.longitude !== null) {
    query.set("latitude", String(planner.latitude));
    query.set("longitude", String(planner.longitude));
  }

  const response = await fetch(`/api/recommendations?${query}`, {
    headers: { accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as ApiErrorPayload;
    throw new ApiRequestError(
      payload.error?.message ?? "공공데이터를 불러오지 못했습니다.",
      payload.error?.code ?? "REQUEST_FAILED",
      response.status,
    );
  }
  return response.json() as Promise<RecommendationResponse>;
}
