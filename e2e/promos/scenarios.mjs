// Promos sembradas para e2e/promos.spec.ts. Las fechas son relativas al build para que el test no caduque.
import { filasDeLaSiembra } from './sembrado.mjs'

const DAY = 24 * 60 * 60 * 1000

// PRI-423: otro proyecto de Supabase. Ese host no existe: si un camino del build intentara bajar la foto, el build falla.
export const FOTO_AJENA = 'https://e2e-proyecto-ajeno.supabase.co/storage/v1/object/public/product-images/ajena.jpg'

const row = (over) => ({
  id: over.slug,
  description: null,
  banner_url: null,
  image_urls: [],
  is_active: true,
  ends_at: null,
  sort_order: 0,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  ...over,
})

const vencida = (now) =>
  row({ slug: 'e2e-vencida', title: 'Promo vencida de prueba', ends_at: new Date(now - DAY).toISOString() })

const gorras = (p, now) =>
  row({
    slug: 'e2e-2x1-gorras',
    title: '2x1 en gorras bordadas',
    description: 'Llevas dos gorras con el mismo bordado y pagas una.',
    ends_at: new Date(now.getTime() + 30 * DAY).toISOString(),
    sort_order: 1,
    banner_url: p[0],
    image_urls: [p[1], FOTO_AJENA, p[2], p[3], p[4]],
  })

const equipos = (p) =>
  row({
    slug: 'e2e-camisetas-equipos',
    title: '10% en camisetas para equipos',
    description: 'Desde 10 camisetas con nombre y número.',
    sort_order: 2,
    image_urls: [p[2], p[3], p[4]],
  })

const ninos = (p) => row({ slug: 'e2e-gorras-ninos', title: 'Gorras para niños con su nombre', sort_order: 3, image_urls: [p[5]] })

// Categoría activa sin productos (e2e/catalogo.spec.ts): la galería muestra el estado vacío.
const vacia = {
  id: '00000000-0000-4000-8000-000000000130',
  slug: 'e2e-vacia',
  label: 'Vacía de prueba',
  image_url: FOTO_AJENA,
  sort_order: 999,
  is_active: true,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
}

// PRI-150: lo que el admin publica, con fotos que sirven y fotos que no. Las buenas son fotos de productos reales.
const medios = (p, base) => {
  const rota = `${base}/storage/v1/object/public/site-media/e2e-no-existe.jpg`
  const color = (id, name, garment_photos) => ({ id, garment: 'camiseta', name, hex: '#2f7d4f', garment_photos })
  const foto = (view, image_url) => ({ view, image_url, print_area: null, print_width_cm: null })
  return {
    site_media: [
      { slot: 'personalizador', image_url: p[0], alt: 'Foto de prueba del bloque' },
      { slot: 'catalogo-todo', image_url: rota, alt: 'Foto que no existe' },
    ],
    garment_colors: [
      color('e2e-verde', 'Verde', [foto('frente', p[1]), foto('espalda', p[2])]),
      color('e2e-sin-espalda', 'Sin espalda', [foto('frente', p[3])]),
      color('e2e-foto-rota', 'Foto rota', [foto('frente', p[1]), foto('espalda', rota)]),
    ],
  }
}

// PRI-413: contenido editable que publica el admin. Desordenado a propósito, con filas y fotos malas mezcladas.
const XSS = '<img src=x onerror="window.__xss=1">Hola & <b>chao</b>'

