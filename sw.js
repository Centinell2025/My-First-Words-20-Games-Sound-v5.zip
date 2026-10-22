const CACHE='my-first-words-kids-v17';
const ASSETS=['./','./index.html','./icon.svg','./manifest.webmanifest','./cover-art.svg'];
const URLS=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('my-first-words-kids-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!URLS.has(event.request.url))return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});
