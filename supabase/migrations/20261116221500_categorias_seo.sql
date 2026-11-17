-- PRI-532: texto por categoría para Google. seo_title va al <title> de /catalogo/<categoría>/ (vacío = el nombre) e
-- intro (1-2 frases) sale arriba de las fotos y en la meta description. Las edita el cliente en serflow-admin, que valida
-- los mismos largos (LIMITS.categorySeoTitle / categoryIntro).
-- Idempotente y aditivo. categories no tiene grant por columnas (solo products, 20261108054500): anon ya lee las
-- columnas nuevas con el grant de tabla, y la policy de siempre deja ver solo las activas. El grant explícito de abajo es
-- por si algún día categories pasa a grant por columnas: estas dos son públicas.

alter table public.categories add column if not exists seo_title text;
alter table public.categories add column if not exists intro text;

alter table public.categories drop constraint if exists categories_seo_title_length;
alter table public.categories add constraint categories_seo_title_length check (char_length(seo_title) <= 60);
alter table public.categories drop constraint if exists categories_intro_length;
alter table public.categories add constraint categories_intro_length check (char_length(intro) <= 200);

grant select (seo_title, intro) on public.categories to anon;

-- Textos iniciales (pedido de Said, 2026-11-16), uno por categoría según lo que hay hoy en cada una. Solo donde siguen
-- vacíos: no pisan lo que el cliente ya haya escrito.
update public.categories c
set seo_title = t.seo_title, intro = t.intro
from (values
  ('sombreros', 'Sombreros en Cartagena, tejidos y de ala ancha',
    'Sombreros de ala ancha y tejidos para el sol de Cartagena, en nuestra tienda del Mercado Bazurto. Les bordamos o estampamos tu marca o tu nombre, por unidad o al por mayor.'),
  ('dama', 'Gorras para dama en Cartagena',
    'Gorras para dama con brillantes, encaje y tejidos calados, de diseño propio. Si quieres una con tu nombre o tu marca, te la personalizamos con bordado, bordado en relieve o estampado.'),
  ('mi-tierra-querida', 'Gorras de Colombia y Cartagena, bordadas en relieve',
    'Gorras con el orgullo colombiano: la bandera, frases nuestras y diseños de Cartagena bordados en relieve. Para llevar o regalar, y al por mayor para tiendas, eventos y recuerdos.'),
  ('beisbol', 'Gorras de béisbol bordadas en Cartagena',
    'Gorras de béisbol con logos bordados en relieve, para el estadio o el día a día. ¿Tu equipo o tu empresa quiere las suyas? Hacemos bordados en Cartagena desde una sola unidad.'),
  ('basketball', 'Gorras de basketball bordadas en Cartagena',
    'Gorras de basketball con escudos bordados de los equipos clásicos y colores combinados. Si tienes equipo propio, te hacemos las gorras y las camisetas estampadas con su escudo.'),
  ('moda', 'Gorras y viseras de moda en Cartagena',
    'Gorras y viseras de moda con parches, telas lavadas y detalles para el día a día. ¿Quieres la tuya con tu diseño? La hacemos con bordado, estampado o DTF, una sola o al por mayor.'),
  ('kids', 'Gorras para niños personalizadas en Cartagena',
    'Gorras para niños con dibujos, animales y fútbol. Les ponemos el nombre bordado o estampado: un regalo que se usa en cumpleaños, en el colegio o en la escuela de fútbol.')
) as t (slug, seo_title, intro)
where c.slug = t.slug and c.seo_title is null and c.intro is null;