const contenido = (p, base) => {
  const rota = `${base}/storage/v1/object/public/site-media/e2e-no-existe.jpg`
  return {
    site_settings: [
      {
        id: 1,
        whatsapp_number: '573001112233',
        email: 'taller@serflow.example',
        address: 'Calle de prueba 1 </script><script>window.__xss=1</script>',
        directions_url: 'https://www.google.com/maps/search/?api=1&query=e2e',
        map_embed_url: 'https://www.google.com/maps/embed?pb=e2e',
        instagram_url: 'https://www.instagram.com/e2e/',
        instagram_handle: '@e2e_ig',
        tiktok_url: 'https://www.tiktok.com/@e2e',
        tiktok_handle: '@e2e_tt',
        facebook_url: 'https://www.facebook.com/e2e',
        facebook_handle: 'E2E',
        facebook_visible: false,
        hours: [{ days: 'Toda la semana', time: '9 a.m. a 5 p.m.' }],
      },
    ],
    site_sections: [
      { slug: 'hero', title: 'Hola Cartagena', description: 'Lema de prueba del hero.', eyebrow: XSS, seo_description: `Descripción de prueba ${XSS}` },
      { slug: 'personalizador', title: 'Hazla tú', description: 'Texto de prueba del personalizador.' },
      { slug: 'que-hacemos', title: XSS, description: 'Descripción de prueba de los servicios.' },
      // Sin descripción: esa sola usa el texto del código.
      { slug: 'disponible', title: 'Para llevar', description: '   ' },
      { slug: 'quienes-somos', title: 'El taller', description: 'Texto de prueba de quiénes somos.' },
      { slug: 'visitanos', title: 'Ven al taller' },
    ],
    hero_slides: [
      { image_url: p[1], alt: 'Segunda', sort_order: 2 },
      { image_url: FOTO_AJENA, alt: 'Proyecto ajeno', sort_order: 0 },
      { image_url: rota, alt: 'No existe', sort_order: 1 },
      { image_url: 'repo:stock/no-existe.jpg', alt: 'Referencia desconocida', sort_order: 1 },
      { image_url: p[0], alt: 'Primera', object_position: '50% 20%', sort_order: 1 },
      // El cliente agrega fotos sin perder las sembradas: conviven las del repo y las de Storage.
      { image_url: 'repo:stock/gorra-bordada.jpg', alt: 'Sembrada', sort_order: 3 },
    ],
    service_cards: [
      ...[1, 2, 3, 4].map((i) => ({ title: `Servicio ${i}`, description: `Descripción ${i}`, image_url: p[i], image_alt: `Foto ${i}`, sort_order: i })),
      { title: 'Servicio 5', description: 'Descripción 5', image_url: 'repo:stock/camiseta-dtf.jpg', image_alt: 'Foto 5', sort_order: 5 },
      { title: 'Servicio 6', description: 'Con una foto que no existe', image_url: rota, sort_order: 6 },
      { title: 'Servicio 7', description: 'Pasa del tope de 6', image_url: p[0], sort_order: 7 },
      { title: '   ', description: 'Sin título', image_url: p[0], sort_order: 0 },
    ],
    about_reasons: [
      { title: 'Razón 2', description: 'Copy 2', sort_order: 2 },
      { title: 'Razón 1', description: 'Copy 1', sort_order: 1 },
    ],
  }
}

// Tablas vacías, sin importar lo que el cliente haya publicado en la base: aquí se prueba el contenido de hoy.
const vacio = () => ({
  site_settings: [],
  site_sections: [],
  hero_slides: [],
  service_cards: [],
  about_reasons: [],
  site_media: [],
  garment_colors: [],
})

// Todo inválido: el build pasa y el sitio queda igual que sin datos.
const malo = () => ({
  ...vacio(),
  site_settings: [
    {
      id: 1,
      whatsapp_number: '3156481243',
      email: 'no-es-correo',
      address: '   ',
      directions_url: 'javascript:alert(1)',
      map_embed_url: 'https://evil.example/maps/embed',
      instagram_url: 'http://www.instagram.com/x',
      tiktok_url: 'https://evil.example/@x',
      facebook_url: 'no es url',
      // Solo false quita una red. Cualquier otro valor la deja visible.
      instagram_visible: 'false',
      tiktok_visible: null,
      facebook_visible: 0,
      hours: 'todos los días',
    },
  ],
  site_sections: [{ slug: 'hero', title: 'x'.repeat(81), description: '   ', eyebrow: 'x'.repeat(61), seo_description: 'x'.repeat(161) }],
  hero_slides: [{ image_url: 'javascript:alert(1)' }, { image_url: 'https://evil.example/x.jpg' }],
  service_cards: [{ title: 'Una sola tarjeta', description: 'No llena la rejilla' }],
  about_reasons: [{ title: 'x'.repeat(41), description: 'Título demasiado largo' }],
})

