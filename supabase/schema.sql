-- Run this in Supabase SQL Editor. Public visitors can read the catalog;
-- only bautistajimmy.dev@gmail.com can change it.
create table if not exists public.catalog (
  id text primary key check (id = 'main'),
  items jsonb not null default '[]'::jsonb,
  categories text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.catalog enable row level security;
drop policy if exists "Public can view catalog" on public.catalog;
create policy "Public can view catalog" on public.catalog for select to anon, authenticated using (true);
drop policy if exists "Admin can insert catalog" on public.catalog;
create policy "Admin can insert catalog" on public.catalog for insert to authenticated
  with check (lower(auth.jwt()->>'email') = 'bautistajimmy.dev@gmail.com');
drop policy if exists "Admin can update catalog" on public.catalog;
create policy "Admin can update catalog" on public.catalog for update to authenticated
  using (lower(auth.jwt()->>'email') = 'bautistajimmy.dev@gmail.com')
  with check (lower(auth.jwt()->>'email') = 'bautistajimmy.dev@gmail.com');
insert into public.catalog (id) values ('main') on conflict (id) do nothing;
