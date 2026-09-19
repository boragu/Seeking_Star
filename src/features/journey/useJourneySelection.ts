import { useCallback, useState } from "react";
import type { Destination, PlannerState, SavedJourneyItem } from "../../domain/types";

const SELECTED_KEY = "stargazing-selected-id";
const SAVED_JOURNEYS_KEY = "stargazing-saved-journeys";
const LEGACY_SAVED_KEY = "stargazing-trip-saved";

function loadSavedJourneys(): SavedJourneyItem[] {
  try {
    const raw = localStorage.getItem(SAVED_JOURNEYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useJourneySelection() {
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [savedJourneys, setSavedJourneysState] = useState<SavedJourneyItem[]>(loadSavedJourneys);

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState(id);
    if (id) {
      localStorage.setItem(SELECTED_KEY, id);
    } else {
      localStorage.removeItem(SELECTED_KEY);
    }
  }, []);

  const persistJourneys = useCallback((items: SavedJourneyItem[]) => {
    setSavedJourneysState(items);
    localStorage.setItem(SAVED_JOURNEYS_KEY, JSON.stringify(items));
    localStorage.setItem(LEGACY_SAVED_KEY, items.length > 0 ? "true" : "false");
  }, []);

  const isSaved = useCallback((destinationId: string | null | undefined): boolean => {
    if (!destinationId) return false;
    return savedJourneys.some((item) => item.destinationId === destinationId);
  }, [savedJourneys]);

  const saveJourney = useCallback((destination: Destination, planner: PlannerState) => {
    const newItem: SavedJourneyItem = {
      id: `${destination.id}-${Date.now()}`,
      destinationId: destination.id,
      destinationName: destination.name,
      destinationAddress: destination.address || destination.region,
      destinationRegion: destination.region,
      imageUrl: destination.imageUrl || destination.thumbnailUrl,
      calm: destination.calm,
      distanceKm: destination.distanceKm,
      travelMinutesEstimate: destination.travelMinutesEstimate,
      date: planner.date,
      departureTime: planner.time,
      departureName: planner.departure,
      campgroundCount: destination.nearbyCampgrounds?.length ?? 0,
      relatedCount: destination.relatedPlaces?.length ?? 0,
      savedAt: new Date().toISOString(),
    };
    const next = [newItem, ...savedJourneys.filter((j) => j.destinationId !== destination.id)];
    persistJourneys(next);
  }, [savedJourneys, persistJourneys]);

  const removeSaved = useCallback((destinationId: string) => {
    const next = savedJourneys.filter((item) => item.destinationId !== destinationId && item.id !== destinationId);
    persistJourneys(next);
  }, [savedJourneys, persistJourneys]);

  const toggleSave = useCallback((destination: Destination, planner: PlannerState) => {
    if (isSaved(destination.id)) {
      removeSaved(destination.id);
    } else {
      saveJourney(destination, planner);
    }
  }, [isSaved, removeSaved, saveJourney]);

  const clearAll = useCallback(() => {
    persistJourneys([]);
  }, [persistJourneys]);

  // Backward compatibility alias for active destination
  const activeSaved = isSaved(selectedId);
  const setSaved = useCallback((value: boolean) => {
    // If setting to false, remove selected
    if (!value && selectedId) {
      removeSaved(selectedId);
    }
  }, [selectedId, removeSaved]);

  return {
    selectedId,
    setSelectedId,
    savedJourneys,
    isSaved,
    saveJourney,
    removeSaved,
    toggleSave,
    clearAll,
    saved: activeSaved,
    setSaved,
  };
}
