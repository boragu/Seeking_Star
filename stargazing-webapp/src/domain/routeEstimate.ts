import type { Destination, RouteEstimate } from "./types";

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder}분`;
  return remainder ? `${hours}시간 ${remainder}분` : `${hours}시간`;
}

export function createRouteEstimate(destination: Destination | null): RouteEstimate | null {
  if (!destination || destination.travelMinutesEstimate === null || destination.distanceKm === null) return null;
  return {
    id: "estimate",
    title: "현재 위치 기준 참고 이동",
    durationMinutes: destination.travelMinutesEstimate,
    duration: formatDuration(destination.travelMinutesEstimate),
    distance: `직선거리 ${destination.distanceKm.toFixed(1)}km`,
    note: destination.travelEstimateMethod ?? "공공데이터 좌표로 계산한 참고값",
  };
}
