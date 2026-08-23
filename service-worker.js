const CACHE_NAME = "kpop-album-tracker-v4";

const FILES_TO_CACHE = [
    "./",
    "./pages/index.html",
    "./pages/affordables.html",
    "./pages/albums.html",
    "./pages/balance.html",
    "./pages/calendar.html",
    "./pages/favorites.html",
    "./pages/login.html",
    "./pages/owned.html",
    "./pages/signup.html",
    "./pages/stores.html",
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