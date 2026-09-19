import { useCallback, useEffect, useState } from "react";
import type { PlannerState } from "../../domain/types";
import { formatAccuracy, resolveLocationLabel, type DeviceLocation } from "../../lib/currentContext";

export type LocationStatus = "idle" | "loading" | "success" | "denied" | "error" | "unsupported";
export interface LocationFeedback { status: LocationStatus; message: string }

const STORAGE_KEY = "stargazing-device-location";
const CACHE_TTL = 6 * 60 * 60 * 1000;

export function useDeviceLocation(setPlanner: React.Dispatch<React.SetStateAction<PlannerState>>) {
  const [feedback, setFeedback] = useState<LocationFeedback>({ status: "idle", message: "현재 위치를 사용하면 가까운 장소부터 볼 수 있어요." });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setFeedback({ status: "unsupported", message: "이 기기에서는 위치 기능을 사용할 수 없어요." });
      return;
    }
    setFeedback({ status: "loading", message: "현재 위치를 확인하고 있어요…" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: DeviceLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy };
        const departure = resolveLocationLabel(location);
        setPlanner((state) => ({ ...state, departure, latitude: location.latitude, longitude: location.longitude, locationAccuracy: location.accuracy, locationSource: "device" }));
        setFeedback({ status: "success", message: `${departure} · ${formatAccuracy(location.accuracy)}` });
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...location, departure, savedAt: Date.now() })); } catch { /* 위치 저장 없이도 현재 세션은 유지됩니다. */ }
      },
      (error) => setFeedback({ status: error.code === error.PERMISSION_DENIED ? "denied" : "error", message: error.code === error.PERMISSION_DENIED ? "위치 권한을 허용하면 가까운 순서로 추천할 수 있어요." : "현재 위치를 확인하지 못했어요. 잠시 후 다시 시도해 주세요." }),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 },
    );
  }, [setPlanner]);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as (DeviceLocation & { departure: string; savedAt: number }) | null;
      if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
        setPlanner((state) => ({ ...state, departure: cached.departure, latitude: cached.latitude, longitude: cached.longitude, locationAccuracy: cached.accuracy, locationSource: "device" }));
        setFeedback({ status: "success", message: `${cached.departure} · 최근 위치 ${formatAccuracy(cached.accuracy)}` });
        return;
      }
    } catch { /* 저장된 위치를 읽을 수 없으면 기본 상태를 사용합니다. */ }
    navigator.permissions?.query({ name: "geolocation" }).then((permission) => {
      if (permission.state === "granted") request();
      if (permission.state === "denied") setFeedback({ status: "denied", message: "위치 권한을 허용하면 가까운 순서로 추천할 수 있어요." });
    }).catch(() => undefined);
  }, [request, setPlanner]);

  return { feedback, request };
}