// PRI-438: catálogo fijo para el efecto 7 (e2e/efectos.spec.ts). Con el real, si las fotos nuevas de arriba de "Todo"
// son todas de una categoría, al cambiar de pestaña ninguna foto viaja. Aquí "Todo" va intercalado (A1 B1 C1 A2...):
// al tocar B, B1 sigue en pantalla en otro puesto y A1 y C1 se van. Una sola foto, para que la rejilla sea pareja, y
// 60 en "Todo" (PAGE_SIZE): el muro más grande, el que mide el costo de layout.
const catalogo = (p) => {
  const categories = ['a', 'b', 'c'].map((slug, i) => ({ ...vacia, id: `e2e-cat-${slug}`, slug: `e2e-${slug}`, label: `Categoría ${slug.toUpperCase()}`, image_url: null, sort_order: i }))
  const products = categories.flatMap((c) =>
    Array.from({ length: 20 }, (_, i) => i + 1).map((n) => ({
      id: `${c.slug}-${n}`,
      legacy_id: n,
      slug: `${c.slug}-${n}`,
      name: `${c.label} ${n}`,
      description: null,
      category_id: c.id,
      image_urls: [p[0]],
      price: null,
      stock: 0,
      is_active: true,
      sort_order: n,
      // Viejas (nada va primero en "Todo") y la 1 la más reciente de su categoría.
      created_at: `2026-01-${String(30 - n).padStart(2, '0')}T00:00:00Z`,
      updated_at: '2026-01-30T00:00:00Z',
      categories: { slug: c.slug, label: c.label },
    })),
  )
  // PRI-455: la primera prenda viene en dos colores (ya en el orden de sort_order, como los da la consulta); la segunda, en ninguno.
  const product_colors = [
    { product_id: 'e2e-a-1', name: 'Negro', hex: '#111111', sort_order: 0 },
    { product_id: 'e2e-a-1', name: 'Azul rey', hex: '#1d3fa8', sort_order: 1 },
  ]
  return { categories, products, product_colors }
}

export const SCENARIOS = [
  // 0 vigentes: solo una vencida, que no debe salir. Y una categoría recién creada, sin fotos (PRI-130).
  { outDir: '.e2e-builds/promos-0', port: 4232, promos: (p, now) => [vencida(now)], categories: [vacia], medios: vacio },
  { outDir: '.e2e-builds/promos-1', port: 4233, promos: (p, now) => [gorras(p, now)], medios: vacio },
  // Desordenadas a propósito: el sitio las ordena por sort_order.
  { outDir: '.e2e-builds/promos-3', port: 4234, promos: (p, now) => [ninos(p), vencida(now), equipos(p), gorras(p, now)], medios: vacio },
  // PRI-150 + PRI-413: lo que publica el admin, y (4236) datos inválidos.
  { outDir: '.e2e-builds/medios', port: 4235, promos: () => [], medios: (p, base) => ({ ...medios(p, base), ...contenido(p, base) }) },
  { outDir: '.e2e-builds/contenido-malo', port: 4236, promos: () => [], medios: malo },
  // PRI-413: lo que deja la migración de siembra. Mismas promos y categorías que 4232, para comparar su HTML.
  {
    outDir: '.e2e-builds/sembrado',
    port: 4237,
    promos: (p, now) => [vencida(now)],
    categories: [vacia],
    medios: () => ({ ...vacio(), ...filasDeLaSiembra() }),
  },
  // PRI-413: el cliente quitó las tres redes, con enlaces guardados que no deben salir.
  {
    outDir: '.e2e-builds/sin-redes',
    port: 4238,
    promos: () => [],
    medios: () => ({
      ...vacio(),
      site_settings: [{ id: 1, instagram_url: 'https://www.instagram.com/e2e-quitada/', instagram_visible: false, tiktok_visible: false, facebook_visible: false }],
    }),
  },
  { outDir: '.e2e-builds/rejilla', port: 4239, promos: () => [], medios: (p) => ({ ...vacio(), ...catalogo(p) }) },
]
