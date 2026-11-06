// Fotos y colores que el cliente administra desde serflow-admin (PRI-150, PRI-122), leídos al hacer el build.
// Nada de lo que venga de la base puede tumbar el build: lo que no sirve se avisa en el log y se usa la foto del repo.
import sharp from 'sharp'
import { supabase } from './supabase'
import type { FilaColor } from './personaliza/base'

/** Lugares de la página (check site_media_slot_known en la migración). */
export type Lugar = 'personalizador' | 'catalogo-todo'

export interface SiteMedia {
  slot: Lugar
  image_url: string
  alt: string
}

/** bytes y tipos son los del bucket site-media: lo que Storage rechaza, aquí tampoco pasa si viene de otro lado. */
export const LIMITES = {
  bytes: 5 * 1024 * 1024,
  pixeles: 40_000_000,
  tipos: ['image/jpeg', 'image/png', 'image/webp'],
}

/** Los mismos hosts que image.remotePatterns de astro.config.mjs: Astro no optimiza los demás. */
export function esUrlPermitida(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.supabase.co')
  } catch {
    return false
  }
}

async function medir(url: string): Promise<{ width: number; height: number } | null> {
  const descartar = (motivo: string) => {
    console.warn(`[medios] ${url}: ${motivo}. Se usa el respaldo.`)
    return null
  }
  if (!esUrlPermitida(url)) return descartar('host no permitido')
  try {
    const res = await fetch(url)
    if (!res.ok) return descartar(`HTTP ${res.status}`)
    const tipo = res.headers.get('content-type')?.split(';')[0] ?? ''
    if (!LIMITES.tipos.includes(tipo)) return descartar(`tipo ${tipo}`)
    if (Number(res.headers.get('content-length')) > LIMITES.bytes) return descartar('pesa más de 5 MB')
    const datos = Buffer.from(await res.arrayBuffer())
    if (datos.length > LIMITES.bytes) return descartar('pesa más de 5 MB')
    const img = sharp(datos, { failOn: 'error', limitInputPixels: LIMITES.pixeles })
    const { width, height, orientation = 1 } = await img.metadata()
    // Decodifica de verdad: una foto cortada a la mitad pasa la lectura del encabezado y saldría medio gris.
    await img.stats()
    // Astro aplica la rotación EXIF (fotos de celular): las medidas que importan son las de la foto ya girada.
    return orientation >= 5 ? { width: height, height: width } : { width, height }
  } catch (e) {
    return descartar(e instanceof Error ? e.message.split('\n')[0] : String(e))
  }
}

const medidas = new Map<string, ReturnType<typeof medir>>()

/** Las medidas de una foto remota lista para optimizar, o null si no sirve (una consulta por URL en cada build). */
export function leerFotoRemota(url: string) {
  if (!medidas.has(url)) medidas.set(url, medir(url))
  return medidas.get(url)!
}

/**
 * Tabla que todavía no existe: el build de un deploy preview o el que corre mientras se aplica la migración. Cuenta
 * como vacía. Cualquier otro error sí tumba el build, como en products.ts: mejor conservar lo publicado que volver a
 * las fotos del repo por una falla pasajera de la base.
 */
function filas<T>(tabla: string, { data, error }: { data: T[] | null; error: { code: string; message: string } | null }): T[] {
  if (error?.code === 'PGRST205' || error?.code === '42P01') return []
  if (error) throw new Error(`Failed to fetch ${tabla}: ${error.message}`)
  return data ?? []
}

let lugares: Promise<Map<Lugar, SiteMedia>> | undefined

async function leerLugares() {
  const res = await supabase.from('site_media').select('slot, image_url, alt').eq('is_active', true)
  return new Map(filas<SiteMedia>('site_media', res).map((m) => [m.slot, m]))
}

/** Los lugares publicados (se consulta una vez por build). */
export const getSiteMedia = () => (lugares ??= leerLugares())

/** Colores activos con sus fotos, en orden. */
export async function getGarmentColors(): Promise<FilaColor[]> {
  const res = await supabase
    .from('garment_colors')
    .select('id, garment, name, hex, garment_photos(view, image_url, print_area, print_width_cm)')
    .eq('is_active', true)
    .order('sort_order')
  return filas<FilaColor>('garment_colors', res as never)
}
