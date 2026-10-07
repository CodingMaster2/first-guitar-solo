const CACHE_NAME = 'fgs-v1'
const STATIC_CACHE = 'fgs-static-v1'
const API_CACHE = 'fgs-api-v1'

// Static assets to pre-cache
const PRECACHE_URLS = [
  '/',
  '/dashboard',
  '/lessons',
  '/offline',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS).catch(() => {}))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE && k !== API_CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, non-http(s), chrome-extension
  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // API routes: network-first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(API_CACHE).then(c => c.put(request, clone))
          }
          return res
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets: cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const clone = res.clone()
        caches.open(STATIC_CACHE).then(c => c.put(request, clone))
        return res
      }))
    )
    return
  }

  // Pages: stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(cache =>
      cache.match(request).then(cached => {
        const fetchPromise = fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone())
          return res
        }).catch(() => cached)
        return cached || fetchPromise
      })
    )
  )
})
