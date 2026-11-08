-- PRI-455: colores disponibles de cada producto (etapa 1 de mayoristas, PRI-454). Opcional: un producto sin filas
-- se ve como antes. Nombre y muestra se guardan por producto (el admin sugiere los de garment_colors, pero esa tabla
-- es del personalizador: su is_active dice si sale allá). Las variantes de PRI-456 (color x talla, stock) colgarán
-- de estas filas. Solo nombre y muestra: nada de precio ni stock (PRI-424).
create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  hex text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_colors_hex_format check (hex ~ '^#[0-9a-fA-F]{6}$'),
  constraint product_colors_name_not_blank check (length(btrim(name)) > 0),
  constraint product_colors_name_length check (length(name) <= 40),
  constraint product_colors_product_name_key unique (product_id, name)
);

drop trigger if exists set_product_colors_updated_at on public.product_colors;

create trigger set_product_colors_updated_at
before update on public.product_colors
for each row
execute function public.set_updated_at();

alter table public.product_colors enable row level security;

-- La subconsulta pasa por la RLS de products: el público solo ve colores de productos activos.
drop policy if exists "Public can read colors of active products" on public.product_colors;

create policy "Public can read colors of active products"
on public.product_colors
for select
to public
using (exists (
  select 1 from public.products p
  where p.id = product_colors.product_id and p.is_active = true
));

drop policy if exists "Authenticated can manage product colors" on public.product_colors;

create policy "Authenticated can manage product colors"
on public.product_colors
for all
to authenticated
using (true)
with check (true);

-- Permisos explícitos: anon solo lee, aunque los privilegios por defecto del proyecto den más (RLS no cubre TRUNCATE).
revoke all on public.product_colors from anon;
grant select on public.product_colors to anon;
revoke all on public.product_colors from authenticated;
grant select, insert, update, delete on public.product_colors to authenticated;
