import { coloresPorProducto } from './colores-producto'
import { esUrlPermitida } from './fotos-host.mjs'
import { filas } from './medios'
import { supabase } from './supabase'
import { livePromos } from './promos'
import type { Category, Product, Promo } from './types'

// PRI-423: el build solo baja fotos del proyecto propio. inferRemoteSize e inferSize (catalog-view, promo-view) bajan
// cualquier URL sin mirar image.remotePatterns, así que una foto de otro host se queda aquí: ni se descarga ni se publica.
function fotoPropia(url: string): boolean {
  const ok = esUrlPermitida(url)
  if (!ok) console.warn(`[fotos] ${url}: host no permitido. Se ignora.`)
  return ok
}
const conFotosPropias = <T extends { image_urls: string[] }>(fila: T): T => ({ ...fila, image_urls: fila.image_urls.filter(fotoPropia) })

/* ── Categories ──────────────────────────────────────────── */

// PRI-452: sort_order se repite (dos categorías en 0) y Postgres no garantiza el orden de los empates: el "Ver todo"
// de la portada cambiaba de categoría entre builds. Todo orden por sort_order desempata por id.

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .order('id')

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`)
  return (data ?? []).map((c: Category) => (c.image_url && !fotoPropia(c.image_url) ? { ...c, image_url: null } : c))
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data
}

/**
 * Returns all active categories together with their active-product count.
 * Only 2 queries regardless of category count.
 */
export async function getCategoriesWithCounts(): Promise<
  (Category & { product_count: number })[]
> {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .order('id'),
    supabase
      .from('products')
      .select('category_id')
      .eq('is_active', true),
  ])

  if (categoriesRes.error)
    throw new Error(
      `Failed to fetch categories: ${categoriesRes.error.message}`,
    )

  const countMap = new Map<string, number>()
  for (const p of productsRes.data ?? []) {
    countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1)
  }

  return (categoriesRes.data ?? []).map((cat) => ({
    ...cat,
    product_count: countMap.get(cat.id) ?? 0,
  }))
}

/* ── Products ────────────────────────────────────────────── */

// PRI-424: la anon key no lee stock (migración ocultar_precio_stock): con select('*') la consulta falla. price sí: lo
// muestra el modal de la foto (PRI-433).
const COLUMNAS = 'id, legacy_id, slug, name, description, category_id, image_urls, price, is_active, sort_order, created_at, updated_at, categories!inner(slug, label)'

export async function getProducts(): Promise<Product[]> {
  const [{ data, error }, colores] = await Promise.all([
    supabase
      .from('products')
      .select<typeof COLUMNAS, Product>(COLUMNAS)
      .eq('is_active', true)
      .order('sort_order')
      .order('id'),
    // Consulta aparte y no embebida: antes de la migración (deploy preview) la tabla no existe y el catálogo sale igual.
    supabase.from('product_colors').select('product_id, name, hex').order('sort_order').order('id'),
  ])

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  const porProducto = coloresPorProducto(filas('product_colors', colores as never))
  return (data ?? []).map((p: Product) => ({ ...conFotosPropias(p), colors: porProducto.get(p.id) ?? [] }))
}

// PRI-123: lo que el cliente prendió en "Disponible ahora" (serflow-admin), en el orden del catálogo y solo lo que la
// portada puede pintar. Consulta aparte: el CI y Netlify construyen antes de que el workflow aplique la migración, y
// sin la columna (42703) no hay nada disponible. Una vez por build: la usan la portada y la nav de Layout.astro.
let disponibles: Promise<Product[]> | undefined

async function leerDisponibles(): Promise<Product[]> {
  const [products, { data, error }] = await Promise.all([
    getProducts(),
    supabase.from('products').select('id').eq('is_active', true).eq('available_now', true),
  ])
  if (error?.code === '42703') return []
  if (error) throw new Error(`Failed to fetch available products: ${error.message}`)
  const ids = new Set((data ?? []).map((p: { id: string }) => p.id))
  return products.filter((p) => ids.has(p.id) && p.image_urls.length > 0 && p.categories?.slug)
}

export const getDisponibles = () => (disponibles ??= leerDisponibles())

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select<typeof COLUMNAS, Product>(COLUMNAS)
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .order('sort_order')
    .order('id')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data ?? []
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select<typeof COLUMNAS, Product>(COLUMNAS)
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

/**
 * Promos activas y vigentes, por sort_order. Lanza si Supabase falla: un build sin promos por un error
 * dejaría en 404 los links de promo que ya circulan por WhatsApp (Netlify conserva el deploy anterior).
 */
export async function getActivePromos(): Promise<Promo[]> {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('is_active', true)

  if (error) throw new Error(`Failed to fetch promos: ${error.message}`)
  const promos = (data ?? []).map((promo: Promo) => {
    const fila = conFotosPropias(promo)
    return fila.banner_url && !fotoPropia(fila.banner_url) ? { ...fila, banner_url: null } : fila
  })
  return livePromos(promos, new Date())
}
