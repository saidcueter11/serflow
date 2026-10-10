-- PRI-131: varias promos activas, con descripción, fecha de fin y orden.
-- Run in Supabase SQL Editor. Idempotente y aditivo: se puede correr más de una vez.

-- Varias promos activas a la vez (antes solo una).
drop index if exists public.promos_one_active;

alter table public.promos add column if not exists description text;
-- La promo deja de mostrarse sola al pasar esta fecha. null = sin fecha de cierre.
alter table public.promos add column if not exists ends_at timestamptz;
-- Orden en la barra de la portada y en /promos (menor primero).
alter table public.promos add column if not exists sort_order int not null default 0;

-- El público solo lee promos activas y no vencidas. El admin (authenticated) sigue viendo todas.
drop policy if exists "Public can read active promos" on public.promos;

create policy "Public can read active promos"
on public.promos
for select
to public
using (is_active = true and (ends_at is null or ends_at > now()));
