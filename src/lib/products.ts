import { supabase } from './supabase'
import type { Category, Product } from './types'

/* ── Categories ──────────────────────────────────────────── */

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`)
  return data ?? []
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
  return data ?? []
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
