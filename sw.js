// Service Worker — Planning Viaggi PWA
const CACHE_NAME = 'viaggi-v41';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js'
];

// Installazione — metti in cache le risorse principali
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        // Se alcune risorse esterne falliscono, va bene lo stesso
        return cache.addAll(['./', './index.html', './manifest.json', './logo.png']);
      });
    }).then(() => self.skipWaiting())
  );
});

// Attivazione — rimuovi cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, poi cache come fallback
self.addEventListener('fetch', event => {
  // Ignora richieste non GET e richieste Google API (Drive, Auth)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('googleapis.com') ||
      event.request.url.includes('accounts.google.com') ||
      event.request.url.includes('drive.google.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Aggiorna la cache con la risposta fresca
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline — servi dalla cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback all'index per navigazione
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
