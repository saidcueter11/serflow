// La parte de medios.ts que necesita a Astro: las fotos de la base pasan por la misma optimización que las del repo.
import { getImage } from 'astro:assets'
import { armarColores, recortarColores, vistasDe, type FotoOptimizada } from './personaliza/base'
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

/** Colores de la base con sus fotos optimizadas, en dos anchos. Prenda sin ningún color completo: lista vacía (usa la muestra). */
export async function coloresDeBase({ width, widthMovil, quality }: { width: number; widthMovil: number; quality?: number }): Promise<Record<Prenda, ColorPrenda[]>> {
  const filas = recortarColores(await getGarmentColors())
  const pendientes = filas.flatMap((c) => c.garment_photos.filter((f) => vistasDe(c.garment).includes(f.view)).map((f) => f.image_url))
  const urls = new Map<string, FotoOptimizada>()
  // De a 4: validar 38 fotos reales tarda 26 s de una en una y 10 s así, y decodificar pesa en memoria como para soltarlas todas.
  for (let i = 0; i < pendientes.length; i += 4) {
    await Promise.all(
      pendientes.slice(i, i + 4).map(async (url) => {
        // leerFotoRemota recuerda la medida: los dos anchos validan con una sola descarga.
        const [foto, movil] = await Promise.all([fotoRemota(url, { width, quality }), fotoRemota(url, { width: widthMovil, quality })])
        if (foto && movil) urls.set(url, { image_url: foto.src, image_url_movil: movil.src })
      }),
    )
  }
  return armarColores(filas, urls)
}
