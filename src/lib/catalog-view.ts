import { getImage, inferRemoteSize } from 'astro:assets'
import type { BannerSlide } from '../components/ui/CategoryBanner'
import type { CategoryLink } from '../components/ui/CategoryNav'
import type { MasonryTile } from '../components/ui/Masonry'
import { TODO_HREF, fotoAlt, fotoHref, fotoTitulo, interleave, newestFirst, pageHref, pages, pedirUrl } from './catalog'
import { getCategories, getProducts } from './products'
import type { Product } from './types'
// Portada de "Todo" en el banner: foto de Unsplash (gorras en un estante, horizontal: aguanta el recorte ancho del
// banner) hasta que lleguen las reales (PRI-150).
import todoCover from '../assets/images/stock/gorras-estante.jpg'

/** Una foto del catálogo lista para pintar: la del muro (con los datos del modal) y la imagen para WhatsApp (og). */
export type CatalogItem = {
  slug: string
  n: number | null
  createdAt: string
  tile: MasonryTile
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

async function toItem(p: Product, cat: { slug: string; label: string }): Promise<CatalogItem> {
  const n = p.legacy_id
  const alt = fotoAlt(cat.label, n)
  const href = fotoHref(cat.slug, p.slug)
  // Una sola consulta de tamaño por foto: muro, modal y og la reusan.
  const sizes = await Promise.all(p.image_urls.map((src) => inferRemoteSize(src)))
  const first = { src: p.image_urls[0], width: sizes[0].width, height: sizes[0].height }
  const [thumb, fotos, og] = await Promise.all([
    getImage({ ...first, widths: [320, 640], ...opt }),
    Promise.all(
      p.image_urls.map(async (src, i) => {
        const img = await getImage({ src, width: sizes[i].width, height: sizes[i].height, widths: [600, 1200], ...opt })
        return { src: img.src, srcSet: img.srcSet.attribute, r: +(sizes[i].width / sizes[i].height).toFixed(3) }
      }),
    ),
    getImage({ ...first, width: 1200, height: Math.round((1200 * first.height) / first.width), format: 'jpg' }),
  ])
  return {
    slug: p.slug,
    n,
    createdAt: p.created_at,
    og: og.src,
    tile: {
      href,
      id: `f-${p.slug}`,
      img: { src: thumb.src, srcSet: thumb.srcSet.attribute, alt },
      label: cat.label,
      photos: p.image_urls.length,
      modal: { titulo: fotoTitulo(cat.label, n), categoria: cat.label, alt, pedir: pedirUrl(cat.label, n, href), fotos, descripcion: p.description },
    },
  }
}

async function build() {
  const now = new Date()
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const groups: CatalogGroup[] = await Promise.all(
    categories.map(async (c) => {
      const own = products.filter((p) => p.categories?.slug === c.slug && p.image_urls.length > 0)
      const items = newestFirst(await Promise.all(own.map((p) => toItem(p, c))))
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

/** Lo que pinta una página del muro (CatalogView.astro). */
export type CatalogPageProps = {
  index: number
  slides: BannerSlide[]
  chips: CategoryLink[]
  view: { label: string; href: string }
  page: number
  /** URL de esta página: la barra vuelve a ella al cerrar el modal. */
  base: string
  tiles: MasonryTile[]
  next?: { href: string; count: number }
}

async function buildPages() {
  const { groups, todo } = await loadCatalog()
  const cover = await getImage({ src: todoCover, widths: [640, 960, 1280], ...opt })
  const views = [
    { slug: '', label: 'Todo', href: TODO_HREF, cover: { src: cover.src, srcSet: cover.srcSet.attribute }, items: todo },
    ...groups,
  ]
  const slides = views.map((v) => ({ label: v.label, image: v.cover }))
  const chips = views.map((v) => ({ label: v.label, href: v.href, count: v.items.length }))
  return views.flatMap((v, index) => {
    const blocks = pages(v.items)
    return blocks.map((items, i) => ({
      slug: v.slug,
      items,
      props: {
        index,
        slides,
        chips,
        view: { label: v.label, href: v.href },
        page: i + 1,
        base: pageHref(v.href, i + 1),
        tiles: items.map((it) => it.tile),
        next: blocks[i + 1] ? { href: pageHref(v.href, i + 2), count: blocks[i + 1].length } : undefined,
      } satisfies CatalogPageProps,
    }))
  })
}

let pagesCache: ReturnType<typeof buildPages> | undefined

/** Todas las páginas del muro: "Todo" y cada categoría, en bloques de 60 (/pagina/2...). */
export const loadPages = () => (pagesCache ??= buildPages())
