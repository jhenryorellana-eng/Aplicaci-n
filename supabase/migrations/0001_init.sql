-- =====================================================================
-- Esquema inicial — app educativa de video (Ruta USA)
-- Tablas + RLS + índices + triggers. Orden: tablas → funciones (que las
-- referencian) → índices → triggers → RLS.
-- Preparado para activar un paywall luego SIN migrar: el acceso se decide
-- en código (canAccessSeries) leyendo `entitlements`.
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- Tablas ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user'))
);

create table public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  source text not null default 'grant' check (source in ('grant', 'stripe')),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  kind text not null default 'topic' check (kind in ('guided_path', 'topic')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.series (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections (id) on delete restrict,
  slug text not null unique,
  title text not null,
  description text,
  cover_url text,
  position int not null default 0,
  required_tier text not null default 'free' check (required_tier in ('free', 'premium')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  mux_asset_id text,
  mux_playback_id text,
  duration_seconds int,
  thumbnail_url text,
  status text not null default 'processing' check (status in ('processing', 'ready', 'errored')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.feed_clips (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  mux_asset_id text,
  mux_playback_id text,
  poster_url text,
  caption text,
  position int not null default 0,
  status text not null default 'processing' check (status in ('processing', 'ready', 'errored')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.watch_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  position_seconds int not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

-- ---------- Funciones que dependen de las tablas ----------

-- ¿El usuario actual es admin? SECURITY DEFINER para evitar recursión de RLS.
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Al crear un usuario: perfil + rol 'user' + entitlement 'free'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', null));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  insert into public.entitlements (user_id, tier) values (new.id, 'free');
  return new;
end;
$$;

-- La función de trigger no debe ser invocable por RPC público.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- ---------- Índices ----------

create index series_section_id_idx on public.series (section_id);
create index series_published_idx on public.series (is_published);
create index episodes_series_id_idx on public.episodes (series_id);
create index episodes_published_idx on public.episodes (is_published);
create index feed_clips_series_id_idx on public.feed_clips (series_id);
create index feed_clips_published_idx on public.feed_clips (is_published);
create index watch_progress_user_idx on public.watch_progress (user_id);

-- ---------- Triggers ----------

create trigger entitlements_updated_at
  before update on public.entitlements
  for each row execute function public.set_updated_at();

create trigger watch_progress_updated_at
  before update on public.watch_progress
  for each row execute function public.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------

alter table public.profiles       enable row level security;
alter table public.user_roles     enable row level security;
alter table public.entitlements   enable row level security;
alter table public.sections       enable row level security;
alter table public.series         enable row level security;
alter table public.episodes       enable row level security;
alter table public.feed_clips     enable row level security;
alter table public.watch_progress enable row level security;

create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy user_roles_select_own on public.user_roles
  for select using (user_id = auth.uid());
create policy entitlements_select_own on public.entitlements
  for select using (user_id = auth.uid());

create policy sections_public_read on public.sections
  for select using (true);
create policy sections_admin_all on public.sections
  for all using (public.is_admin()) with check (public.is_admin());

create policy series_public_read on public.series
  for select using (is_published = true);
create policy series_admin_all on public.series
  for all using (public.is_admin()) with check (public.is_admin());

create policy episodes_public_read on public.episodes
  for select using (is_published = true);
create policy episodes_admin_all on public.episodes
  for all using (public.is_admin()) with check (public.is_admin());

create policy feed_clips_public_read on public.feed_clips
  for select using (is_published = true);
create policy feed_clips_admin_all on public.feed_clips
  for all using (public.is_admin()) with check (public.is_admin());

create policy watch_progress_select_own on public.watch_progress
  for select using (user_id = auth.uid());
create policy watch_progress_insert_own on public.watch_progress
  for insert with check (user_id = auth.uid());
create policy watch_progress_update_own on public.watch_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
