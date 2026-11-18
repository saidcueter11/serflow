import { getImage, inferRemoteSize } from 'astro:assets'
import type { BannerSlide } from '../components/ui/CategoryBanner'
import type { CategoryLink } from '../components/ui/CategoryNav'
import type { MasonryTile } from '../components/ui/Masonry'
import type { FotoModal } from '../components/ui/PhotoModal'
import { TODO_HREF, fotoAlt, fotoHref, fotoTitulo, fotoZoom, interleave, newestFirst, pageHref, pages, pedirUrl, precioCop } from './catalog'
import { fotoDeLugar } from './medios-build'
import { getCategories, getEnStock, getProducts } from './products'
import type { Product } from './types'
// Portada de "Todo" en el banner: la que publique el admin (lugar catalogo-todo, PRI-150) o esta foto de Unsplash
// (gorras en un estante, horizontal: aguanta el recorte ancho del banner).
import todoCover from '../assets/images/stock/gorras-estante.jpg'

/** Una foto del catálogo lista para pintar: la del muro, los datos de su ficha y la imagen para WhatsApp (og). */
export type CatalogItem = {
  slug: string
  n: number | null
  createdAt: string
  tile: MasonryTile
  /** Lo que muestra su ficha (PRI-529): nombre, fotos, precio, colores, descripción y Pedir por WhatsApp. */
  ficha: FotoModal
  og: string | null
  /** Para el JSON-LD (PRI-525): precio del admin y si hay para llevar (null: no se sabe, va sin disponibilidad). */
  price: number | null
  disponible: boolean | null
  /** Versión grande de cada foto para la lupa y el visor de la ficha (fotoZoom, PRI-529); null usa la normal. */
  zoom: (string | null)[]
}

export type CatalogGroup = {
  slug: string
  label: string
  href: string
  cover?: { src: string; srcSet?: string }
  /** Portada de la categoría en JPEG para compartir (og:image, PRI-525). Sin portada del admin, la de la marca. */
  og?: string
  /** Lo que el cliente escribió en el admin (PRI-532), sin espacios sobrantes; vacío = undefined. */
  intro?: string
  seoTitle?: string
  items: CatalogItem[]
}

const opt = { format: 'webp', quality: 72 } as const

async function toItem(p: Product, cat: { slug: string; label: string }, enStock: Set<string> | null): Promise<CatalogItem> {
  const n = p.legacy_id
  const alt = fotoAlt(cat.label, n, p.name)
  const href = fotoHref(cat.slug, p.slug)
  // Una sola consulta de tamaño por foto: muro, ficha y og la reusan.
  const sizes = await Promise.all(p.image_urls.map((src) => inferRemoteSize(src)))
  const first = { src: p.image_urls[0], width: sizes[0].width, height: sizes[0].height }
  const [thumb, fotos, og, zoom] = await Promise.all([
    getImage({ ...first, widths: [320, 640], ...opt }),
    Promise.all(
      p.image_urls.map(async (src, i) => {
        const img = await getImage({ src, width: sizes[i].width, height: sizes[i].height, widths: [600, 1200], ...opt })
        return { src: img.src, srcSet: img.srcSet.attribute, r: +(sizes[i].width / sizes[i].height).toFixed(3) }
      }),
    ),
    getImage({ ...first, width: 1200, height: Math.round((1200 * first.height) / first.width), format: 'jpg' }),
    Promise.all(p.image_urls.map(fotoZoom)),
  ])
  return {
    slug: p.slug,
    n,
    createdAt: p.created_at,
    og: og.src,
    price: p.price,
    disponible: enStock && enStock.has(p.id),
    zoom,
    tile: {
      href,
      id: `f-${p.slug}`,
      img: { src: thumb.src, srcSet: thumb.srcSet.attribute, alt },
      label: cat.label,
      photos: p.image_urls.length,
    },
    // PRI-433: lo que el admin le puso a la prenda. Sin nombre, el de la foto ("Beisbol N.º 26").
    ficha: {
      titulo: p.name?.trim() || fotoTitulo(cat.label, n),
      categoria: cat.label,
      alt,
      pedir: pedirUrl(cat.label, n, href),
      fotos,
      descripcion: p.description?.trim() || null,
      precio: precioCop(p.price),
      ...(p.colors?.length && { colores: p.colors }),
    },
  }
}

async function build() {
  const now = new Date()
  const [categories, products, enStock] = await Promise.all([getCategories(), getProducts(), getEnStock()])
  const groups: CatalogGroup[] = await Promise.all(
    categories.map(async (c) => {
      const own = products.filter((p) => p.categories?.slug === c.slug && p.image_urls.length > 0)
      const items = newestFirst(await Promise.all(own.map((p) => toItem(p, c, enStock))))
      const [cover, og] = c.image_url
        ? await Promise.all([
            getImage({ src: c.image_url, inferSize: true, widths: [640, 960, 1280], ...opt }),
            getImage({ src: c.image_url, inferSize: true, width: 1200, format: 'jpg' }),
          ])
        : [null, null]
      return {
        slug: c.slug,
        label: c.label,
        href: `${TODO_HREF}/${c.slug}`,
        cover: cover ? { src: cover.src, srcSet: cover.srcSet.attribute } : undefined,
        og: og?.src,
        intro: c.intro?.trim() || undefined,
        seoTitle: c.seo_title?.trim() || undefined,
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
  /** intro y seoTitle (PRI-532): solo las categorías que los tengan. */
  view: { label: string; href: string; intro?: string; seoTitle?: string }
  /** og:image de la página (PRI-525): la portada de la categoría. */
  og?: string
  page: number
  tiles: MasonryTile[]
  next?: { href: string; count: number }
}

async function portadaDelRepo() {
  const img = await getImage({ src: todoCover, widths: [640, 960, 1280], ...opt })
  return { src: img.src, srcSet: img.srcSet.attribute }
}

async function buildPages() {
  const { groups, todo } = await loadCatalog()
  const cover = (await fotoDeLugar('catalogo-todo', { width: 1280, widths: [640, 960, 1280], quality: opt.quality })) ?? (await portadaDelRepo())
  const views = [
    { slug: '', label: 'Todo', href: TODO_HREF, cover: { src: cover.src, srcSet: cover.srcSet }, items: todo },
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
        view: { label: v.label, href: v.href, intro: 'intro' in v ? v.intro : undefined, seoTitle: 'seoTitle' in v ? v.seoTitle : undefined },
        og: 'og' in v ? v.og : undefined,
        page: i + 1,
        tiles: items.map((it) => it.tile),
        next: blocks[i + 1] ? { href: pageHref(v.href, i + 2), count: blocks[i + 1].length } : undefined,
      } satisfies CatalogPageProps,
    }))
  })
}

let pagesCache: ReturnType<typeof buildPages> | undefined

/** Todas las páginas del muro: "Todo" y cada categoría, en bloques de 60 (/pagina/2...). */
export const loadPages = () => (pagesCache ??= buildPages())
