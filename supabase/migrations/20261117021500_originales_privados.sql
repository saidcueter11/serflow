-- PRI-537 (serflow-admin #39): la foto entera de un recorte, que el panel guarda para volver a encuadrarla.
-- Iba como <foto>.orig en el mismo bucket público, en una URL que se deduce de la foto del sitio: cualquiera
-- veía lo que el admin recortó. Ahora vive en un bucket privado (las URLs /object/public/ no lo sirven) y
-- solo el panel, con sesión, la sube, la lee para re-encuadrar y la borra. La anon key no tiene policy aquí.
-- Rutas: <bucket de la foto>/<nombre de la foto sin extensión>. El panel la sube ya re-codificada (sin EXIF).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photo-originals', 'photo-originals', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false;

drop policy if exists "Authenticated read photo originals" on storage.objects;

create policy "Authenticated read photo originals"
on storage.objects
for select
to authenticated
using (bucket_id = 'photo-originals');

drop policy if exists "Authenticated upload photo originals" on storage.objects;

create policy "Authenticated upload photo originals"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'photo-originals');

drop policy if exists "Authenticated delete photo originals" on storage.objects;

create policy "Authenticated delete photo originals"
on storage.objects
for delete
to authenticated
using (bucket_id = 'photo-originals');
