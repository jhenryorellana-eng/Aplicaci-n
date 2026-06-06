# Puesta en marcha — Ruta USA

La app funciona en **dos modos**:

- **Modo demo** (sin variables de entorno): datos de ejemplo y videos de prueba.
- **Modo real** (con `.env.local`): Supabase real. **Ya está conectado** al
  proyecto `PlataformaNetflix`. Mientras la base esté vacía, la app muestra
  contenido demo para no verse vacía; al publicar contenido real, lo reemplaza.

## Estado actual

- ✅ Supabase conectado (esquema, RLS, tipos, secciones base).
- ✅ Subida de video **directa a Supabase Storage** desde `/admin` (sin Mux).
- ⏳ Para usar `/admin` falta: publicar la app (deploy), configurar el login y
  nombrar admin a Henry (pasos abajo).

## Subir contenido (vía Supabase Storage — sin Mux)

En `/admin` (como administrador):

1. Crea una **serie** (sección, título, portada, gratis/premium).
2. Entra a la serie → **Nuevo episodio** → sube el archivo de video (.mp4).
   Se guarda en el bucket `media` de Supabase Storage y queda listo.
3. En **Feed**, crea resúmenes verticales (sube el clip + portada) que apuntan
   a una serie.
4. Pulsa **Publicar**. ¡Aparece en la app!

> Límite práctico: en el plan gratuito de Supabase, Storage tiene tope de
> tamaño por archivo (~50 MB) y 1 GB total. Para videos largos/pesados o mucho
> tráfico conviene una plataforma de video (Bunny Stream o Mux): el código ya
> está preparado para ese cambio sin rehacer la app.

## Falta para activar el login / admin

1. **Publicar la app** (deploy a Vercel) para tener una URL pública. Carga las
   variables de `.env.local` en Vercel.
2. **Supabase → Authentication → URL Configuration**: pon el *Site URL* (tu
   dominio) y agrega `…/auth/callback` y `http://localhost:3000/**` a las
   *Redirect URLs*.
3. Henry inicia sesión una vez con su correo (enlace mágico).
4. Nombrar admin (ejecutar con service_role / SQL Editor, con su UUID de
   *Authentication → Users*):
   ```sql
   update public.user_roles set role = 'admin' where user_id = '<UUID>';
   ```

## Variables de entorno

`.env.local` (ya creado) tiene la URL y la clave publishable de Supabase.
Pendientes (opcionales según el camino):

- `SUPABASE_SERVICE_ROLE_KEY` — solo si se usa el webhook de Mux.
- `MUX_*` — solo si más adelante se usa Mux para el video.

## Desplegar

```bash
npm run build   # valida tipos y genera el service worker
```

Conecta el repo a Vercel (o `vercel deploy`) con las variables cargadas.

## Activar el paywall (v2)

1. En `lib/access/gating.ts`, cambia la rama premium a
   `return user.tier === TIER.premium;`.
2. Integra Stripe y, en su webhook, escribe en `entitlements` (`tier='premium'`)
   con el cliente `service_role`. No requiere migración.
