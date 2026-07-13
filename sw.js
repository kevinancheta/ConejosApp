// IMPORTANTE: cada vez que cambian los archivos cacheados (style.css,
// app.js, etc.) hay que subir este número. El Service Worker solo vuelve a
// descargar y cachear los archivos cuando el navegador detecta que ESTE
// ARCHIVO (sw.js) cambió de contenido; si sw.js queda igual, el navegador
// sigue usando para siempre la caché vieja con el CSS/JS viejo, aunque el
// archivo en el servidor ya esté arreglado (por eso el fix de scroll no se
// veía: quedaba serviéndose el style.css cacheado de antes del arreglo).
const CACHE_NAME = 'conejos-app-v4';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './qrcode.min.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap'
];

// Instalar el Service Worker y guardar recursos en caché
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Guardando recursos de ConejosApp en caché...');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activar el Service Worker y limpiar cachés antiguas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('Service Worker: Borrando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia "red primero, caché como respaldo" para los archivos propios
// de la app (html/css/js): así, si volvés a tocar el código más adelante,
// el cambio se ve al toque la próxima vez que haya conexión, en vez de
// quedar atrapado en la caché hasta el próximo bump de CACHE_NAME. Si no
// hay conexión, se sirve la última copia guardada (para que la app siga
// funcionando offline).
self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    const isOwnAsset = url.origin === self.location.origin;

    if (isOwnAsset) {
        e.respondWith(
            fetch(e.request)
                .then((networkResponse) => {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
                    return networkResponse;
                })
                .catch(() => caches.match(e.request).then((cached) => {
                    return cached || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined);
                }))
        );
        return;
    }

    // Recursos externos (p. ej. la fuente de Google Fonts): caché primero.
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request).catch(() => undefined);
        })
    );
});
