// sw.js — Service Worker para NCLEX Masterclass (VERSIÓN 4.0 - SYSTEM UPGRADE)
// Estrategia: Cache First, luego Network con actualización en background

const CACHE_NAME = 'nclex-v4'; // <--- CAMBIO CRÍTICO: Fuerza a los navegadores a borrar la v3
const STATIC_CACHE = 'nclex-static-v4';
const DYNAMIC_CACHE = 'nclex-dynamic-v4';

// Assets esenciales para el "shell" de la app
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/js/utils.js',
  '/js/auth.js', // <--- AGREGADO: Vital para el login
  '/js/logic.js',
  '/js/skins.js',
  '/js/31_search_service.js',
  '/js/32_analytics_dashboard.js',
  '/js/simulator.js',
  '/js/ngn_engine.js',
  '/js/premium_books_library.js',
  '/js/17_bnotepad.js'
];

// Instalación: Precachear assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4 System Upgrade...');
  self.skipWaiting(); // Forzar activación inmediata
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activación: Limpiar caches viejas (v3, v2, etc.)
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4 & Cleaning old caches...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim()) // Tomar control inmediato
  );
});

// Fetch: Estrategia de caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests no GET
  if (request.method !== 'GET') return;

  // Ignorar analytics y tracking
  if (url.pathname.includes('analytics') || url.pathname.includes('track')) return;

  // Estrategia 1: Cache First para assets estáticos (JS, CSS, HTML)
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Estrategia 2: Network First para datos dinámicos (APIs)
  if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Estrategia 3: Stale While Revalidate para imágenes y fonts
  if (isImageOrFont(url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Default: Network con fallback a cache
  event.respondWith(networkWithCacheFallback(request));
});

// ===== HELPERS DE ESTRATEGIA =====

function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|html|json)$/) ||
         STATIC_ASSETS.includes(url.pathname);
}

function isAPIRequest(url) {
  return url.hostname.includes('github') ||
         url.hostname.includes('google') ||
         url.pathname.includes('api') ||
         url.hostname.includes('firebase');
}

function isImageOrFont(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/);
}

// Cache First: Sirve del cache, si no existe va a network
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    throw error;
  }
}

// Network First: Intenta network, fallback a cache
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    
    return new Response(
      JSON.stringify({ offline: true, error: 'No connection' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Stale While Revalidate: Sirve cache inmediatamente, actualiza en background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network with Cache Fallback
async function networkWithCacheFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});