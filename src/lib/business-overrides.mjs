// Lee y valida los datos del negocio de la tabla site_settings (PRI-413). Es .mjs porque también lo importa
// astro.config.mjs, que los inyecta en business.ts. Un dato vacío o inválido se omite: business.ts usa su respaldo.

const SOCIAL_HOSTS = {
  instagram: ['instagram.com', 'www.instagram.com'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'],
  facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com'],
}
const MAPS_HOSTS = ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl']
const READ_TIMEOUT_MS = 8000
const MAX_HOURS = 7

/** Texto recortado, o undefined si está vacío o pasa de max. El escape lo hace quien lo pinta (React). */
export function cleanText(value, max) {
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  return text && text.length <= max ? text : undefined
}

/** Celular colombiano con indicativo, solo dígitos: un número sin el 57 rompería todos los pedidos. */
export function cleanWhatsapp(value) {
  return typeof value === 'string' && /^573\d{9}$/.test(value) ? value : undefined
}

/** Sin ? ni &: el correo va en un mailto: y no debe poder agregarle parámetros. */
export function cleanEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value)
    ? value
    : undefined
}

/** URL https de uno de los dominios permitidos, sin usuario ni clave. Deja fuera javascript:, http: y dominios ajenos. */
export function cleanUrl(value, hosts) {
  if (typeof value !== 'string' || value.length > 2000) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && hosts.includes(url.hostname) ? value : undefined
  } catch {
    return undefined
  }
}

/** El mapa va en un iframe: solo el embed de Google. */
function cleanMapEmbed(value) {
  const url = cleanUrl(value, ['www.google.com'])
  return url && new URL(url).pathname.startsWith('/maps/embed') ? url : undefined
}

/** Horarios completos o nada: un horario a medias informa mal. */
function cleanHours(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_HOURS) return undefined
  const hours = value.map((h) => ({ days: cleanText(h?.days, 40), time: cleanText(h?.time, 40) }))
  return hours.every((h) => h.days && h.time) ? hours.map((h) => ({ days: h.days, short: h.days, time: h.time })) : undefined
}

/**
 * @typedef {{ days: string, short: string, time: string }} BusinessHours
 * @typedef {{ whatsappNumber?: string, email?: string, address?: string, directionsUrl?: string, mapEmbedUrl?: string,
 *   instagramUrl?: string, instagramHandle?: string, tiktokUrl?: string, tiktokHandle?: string, facebookUrl?: string,
 *   facebookHandle?: string, hours?: BusinessHours[] }} BusinessOverrides
 */

/** @returns {BusinessOverrides} */
export function parseBusinessOverrides(row) {
  const all = {
    whatsappNumber: cleanWhatsapp(row?.whatsapp_number),
    email: cleanEmail(row?.email),
    address: cleanText(row?.address, 120),
    directionsUrl: cleanUrl(row?.directions_url, MAPS_HOSTS),
    mapEmbedUrl: cleanMapEmbed(row?.map_embed_url),
    instagramUrl: cleanUrl(row?.instagram_url, SOCIAL_HOSTS.instagram),
    instagramHandle: cleanText(row?.instagram_handle, 40),
    tiktokUrl: cleanUrl(row?.tiktok_url, SOCIAL_HOSTS.tiktok),
    tiktokHandle: cleanText(row?.tiktok_handle, 40),
    facebookUrl: cleanUrl(row?.facebook_url, SOCIAL_HOSTS.facebook),
    facebookHandle: cleanText(row?.facebook_handle, 40),
    hours: cleanHours(row?.hours),
  }
  return Object.fromEntries(Object.entries(all).filter(([, v]) => v !== undefined))
}

/**
 * Tabla sin migrar o fila vacía: los valores del código. Otra falla de lectura lanza el error: en el build, tumbarlo
 * conserva lo publicado, como con products.ts; volver al respaldo publicaría un número de WhatsApp viejo.
 * @returns {Promise<BusinessOverrides>}
 */
export async function loadBusinessOverrides(supabaseUrl, anonKey) {
  if (!supabaseUrl || !anonKey) return {}
  const res = await fetch(`${supabaseUrl}/rest/v1/site_settings?id=eq.1&select=*`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  })
  const body = await res.json()
  if (res.ok) return parseBusinessOverrides(body[0])
  if (body?.code === 'PGRST205' || body?.code === '42P01') return {}
  throw new Error(`Failed to fetch site_settings: HTTP ${res.status}`)
}
