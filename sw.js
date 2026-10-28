// Network first so updates show at once; the last copy opens the app when offline.
const C = "pa-shell-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "manifest.webmanifest", "icon-192.png", "img/councilLogoInk.webp", "img/clubsLogo.webp", "img/crestImg.webp", "img/meisLogo.webp", "img/ataaLogo.webp", "img/councilLogo.webp"]))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch {}
  e.waitUntil(self.registration.showNotification(d.title || "Primum Auxilium", { body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag || undefined, data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => { for (const c of l) if ("focus" in c) return c.focus(); return self.clients.openWindow((e.notification.data && e.notification.data.url) || "./"); }));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(C).then(c => c.put(r, copy)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("./"))));
});
