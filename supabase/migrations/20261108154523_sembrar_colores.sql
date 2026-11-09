-- PRI-427: los colores de muestra del personalizador pasan a ser colores normales de la base, para que el cliente los
-- vea, oculte y reordene en serflow-admin y un color nuevo se sume en vez de reemplazarlos a todos. Son los 21 colores
-- teñidos de src/lib/personaliza/muestra.ts, en la camiseta (frente y espalda) y la gorra acrílica (frente), con sus
-- áreas y cm. La gorra de malla no tiene fotos ni cabe en garment_colors (check): sigue apagada.
-- Las fotos viven en el repo del sitio: repo:personalizador/<archivo>.jpg, que el build resuelve en
-- src/lib/medios-build.ts y serflow-admin muestra con su propia copia. src/lib/personaliza/siembra.test.ts compara este
-- archivo con muestra.ts, y e2e/promos/sembrado.mjs lo lee: mantener los values de colores y vistas como están.

alter table public.garment_photos drop constraint if exists garment_photos_image_url_https;
alter table public.garment_photos add constraint garment_photos_image_url_https
  check (image_url ~ '^https://' or image_url ~ '^repo:personalizador/[a-z0-9-]+\.jpg$');

-- Una sola vez y sin pisar nada: un color que el cliente ya tenga con el mismo nombre se queda como está, y las fotos
-- solo van a los colores que inserta esta migración.
with colores (archivo, name, hex, sort_order) as (values
  ('negra', 'Negra', '#1d1c1a', 1),
  ('blanca', 'Blanca', '#f2f0ea', 2),
  ('amarillo-pollo', 'Amarillo pollo', '#d0c98b', 3),
  ('amarillo', 'Amarilla', '#fdea01', 4),
  ('azul-cielo', 'Azul cielo', '#6cc1e5', 5),
  ('azul-rey', 'Azul rey', '#0a44a6', 6),
  ('beige', 'Beige', '#cab397', 7),
  ('cafe', 'Café', '#815540', 8),
  ('crema', 'Crema', '#dbc4b2', 9),
  ('fucsia', 'Fucsia', '#e2187b', 10),
  ('gris-cenizo', 'Gris cenizo', '#5b5957', 11),
  ('gris', 'Gris', '#b8b8b8', 12),
  ('lila', 'Lila', '#cec1e1', 13),
  ('mostaza', 'Mostaza', '#f3b550', 14),
  ('naranja', 'Naranja', '#f97603', 15),
  ('roja', 'Roja', '#f0062c', 16),
  ('rosado-bajito', 'Rosado bajito', '#cfa1af', 17),
  ('rosado-barbie', 'Rosado barbie', '#f393a6', 18),
  ('verde-militar', 'Verde militar', '#48582a', 19),
  ('verde-navidad', 'Verde navidad', '#1d8c56', 20),
  ('vino-tinto', 'Vino tinto', '#892a39', 21)
),
vistas (garment, view, sufijo, print_area, print_width_cm) as (values
  ('camiseta', 'frente', '', '{"tl":[0.31,0.28],"tr":[0.67,0.28],"br":[0.67,0.63],"bl":[0.31,0.63]}'::jsonb, 30),
  ('camiseta', 'espalda', '-espalda', '{"tl":[0.353,0.3],"tr":[0.647,0.3],"br":[0.647,0.6],"bl":[0.353,0.6]}'::jsonb, 35),
  ('gorra', 'frente', '', '{"tl":[0.29,0.42],"tr":[0.71,0.42],"br":[0.71,0.66],"bl":[0.29,0.66]}'::jsonb, 12)
),
nuevos as (
  insert into public.garment_colors (garment, name, hex, sort_order, is_active)
  select g.garment, c.name, c.hex, c.sort_order, true
  from colores c cross join (values ('camiseta'), ('gorra')) as g (garment)
  on conflict (garment, name) do nothing
  returning id, garment, name
)
insert into public.garment_photos (color_id, view, image_url, print_area, print_width_cm)
select n.id, v.view, 'repo:personalizador/' || n.garment || '-' || c.archivo || v.sufijo || '.jpg', v.print_area, v.print_width_cm
from nuevos n
join colores c on c.name = n.name
join vistas v on v.garment = n.garment
on conflict (color_id, view) do nothing;
