const CACHE_NAME = "byeolboreoganda-v4";
const APP_SHELL = [
  "/",
  "/planner",
  "/map",
  "/trips",
  "/alerts",
  "/api-docs.html",
  "/manifest.webmanifest",
  "/assets/app-icon.png",
  "/assets/byeolmaro-night.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {
      // Ignore caching failures for optional assets during install
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({
            error: {
              code: "NETWORK_OFFLINE",
              message: "네트워크에 연결할 수 없습니다. 오프라인 상태입니다."
            }
          }),
          {
            status: 503,
            headers: { "content-type": "application/json; charset=utf-8" }
          }
        )
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});

// Web Notifications & Push handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/alerts";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            if ("navigate" in client) {
              client.navigate(targetUrl);
            }
            return;
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener("push", (event) => {
  let data = {
    title: "별보러간다 알림",
    body: "출발 전 혼잡도 변화 및 별보기 예보를 확인하세요.",
    url: "/alerts"
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/assets/app-icon.png",
      badge: "/assets/app-icon.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/alerts" }
    })
  );
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (event.data.type === "SHOW_NOTIFICATION") {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: "/assets/app-icon.png",
      badge: "/assets/app-icon.png",
      vibrate: [100, 50, 100],
      ...options
    });
  }
});
