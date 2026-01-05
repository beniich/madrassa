/**
 * SchoolGenius - Service Worker
 * Cache offline et stratégies de réseau
 */

const CACHE_NAME = 'schoolgenius-v1';
const STATIC_CACHE = 'schoolgenius-static-v1';
const DYNAMIC_CACHE = 'schoolgenius-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/offline.html',
];

// API endpoints à mettre en cache
const API_CACHE_PATTERNS = [
    /\/api\/students/,
    /\/api\/teachers/,
    /\/api\/classes/,
    /\/api\/subjects/,
    /\/api\/timetable/,
];

// ============================================
// INSTALLATION
// ============================================

self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// ============================================
// ACTIVATION
// ============================================

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================
// FETCH - Stratégies de cache
// ============================================

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-GET
    if (request.method !== 'GET') {
        return;
    }

    // Stratégie pour les API
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Stratégie pour les assets statiques
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Stratégie par défaut: Network First avec fallback
    event.respondWith(networkFirstWithOfflineFallback(request));
});

// ============================================
// STRATÉGIES DE CACHE
// ============================================

/**
 * Cache First: Utilise le cache, sinon le réseau
 * Idéal pour: Assets statiques (JS, CSS, images)
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        console.log('[SW] Cache first failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

/**
 * Network First: Essaie le réseau, sinon le cache
 * Idéal pour: API, données dynamiques
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);

        // Mettre en cache pour usage offline
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());

        return response;
    } catch (error) {
        console.log('[SW] Network first - falling back to cache');
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        // Retourner une réponse vide pour les API
        return new Response(JSON.stringify({
            offline: true,
            message: 'Données non disponibles hors ligne'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Network First avec page offline de fallback
 * Idéal pour: Pages HTML
 */
async function networkFirstWithOfflineFallback(request) {
    try {
        const response = await fetch(request);

        // Mettre en cache les pages
        if (response.ok && request.destination === 'document') {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('[SW] Offline - serving cached version or offline page');

        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Fallback vers la page offline
        if (request.destination === 'document') {
            return caches.match('/offline.html');
        }

        return new Response('Offline', { status: 503 });
    }
}

// ============================================
// HELPERS
// ============================================

function isStaticAsset(pathname) {
    return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(pathname);
}

// ============================================
// BACKGROUND SYNC
// ============================================

self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'sync-data') {
        event.waitUntil(syncPendingData());
    }
});

async function syncPendingData() {
    // Communiquer avec le client pour déclencher la sync
    const clients = await self.clients.matchAll();

    clients.forEach((client) => {
        client.postMessage({
            type: 'SYNC_REQUIRED',
            timestamp: Date.now()
        });
    });
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    let data = { title: 'SchoolGenius', body: 'Nouvelle notification' };

    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/dashboard'
        },
        actions: [
            { action: 'open', title: 'Ouvrir' },
            { action: 'close', title: 'Fermer' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        const url = event.notification.data?.url || '/dashboard';
        event.waitUntil(
            self.clients.openWindow(url)
        );
    }
});

console.log('[SW] Service Worker loaded');
