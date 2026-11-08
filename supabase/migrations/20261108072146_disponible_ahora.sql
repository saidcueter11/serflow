-- PRI-123: "Disponible ahora" en la portada. El cliente lo prende y lo apaga a mano en serflow-admin, sin vencimiento.
-- Aparte de is_active: un producto puede estar en el catálogo (portafolio) sin estar listo para llevar. Nace apagado,
-- así que al aplicarla la sección se oculta hasta que el cliente prenda alguno.
alter table public.products add column if not exists available_now boolean not null default false;

-- El sitio la lee con la anon key: grant por columnas de PRI-424 (20261108054500), sin stock.
grant select (available_now) on public.products to anon;
