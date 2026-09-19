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

export function useAlertPreferences(destination?: Destination | null) {
  const [enabled, setEnabledState] = useState(() => localStorage.getItem(ENABLED_KEY) === "true");
  const [timing, setTimingState] = useState<AlertTiming>(() => {
    const saved = localStorage.getItem(TIMING_KEY);
    return saved === "15" || saved === "60" ? saved : "30";
  });
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [permission, setPermission] = useState<NotificationPermissionState>(() => getNotificationPermission());

  const requestPermission = useCallback(async () => {
    const nextPermission = await requestNotificationPermission();
    setPermission(nextPermission);
    return nextPermission;
  }, []);

  const setEnabled = useCallback(
    async (value: boolean, targetDest?: Destination | null) => {
      const dest = targetDest !== undefined ? targetDest : destination;

      if (value) {
        let currentPerm = getNotificationPermission();
        if (currentPerm === "default") {
          currentPerm = await requestNotificationPermission();
        }
        setPermission(currentPerm);

        if (currentPerm !== "granted") {
          // 권한이 허용되지 않은 경우 켜지지 않음
          return false;
        }

        setEnabledState(true);
        localStorage.setItem(ENABLED_KEY, "true");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
        const destName = dest ? dest.name : "선택한 별보기 장소";
        await sendStargazingNotification(`🌟 [별보러간다] ${destName} 알림 등록 완료`, {
          body: `출발 ${timingLabel} 전에 혼잡도 변화 및 별보기 예보를 보내드릴게요.`,
          tag: "alert-registration",
          url: "/alerts"
        });
        return true;
      } else {
        setEnabledState(false);
        localStorage.setItem(ENABLED_KEY, "false");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return true;
      }
    },
    [destination, timing]
  );

  const setTiming = useCallback(
    (value: AlertTiming) => {
      setTimingState(value);
      localStorage.setItem(TIMING_KEY, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
    []
  );

  const save = useCallback(
    async (targetDest?: Destination | null) => {
      const dest = targetDest !== undefined ? targetDest : destination;
      let nextPermission = getNotificationPermission();

      if (enabled) {
        if (nextPermission === "default") {
          nextPermission = await requestNotificationPermission();
        }
        setPermission(nextPermission);

        if (nextPermission === "granted") {
          const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
          const destName = dest ? dest.name : "선택한 별보기 장소";
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
      setTimeout(() => setSaved(false), 3000);
    },
    [destination, enabled, timing]
  );

  const triggerTestAlert = useCallback(
    async (targetDest?: Destination | null) => {
      const dest = targetDest !== undefined ? targetDest : destination;
      const timingLabel = timing === "60" ? "1시간" : `${timing}분`;
      const destName = dest ? dest.name : undefined;
      const ok = await sendTestNotification(destName, timingLabel);
      setPermission(getNotificationPermission());
      if (ok) {
        setTestSent(true);
        setTimeout(() => setTestSent(false), 4000);
      }
      return ok;
    },
    [destination, timing]
  );

  return {
    enabled,
    setEnabled,
    timing,
    setTiming,
    saved,
    testSent,
    permission,
    requestPermission,
    save,
    triggerTestAlert
  };
}
