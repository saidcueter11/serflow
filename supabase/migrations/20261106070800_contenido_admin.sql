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
  constraint site_media_slot_known check (slot in ('personalizador', 'catalogo-todo')),
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


-- PRI-413: contenido editable de la portada y datos del negocio. Tablas vacías: mientras no haya datos, el sitio usa los
-- valores del código. Los límites se repiten al leer en el build (src/lib/site-content.ts, src/lib/business-overrides.mjs).

-- Datos del negocio: una sola fila (id = 1). Cada columna vacía usa el valor de src/lib/business.ts.
create table if not exists public.site_settings (
  id smallint primary key default 1,
  whatsapp_number text,
  email text,
  address text,
  directions_url text,
  map_embed_url text,
  instagram_url text,
  instagram_handle text,
  tiktok_url text,
  tiktok_handle text,
  facebook_url text,
  facebook_handle text,
  -- [{ "days": "Lunes a sábado", "time": "8 a.m. - 6 p.m." }], de 1 a 7 filas.
  hours jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1),
  -- Celular colombiano con indicativo, solo dígitos: un número sin el 57 rompe todos los pedidos.
  constraint site_settings_whatsapp check (whatsapp_number is null or whatsapp_number ~ '^573[0-9]{9}$'),
  constraint site_settings_email check (
    email is null or (char_length(email) <= 254 and email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$')
  ),
  constraint site_settings_address check (address is null or char_length(address) <= 120),
  constraint site_settings_directions check (directions_url is null or (char_length(directions_url) <= 2000 and directions_url ~ '^https://')),
  constraint site_settings_map check (map_embed_url is null or (char_length(map_embed_url) <= 2000 and map_embed_url ~ '^https://www\.google\.com/maps/embed')),
  constraint site_settings_instagram check (instagram_url is null or (char_length(instagram_url) <= 2000 and instagram_url ~ '^https://(www\.)?instagram\.com/')),
  constraint site_settings_tiktok check (tiktok_url is null or (char_length(tiktok_url) <= 2000 and tiktok_url ~ '^https://(www\.|vm\.)?tiktok\.com/')),
  constraint site_settings_facebook check (facebook_url is null or (char_length(facebook_url) <= 2000 and facebook_url ~ '^https://(www\.|m\.)?facebook\.com/')),
  constraint site_settings_handles check (
    coalesce(char_length(instagram_handle), 0) <= 40 and coalesce(char_length(tiktok_handle), 0) <= 40 and coalesce(char_length(facebook_handle), 0) <= 40
  ),
  constraint site_settings_hours check (hours is null or (jsonb_typeof(hours) = 'array' and jsonb_array_length(hours) between 1 and 7))
);

-- Título y descripción de cada sección de la portada. Cada campo vacío usa el texto del código.
create table if not exists public.site_sections (
  slug text primary key,
  title text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_sections_slug check (slug in ('hero', 'personalizador', 'que-hacemos', 'disponible', 'quienes-somos', 'visitanos')),
  constraint site_sections_title check (title is null or char_length(title) <= 80),
  constraint site_sections_description check (description is null or char_length(description) <= 400)
);

-- Fotos del carrusel del hero, de 1 a 6 (el sitio toma las 6 primeras). Sin filas, las 4 del código.
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text,
  -- Encuadre en CSS object-position, por ejemplo "50% 35%". Vacío: centrada.
  object_position text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hero_slides_image check (char_length(image_url) <= 2000 and image_url ~ '^https://'),
  constraint hero_slides_alt check (alt is null or char_length(alt) <= 140),
  constraint hero_slides_position check (object_position is null or object_position ~ '^(100|[0-9]{1,2})% (100|[0-9]{1,2})%$')
);

-- Tarjetas de "Qué hacemos", de 2 a 6 (el sitio toma las 6 primeras; con menos de 2, las 3 del código).
create table if not exists public.service_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  image_alt text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_cards_title check (char_length(title) between 1 and 40),
  constraint service_cards_description check (char_length(description) between 1 and 140),
  constraint service_cards_image check (image_url is null or (char_length(image_url) <= 2000 and image_url ~ '^https://')),
  constraint service_cards_alt check (image_alt is null or char_length(image_alt) <= 140)
);

-- Razones de "Quiénes somos", hasta 6 (el sitio toma las 6 primeras). Sin filas, las 3 del código.
create table if not exists public.about_reasons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint about_reasons_title check (char_length(title) between 1 and 40),
  constraint about_reasons_description check (char_length(description) between 1 and 140)
);

-- updated_at
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_site_sections_updated_at on public.site_sections;
create trigger set_site_sections_updated_at before update on public.site_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_hero_slides_updated_at on public.hero_slides;
create trigger set_hero_slides_updated_at before update on public.hero_slides
for each row execute function public.set_updated_at();

drop trigger if exists set_service_cards_updated_at on public.service_cards;
create trigger set_service_cards_updated_at before update on public.service_cards
for each row execute function public.set_updated_at();

drop trigger if exists set_about_reasons_updated_at on public.about_reasons;
create trigger set_about_reasons_updated_at before update on public.about_reasons
for each row execute function public.set_updated_at();

-- RLS: el público lee (las filas activas donde aplica); solo authenticated escribe.
alter table public.site_settings enable row level security;
alter table public.site_sections enable row level security;
alter table public.hero_slides enable row level security;
alter table public.service_cards enable row level security;
alter table public.about_reasons enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select to public using (true);
drop policy if exists "Authenticated can manage site settings" on public.site_settings;
create policy "Authenticated can manage site settings" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "Public can read site sections" on public.site_sections;
create policy "Public can read site sections" on public.site_sections for select to public using (true);
drop policy if exists "Authenticated can manage site sections" on public.site_sections;
create policy "Authenticated can manage site sections" on public.site_sections for all to authenticated using (true) with check (true);

drop policy if exists "Public can read active hero slides" on public.hero_slides;
create policy "Public can read active hero slides" on public.hero_slides for select to public using (is_active = true);
drop policy if exists "Authenticated can manage hero slides" on public.hero_slides;
create policy "Authenticated can manage hero slides" on public.hero_slides for all to authenticated using (true) with check (true);

drop policy if exists "Public can read active service cards" on public.service_cards;
create policy "Public can read active service cards" on public.service_cards for select to public using (is_active = true);
drop policy if exists "Authenticated can manage service cards" on public.service_cards;
create policy "Authenticated can manage service cards" on public.service_cards for all to authenticated using (true) with check (true);

drop policy if exists "Public can read active about reasons" on public.about_reasons;
create policy "Public can read active about reasons" on public.about_reasons for select to public using (is_active = true);
drop policy if exists "Authenticated can manage about reasons" on public.about_reasons;
create policy "Authenticated can manage about reasons" on public.about_reasons for all to authenticated using (true) with check (true);

-- Igual que arriba: anon solo lee; authenticated, CRUD (RLS no cubre TRUNCATE).
revoke all on public.site_settings, public.site_sections, public.hero_slides, public.service_cards, public.about_reasons from anon;
grant select on public.site_settings, public.site_sections, public.hero_slides, public.service_cards, public.about_reasons to anon;
revoke all on public.site_settings, public.site_sections, public.hero_slides, public.service_cards, public.about_reasons from authenticated;
grant select, insert, update, delete on public.site_settings, public.site_sections, public.hero_slides, public.service_cards, public.about_reasons to authenticated;
