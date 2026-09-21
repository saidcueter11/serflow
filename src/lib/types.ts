export interface Category {
  id: string
  slug: string
  label: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  legacy_id: number | null
  slug: string
  name: string
  description: string | null
  category_id: string
  image_urls: string[]
  price: number | null
  stock: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  /** Joined from categories table */
  categories?: {
    slug: string
    label: string
  }
}

export interface Promo {
  id: string
  slug: string
  title: string
  banner_url: string | null
  image_urls: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}
