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

## Hecho (sesión 3 — marca, monetización)
- [x] Rebrand a **USA Latino Prime**: navy + dorado (#e9ae4e) + Plus Jakarta Sans
- [x] Auth por **correo + contraseña** (sin enlace mágico/SMS); registro instantáneo (service_role + email_confirm)
- [x] **Kit de audiencia de asilo**: 3 videos de pago ($8 c/u o $17 bundle), tablas products/purchases
- [x] Stripe en código (checkout + webhook) **sin llaves** (gated; las da Mauricio)
- [x] Feed enriquecido: me gusta/guardar/comentar (login requerido) + moderación admin
- [x] Embudo de Servicios a usalatinoprime.com (links, SIN precios, sin fusionar proyectos)

> Nota: el "Juez IA por voz" (avatar + Gemini) se construyó y luego se **eliminó
> por completo** a pedido del cliente (2026-06-19). La app quedó solo con videos.

## Pendiente (para activar lo construido)
- [ ] **Stripe**: pegar llaves de Mauricio en `.env.local` para activar las compras
- [ ] Sección **Casos Reales / Evidencia** (tabla `case_studies` lista, UI pendiente)
- [ ] Desplegar a Vercel → necesario para entrar al admin y para que Henry suba contenido
- [ ] Tras primer login de Henry: hacerlo admin (1 SQL)
- [ ] (Opcional/escala) Migrar video a Bunny/Mux si crece el tráfico/peso

## Más adelante (fuera de v1)
- [ ] Paywall por suscripción (Stripe) — esquema ya preparado (`entitlements`)
- [ ] Calificación/derivación de leads a USA Latino Prime
- [ ] App nativa (Expo), login por SMS, descargas offline, notificaciones push
