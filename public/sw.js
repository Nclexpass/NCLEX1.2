// sw.js — Service Worker para NCLEX Masterclass (VERSIÓN 3.1)
// Estrategia: Cache First, luego Network con actualización en background
//
// FIX CRÍTICO (Firebase):
// - Evitar servir versiones viejas de /js/auth.js (Network First)
// - Evitar cachear SDK de Firebase desde gstatic (bypass / no cache)
// - Bump de versión de caches para forzar refresh

const CACHE_NAME = 'nclex-v4';
const STATIC_CACHE = 'nclex-static-v4';
const DYNAMIC_CACHE = 'nclex-dynamic-v4';

// Assets esenciales para el "shell" de la app
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/js/auth.js', // ✅ IMPORTANTE: aseguramos disponibilidad del auth en el shell
  '/js/utils.js',
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
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpiar caches viejas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

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
    }).then(() => self.clients.claim())
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

  // ✅ FIX Firebase: NO cachear SDK desde gstatic (evita SDK viejo/rota)
  if (url.hostname === 'www.gstatic.com' && url.pathname.includes('/firebasejs/')) {
    event.respondWith(fetch(request));
    return;
  }

  // ✅ FIX Firebase: /js/auth.js SIEMPRE Network First (evita auth viejo)
  if (url.pathname === '/js/auth.js') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

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
         url.pathname.includes('api');
}

function isImageOrFont(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/);
}

// Cache First: Sirve del cache, si no existe va a network
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    // Fallback para navegación
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
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);
    if (cached) return cached;

    // Respuesta offline para APIs
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
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network with Cache Fallback: Intenta network, si falla usa cache
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

// ===== MENSAJES DESDE LA APP =====

self.addEventListener('message', (event) => {
  // Compatibilidad: string simple
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  // Compatibilidad: payload estructurado
  if (event.data && event.data.type === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'getVersion') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(CACHE_NAME);
    }
  }
});

// ===== SYNC EN BACKGROUND (para cuando vuelva la conexión) =====

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

async function syncQuizResults() {
  // Sincronizar resultados de quizzes pendientes
  console.log('[SW] Syncing quiz results...');
}

// ===== PUSH NOTIFICATIONS (preparado para futuro) =====

self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png'
    })
  );
});
