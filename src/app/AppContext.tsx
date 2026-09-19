import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createDefaultPlanner } from "../domain/planner";
import { createRouteEstimate } from "../domain/routeEstimate";
import type { Destination, PlannerState, SavedJourneyItem } from "../domain/types";
import { useJourneySelection } from "../features/journey/useJourneySelection";
import { useDeviceLocation } from "../features/location/useDeviceLocation";
import { useRecommendations } from "../features/recommendations/useRecommendations";
import { rankDestinations, scoreDestination, type RankedDestination } from "../lib/recommendationEngine";
import { useRoute } from "./navigation";

export type AppContextType = ReturnType<typeof useAppModel>;

const AppContext = createContext<AppContextType | null>(null);

function savedItemToDestination(item: SavedJourneyItem, planner: PlannerState): RankedDestination {
  const dest: Destination = item.destination ?? {
    id: item.destinationId,
    name: item.destinationName,
    address: item.destinationAddress,
    region: item.destinationRegion,
    latitude: null,
    longitude: null,
    imageUrl: item.imageUrl ?? null,
    thumbnailUrl: item.imageUrl ?? null,
    contentTypeId: null,
    tel: null,
    modifiedAt: item.savedAt,
    source: "KorService2",
    concentrationRate: null,
    concentrationDate: null,
    calm: item.calm ?? null,
    distanceKm: item.distanceKm ?? null,
    travelMinutesEstimate: item.travelMinutesEstimate ?? null,
    travelEstimateMethod: null,
    nearbyCampgrounds: [],
    relatedPlaces: [],
    accessible: null,
    cloud: null,
    parkingMinutes: null,
    observingWindow: null,
  };

  return {
    ...dest,
    analysis: scoreDestination(dest, planner),
  };
}

function useAppModel(path: string) {
  const [planner, setPlanner] = useState<PlannerState>(createDefaultPlanner);
  const journey = useJourneySelection();
  const { selectedId, setSelectedId } = journey;
  const location = useDeviceLocation(setPlanner);
  const recommendations = useRecommendations(planner, false);
  const ranked = useMemo(() => rankDestinations(recommendations.data?.destinations ?? [], planner), [recommendations.data, planner]);
  
  const destination = useMemo(() => {
    if (selectedId) {
      const fromRanked = ranked.find((item) => item.id === selectedId);
      if (fromRanked) return fromRanked;
      const fromSaved = journey.savedJourneys.find((item) => item.destinationId === selectedId);
      if (fromSaved) return savedItemToDestination(fromSaved, planner);
    }
    if (ranked.length > 0) return ranked[0];
    if (journey.savedJourneys.length > 0) {
      return savedItemToDestination(journey.savedJourneys[0], planner);
    }
    return null;
  }, [ranked, selectedId, journey.savedJourneys, planner]);

  const route = useMemo(() => createRouteEstimate(destination), [destination]);

  const reloadRecommendations = useCallback(async () => {
    setSelectedId(null);
    return recommendations.reload();
  }, [setSelectedId, recommendations]);

  useEffect(() => {
    if (!ranked.length) return;
    const isSelectedInRanked = ranked.some((item) => item.id === selectedId);
    const isSelectedInSaved = journey.savedJourneys.some((item) => item.destinationId === selectedId);
    if (!selectedId || (!isSelectedInRanked && !isSelectedInSaved)) {
      setSelectedId(ranked[0].id);
    }
  }, [ranked, selectedId, journey.savedJourneys, setSelectedId]);

  return { 
    planner, 
    setPlanner, 
    ranked, 
    destination, 
    route, 
    recommendations: { ...recommendations, reload: reloadRecommendations }, 
    location, 
    journey 
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [path] = useRoute();
  const model = useAppModel(path);

  return <AppContext.Provider value={model}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
