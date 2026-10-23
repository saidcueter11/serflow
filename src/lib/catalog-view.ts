import { getImage, inferRemoteSize } from 'astro:assets'
import type { CarouselPhoto } from '../components/ui/PhotoCarousel'
import type { MasonryTile } from '../components/ui/Masonry'
import { fotoAlt, hace, interleave, isNuevo, newestFirst } from './catalog'
import { getCategories, getProducts } from './products'
import type { Product } from './types'

/** Una foto del catálogo lista para pintar: miniatura del muro, fotos del visor y la imagen para WhatsApp (og). */
export type CatalogItem = {
  slug: string
  n: number | null
  createdAt: string
  hace: string
  tile: MasonryTile
  photos: CarouselPhoto[]
  og: string | null
}

export type CatalogGroup = {
  slug: string
  label: string
  href: string
  cover?: { src: string; srcSet?: string }
  items: CatalogItem[]
}

const opt = { format: 'webp', quality: 72 } as const

async function toItem(p: Product, cat: { slug: string; label: string }, now: Date): Promise<CatalogItem> {
  const n = p.legacy_id
  const alt = fotoAlt(cat.label, n)
  const urls = p.image_urls
  const href = `/products/${cat.slug}/${p.slug}`
  const first = urls[0]
  const size = first ? await inferRemoteSize(first) : null
  const [thumb, photos, og] = await Promise.all([
    first ? getImage({ src: first, width: size!.width, height: size!.height, widths: [320, 640], ...opt }) : null,
    Promise.all(
      urls.map(async (src, i) => {
        const img = await getImage({ src, inferSize: true, widths: [600, 1200], ...opt })
        return { src: img.src, srcSet: img.srcSet.attribute, alt: i === 0 ? alt : `${alt}, foto ${i + 1} de ${urls.length}` }
      }),
    ),
    first ? getImage({ src: first, inferSize: true, width: 1200, format: 'jpg' }) : null,
  ])
  const nuevo = isNuevo(p.created_at, now)
  return {
    slug: p.slug,
    n,
    createdAt: p.created_at,
    hace: hace(p.created_at, now),
    photos,
    og: og?.src ?? null,
    tile: {
      href,
      id: `f-${p.slug}`,
      img: { src: thumb?.src ?? '', srcSet: thumb?.srcSet.attribute, alt, ratio: size ? size.width / size.height : 3 / 4 },
      label: cat.label,
      nuevo,
      photos: urls.length,
    },
  }
}

async function build() {
  const now = new Date()
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const groups: CatalogGroup[] = await Promise.all(
    categories.map(async (c) => {
      const own = products.filter((p) => p.categories?.slug === c.slug && p.image_urls.length > 0)
      const items = newestFirst(await Promise.all(own.map((p) => toItem(p, c, now))))
      const cover = c.image_url ? await getImage({ src: c.image_url, inferSize: true, widths: [640, 960, 1280], ...opt }) : null
      return {
        slug: c.slug,
        label: c.label,
        href: `/products/${c.slug}`,
        cover: cover ? { src: cover.src, srcSet: cover.srcSet.attribute } : undefined,
        items,
      }
    }),
  )
  return { groups, todo: interleave(groups.map((g) => g.items), now) }
}

let cache: ReturnType<typeof build> | undefined

/**
 * Categorías activas (sort_order) con sus fotos, lo más nuevo primero, y "Todo" intercalado. Las páginas del
 * catálogo lo piden en cada getStaticPaths: se arma una vez por build. Productos sin foto no salen (no hay qué mostrar).
 */
export const loadCatalog = () => (cache ??= build())
