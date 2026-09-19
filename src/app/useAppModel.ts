import { useEffect, useMemo, useState } from "react";
import { createDefaultPlanner } from "../domain/planner";
import { createRouteEstimate } from "../domain/routeEstimate";
import type { PlannerState } from "../domain/types";
import { useJourneySelection } from "../features/journey/useJourneySelection";
import { useDeviceLocation } from "../features/location/useDeviceLocation";
import { useRecommendations } from "../features/recommendations/useRecommendations";
import { rankDestinations } from "../lib/recommendationEngine";
import type { AppPath } from "./navigation";

export function useAppModel(path: AppPath) {
  const [planner, setPlanner] = useState<PlannerState>(createDefaultPlanner);
  const journey = useJourneySelection();
  const { selectedId, setSelectedId } = journey;
  const location = useDeviceLocation(setPlanner);
  const recommendations = useRecommendations(planner, path !== "/");
  const ranked = useMemo(() => rankDestinations(recommendations.data?.destinations ?? [], planner), [recommendations.data, planner]);
  const destination = ranked.find((item) => item.id === selectedId) ?? ranked[0] ?? null;
  const route = useMemo(() => createRouteEstimate(destination), [destination]);

  useEffect(() => {
    if (ranked.length && (!selectedId || !ranked.some((item) => item.id === selectedId))) setSelectedId(ranked[0].id);
  }, [ranked, selectedId, setSelectedId]);

  return { planner, setPlanner, ranked, destination, route, recommendations, location, journey };
}
