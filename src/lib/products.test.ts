import { describe, expect, it, vi } from 'vitest'

const PROPIA = 'https://x.supabase.co/storage/v1/object/public/product-images/a.webp'
const AJENA = 'https://otro-proyecto.supabase.co/storage/v1/object/public/product-images/b.webp'

const tables: Record<string, unknown[]> = {
  categories: [
    { id: 'c1', slug: 'moda', image_url: PROPIA },
    { id: 'c2', slug: 'kids', image_url: AJENA },
  ],
  products: [
    { category_id: 'c1', image_urls: [AJENA, PROPIA] },
    { category_id: 'c1', image_urls: [AJENA] },
  ],
  promos: [
    { slug: 'a', banner_url: AJENA, image_urls: [PROPIA, AJENA], ends_at: null, created_at: '2026-10-01' },
    { slug: 'b', banner_url: PROPIA, image_urls: [], ends_at: null, created_at: '2026-10-02' },
  ],
}

// Chainable stand-in for the supabase query builder; resolves with the table rows.
const selects: [string, string][] = []
vi.mock('./supabase', () => ({
  supabase: {
    from: (table: string) => {
      const result = { data: tables[table], error: null }
      const q: Record<string, unknown> = {
        then: (resolve: (r: typeof result) => unknown) => resolve(result),
      }
      for (const m of ['eq', 'order', 'single']) q[m] = () => q
      q.select = (cols: string) => (selects.push([table, cols]), q)
      return q
    },
  },
}))

vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://x.supabase.co')
vi.stubEnv('PUBLIC_SUPABASE_FOTOS_URL', '')

const { getActivePromos, getCategories, getCategoriesWithCounts, getProductBySlug, getProducts, getProductsByCategory } = await import('./products')

// PRI-423: inferRemoteSize e inferSize bajan cualquier URL sin mirar image.remotePatterns.
describe('fotos de otro proyecto de Supabase', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  it('no llegan al build: ni productos, ni categorías, ni promos', async () => {
    expect((await getProducts()).map((p) => p.image_urls)).toEqual([[PROPIA], []])
    expect((await getCategories()).map((c) => c.image_url)).toEqual([PROPIA, null])
    expect((await getActivePromos()).map((p) => [p.banner_url, p.image_urls])).toEqual([
      [null, [PROPIA]],
      [PROPIA, []],
    ])
  })
})

describe('getCategoriesWithCounts', () => {
  it('counts active products per category, zero when none', async () => {
    const result = await getCategoriesWithCounts()
    expect(result.map((c) => [c.slug, c.product_count])).toEqual([
      ['moda', 2],
      ['kids', 0],
    ])
  })
})

// PRI-424: la anon key no puede leer stock (migración ocultar_precio_stock); un select('*') fallaría.
describe('columnas de products', () => {
  it('el sitio no pide stock ni select *', async () => {
    selects.length = 0
    await Promise.all([getProducts(), getProductsByCategory('moda'), getProductBySlug('a'), getCategoriesWithCounts()])
    const cols = selects.filter(([t]) => t === 'products').map(([, c]) => c)
    expect(cols).toHaveLength(4)
    for (const c of cols) expect(c.split('(')[0]).not.toMatch(/\*|\bstock\b/)
  })
})
