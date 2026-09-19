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

export async function sendTestNotification(destinationName?: string, timingLabel?: string): Promise<boolean> {
  const target = destinationName || "영월 별마로 천문대";
  const timing = timingLabel || "30분";
  const title = `✨ [별보러간다] ${target} 출발 ${timing} 전 알림`;
  const body = `현재 혼잡도가 낮고 관측 조건이 쾌적합니다. 안전하고 고요한 별빛 여정을 시작하세요!`;

  return sendStargazingNotification(title, {
    body,
    tag: `test-alert-${Date.now()}`,
    url: "/alerts",
    data: { destination: target, timing }
  });
}
