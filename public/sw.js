const CACHE_NAME = "byeolboreoganda-v3";
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
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: { code: "NETWORK_OFFLINE", message: "네트워크에 연결할 수 없습니다." } }), {
        status: 503,
        headers: { "content-type": "application/json; charset=utf-8" },
      })),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
  );
});
