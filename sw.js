const cacheName = 'app-shell-v2';
const assetsToCache = [
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
    'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'assets/images/pwa-logo.png',
    'assets/js/material.min.js',
    'assets/css/style.css',
    'assets/js/app.js',
    'favicon.ico',
    'index.html',
    '/'
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
        return cache.match(request);
    }
}


self.addEventListener('fetch', event => {
    // console.log('[Service Worker] fecth event ...', event);
    event.respondWith(networkFirst(event.request));
})
