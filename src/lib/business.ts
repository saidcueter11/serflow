// Datos del negocio en un solo lugar. Los componentes del design system los leen de aquí;
// los .astro viejos todavía repiten el número a mano (deuda documentada en los canvases).

export const WHATSAPP_NUMBER = '573156481243'
export const WHATSAPP_DISPLAY = '+57 315 648 1243'
export const WHATSAPP_DEFAULT_TEXT = 'Hola! Quiero más información'
export const EMAIL = 'distribuidoraelmayorista@hotmail.com'
export const CITY = 'Cartagena, Colombia'

// Confirmada con el cliente (PRI-121). La UI muestra "Dirección por confirmar" si vuelve a null.
export const ADDRESS: string | null = 'Mercado Bazurto, C.C. Bazurtico, local 31'
export const POSTAL_CODE = '130001'

// "Cómo llegar": búsqueda en Google Maps por nombre + dirección.
export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Serflow, Centro Comercial Bazurtico local 31, Mercado Bazurto, Cartagena',
)}`

export const SOCIAL = [
  { name: 'Instagram', handle: '@serflow_serflow', url: 'https://www.instagram.com/serflow_serflow/' },
  { name: 'TikTok', handle: '@serflow4', url: 'https://www.tiktok.com/@serflow4' },
  { name: 'Facebook', handle: 'Serflow', url: 'https://www.facebook.com/people/Serflow/100054522471881/' },
] as const

export const HOURS = [
  { days: 'Lunes a sábado', short: 'Lun a sáb', time: '8 a.m. – 6 p.m.' },
  { days: 'Domingo y festivos', short: 'Dom y festivos', time: '8 a.m. – 2 p.m.' },
] as const

// Mismo embed que usa src/pages/index.astro (sección "Encuéntranos").
export const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.1040576904143!2d-75.5238772!3d10.4133097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62592f68c041b%3A0x3b6e98a99be2e1de!2sSerflow!5e0!3m2!1ses-419!2sco!4v1747794709936!5m2!1ses-419!2sco'

export function whatsappUrl(text: string = WHATSAPP_DEFAULT_TEXT): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

// Para valores estáticos (p. ej. variantes de defineAsset) donde no se puede llamar a whatsappUrl().
export const WHATSAPP_URL = whatsappUrl()
