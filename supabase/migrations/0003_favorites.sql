-- Favoritos ("lo que le gusta" al usuario): series guardadas.
create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  series_id uuid not null references public.series (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

create index favorites_user_idx on public.favorites (user_id);
create index favorites_series_idx on public.favorites (series_id);

alter table public.favorites enable row level security;

create policy favorites_select_own on public.favorites
  for select using (user_id = auth.uid());
create policy favorites_insert_own on public.favorites
  for insert with check (user_id = auth.uid());
create policy favorites_delete_own on public.favorites
  for delete using (user_id = auth.uid());
