const CACHE_NAME = "kpop-album-tracker-v4";

const FILES_TO_CACHE = [
    "./",
    "./Pages/index.html",
    "./Pages/affordables.html",
    "./Pages/albums.html",
    "./Pages/balance.html",
    "./Pages/calendar.html",
    "./Pages/favorites.html",
    "./Pages/login.html",
    "./Pages/owned.html",
    "./Pages/signup.html",
    "./Pages/stores.html",
    "./manifest.json",
    "./Logo.png",
    "./Transparent Logo.png",
    "./app.js",
    "./design.css"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});