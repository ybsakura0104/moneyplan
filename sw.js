const CACHE_NAME = 'ledger-cache-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  // 데이터 API 요청은 항상 네트워크에서 최신으로 가져오기
  if(url.hostname.includes('script.google.com')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request))
  );
});
