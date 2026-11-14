const V='dafter-v1';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='dafter_new').map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
 if(u.hostname==='generativelanguage.googleapis.com')return;
 // الكتب: من الذاكرة أولًا (تعمل بلا إنترنت بعد أول فتح)
 if(u.pathname.includes('/dafter_new/')){e.respondWith(caches.open('dafter_new').then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;const r=await fetch(e.request);if(r.ok&&!e.request.headers.get('range'))c.put(e.request,r.clone());return r}));return}
 // الصفحة: الشبكة أولًا ثم الذاكرة (لتصل التحديثات)
 if(u.origin===location.origin){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));return}
 // الخطوط ومكتبة PDF
 if(/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.hostname)){e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;const r=await fetch(e.request);if(r.ok||r.type==='opaque')c.put(e.request,r.clone());return r}))}
});
