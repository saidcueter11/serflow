-- PRI-413: copia a la base lo que el sitio muestra hoy, una sola vez. Sin esto, la primera foto o tarjeta que agregue el
-- cliente reemplazaría todo el respaldo del código (1 foto en vez de 5). Mergear no cambia nada visible: son los mismos
-- valores (e2e/site-content.spec.ts compara el HTML). No pisa nada: una tabla con filas se deja como está.
-- Las fotos viven en el repo del sitio y no tienen URL en Storage: repo:stock/<archivo>.jpg, que el build resuelve en
-- src/pages/index.astro. e2e/promos/sembrado.mjs lee este archivo: mantener una lista de values por insert.

insert into public.site_settings (id, whatsapp_number, email, address, directions_url, map_embed_url, instagram_url, instagram_handle, tiktok_url, tiktok_handle, facebook_url, facebook_handle, hours)
values (
  1,
  '573156481243',
  'distribuidoraelmayorista@hotmail.com',
  'Mercado Bazurto, C.C. Bazurtico, local 31',
  'https://www.google.com/maps/search/?api=1&query=Serflow%2C%20Centro%20Comercial%20Bazurtico%20local%2031%2C%20Mercado%20Bazurto%2C%20Cartagena',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.1040576904143!2d-75.5238772!3d10.4133097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62592f68c041b%3A0x3b6e98a99be2e1de!2sSerflow!5e0!3m2!1ses-419!2sco!4v1747794709936!5m2!1ses-419!2sco',
  'https://www.instagram.com/serflow_serflow/',
  '@serflow_serflow',
  'https://www.tiktok.com/@serflow4',
  '@serflow4',
  'https://www.facebook.com/people/Serflow/100054522471881/',
  'Serflow',
  '[{"days":"Lunes a sábado","time":"8 a.m. – 6 p.m."},{"days":"Domingo y festivos","time":"8 a.m. – 2 p.m."}]'::jsonb
)
on conflict (id) do nothing;

insert into public.site_sections (slug, title, description, eyebrow, seo_description)
values
  ('hero', 'Bienvenido a Serflow', 'Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.', 'Mercado Bazurto · Cartagena', 'Serflow en Cartagena: camisetas y gorras con estampado, DTF y bordado. Ven al taller en el Mercado Bazurto o escríbenos por WhatsApp.'),
  ('personalizador', 'Diseña la tuya', 'Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.', null, null),
  ('que-hacemos', 'Qué hacemos', 'Camisetas y gorras, con la técnica que mejor le quede a tu diseño.', null, null),
  ('disponible', 'Disponible ahora', 'Lo que hay en el taller esta semana.', null, null),
  ('quienes-somos', 'Quiénes somos', 'Somos un taller en Cartagena que hace prendas personalizadas. La ropa no solo se usa, se vive: por eso cada pieza lleva algo tuyo.', null, null),
  ('visitanos', 'Visítanos', null, null, null)
on conflict (slug) do nothing;

insert into public.hero_slides (image_url, alt, object_position, sort_order)
select v.image_url, v.alt, v.object_position, v.sort_order from (values
  ('repo:stock/camisetas-estampadas.jpg', 'Dos personas con camisetas negras estampadas', '50% 35%', 1),
  ('repo:stock/estampado-proceso.jpg', 'Manos pasando el rasero sobre una plancha de estampado', '50% 50%', 2),
  ('repo:stock/gorra-bordada.jpg', 'Gorra blanca con bordado rojo', '50% 40%', 3),
  ('repo:stock/amigos-gorras.jpg', 'Dos amigos con gorras personalizadas riéndose', '50% 30%', 4)
) as v(image_url, alt, object_position, sort_order)
where not exists (select 1 from public.hero_slides);

insert into public.service_cards (title, description, image_url, image_alt, sort_order)
select v.title, v.description, v.image_url, v.image_alt, v.sort_order from (values
  ('Estampado', 'Mate, toma la textura de la tela. Ideal para camisetas.', 'repo:stock/estampado-rasero.jpg', 'Estampado', 1),
  ('DTF', 'Colores vivos y con brillo. Fotos y degradados.', 'repo:stock/camiseta-dtf.jpg', 'DTF', 2),
  ('Bordado', 'Hilo con relieve. El clásico de las gorras.', 'repo:stock/gorra-bordada-2.jpg', 'Bordado', 3)
) as v(title, description, image_url, image_alt, sort_order)
where not exists (select 1 from public.service_cards);

insert into public.about_reasons (title, description, sort_order)
select v.title, v.description, v.sort_order from (values
  ('A tu gusto', 'Cada prenda sale de tu idea. Nada genérico.', 1),
  ('Acabados que duran', 'Bordado y estampado con materiales de calidad.', 2),
  ('Atención directa', 'Te asesoramos por WhatsApp, sin vueltas.', 3)
) as v(title, description, sort_order)
where not exists (select 1 from public.about_reasons);
