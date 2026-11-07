import { esUrlPermitida } from './fotos-host.mjs'
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

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

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
      .order('sort_order'),
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

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug, label)')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return (data ?? []).map(conFotosPropias)
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug, label)')
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch products: ${error.message}`)
  return data ?? []
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug, label)')
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
