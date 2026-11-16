export interface Category {
  id: string
  slug: string
  label: string
  image_url: string | null
  /** PRI-532: <title> de su página en el catálogo; vacío = el nombre. Falta antes de su migración. */
  seo_title?: string | null
  /** PRI-532: 1-2 frases arriba de las fotos y en la meta description; vacío = no sale. Falta antes de su migración. */
  intro?: string | null
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
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  /** Colores disponibles (product_colors, PRI-455), en orden. Vacío: el producto no muestra colores. */
  colors?: ProductColor[]
  /** Joined from categories table */
  categories?: {
    slug: string
    label: string
  }
}

/** Un color en que viene un producto: nombre que se lee y muestra (#rrggbb). */
export interface ProductColor {
  name: string
  hex: string
}

export interface Promo {
  id: string
  slug: string
  title: string
  description: string | null
  banner_url: string | null
  image_urls: string[]
  is_active: boolean
  /** Fin de la promo; null = sin fecha de cierre. */
  ends_at: string | null
  /** Días en que sale (PRI-524): ISO, 1 = lunes ... 7 = domingo, en Cartagena. Vacío = todos. Falta antes de su migración. */
  weekdays?: number[] | null
  sort_order: number
  created_at: string
  updated_at: string
}
