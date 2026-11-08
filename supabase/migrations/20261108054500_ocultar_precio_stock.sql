-- PRI-424: stock no es público (price sí: el modal de la foto lo muestra desde PRI-433). RLS filtra filas, no
-- columnas: con el grant de tabla, la anon key lee todas las columnas de los productos activos. El sitio pide
-- columnas explícitas (src/lib/products.ts) y no usa stock.
-- serflow-admin entra como authenticated, que conserva su grant. Una columna nueva de products que el sitio deba leer
-- se agrega a este grant en una migración nueva: sin eso, la anon key no la ve.
revoke select on public.products from anon;
grant select (id, legacy_id, slug, name, description, category_id, image_urls, price, is_active, sort_order, created_at, updated_at)
  on public.products to anon;
