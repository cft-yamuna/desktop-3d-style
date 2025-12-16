const CACHE_NAME = '3d-figurine-v1';

// Install event - activate immediately
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Only handle http/https requests
    const { request } = event;
    const url = new URL(request.url);

    // Skip chrome-extension, chrome:, devtools:, etc.
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    }).catch((err) => {
                        console.log('Cache put error:', err);
                    });
                }
                return response;
            })
            .catch(() => {
                // Return from cache if offline
                return caches.match(request);
            })
    );
});
