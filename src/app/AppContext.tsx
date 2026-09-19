import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createDefaultPlanner } from "../domain/planner";
import { createRouteEstimate } from "../domain/routeEstimate";
import type { Destination, PlannerState, SavedJourneyItem } from "../domain/types";
import { useJourneySelection } from "../features/journey/useJourneySelection";
import { useDeviceLocation } from "../features/location/useDeviceLocation";
import { useRecommendations } from "../features/recommendations/useRecommendations";
import { calculateDistanceKm, estimateTravelMinutes, resolveDestinationCoordinates } from "../lib/geoFallback";
import { rankDestinations, scoreDestination, type RankedDestination } from "../lib/recommendationEngine";
import { useRoute } from "./navigation";

export type AppContextType = ReturnType<typeof useAppModel>;

const AppContext = createContext<AppContextType | null>(null);

function savedItemToDestination(item: SavedJourneyItem, planner: PlannerState): RankedDestination {
  const coords = resolveDestinationCoordinates(
    item.destination ?? {
      name: item.destinationName,
      address: item.destinationAddress,
      region: item.destinationRegion,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
    }
  );

  const distKm =
    item.destination?.distanceKm ??
    item.distanceKm ??
    calculateDistanceKm(
      { latitude: planner.latitude, longitude: planner.longitude },
      coords
    );

  const travelMins =
    item.destination?.travelMinutesEstimate ??
    item.travelMinutesEstimate ??
    estimateTravelMinutes(distKm);

  const rawDest: Destination = item.destination ?? {
    id: item.destinationId,
    name: item.destinationName,
    address: item.destinationAddress,
    region: item.destinationRegion,
    latitude: coords.latitude,
    longitude: coords.longitude,
    imageUrl: item.imageUrl ?? null,
    thumbnailUrl: item.imageUrl ?? null,
    contentTypeId: null,
    tel: null,
    modifiedAt: item.savedAt,
    source: "KorService2",
    concentrationRate: null,
    concentrationDate: null,
    calm: item.calm ?? null,
    distanceKm: distKm,
    travelMinutesEstimate: travelMins,
    travelEstimateMethod: "공공데이터 좌표 기반 계산",
    nearbyCampgrounds: [],
    relatedPlaces: [],
    accessible: null,
    cloud: null,
    parkingMinutes: null,
    observingWindow: null,
  };

  const dest: Destination = {
    ...rawDest,
    latitude: coords.latitude ?? rawDest.latitude,
    longitude: coords.longitude ?? rawDest.longitude,
    distanceKm: distKm ?? rawDest.distanceKm,
    travelMinutesEstimate: travelMins ?? rawDest.travelMinutesEstimate,
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
  const recommendations = useRecommendations(planner, true);
  const ranked = useMemo(() => rankDestinations(recommendations.data?.destinations ?? [], planner), [recommendations.data, planner]);
  
  const destination = useMemo(() => {
    let target: Destination | null = null;
    if (selectedId) {
      const fromRanked = ranked.find((item) => item.id === selectedId);
      if (fromRanked) {
        target = fromRanked;
      } else {
        const fromSaved = journey.savedJourneys.find((item) => item.destinationId === selectedId);
        if (fromSaved) target = savedItemToDestination(fromSaved, planner);
      }
    }
    if (!target && ranked.length > 0) target = ranked[0];
    if (!target && journey.savedJourneys.length > 0) {
      target = savedItemToDestination(journey.savedJourneys[0], planner);
    }
    if (!target) return null;

    // 좌표가 누락된 경우 안전하게 폴백 좌표 매핑
    const coords = resolveDestinationCoordinates(target);
    const distKm =
      target.distanceKm ??
      calculateDistanceKm(
        { latitude: planner.latitude, longitude: planner.longitude },
        coords
      );
    const travelMins =
      target.travelMinutesEstimate ?? estimateTravelMinutes(distKm);

    const updatedDest: Destination = {
      ...target,
      latitude: coords.latitude ?? target.latitude,
      longitude: coords.longitude ?? target.longitude,
      distanceKm: distKm,
      travelMinutesEstimate: travelMins,
    };

    const analysis = "analysis" in target && target.analysis ? target.analysis : scoreDestination(updatedDest, planner);

    return {
      ...updatedDest,
      analysis,
    } as RankedDestination;
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
