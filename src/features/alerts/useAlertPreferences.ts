import { useState } from "react";

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
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => "Notification" in window ? Notification.permission : "unsupported");

  const setEnabled = (value: boolean) => { setEnabledState(value); setSaved(false); };
  const setTiming = (value: AlertTiming) => { setTimingState(value); setSaved(false); };
  const save = async () => {
    let nextPermission = permission;
    if (enabled && "Notification" in window && Notification.permission === "default") nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
    localStorage.setItem(ENABLED_KEY, String(enabled));
    localStorage.setItem(TIMING_KEY, timing);
    setSaved(true);
  };

  return { enabled, setEnabled, timing, setTiming, saved, permission, save };
}
