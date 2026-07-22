const CACHE_NAME = 'marvel-tracker-v3';
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './data.js',
    './manifest.json',
    './imagen.png'
];

// 1. INSTALACIÓN: Obligamos al Service Worker a instalarse de inmediato sin esperar
self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// 2. ACTIVACIÓN: Autolimpieza de cachés fantasmas del pasado
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    // Si el caché antiguo no coincide con el actual, lo destruye
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Toma el control de la página instantáneamente
});

// 3. INTERCEPTOR (ESTRATEGIA NETWORK FIRST)
self.addEventListener('fetch', event => {
    event.respondWith(
        // Intentamos ir a internet (o tu localhost) primero para traer lo más nuevo
        fetch(event.request)
            .then(response => {
                // Si la red funciona, devolvemos el archivo fresco
                return response;
            })
            .catch(() => {
                // Si la red falla (estás offline), sacamos el archivo del caché de emergencia
                return caches.match(event.request);
            })
    );
});
