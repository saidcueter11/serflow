import { describe, expect, it, vi } from 'vitest'

const tables: Record<string, unknown[]> = {
  categories: [
    { id: 'c1', slug: 'moda' },
    { id: 'c2', slug: 'kids' },
  ],
  products: [{ category_id: 'c1' }, { category_id: 'c1' }],
}

// Chainable stand-in for the supabase query builder; resolves with the table rows.
vi.mock('./supabase', () => ({
  supabase: {
    from: (table: string) => {
      const result = { data: tables[table], error: null }
      const q: Record<string, unknown> = {
        then: (resolve: (r: typeof result) => unknown) => resolve(result),
      }
      for (const m of ['select', 'eq', 'order']) q[m] = () => q
      return q
    },
  },
}))

const { getCategoriesWithCounts } = await import('./products')

describe('getCategoriesWithCounts', () => {
  it('counts active products per category, zero when none', async () => {
    const result = await getCategoriesWithCounts()
    expect(result.map((c) => [c.slug, c.product_count])).toEqual([
      ['moda', 2],
      ['kids', 0],
    ])
  })
})
