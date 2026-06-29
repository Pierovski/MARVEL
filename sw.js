const CACHE_NAME = 'marvel-tracker-v1.3';
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './data.js',
    './manifest.json',
    './imagen.png' // ¡Corregido! Antes decía image.png
];

// Instalación del Service Worker y guardado en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Interceptar peticiones para que funcione offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
