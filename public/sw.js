import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkOnly } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Precache de assets gerados pelo Next.js (preenchido pelo InjectManifest no build)
precacheAndRoute(self.__WB_MANIFEST || [])

// Auth e tokens — NUNCA cacheados, sempre network
registerRoute(
  ({ url }) => url.pathname.startsWith('/auth/v1/'),
  new NetworkOnly()
)

// REST do Supabase — NUNCA cacheado, sempre network
// Dados financeiros e operacionais exigem sempre a versão mais recente
registerRoute(
  ({ url }) =>
    url.origin === 'https://jgokqginxmkfksyppues.supabase.co' &&
    url.pathname.startsWith('/rest/v1/'),
  new NetworkOnly()
)

// Assets estáticos (fontes, imagens, ícones) — cache longo
registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
      }),
    ],
  })
)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
