/*
 * Colores y fotos de MUESTRA del personalizador, con la forma de garment_colors + garment_photos (spec 6.7).
 * Es el respaldo: lo usa la prenda sin ningún color completo publicado desde el admin (src/lib/personaliza/base.ts).
 *
 * FOTOS REALES DE STOCK, NO DEL TALLER (las reemplazan las oficiales de PRI-125). Una foto por color y vista, sin teñir;
 * si falta una foto, ese color queda fuera. Licencias Pexels y Unsplash: uso comercial, sin atribución obligatoria.
 * - camiseta-negra: Hanna Pad, pexels.com/photo/8532616
 * - camiseta-negra-espalda: Angela Roma, pexels.com/photo/7319032
 * - camiseta-blanca: Avtar Singh, unsplash.com/photos/8ACmRoleM24
 * - camiseta-blanca-espalda: Estefania Milazzo, pexels.com/photo/17858291
 * - gorra-negra: Giorgio Trovato, unsplash.com/photos/a6PIHHL7d4I
 * - gorra-blanca: personalgraphic.com, unsplash.com/photos/ozdzzeBu4Go
 *
 * SIN LICENCIA TODAVÍA (PRI-122, PR en draft que no se mergea así): camiseta azul, gris, roja y verde (frente y
 * espalda) son mockups de bancos de stock (Shutterstock, iStock, Freepik o similares). Said las cambia por las
 * versiones con licencia antes de mergear. Áreas calibradas con el torso de cada foto = 50 cm.
 *
 * Para cambiar una foto: reemplaza el archivo en src/assets/personalizador/ (4:5, 1080 × 1350) y recalibra aquí su area
 * (fracciones de la foto) y su print_width_cm (lo que mide esa área en la prenda real).
 */
import type { ImageMetadata } from 'astro'
import type { Area, ColorPrenda, FotoColor, Prenda } from './datos'
import camisetaNegra from '../../assets/personalizador/camiseta-negra.jpg'
import camisetaBlanca from '../../assets/personalizador/camiseta-blanca.jpg'
import espaldaNegra from '../../assets/personalizador/camiseta-negra-espalda.jpg'
import espaldaBlanca from '../../assets/personalizador/camiseta-blanca-espalda.jpg'
import camisetaAzul from '../../assets/personalizador/camiseta-azul.jpg'
import espaldaAzul from '../../assets/personalizador/camiseta-azul-espalda.jpg'
import camisetaGris from '../../assets/personalizador/camiseta-gris.jpg'
import espaldaGris from '../../assets/personalizador/camiseta-gris-espalda.jpg'
import camisetaRoja from '../../assets/personalizador/camiseta-roja.jpg'
import espaldaRoja from '../../assets/personalizador/camiseta-roja-espalda.jpg'
import camisetaVerde from '../../assets/personalizador/camiseta-verde.jpg'
import espaldaVerde from '../../assets/personalizador/camiseta-verde-espalda.jpg'
import gorraNegra from '../../assets/personalizador/gorra-negra.jpg'
import gorraBlanca from '../../assets/personalizador/gorra-blanca.jpg'

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })

type FotoMuestra = Omit<FotoColor, 'image_url' | 'image_url_movil'> & { image: ImageMetadata }
type ColorMuestra = Omit<ColorPrenda, 'photos'> & { photos: FotoMuestra[] }

const foto = (view: FotoColor['view'], image: ImageMetadata, print_area: Area, print_width_cm: number): FotoMuestra => ({ view, image, print_area, print_width_cm })

export const MUESTRA: Record<Prenda, ColorMuestra[]> = {
  camiseta: [
    {
      id: 'negra',
      garment: 'camiseta',
      name: 'Negra',
      hex: '#1d1c1a',
      photos: [foto('frente', camisetaNegra, rect(0.3, 0.25, 0.4, 0.38), 30), foto('espalda', espaldaNegra, rect(0.295, 0.27, 0.35, 0.34), 35)],
    },
    {
      id: 'blanca',
      garment: 'camiseta',
      name: 'Blanca',
      hex: '#f2f0ea',
      photos: [foto('frente', camisetaBlanca, rect(0.31, 0.28, 0.36, 0.35), 30), foto('espalda', espaldaBlanca, rect(0.353, 0.3, 0.294, 0.3), 35)],
    },
    {
      id: 'azul',
      garment: 'camiseta',
      name: 'Azul',
      hex: '#0b48ac',
      photos: [foto('frente', camisetaAzul, rect(0.353, 0.243, 0.307, 0.294), 30), foto('espalda', espaldaAzul, rect(0.328, 0.201, 0.339, 0.326), 35)],
    },
    {
      id: 'gris',
      garment: 'camiseta',
      name: 'Gris',
      hex: '#b9b9b9',
      photos: [foto('frente', camisetaGris, rect(0.344, 0.216, 0.32, 0.307), 30), foto('espalda', espaldaGris, rect(0.318, 0.184, 0.38, 0.365), 35)],
    },
    {
      id: 'roja',
      garment: 'camiseta',
      name: 'Roja',
      hex: '#f1052d',
      photos: [foto('frente', camisetaRoja, rect(0.359, 0.258, 0.287, 0.275), 30), foto('espalda', espaldaRoja, rect(0.344, 0.246, 0.33, 0.317), 35)],
    },
    {
      id: 'verde',
      garment: 'camiseta',
      name: 'Verde oliva',
      hex: '#4d5d2e',
      photos: [foto('frente', camisetaVerde, rect(0.345, 0.226, 0.312, 0.3), 30), foto('espalda', espaldaVerde, rect(0.318, 0.202, 0.363, 0.349), 35)],
    },
  ],
  gorra: [
    // Esta foto está en 3/4: el área sigue el panel de la copa, y así el diseño se acuesta con la gorra (el motor ya usa 4 esquinas).
    { id: 'negra', garment: 'gorra', name: 'Negra', hex: '#1d1c1a', photos: [foto('frente', gorraNegra, { tl: [0.356, 0.593], tr: [0.718, 0.615], br: [0.785, 0.845], bl: [0.325, 0.795] }, 12)] },
    { id: 'blanca', garment: 'gorra', name: 'Blanca', hex: '#f2f0ea', photos: [foto('frente', gorraBlanca, rect(0.29, 0.42, 0.42, 0.24), 12)] },
  ],
}

/** Publica cada foto optimizada en el mismo dominio (el canvas solo lee píxeles de su propio origen), en dos anchos. */
export async function coloresMuestra(optimizar: (img: ImageMetadata, ancho: number) => Promise<string>): Promise<Record<Prenda, ColorPrenda[]>> {
  const pasar = (colores: ColorMuestra[]) =>
    Promise.all(
      colores.map(async ({ photos, ...c }) => ({
        ...c,
        photos: await Promise.all(photos.map(async ({ image, ...f }) => ({ ...f, image_url: await optimizar(image, 1080), image_url_movil: await optimizar(image, 720) }))),
      })),
    )
  return { camiseta: await pasar(MUESTRA.camiseta), gorra: await pasar(MUESTRA.gorra) }
}
