// Datos del negocio en un solo lugar. Los componentes del design system los leen de aquí;
// los .astro viejos todavía repiten el número a mano (deuda documentada en los canvases).

export const WHATSAPP_NUMBER = '573156481243'
export const WHATSAPP_DISPLAY = '+57 315 648 1243'
export const WHATSAPP_DEFAULT_TEXT = 'Hola! Quiero más información'
export const EMAIL = 'distribuidoraelmayorista@hotmail.com'
export const CITY = 'Cartagena, Colombia'

// La dirección que muestra el sitio hoy ("Calle fictia #67-112") es de relleno.
// null hasta que el cliente la confirme; la UI muestra "Dirección por confirmar".
export const ADDRESS: string | null = null

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
