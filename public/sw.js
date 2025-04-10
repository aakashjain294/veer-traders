const CACHE_NAME = "veer-traders-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/papaparse.min.js",
  "/logo.webp",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      if (event.request.url.includes("script.google.com")) {
        return caches.match("/offline.html") || new Response(
          "<h1>Go Online</h1><p>Please connect to the internet to view products and blog posts.</p>",
          { status: 503, headers: { "Content-Type": "text/html" } }
        );
      }
      return fetch(event.request).catch(() =>
        caches.match("/offline.html") || new Response(
          "<h1>Go Online</h1><p>Please connect to the internet to continue.</p>",
          { status: 503, headers: { "Content-Type": "text/html" } }
        )
      );
    })
  );
});