-- PRI-426: la anon key podía listar los buckets de imágenes (POST /storage/v1/object/list/<bucket>) y descubrir fotos
-- que nadie enlaza. Solo el panel, con sesión, conserva el SELECT: Storage lo exige para borrar y para subir con upsert.
-- Las URLs públicas (/object/public/...) no pasan por RLS porque los buckets siguen public = true.
-- site-media es el bucket del PR #43: se cubre aquí por si esa migración se aplica antes que esta.
drop policy if exists "Public read product/category images" on storage.objects;
drop policy if exists "Authenticated read product/category images" on storage.objects;

create policy "Authenticated read product/category images"
on storage.objects
for select
to authenticated
using (bucket_id in ('product-images', 'category-images'));

drop policy if exists "Public read promo images" on storage.objects;
drop policy if exists "Authenticated read promo images" on storage.objects;

create policy "Authenticated read promo images"
on storage.objects
for select
to authenticated
using (bucket_id = 'promo-images');

drop policy if exists "Public read site media" on storage.objects;
drop policy if exists "Authenticated read site media" on storage.objects;

create policy "Authenticated read site media"
on storage.objects
for select
to authenticated
using (bucket_id = 'site-media');
