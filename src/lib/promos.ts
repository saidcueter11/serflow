import type { FotoModal } from '../components/ui/PhotoModal'
import { whatsappUrl } from './business'
import type { Promo } from './types'
import { SITE_URL } from './site.mjs'

export const SITE = SITE_URL

/**
 * r = ancho / alto: el modal de foto reserva la forma mientras baja. banner: la portada es el banner_url (no una foto
 * de producto) y no entra a la galería del modal (PRI-535).
 */
export type Photo = { src: string; srcSet?: string; alt: string; r?: number; banner?: boolean }

/**
 * Ancho con que se pinta una foto que cubre su caja (object-cover), para el `sizes` (PRI-555): si la foto es más ancha que
 * la caja, se pinta con el ancho del recorte, no con el de la caja; pedirla al de la caja la dejaría blanda.
 * ancho: el de la caja en CSS ("100vw - 32px"); r: ancho / alto de la foto; caja: ancho / alto de la caja.
 */
export function anchoCubre(ancho: string, r: number | undefined, caja: number): string {
  const k = r && r > caja ? Math.ceil((r / caja) * 100) / 100 : 1
  return k === 1 ? `calc(${ancho})` : `calc((${ancho}) * ${k})`
}

/** Una promo lista para pintar: fotos ya optimizadas, la primera es la portada. */
export type PromoView = {
  slug: string
  title: string
  description: string | null
  /** ends_at (ISO). null = sin fecha de cierre. */
  endsAt: string | null
  /** "Disponible martes, miércoles y jueves" (diasPromo). null = todos los días, sin etiqueta. */
  dias: string | null
  cover?: Photo
  photos: Photo[]
}

/**
 * Promos que se publican: activas (ya filtradas en la consulta) y no vencidas en `now`, por sort_order. Los días de la
 * semana no las ocultan (PRI-538): solo se muestran con diasPromo.
 * El build filtra aunque RLS ya lo haga, por si la policy no se ha actualizado.
 * Tolera filas sin ends_at/sort_order (antes de correr supabase/migrations/20261010013709_promos_varias.sql).
 */
export function livePromos(rows: Promo[], now: Date): Promo[] {
  return rows
    .filter((p) => p.ends_at == null || new Date(p.ends_at) > now)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.created_at.localeCompare(b.created_at))
}

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const Y = new Intl.ListFormat('es-CO', { type: 'conjunction' })

/**
 * Los días de la promo como etiqueta (PRI-538): "Disponible martes, miércoles y jueves", "Disponible de lunes a viernes",
 * "Disponible fines de semana", "Disponible los sábados". Un tramo seguido de 4 días o más va como rango (Said escribió
 * "martes, miércoles y jueves" sueltos). Todos o ninguno: null, sin etiqueta. Días ISO, 1 = lunes ... 7 = domingo.
 */
export function diasPromo(weekdays: readonly number[] | null | undefined): string | null {
  const d = [...new Set(weekdays ?? [])].filter((n) => n >= 1 && n <= 7).sort((a, b) => a - b)
  if (d.length === 0 || d.length === 7) return null
  if (d.join() === '6,7') return 'Disponible fines de semana'
  if (d.length === 1) return `Disponible los ${DIAS[d[0] - 1]}${d[0] >= 6 ? 's' : ''}`
  const partes: string[] = []
  for (let i = 0, j = 0; i < d.length; i = ++j) {
    while (d[j + 1] === d[j] + 1) j++
    if (j - i >= 3) partes.push(`de ${DIAS[d[i] - 1]} a ${DIAS[d[j] - 1]}`)
    else partes.push(...d.slice(i, j + 1).map((n) => DIAS[n - 1]))
  }
  return `Disponible ${Y.format(partes)}`
}

/** Fotos de la promo en orden: el banner (si hay) y luego las demás. */
export function promoPhotoUrls(p: Pick<Promo, 'banner_url' | 'image_urls'>): string[] {
  return [p.banner_url, ...p.image_urls].filter((u): u is string => !!u)
}

// El sitio es estático: la fecha se escribe en el build, en hora de Cartagena.
const FECHA = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' })
const FECHA_CORTA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })

/** "Válida hasta el domingo 11 de octubre". Sin fecha, null (no se muestra nada). */
export function validaHasta(endsAt: string | null): string | null {
  return endsAt ? `Válida hasta el ${FECHA.format(new Date(endsAt)).replace(',', '')}` : null
}

/** "Hasta el 11 de oct" para PromoCard. */
export function hastaCorto(endsAt: string | null): string | null {
  return endsAt ? `Hasta el ${FECHA_CORTA.format(new Date(endsAt))}` : null
}

/** El mensaje de WhatsApp ya dice qué promo vio el cliente. */
export function promoMensaje(promo: Pick<PromoView, 'title' | 'slug'>): string {
  return `¡Hola! Me interesa la promo "${promo.title}". ${SITE}/promos/${promo.slug}`
}

export function promoWhatsapp(promo: Pick<PromoView, 'title' | 'slug'>): string {
  return whatsappUrl(promoMensaje(promo))
}

/**
 * Lo que el modal de foto (PhotoModal, PRI-523) muestra de una promo: sus fotos de producto (sin el banner, PRI-535), el
 * título, la descripción y su WhatsApp. Las promos no tienen precio. Sin fotos de producto, undefined: no hay modal.
 */
export function promoModal(promo: PromoView): FotoModal | undefined {
  const fotos = promo.cover?.banner ? promo.photos : [promo.cover, ...promo.photos].filter((f): f is Photo => !!f)
  if (!fotos.length) return undefined
  return {
    titulo: promo.title,
    categoria: 'Promo',
    alt: promo.title,
    pedir: promoWhatsapp(promo),
    fotos: fotos.map(({ src, r }) => ({ src, r })),
    descripcion: promo.description,
  }
}
