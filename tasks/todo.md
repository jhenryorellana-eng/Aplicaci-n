# Estado del proyecto — Ruta USA (PWA educativa de video)

App tipo **Netflix + TikTok**: feed vertical de resúmenes + catálogo de series
(ruta guiada de Henry + temas alternos). Stack: Next.js 15, TypeScript,
Tailwind v4, Supabase (RLS), Mux, Serwist (PWA). Detalle: ver
`docs/SETUP.md` y el plan en `~/.claude/plans`.

## Hecho (v1, funciona en modo demo)
- [x] Fase 1 — Scaffold Next.js + estructura + tema (dark dorado) + splash
- [x] Fase 2 — Supabase clients + Auth (enlace mágico) + middleware
- [x] Fase 3 — Esquema + RLS + triggers (`supabase/migrations/0001_init.sql`)
- [x] Fase 4 — Firma de reproducción Mux + webhook + gating centralizado
- [x] Fase 5 — Catálogo (ruta guiada + secciones + serie + reproductor)
- [x] Fase 6 — Feed vertical (scroll-snap, autoplay del activo, ventana de carga)
- [x] Fase 7 — PWA (manifest, service worker, íconos, instalable)
- [x] Fase 8 — Panel de administración (`/admin`: series, episodios, feed)
- [x] Fase 9 — Pulido (guard de login, 404, skeleton, fix iOS bfcache)

## Hecho (integración + diseño, sesión 2)
- [x] Supabase conectado (proyecto PlataformaNetflix): esquema, RLS, tipos, secciones
- [x] Subida de video directa a Supabase Storage desde /admin (sin Mux)
- [x] Mejora de diseño: billboard destacado + barra de marca + progreso/“desliza” en feed
- [x] Acceso público a feed/catálogo/series/watch (v1 abierto); login para cuenta/admin

## Pendiente (para que el cliente use el admin y suba SU contenido)
- [ ] Desplegar a Vercel (el cliente aún no quiere) → necesario para entrar al admin
- [ ] Config Auth URL en panel Supabase (Site URL + redirect /auth/callback)
- [ ] Tras primer login de Henry: hacerlo admin (1 SQL)
- [ ] Definir el nombre/marca definitivo (placeholder actual: "Ruta USA")
- [ ] (Opcional/escala) Migrar video a Bunny/Mux si crece el tráfico/peso

## Más adelante (fuera de v1)
- [ ] Paywall por suscripción (Stripe) — esquema ya preparado (`entitlements`)
- [ ] Calificación/derivación de leads a USA Latino Prime
- [ ] App nativa (Expo), login por SMS, descargas offline, notificaciones push
