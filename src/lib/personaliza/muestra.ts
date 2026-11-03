/*
 * Colores y fotos de MUESTRA del personalizador, con la forma de garment_colors + garment_photos (spec 6.7).
 * Se borra cuando el sitio lea los datos reales de Supabase (PR 4, después de PRI-125 y del admin).
 *
 * FOTOS DE MUESTRA, NO DEL TALLER (por eso /personaliza está escondida hasta PRI-125):
 * - Camisetas: un recorte sin cara de src/assets/images/stock/amigos-gorras.jpg, teñido a cada color; la "espalda" es
 *   una zona de solo tela de la misma foto.
 * - Gorras: gorras Serflow del catálogo (moda5 y moda8) con el parche borrado; la blanca y la gris son la azul teñida.
 */
import type { ImageMetadata } from 'astro'
import type { Area, ColorPrenda, FotoColor, Prenda } from './datos'
import camisetaNegra from '../../assets/personalizador/camiseta-negra.jpg'
import camisetaBlanca from '../../assets/personalizador/camiseta-blanca.jpg'
import camisetaGris from '../../assets/personalizador/camiseta-gris.jpg'
import camisetaAzul from '../../assets/personalizador/camiseta-azul.jpg'
import espaldaNegra from '../../assets/personalizador/camiseta-negra-espalda.jpg'
import espaldaBlanca from '../../assets/personalizador/camiseta-blanca-espalda.jpg'
import espaldaGris from '../../assets/personalizador/camiseta-gris-espalda.jpg'
import espaldaAzul from '../../assets/personalizador/camiseta-azul-espalda.jpg'
import gorraNegra from '../../assets/personalizador/gorra-negra.jpg'
import gorraBlanca from '../../assets/personalizador/gorra-blanca.jpg'
import gorraGris from '../../assets/personalizador/gorra-gris.jpg'
import gorraAzul from '../../assets/personalizador/gorra-azul.jpg'

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })
const PECHO = rect(0.24, 0.1, 0.56, 0.48)
const ESPALDA = rect(0.2, 0.12, 0.6, 0.56)
const FRENTE = rect(0.3, 0.28, 0.4, 0.28)

type FotoMuestra = Omit<FotoColor, 'image_url'> & { image: ImageMetadata }
type ColorMuestra = Omit<ColorPrenda, 'photos'> & { photos: FotoMuestra[] }

const camiseta = (id: string, name: string, hex: string, frente: ImageMetadata, espalda: ImageMetadata): ColorMuestra => ({
  id,
  garment: 'camiseta',
  name,
  hex,
  photos: [
    { view: 'frente', image: frente, print_area: PECHO, print_width_cm: 30 },
    { view: 'espalda', image: espalda, print_area: ESPALDA, print_width_cm: 35 },
  ],
})
const gorra = (id: string, name: string, hex: string, frente: ImageMetadata): ColorMuestra => ({
  id,
  garment: 'gorra',
  name,
  hex,
  photos: [{ view: 'frente', image: frente, print_area: FRENTE, print_width_cm: 12 }],
})

export const MUESTRA: Record<Prenda, ColorMuestra[]> = {
  camiseta: [
    camiseta('negra', 'Negra', '#1d1c1a', camisetaNegra, espaldaNegra),
    camiseta('blanca', 'Blanca', '#f2f0ea', camisetaBlanca, espaldaBlanca),
    camiseta('gris', 'Gris', '#8a8781', camisetaGris, espaldaGris),
    camiseta('azul', 'Azul', '#2f56a3', camisetaAzul, espaldaAzul),
  ],
  gorra: [
    gorra('negra', 'Negra', '#1d1c1a', gorraNegra),
    gorra('blanca', 'Blanca', '#f2f0ea', gorraBlanca),
    gorra('gris', 'Gris', '#8a8781', gorraGris),
    gorra('azul', 'Azul', '#2340c8', gorraAzul),
  ],
}

/** Publica las fotos optimizadas en el mismo dominio (el canvas solo lee píxeles de su propio origen). */
export async function coloresMuestra(optimizar: (img: ImageMetadata) => Promise<string>): Promise<Record<Prenda, ColorPrenda[]>> {
  const pasar = (colores: ColorMuestra[]) =>
    Promise.all(
      colores.map(async ({ photos, ...c }) => ({
        ...c,
        photos: await Promise.all(photos.map(async ({ image, ...f }) => ({ ...f, image_url: await optimizar(image) }))),
      })),
    )
  return { camiseta: await pasar(MUESTRA.camiseta), gorra: await pasar(MUESTRA.gorra) }
}
