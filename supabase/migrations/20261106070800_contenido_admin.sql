-- PRI-150 + PRI-122 PR 2: fotos del sitio y colores y fotos del personalizador, editables desde serflow-admin.
-- Aditiva e idempotente: solo crea tablas, bucket y policies nuevas; no toca datos existentes.

-- Un lugar de la página (un slot), su foto y su texto alternativo. Sin fila publicada, el sitio usa la foto del repo.
create table if not exists public.site_media (
  slot text primary key,
  image_url text not null,
  alt text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_media_slot_known check (slot in (
    'hero-1', 'hero-2', 'hero-3', 'hero-4',
    'servicio-estampado', 'servicio-dtf', 'servicio-bordado',
    'personalizador',
    'catalogo-todo'
  )),
  constraint site_media_image_url_https check (image_url ~ '^https://'),
  constraint site_media_alt_not_blank check (length(btrim(alt)) > 0)
);

drop trigger if exists set_site_media_updated_at on public.site_media;

create trigger set_site_media_updated_at
before update on public.site_media
for each row
execute function public.set_updated_at();

-- Colores por prenda. Arranca apagado hasta tener sus fotos.
create table if not exists public.garment_colors (
  id uuid primary key default gen_random_uuid(),
  garment text not null,
  name text not null,
  hex text not null,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint garment_colors_garment_known check (garment in ('camiseta', 'gorra')),
  constraint garment_colors_hex_format check (hex ~ '^#[0-9a-fA-F]{6}$'),
  constraint garment_colors_name_not_blank check (length(btrim(name)) > 0),
  constraint garment_colors_garment_name_key unique (garment, name)
);

drop trigger if exists set_garment_colors_updated_at on public.garment_colors;

create trigger set_garment_colors_updated_at
before update on public.garment_colors
for each row
execute function public.set_updated_at();

-- Una foto por color y vista. print_area y print_width_cm son opcionales: null = el valor por defecto de la prenda y
-- la vista en el código del sitio (src/lib/personaliza/base.ts). El cliente nunca tiene que calibrar nada.
create table if not exists public.garment_photos (
  id uuid primary key default gen_random_uuid(),
  color_id uuid not null references public.garment_colors(id) on delete cascade,
  view text not null,
  image_url text not null,
  print_area jsonb,
  print_width_cm numeric(4,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint garment_photos_view_known check (view in ('frente', 'espalda')),
  constraint garment_photos_image_url_https check (image_url ~ '^https://'),
  constraint garment_photos_print_area_shape check (
    print_area is null or (jsonb_typeof(print_area) = 'object' and print_area ?& array['tl', 'tr', 'br', 'bl'])
  ),
  constraint garment_photos_print_width_positive check (print_width_cm is null or print_width_cm > 0),
  constraint garment_photos_color_view_key unique (color_id, view)
);

drop trigger if exists set_garment_photos_updated_at on public.garment_photos;

create trigger set_garment_photos_updated_at
before update on public.garment_photos
for each row
execute function public.set_updated_at();

-- RLS: el público solo lee lo publicado; escribir, solo usuarios autenticados.
alter table public.site_media enable row level security;
alter table public.garment_colors enable row level security;
alter table public.garment_photos enable row level security;

drop policy if exists "Public can read active site media" on public.site_media;

create policy "Public can read active site media"
on public.site_media
for select
to public
using (is_active = true);

drop policy if exists "Authenticated can manage site media" on public.site_media;

create policy "Authenticated can manage site media"
on public.site_media
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active garment colors" on public.garment_colors;

create policy "Public can read active garment colors"
on public.garment_colors
for select
to public
using (is_active = true);

drop policy if exists "Authenticated can manage garment colors" on public.garment_colors;

create policy "Authenticated can manage garment colors"
on public.garment_colors
for all
to authenticated
using (true)
with check (true);

-- La subconsulta pasa por la RLS de garment_colors: el público solo ve fotos de colores activos.
drop policy if exists "Public can read photos of active colors" on public.garment_photos;

create policy "Public can read photos of active colors"
on public.garment_photos
for select
to public
using (exists (
  select 1 from public.garment_colors c
  where c.id = garment_photos.color_id and c.is_active = true
));

drop policy if exists "Authenticated can manage garment photos" on public.garment_photos;

create policy "Authenticated can manage garment photos"
on public.garment_photos
for all
to authenticated
using (true)
with check (true);

-- Permisos explícitos: anon solo lee, aunque los privilegios por defecto del proyecto den más (RLS no cubre TRUNCATE).
revoke all on public.site_media, public.garment_colors, public.garment_photos from anon;
grant select on public.site_media, public.garment_colors, public.garment_photos to anon;
revoke all on public.site_media, public.garment_colors, public.garment_photos from authenticated;
grant select, insert, update, delete on public.site_media, public.garment_colors, public.garment_photos to authenticated;

-- Bucket de estas fotos, con el límite de peso y los formatos impuestos por Storage (prefijos sitio/ y personalizador/).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public read site media" on storage.objects;

create policy "Public read site media"
on storage.objects
for select
to public
using (bucket_id = 'site-media');

drop policy if exists "Authenticated upload site media" on storage.objects;

create policy "Authenticated upload site media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-media');

drop policy if exists "Authenticated update site media" on storage.objects;

create policy "Authenticated update site media"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');

drop policy if exists "Authenticated delete site media" on storage.objects;

create policy "Authenticated delete site media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-media');
