-- Phase 1: Supabase schema + storage + RLS
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

-- Keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]*$')
);

drop trigger if exists set_categories_updated_at on public.categories;

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create index if not exists idx_categories_sort_order on public.categories (sort_order);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  slug text not null unique,
  name text not null,
  description text,
  category_id uuid not null references public.categories(id) on delete restrict,
  image_urls text[] not null default '{}'::text[],
  price numeric(10,2),
  stock integer not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_stock_non_negative check (stock >= 0),
  constraint products_slug_format check (slug ~ '^[a-z0-9][a-z0-9-]*$')
);

drop trigger if exists set_products_updated_at on public.products;

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_is_active on public.products (is_active);
create index if not exists idx_products_sort_order on public.products (sort_order);

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Public read for storefront
drop policy if exists "Public can read active categories" on public.categories;

create policy "Public can read active categories"
on public.categories
for select
to public
using (is_active = true);

drop policy if exists "Public can read active products" on public.products;

create policy "Public can read active products"
on public.products
for select
to public
using (is_active = true);

-- Authenticated users can manage (admin panel)
drop policy if exists "Authenticated can manage categories" on public.categories;

create policy "Authenticated can manage categories"
on public.categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can manage products" on public.products;

create policy "Authenticated can manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('category-images', 'category-images', true)
on conflict (id) do nothing;

-- Storage policies: public read
drop policy if exists "Public read product/category images" on storage.objects;

create policy "Public read product/category images"
on storage.objects
for select
to public
using (bucket_id in ('product-images', 'category-images'));

-- Storage policies: authenticated write
drop policy if exists "Authenticated upload product/category images" on storage.objects;

create policy "Authenticated upload product/category images"
on storage.objects
for insert
to authenticated
with check (bucket_id in ('product-images', 'category-images'));

drop policy if exists "Authenticated update product/category images" on storage.objects;

create policy "Authenticated update product/category images"
on storage.objects
for update
to authenticated
using (bucket_id in ('product-images', 'category-images'))
with check (bucket_id in ('product-images', 'category-images'));

drop policy if exists "Authenticated delete product/category images" on storage.objects;

create policy "Authenticated delete product/category images"
on storage.objects
for delete
to authenticated
using (bucket_id in ('product-images', 'category-images'));

-- Seed categories for current storefront
insert into public.categories (slug, label, sort_order)
values
  ('mi-tierra-querida', 'Mi Tierra Querida', 1),
  ('beisbol', 'Beisbol', 2),
  ('basketball', 'Basketball', 3),
  ('moda', 'Moda', 4),
  ('kids', 'Niños', 5)
on conflict (slug) do update
set label = excluded.label,
    sort_order = excluded.sort_order,
    updated_at = now();
