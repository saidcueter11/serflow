import { precioCop } from './catalog'
import { SITE_URL } from './site.mjs'

// PRI-525: piezas del SEO que comparten las páginas: imagen al compartir y JSON-LD. Pasan siempre por jsonLd() al pintarse.

/** URL absoluta en el dominio del sitio. */
export const absoluta = (path: string) => new URL(path, `${SITE_URL}/`).href

/** Imagen al compartir por defecto (#2): la marca en negro y dorado, sin fotos de terceros (public/og-serflow.jpg). */
export const OG_MARCA = {
  src: '/og-serflow.jpg',
  width: 1200,
  height: 630,
  alt: 'Serflow: camisetas y gorras personalizadas en Cartagena',
}

export type Miga = { name: string; url: string }

/** Migas de pan (#5): Inicio > Catálogo > categoría > foto. */
export function breadcrumbSchema(migas: Miga[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, item: m.url })),
  }
}

/**
 * Oferta del producto (#4): pesos colombianos, el precio si el admin lo puso y si hay para llevar, nunca cuántos.
 * Sin stock no es OutOfStock: Serflow la hace a pedido (MadeToOrder).
 * La url es la del canonical, con su "/" final.
 */
export function offerSchema({ url, price, disponible }: { url: string; price: number | null; disponible: boolean | null }) {
  return {
    '@type': 'Offer',
    url,
    priceCurrency: 'COP',
    ...(price != null && price > 0 && { price }),
    ...(disponible != null && { availability: `https://schema.org/${disponible ? 'InStock' : 'MadeToOrder'}` }),
    seller: { '@type': 'Organization', name: 'Serflow' },
  }
}

/**
 * Vigencia de una promo (#9, PRI-532). No hay fecha de inicio: vale desde que se creó hasta ends_at (sin ends_at, sin fin).
 * Con días de la semana (PRI-524) la página solo existe el día que sale (el rebuild diario de las 00:05 la quita y la
 * pone), así que vale hoy, de 00:00 a 23:59:59 en Cartagena (UTC-5, sin horario de verano), sin pasar de ends_at.
 */
export function vigenciaPromo(
  { created_at, ends_at, weekdays }: { created_at: string; ends_at: string | null; weekdays?: number[] | null },
  now: Date,
): { validFrom: string; validThrough?: string } {
  const creada = new Date(created_at).getTime()
  const fin = ends_at ? new Date(ends_at).getTime() : Infinity
  if (!weekdays?.length) return { validFrom: new Date(creada).toISOString(), ...(ends_at && { validThrough: new Date(fin).toISOString() }) }
  const cinco = 5 * 3600e3
  const hoy = Math.floor((now.getTime() - cinco) / 86400e3) * 86400e3 + cinco
  return { validFrom: new Date(Math.max(hoy, creada)).toISOString(), validThrough: new Date(Math.min(hoy + 86400e3 - 1000, fin)).toISOString() }
}

/** La promo como Offer (#9): Google no acepta promociones marcadas como Event. La url es la del canonical. */
export function promoOfferSchema(p: { url: string; name: string; description: string | null; image?: string; validFrom: string; validThrough?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: p.name,
    ...(p.description?.trim() && { description: p.description.trim() }),
    url: p.url,
    ...(p.image && { image: p.image }),
    validFrom: p.validFrom,
    ...(p.validThrough && { validThrough: p.validThrough }),
    seller: { '@type': 'Organization', name: 'Serflow', url: absoluta('/') },
  }
}

/** Coordenadas del pin del mapa (#7): el embed de Google las lleva como !2d<longitud>!3d<latitud>. */
export function geoDelMapa(embedUrl: string) {
  const m = embedUrl.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/)
  return m ? { '@type': 'GeoCoordinates', latitude: Number(m[2]), longitude: Number(m[1]) } : undefined
}

/** priceRange de la tienda (#7) con los precios publicados: "$25.000 - $60.000". Sin ninguno, no se dice. */
export function rangoDePrecios(precios: (number | null)[]): string | undefined {
  const v = precios.filter((p): p is number => p != null && p > 0)
  if (!v.length) return undefined
  const [min, max] = [Math.min(...v), Math.max(...v)]
  return min === max ? precioCop(min)! : `${precioCop(min)} - ${precioCop(max)}`
}
