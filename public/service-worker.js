/* Minimal service worker for offline shell and asset caching */
const CACHE_NAME = 'aquahelix-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
  '/logo-aquahelix.svg',
  '/logo-mark.svg',
  '/logo-wordmark.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request).then((r) => {
      if (!r || r.status !== 200 || r.type !== 'basic') return r;
      const clone = r.clone();
      caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
      return r;
    })).catch(() => caches.match('/index.html'))
  );
});
