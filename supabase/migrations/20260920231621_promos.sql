-- Promos / seasonal campaigns
-- Run in Supabase SQL Editor

create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  banner_url text,
  image_urls text[] not null default '{}'::text[],
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promos_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]*$')
);

drop trigger if exists set_promos_updated_at on public.promos;

create trigger set_promos_updated_at
before update on public.promos
for each row
execute function public.set_updated_at();

create unique index if not exists promos_one_active
on public.promos (is_active)
where is_active;

alter table public.promos enable row level security;

drop policy if exists "Public can read active promos" on public.promos;

create policy "Public can read active promos"
on public.promos
for select
to public
using (is_active = true);

drop policy if exists "Authenticated can manage promos" on public.promos;

create policy "Authenticated can manage promos"
on public.promos
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('promo-images', 'promo-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read promo images" on storage.objects;

create policy "Public read promo images"
on storage.objects
for select
to public
using (bucket_id = 'promo-images');

drop policy if exists "Authenticated upload promo images" on storage.objects;

create policy "Authenticated upload promo images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'promo-images');

drop policy if exists "Authenticated update promo images" on storage.objects;

create policy "Authenticated update promo images"
on storage.objects
for update
to authenticated
using (bucket_id = 'promo-images')
with check (bucket_id = 'promo-images');

drop policy if exists "Authenticated delete promo images" on storage.objects;

create policy "Authenticated delete promo images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'promo-images');
