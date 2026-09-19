import { useCallback, useState } from "react";

const SELECTED_KEY = "stargazing-selected-id";
const SAVED_KEY = "stargazing-trip-saved";

export function useJourneySelection() {
  const [selectedId, setSelectedIdState] = useState<string | null>(() => localStorage.getItem(SELECTED_KEY));
  const [saved, setSavedState] = useState(() => localStorage.getItem(SAVED_KEY) === "true");

  const setSelectedId = useCallback((id: string) => {
    setSelectedIdState(id);
    localStorage.setItem(SELECTED_KEY, id);
  }, []);
  const setSaved = useCallback((value: boolean) => {
    setSavedState(value);
    localStorage.setItem(SAVED_KEY, String(value));
  }, []);

  return { selectedId, setSelectedId, saved, setSaved };
}
