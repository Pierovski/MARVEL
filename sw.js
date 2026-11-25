const CACHE_NAME = 'marvel-tracker-v4.1';
const RUNTIME_CACHE = 'marvel-runtime-v4';

const APP_SHELL = [
    './',
    './index.html',
    './app.js',
    './data.js',
    './manifest.json',
    './imagen.png'
];

const CDN_ORIGINS = [
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
];

// 1. INSTALACIÓN: Precarga del App Shell (sin fallar si falta imagen.png en local)
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(APP_SHELL.map(url => cache.add(url)))
        )
    );
});

// 2. ACTIVACIÓN: Limpieza de cachés obsoletos
self.addEventListener('activate', event => {
    const validCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cache => {
                    if (!validCaches.includes(cache)) {
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// 3. INTERCEPTOR: Network First con actualización dinámica + soporte offline para CDN
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isTrustedCdn = CDN_ORIGINS.includes(url.origin);

    if (!isSameOrigin && !isTrustedCdn) return;

    // Para activos de CDN (fuentes, CSS, iconos): Stale-While-Revalidate
    if (isTrustedCdn) {
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache =>
                cache.match(event.request).then(cached => {
                    const networkFetch = fetch(event.request)
                        .then(response => {
                            if (response && (response.ok || response.type === 'opaque')) {
                                cache.put(event.request, response.clone());
                            }
                            return response;
                        })
                        .catch(() => cached);
                    return cached || networkFetch;
                })
            )
        );
        return;
    }

    // Para archivos propios de la app: Network First guardando siempre la versión fresca
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
