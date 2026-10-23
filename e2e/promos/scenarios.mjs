// Promos sembradas para e2e/promos.spec.ts. Las fechas son relativas al build para que el test no caduque.
const DAY = 24 * 60 * 60 * 1000

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
    image_urls: [p[1], p[2], p[3], p[4]],
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
  image_url: null,
  sort_order: 999,
  is_active: true,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
}

export const SCENARIOS = [
  // 0 vigentes: solo una vencida, que no debe salir. Y una categoría recién creada, sin fotos (PRI-130).
  { outDir: '.e2e-builds/promos-0', port: 4232, promos: (p, now) => [vencida(now)], categories: [vacia] },
  { outDir: '.e2e-builds/promos-1', port: 4233, promos: (p, now) => [gorras(p, now)] },
  // Desordenadas a propósito: el sitio las ordena por sort_order.
  { outDir: '.e2e-builds/promos-3', port: 4234, promos: (p, now) => [ninos(p), vencida(now), equipos(p), gorras(p, now)] },
]
