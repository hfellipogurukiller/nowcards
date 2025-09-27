// Service Worker for NowCards PWA
const CACHE_NAME = 'nowcards-v1';
const urlsToCache = [
  '/',
  '/login',
  '/register',
  '/admin',
  '/manifest.json',
  '/logo_botao.png',
  '/logo.png',
  '/logo_s_fundo - Edited.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API calls and external resources
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for offline progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(
      // Sync offline progress when back online
      syncOfflineProgress()
    );
  }
});

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo_botao.png',
      badge: '/logo_botao.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper function to sync offline progress
async function syncOfflineProgress() {
  try {
    // Get offline progress from IndexedDB
    const offlineProgress = await getOfflineProgress();
    
    if (offlineProgress.length > 0) {
      // Sync with server
      for (const progress of offlineProgress) {
        await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progress)
        });
      }
      
      // Clear offline progress
      await clearOfflineProgress();
      console.log('Service Worker: Offline progress synced');
    }
  } catch (error) {
    console.error('Service Worker: Sync failed', error);
  }
}

// Helper functions for offline storage
async function getOfflineProgress() {
  // Implementation would use IndexedDB
  return [];
}

async function clearOfflineProgress() {
  // Implementation would clear IndexedDB
  return;
}
