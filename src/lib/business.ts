// Datos del negocio en un solo lugar. Los componentes del design system los leen de aquí;
// los .astro viejos todavía repiten el número a mano (deuda documentada en los canvases).
//
// PRI-413: el cliente los edita desde el admin (tabla site_settings). astro.config.mjs lee y valida la fila al arrancar
// el build y la inyecta en __SITE_BUSINESS__; este archivo funciona igual en el servidor, en la isla del personalizador
// y en los canvases, donde no existe. Cada valor de abajo es el respaldo si el dato está vacío o es inválido.

import type { BusinessOverrides } from './business-overrides.mjs'

declare const __SITE_BUSINESS__: BusinessOverrides | undefined
const override: BusinessOverrides = typeof __SITE_BUSINESS__ === 'undefined' ? {} : __SITE_BUSINESS__

export const WHATSAPP_NUMBER = override.whatsappNumber ?? '573156481243'
export const WHATSAPP_DISPLAY = `+57 ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5, 8)} ${WHATSAPP_NUMBER.slice(8)}`
export const WHATSAPP_DEFAULT_TEXT = 'Hola! Quiero más información'
export const EMAIL = override.email ?? 'distribuidoraelmayorista@hotmail.com'
export const CITY = 'Cartagena, Colombia'

// Confirmada con el cliente (PRI-121). La UI muestra "Dirección por confirmar" si vuelve a null.
export const ADDRESS: string | null = override.address ?? 'Mercado Bazurto, C.C. Bazurtico, local 31'
export const POSTAL_CODE = '130001'

// "Cómo llegar": búsqueda en Google Maps por nombre + dirección.
export const DIRECTIONS_URL =
  override.directionsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Serflow, Centro Comercial Bazurtico local 31, Mercado Bazurto, Cartagena',
  )}`

// Una red que el cliente quitó (instagram_visible = false, etc.) no sale en ningún lado. Pueden quedar de 0 a 3.
export const SOCIAL = (
  [
    {
      name: 'Instagram',
      handle: override.instagramHandle ?? '@serflow_serflow',
      url: override.instagramUrl ?? 'https://www.instagram.com/serflow_serflow/',
      hidden: override.instagramHidden,
    },
    { name: 'TikTok', handle: override.tiktokHandle ?? '@serflow4', url: override.tiktokUrl ?? 'https://www.tiktok.com/@serflow4', hidden: override.tiktokHidden },
    {
      name: 'Facebook',
      handle: override.facebookHandle ?? 'Serflow',
      url: override.facebookUrl ?? 'https://www.facebook.com/people/Serflow/100054522471881/',
      hidden: override.facebookHidden,
    },
  ] as const
).filter((s) => !s.hidden)

const DEFAULT_HOURS = [
  { days: 'Lunes a sábado', short: 'Lun a sáb', time: '8 a.m. – 6 p.m.' },
  { days: 'Domingo y festivos', short: 'Dom y festivos', time: '8 a.m. – 2 p.m.' },
]
const hoursKey = (hours: readonly { days: string; time: string }[]) => JSON.stringify(hours.map((h) => [h.days, h.time]))

export const HOURS: readonly { days: string; short: string; time: string }[] = override.hours ?? DEFAULT_HOURS
/** Los horarios editados son texto libre: el JSON-LD no puede sacar de ahí horas exactas. Los sembrados son los de siempre. */
export const HOURS_EDITED = hoursKey(HOURS) !== hoursKey(DEFAULT_HOURS)

// Mismo embed que usa src/pages/index.astro (sección "Encuéntranos").
export const MAP_EMBED_URL =
  override.mapEmbedUrl ??
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.1040576904143!2d-75.5238772!3d10.4133097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62592f68c041b%3A0x3b6e98a99be2e1de!2sSerflow!5e0!3m2!1ses-419!2sco!4v1747794709936!5m2!1ses-419!2sco'

export function whatsappUrl(text: string = WHATSAPP_DEFAULT_TEXT): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

// Para valores estáticos (p. ej. variantes de defineAsset) donde no se puede llamar a whatsappUrl().
export const WHATSAPP_URL = whatsappUrl()

/** JSON-LD listo para set:html: con datos del admin, un "</script>" no puede cerrar la etiqueta. */
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/[<>&\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)
}
