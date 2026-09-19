import type { Destination, PlannerState } from "../../domain/types";

export function createMapEmbedUrl(destination: Destination, planner: PlannerState): string | null {
  if (destination.latitude === null || destination.longitude === null) return null;
  const points = [{ latitude: destination.latitude, longitude: destination.longitude }];
  if (planner.latitude !== null && planner.longitude !== null) points.push({ latitude: planner.latitude, longitude: planner.longitude });
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const padding = points.length === 1 ? 0.12 : Math.max(0.08, (Math.max(...latitudes) - Math.min(...latitudes)) * 0.2);
  const query = new URLSearchParams({
    bbox: `${Math.min(...longitudes) - padding},${Math.min(...latitudes) - padding},${Math.max(...longitudes) + padding},${Math.max(...latitudes) + padding}`,
    layer: "mapnik",
    marker: `${destination.latitude},${destination.longitude}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${query}`;
}
