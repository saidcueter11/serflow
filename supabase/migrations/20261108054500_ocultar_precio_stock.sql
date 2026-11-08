-- PRI-424: price y stock no son públicos. RLS filtra filas, no columnas: con el grant de tabla, la anon key lee todas
-- las columnas de los productos activos. El sitio pide columnas explícitas (src/lib/products.ts) y no usa estas dos.
-- serflow-admin entra como authenticated, que conserva su grant. Una columna nueva de products que el sitio deba leer
-- se agrega a este grant en una migración nueva: sin eso, la anon key no la ve.
revoke select on public.products from anon;
grant select (id, legacy_id, slug, name, description, category_id, image_urls, is_active, sort_order, created_at, updated_at)
  on public.products to anon;
