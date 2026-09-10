const CACHE = 'rgmd-crm-v1';
const SHELL = ['/', '/logo.png', '/manifest.json'];

// Cache app shell on install
self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
    self.skipWaiting();
});

// Remove old caches on activate
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // External CDN requests (Firebase, Tailwind, jsPDF, Google APIs) — network only
    if (url.origin !== self.location.origin) {
        e.respondWith(fetch(e.request));
        return;
    }

    // HTML navigation — network first, fall back to cached shell
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match('/'))
        );
        return;
    }

    // Same-origin assets — cache first, update cache in background
    e.respondWith(
        caches.match(e.request).then(cached => {
            const network = fetch(e.request).then(resp => {
                if (resp.ok) {
                    caches.open(CACHE).then(c => c.put(e.request, resp.clone()));
                }
                return resp;
            });
            return cached || network;
        })
    );
});
