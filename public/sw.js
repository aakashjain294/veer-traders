// public/sw.js
self.addEventListener("install", (event) => {
    console.log("Service Worker installed");
    self.skipWaiting();
  });
  
  self.addEventListener("activate", (event) => {
    console.log("Service Worker activated");
    self.clients.claim();
  });
  
  // Online-first fetch strategy
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  });
  