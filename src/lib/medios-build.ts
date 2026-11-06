// La parte de medios.ts que necesita a Astro: las fotos de la base pasan por la misma optimización que las del repo.
import { getImage } from 'astro:assets'
import { armarColores, vistasDe } from './personaliza/base'
import type { ColorPrenda, Prenda } from './personaliza/datos'
import { getGarmentColors, getSiteMedia, leerFotoRemota, type Lugar } from './medios'

export interface FotoOpciones {
  width: number
  /** Anchos del srcset. Los que la foto no alcanza se quedan por fuera: nunca se agranda. */
  widths?: number[]
  quality?: number
}

/**
 * Optimiza una foto de la base (WebP, en el mismo dominio) o devuelve null si no sirve: con null, usa la foto del repo.
 * Valida antes de pedirle la foto a Astro, porque Astro la procesa al final del build, donde un error ya no se puede
 * atrapar y tumba la publicación.
 */
export async function fotoRemota(url: string, { width, widths, quality = 72 }: FotoOpciones) {
  const medida = await leerFotoRemota(url)
  if (!medida) return null
  const w = Math.min(width, medida.width)
  const anchos = widths && [...widths.filter((a) => a < w), w]
  const img = await getImage({ src: url, width: w, height: Math.round((w * medida.height) / medida.width), widths: anchos, format: 'webp', quality })
  return { src: img.src, srcSet: anchos && img.srcSet.attribute }
}

/** La foto publicada de un lugar con su alt, o null si no hay o no sirve. */
export async function fotoDeLugar(slot: Lugar, opciones: FotoOpciones) {
  const fila = (await getSiteMedia()).get(slot)
  const foto = fila && (await fotoRemota(fila.image_url, opciones))
  return foto ? { ...foto, alt: fila.alt } : null
}

/** Colores de la base con sus fotos optimizadas. Prenda sin ningún color completo: lista vacía (usa la muestra). */
export async function coloresDeBase(opciones: FotoOpciones): Promise<Record<Prenda, ColorPrenda[]>> {
  const filas = await getGarmentColors()
  const urls = new Map<string, string>()
  // De a una: decodificar para validar pesa en memoria, y son pocas fotos.
  for (const { garment, garment_photos } of filas) {
    for (const { view, image_url } of garment_photos) {
      if (!vistasDe(garment).includes(view)) continue
      const foto = await fotoRemota(image_url, opciones)
      if (foto) urls.set(image_url, foto.src)
    }
  }
  return armarColores(filas, urls)
}
