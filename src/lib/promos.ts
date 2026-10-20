import { whatsappUrl } from './business'
import type { Promo } from './types'

export const SITE = 'https://serflowctg.netlify.app'

export type Photo = { src: string; alt: string }

/** Una promo lista para pintar: fotos ya optimizadas, la primera es la portada. */
export type PromoView = {
  slug: string
  title: string
  description: string | null
  /** ends_at (ISO). null = sin fecha de cierre. */
  endsAt: string | null
  cover?: Photo
  photos: Photo[]
}

/**
 * Promos que se publican: activas (ya filtradas en la consulta) y no vencidas en `now`, por sort_order.
 * El build filtra aunque RLS ya lo haga, por si la policy no se ha actualizado.
 * Tolera filas sin ends_at/sort_order (antes de correr supabase/03_promos_varias.sql).
 */
export function livePromos(rows: Promo[], now: Date): Promo[] {
  return rows
    .filter((p) => p.ends_at == null || new Date(p.ends_at) > now)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.created_at.localeCompare(b.created_at))
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
