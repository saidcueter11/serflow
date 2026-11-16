-- PRI-524: promos que solo salen ciertos días de la semana ("martes, miércoles y jueves"), además de ends_at.
-- weekdays: días ISO, 1 = lunes ... 7 = domingo, en hora de Cartagena. Vacío = todos los días, como antes.
-- Idempotente y aditivo. promos no tiene grant por columnas (solo products, 20261108054500): anon ya lee la columna
-- nueva con el grant de tabla, y la policy de abajo sigue dejando ver solo filas activas.

alter table public.promos add column if not exists weekdays smallint[] not null default '{}';

alter table public.promos drop constraint if exists promos_weekdays_valid;
alter table public.promos add constraint promos_weekdays_valid check (weekdays <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]);

-- El público solo lee promos activas, no vencidas y de hoy (Cartagena no tiene horario de verano). El sitio filtra
-- igual en el build (livePromos); el rebuild diario de las 00:05 de Cartagena (daily-rebuild.yml) cambia el día.
drop policy if exists "Public can read active promos" on public.promos;

create policy "Public can read active promos"
on public.promos
for select
to public
using (
  is_active = true
  and (ends_at is null or ends_at > now())
  and (cardinality(weekdays) = 0 or extract(isodow from now() at time zone 'America/Bogota')::smallint = any(weekdays))
);
