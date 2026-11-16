-- PRI-525: SEO técnico (auditoría 2026-11-15, puntos #3 y #4).

-- #4: disponibilidad para el JSON-LD de producto sin publicar el stock (PRI-424). La anon key lee solo si hay o no hay,
-- nunca el número. Generada: serflow-admin sigue escribiendo stock como siempre.
alter table public.products add column if not exists en_stock boolean generated always as (stock > 0) stored;
grant select (en_stock) on public.products to anon;

-- #3: la URL de cada foto (/catalogo/<categoría>/<slug>) sale del nombre del producto. Al renombrarlo en el admin, el slug
-- se regenera y el viejo queda en product_slug_redirects; el build publica un 301 de cada slug viejo a la URL actual
-- (src/lib/seo-build.mjs), así los links que circulan por WhatsApp no se pierden.
create table if not exists public.product_slug_redirects (
  category_slug text not null,
  slug text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (category_slug, slug)
);

alter table public.product_slug_redirects enable row level security;

-- Solo la lee el build. La llena el trigger (security definer): nadie escribe directo, tampoco authenticated.
revoke insert, update, delete, truncate on public.product_slug_redirects from anon, authenticated;
grant select on public.product_slug_redirects to anon, authenticated;

-- La subconsulta pasa por la RLS de products: el público solo ve los slugs viejos de productos activos.
drop policy if exists "Public can read slug redirects of active products" on public.product_slug_redirects;

create policy "Public can read slug redirects of active products"
on public.product_slug_redirects
for select
to public
using (exists (
  select 1 from public.products p
  where p.id = product_slug_redirects.product_id and p.is_active = true
));

-- Igual que el slugify de serflow-admin (product-form.tsx): sin tildes, minúsculas, todo lo demás a "-".
create or replace function public.slug_desde_nombre(nombre text)
returns text
language sql
immutable
set search_path = ''
as $$
  select btrim(
    regexp_replace(
      lower(translate(nombre, 'ÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇáàäâãéèëêíìïîóòöôõúùüûñç', 'AAAAAEEEEIIIIOOOOOUUUUNCaaaaaeeeeiiiiooooouuuunc')),
      '[^a-z0-9]+', '-', 'g'
    ),
    '-'
  )
$$;

-- Al cambiar el nombre, slug nuevo desde el nombre (con -2, -3... si ya existe). Si en el mismo guardado el admin
-- cambió el slug a mano, se respeta el suyo. Un nombre sin letras ni números deja el slug como estaba.
create or replace function public.products_slug_desde_nombre()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidato text;
  n integer := 1;
begin
  if new.name is not distinct from old.name or new.slug is distinct from old.slug then
    return new;
  end if;
  base := public.slug_desde_nombre(new.name);
  if base = '' then
    return new;
  end if;
  candidato := base;
  while exists (select 1 from public.products p where p.slug = candidato and p.id <> new.id) loop
    n := n + 1;
    candidato := base || '-' || n;
  end loop;
  new.slug := candidato;
  return new;
end;
$$;

drop trigger if exists products_slug_desde_nombre on public.products;

create trigger products_slug_desde_nombre
before update of name on public.products
for each row
execute function public.products_slug_desde_nombre();

-- Guarda la URL vieja cuando cambia el slug o la categoría. Si la URL nueva estaba guardada como vieja, se borra: es
-- otra vez una página.
create or replace function public.products_guardar_slug_viejo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.slug is not distinct from old.slug and new.category_id is not distinct from old.category_id then
    return null;
  end if;
  insert into public.product_slug_redirects (category_slug, slug, product_id)
  select c.slug, old.slug, new.id from public.categories c where c.id = old.category_id
  on conflict (category_slug, slug) do update set product_id = excluded.product_id, created_at = now();
  delete from public.product_slug_redirects r
  using public.categories c
  where c.id = new.category_id and r.category_slug = c.slug and r.slug = new.slug;
  return null;
end;
$$;

revoke execute on function public.products_guardar_slug_viejo() from public, anon, authenticated;

drop trigger if exists products_guardar_slug_viejo on public.products;

create trigger products_guardar_slug_viejo
after update on public.products
for each row
execute function public.products_guardar_slug_viejo();
