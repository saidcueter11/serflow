-- PRI-538: los días de la semana de una promo (weekdays, PRI-524) ya no la ocultan; el sitio los muestra como etiqueta
-- ("Disponible martes, miércoles y jueves"). La columna y su check se quedan. La policy pública vuelve a la de
-- 20261010013709_promos_varias.sql: solo filas activas y no vencidas, sin filtro por día.
-- Idempotente.

drop policy if exists "Public can read active promos" on public.promos;

create policy "Public can read active promos"
on public.promos
for select
to public
using (is_active = true and (ends_at is null or ends_at > now()));
