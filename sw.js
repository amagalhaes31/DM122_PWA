const cacheName = 'app-shell-v2';
const assetsToCache = [
    'offline.html',
    'index.html',
];


async function cacheStaticAssets(){
    const cache = await caches.open(cacheName);
    return cache.addAll(assetsToCache);
}


self.addEventListener('install', event => {
    console.log('[Service Worker] Installing service worker...');
    event.waitUntil(cacheStaticAssets());
    self.skipWaiting();
});
  

function removeOldCache(cacheKey) {
    if (cacheKey !== cacheName) {
        console.log('[Service Worker] removing old cache');
        return caches.delete(cacheKey);
    }
}


async function cacheCleanup() {
    const keyList = await caches.keys();
    return Promise.all(keyList.map(removeOldCache));
}


self.addEventListener('activate', event => {
    console.log('[Service Worker] activating service worker ...');
    event.waitUntil(cacheCleanup());
    self.clients.claim();
})


async function networkFirst(request) {
    try {
        return await fetch(request);
    } catch (error) {
        const cache = await caches.open(cacheName);
        return cache.match('offline.html');
    }
}


self.addEventListener('fetch', event => {
    // console.log('[Service Worker] fecth event ...', event);
    event.respondWith(networkFirst(event.request));
})
