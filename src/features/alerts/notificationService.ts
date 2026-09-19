import type { Destination } from "../../domain/types";

export type NotificationPermissionState = NotificationPermission | "unsupported";

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return "denied";
  }
}

export interface StargazingNotificationOptions {
  body: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
  icon?: string;
  badge?: string;
  silent?: boolean;
}

export async function sendStargazingNotification(
  title: string,
  options: StargazingNotificationOptions
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let currentPermission: NotificationPermissionState = Notification.permission;
  if (currentPermission !== "granted") {
    currentPermission = await requestNotificationPermission();
  }

  if (currentPermission !== "granted") {
    return false;
  }

  const notificationData = {
    url: options.url || "/alerts",
    ...options.data
  };

  // On Mobile Chrome & iOS 16.4+ PWA, notifications must be shown via ServiceWorkerRegistration
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && "showNotification" in registration) {
        await registration.showNotification(title, {
          body: options.body,
          icon: options.icon || "/assets/app-icon.png",
          badge: options.badge || "/assets/app-icon.png",
          tag: options.tag || "stargazing-alert",
          data: notificationData,
          vibrate: [100, 50, 100],
          silent: options.silent
        } as NotificationOptions);
        return true;
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to Window Notification API for desktop/browsers where supported
  try {
    const notification = new Notification(title, {
      body: options.body,
      icon: options.icon || "/assets/app-icon.png",
      badge: options.badge || "/assets/app-icon.png",
      tag: options.tag || "stargazing-alert",
      data: notificationData
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.url) {
        window.location.href = options.url;
      }
    };
    return true;
  } catch {
    return false;
  }
}

export async function sendTestNotification(
  destination?: Destination | null,
  timingLabel?: string,
  plannerDeparture?: string
): Promise<boolean> {
  const target = destination?.name || "영월 별마로 천문대";
  const timing = timingLabel || "30분";
  const calmVal = destination?.calm ?? 82;
  const distanceStr = destination?.distanceKm ? ` (${destination.distanceKm.toFixed(1)}km)` : "";
  const departureName = plannerDeparture || "출발지";

  const title = `✨ [별보러간다] ${target} 출발 ${timing} 전 혼잡도 알림`;
  let body = "";

  if (calmVal >= 75) {
    body = `${departureName} 기준 이동 소요시간${distanceStr} 정상. 현재 한적도 ${calmVal}점으로 야간 방문객 집중 없이 쾌적하게 관측할 수 있습니다!`;
  } else if (calmVal >= 50) {
    body = `현재 한적도 ${calmVal}점(보통). 주차 및 진입로 여유가 있으니 출발 일정에 맞추어 서행 운전하세요.`;
  } else {
    body = `현재 한적도 ${calmVal}점(집중도 높음). 산간 도로 정체가 예상되니 심야 시간 분산 도착을 권장합니다.`;
  }

  return sendStargazingNotification(title, {
    body,
    tag: `test-alert-${Date.now()}`,
    url: "/alerts",
    data: { destination: target, timing, calm: calmVal }
  });
}
