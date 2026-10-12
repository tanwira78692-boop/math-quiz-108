const CACHE_NAME = "math-quiz-108-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./launchericon-192x192.png",
  "./launchericon-512x512.png"
];

// Install service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS).catch(function () {
        return Promise.resolve();
      });
    })
  );

  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim();
});

// Cache website files for offline use
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (response) {
        if (
          response &&
          response.ok &&
          new URL(event.request.url).origin === self.location.origin
        ) {
          const responseCopy = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseCopy);
          });
        }

        return response;
      });
    })
  );
});
