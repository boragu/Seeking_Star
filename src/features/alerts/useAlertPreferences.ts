import { useCallback, useState } from "react";
import type { Destination } from "../../domain/types";
import {
  getNotificationPermission,
  type NotificationPermissionState,
  requestNotificationPermission,
  sendStargazingNotification,
  sendTestNotification
} from "./notificationService";

const ENABLED_KEY = "stargazing-concentration-alert";
const TIMING_KEY = "stargazing-alert-timing";

export type AlertTiming = "15" | "30" | "60";

export function useAlertPreferences() {
  const [enabled, setEnabledState] = useState(() => localStorage.getItem(ENABLED_KEY) === "true");
  const [timing, setTimingState] = useState<AlertTiming>(() => {
    const saved = localStorage.getItem(TIMING_KEY);
    return saved === "15" || saved === "60" ? saved : "30";
  });
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [permission, setPermission] = useState<NotificationPermissionState>(() => getNotificationPermission());

  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    setSaved(false);
  };

  const setTiming = (value: AlertTiming) => {
    setTimingState(value);
    setSaved(false);
  };

  const save = useCallback(
    async (destination?: Destination | null) => {
      let nextPermission = getNotificationPermission();

      if (enabled) {
        if (nextPermission === "default") {
          nextPermission = await requestNotificationPermission();
        }
        setPermission(nextPermission);

        if (nextPermission === "granted") {
          const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
          const destName = destination ? destination.name : "선택한 별보기 장소";
          await sendStargazingNotification(`🌟 [별보러간다] ${destName} 알림 등록 완료`, {
            body: `출발 ${timingLabel} 전에 혼잡도 변화 및 별보기 예보를 보내드릴게요.`,
            tag: "alert-registration",
            url: "/alerts"
          });
        }
      }

      localStorage.setItem(ENABLED_KEY, String(enabled));
      localStorage.setItem(TIMING_KEY, timing);
      setSaved(true);
    },
    [enabled, timing]
  );

  const triggerTestAlert = useCallback(async (destination?: Destination | null) => {
    const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
    const destName = destination ? destination.name : undefined;
    const ok = await sendTestNotification(destName, timingLabel);
    setPermission(getNotificationPermission());
    if (ok) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
    return ok;
  }, [timing]);

  return {
    enabled,
    setEnabled,
    timing,
    setTiming,
    saved,
    testSent,
    permission,
    save,
    triggerTestAlert
  };
}
