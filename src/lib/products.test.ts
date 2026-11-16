import { describe, expect, it, vi } from 'vitest'

const PROPIA = 'https://x.supabase.co/storage/v1/object/public/product-images/a.webp'
const AJENA = 'https://otro-proyecto.supabase.co/storage/v1/object/public/product-images/b.webp'

const tables: Record<string, unknown[]> = {
  categories: [
    { id: 'c1', slug: 'moda', image_url: PROPIA },
    { id: 'c2', slug: 'kids', image_url: AJENA },
  ],
  products: [
    { id: 'p1', category_id: 'c1', image_urls: [AJENA, PROPIA] },
    { id: 'p2', category_id: 'c1', image_urls: [AJENA] },
  ],
  product_colors: [
    { product_id: 'p1', name: 'Negro', hex: '#111111' },
    { product_id: 'p1', name: ' Blanco ', hex: '#ffffff' },
    { product_id: 'p1', name: 'Malo', hex: 'red;background:url(x)' },
  ],
  promos: [
    { slug: 'a', banner_url: AJENA, image_urls: [PROPIA, AJENA], ends_at: null, created_at: '2026-10-01' },
    { slug: 'b', banner_url: PROPIA, image_urls: [], ends_at: null, created_at: '2026-10-02' },
  ],
}

const errors: Record<string, { code: string; message: string }> = {}

// Chainable stand-in for the supabase query builder; resolves with the table rows.
const selects: [string, string][] = []
const orders: string[][] = []
vi.mock('./supabase', () => ({
  supabase: {
    from: (table: string) => {
      const result = table in errors ? { data: null, error: errors[table] } : { data: tables[table], error: null }
      const q: Record<string, unknown> = {
        then: (resolve: (r: typeof result) => unknown) => resolve(result),
      }
      const orden: string[] = []
      orders.push(orden)
      for (const m of ['eq', 'single']) q[m] = () => q
      q.order = (col: string) => (orden.push(col), q)
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

// PRI-455
describe('colores de los productos', () => {
  it('cada producto trae los suyos, en orden y sin filas inválidas; sin colores, lista vacía', async () => {
    expect((await getProducts()).map((p) => p.colors)).toEqual([
      [
        { name: 'Negro', hex: '#111111' },
        { name: 'Blanco', hex: '#ffffff' },
      ],
      [],
    ])
  })

  it('sin la tabla (antes de la migración) el catálogo sale igual, sin colores', async () => {
    errors.product_colors = { code: 'PGRST205', message: 'no table' }
    try {
      expect((await getProducts()).map((p) => p.colors)).toEqual([[], []])
    } finally {
      delete errors.product_colors
    }
  })

  it('otro error de la base tumba el build', async () => {
    errors.product_colors = { code: '500', message: 'down' }
    try {
      await expect(getProducts()).rejects.toThrow('Failed to fetch product_colors: down')
    } finally {
      delete errors.product_colors
    }
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

// PRI-452: dos categorías (o prendas) con el mismo sort_order salían en cualquier orden y el "Ver todo" de la portada
// cambiaba de categoría entre builds. Todo orden por sort_order desempata por id.
describe('orden estable', () => {
  it('cada consulta por sort_order desempata por id', async () => {
    orders.length = 0
    await Promise.all([getCategories(), getProducts(), getProductsByCategory('moda'), getCategoriesWithCounts()])
    const porOrden = orders.filter((o) => o.includes('sort_order'))
    expect(porOrden.length).toBeGreaterThanOrEqual(5)
    for (const o of porOrden) expect(o).toEqual(['sort_order', 'id'])
  })
})
