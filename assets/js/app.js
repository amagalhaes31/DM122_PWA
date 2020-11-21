'use strict'

if('serviceWorker' in navigator){
    const success = () => console.log('[Service worker] registered');
    const failed  = () => console.log('[Service worker] registration failed');

    navigator.serviceWorker
        .register('sw.js')
        .then(success)
        .catch(failed);
}

