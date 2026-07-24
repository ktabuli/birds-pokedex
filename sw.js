/* BirdDex service worker — network-first so deploys show up immediately,
   with a cached copy as an offline fallback. */
const CACHE = 'birddex-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data/species.js',
  './data/cities.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './fonts/PressStart2P.ttf'
];

self.addEventListener('install', (e) => {
  // take over as soon as possible so a new version isn't stuck "waiting"
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for our own GET requests: try the network, cache the fresh
// response, and only fall back to cache when offline. Cross-origin requests
// (e.g. future map tiles) are left untouched so the browser handles them.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
