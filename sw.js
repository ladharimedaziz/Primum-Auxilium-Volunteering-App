const C = "pa-shell-v2";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "manifest.webmanifest", "icon-192.png", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/cinzel-latin-500-normal.woff2", "fonts/cinzel-latin-600-normal.woff2", "fonts/cinzel-latin-700-normal.woff2", "fonts/cinzel-latin-800-normal.woff2", "fonts/fonts.css", "fonts/ibm-plex-mono-latin-500-normal.woff2", "fonts/ibm-plex-mono-latin-600-normal.woff2", "img/councilLogoInk.webp", "img/clubsLogo.webp", "img/crestImg.webp", "img/meisLogo.webp", "img/ataaLogo.webp", "img/councilLogo.webp"]))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch {}
  e.waitUntil(self.registration.showNotification(d.title || "Primum Auxilium", { body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.tag || undefined, data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => { for (const c of l) if ("focus" in c) return c.focus(); return self.clients.openWindow((e.notification.data && e.notification.data.url) || "./"); }));
});
const save = (r, res) => { if (res && res.ok) { const copy = res.clone(); caches.open(C).then(c => c.put(r, copy)); } return res; };
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.includes("/media/")) return;
  if (u.pathname.includes("/fonts/")) { e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => save(r, res)))); return; }
  const net = fetch(r).then(res => save(r, res));
  e.waitUntil(net.catch(() => {}));
  const fallback = () => caches.match(r).then(m => m || (r.mode === "navigate" ? caches.match("./") : undefined));
  const slow = new Promise(ok => setTimeout(ok, r.mode === "navigate" ? 3500 : 6000)).then(fallback);
  e.respondWith(Promise.race([net.catch(fallback), slow.then(m => m || net)]).then(res => res || net));
});
