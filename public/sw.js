const CACHE_NAME = "veer-traders-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/logo.webp",
  "/papaparse.min.js",

  // Static JS chunks from build/static/js
  "/static/js/191.9099ea13.chunk.js",
  "/static/js/206.b8ba95a8.chunk.js",
  "/static/js/338.d1d79c17.chunk.js",
  "/static/js/453.b325115e.chunk.js",
  "/static/js/main.8ba06976.js",
  "/static/js/main.8ba06976.js.LICENSE.txt",
  "/static/js/main.8ba06976.js.map",
  "/static/js/191.9099ea13.chunk.js.map",
  "/static/js/206.b8ba95a8.chunk.js.map",
  "/static/js/338.d1d79c17.chunk.js.map",
  "/static/js/453.b325115e.chunk.js.map",

  // Optionally include media, asset-manifest
  "/asset-manifest.json"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
