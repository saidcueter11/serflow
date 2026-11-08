/*
 * Colores y fotos de MUESTRA del personalizador, con la forma de garment_colors + garment_photos (spec 6.7).
 * Es el respaldo: lo usa la prenda sin ningún color completo publicado desde el admin (src/lib/personaliza/base.ts).
 *
 * Los 21 colores del taller salen TEÑIDOS de la foto blanca de cada prenda y vista (PRI-122, método aprobado por Said el
 * 2026-11-07): la herramienta tinte toma el tono medio del pecho de la foto de referencia del color y pinta solo la tela
 * blanca, con sus sombras. Todos los colores de una prenda comparten así la misma foto, el mismo encuadre y la misma área.
 * La camiseta negra conserva su foto (de stock, otro encuadre: su área es propia).
 * Archivos: src/assets/personalizador/<prenda>-<color>[-espalda | -lado].jpg; un color sin la foto de una vista sale sin
 * esa ubicación (ubicacionesDe). Fotos base, licencias de uso comercial sin atribución obligatoria:
 * - camiseta-negra: Hanna Pad, pexels.com/photo/8532616
 * - camiseta-negra-espalda: Angela Roma, pexels.com/photo/7319032
 * - camiseta-blanca (base de frente): Avtar Singh, unsplash.com/photos/8ACmRoleM24
 * - camiseta-blanca-espalda (base de espalda): Estefania Milazzo, pexels.com/photo/17858291
 * - gorra-blanca (base de la acrílica, frente): personalgraphic.com, unsplash.com/photos/ozdzzeBu4Go
 * Sin foto base libre todavía (PRI-122, 2026-11-08: Pexels y Pixabay solo traen gorras blancas puestas, con marca o de
 * color): la gorra acrílica de lado y la de malla. Hasta tenerlas, la acrílica sale sin Lado (y sin estampado, que solo va
 * a los lados) y la de malla, apagada. Al llegar: su foto blanca, teñirla y agregar su vista aquí.
 *
 * Para cambiar una foto base: reemplaza sus archivos (4:5, 1080 × 1350), vuelve a teñir y recalibra aquí su área
 * (fracciones de la foto) y sus cm (lo que mide esa área en la prenda real).
 */
import type { ImageMetadata } from 'astro'
import type { Area, ColorPrenda, FotoColor, Prenda, Vista } from './datos'

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })

type FotoMuestra = Omit<FotoColor, 'image_url' | 'image_url_movil'> & { image: ImageMetadata }
type ColorMuestra = Omit<ColorPrenda, 'photos'> & { photos: FotoMuestra[] }

const ARCHIVOS = import.meta.glob<ImageMetadata>('../../assets/personalizador/*.jpg', { eager: true, import: 'default' })
const archivo = (nombre: string): ImageMetadata | undefined => ARCHIVOS[`../../assets/personalizador/${nombre}.jpg`]

/** Los colores del taller, en el orden del selector. hex: el tono de su referencia, el mismo con que se tiñó la foto. */
const COLORES: [id: string, name: string, hex: string][] = [
  ['negra', 'Negra', '#1d1c1a'],
  ['blanca', 'Blanca', '#f2f0ea'],
  ['amarillo-pollo', 'Amarillo pollo', '#d0c98b'],
  ['amarillo', 'Amarilla', '#fdea01'],
  ['azul-cielo', 'Azul cielo', '#6cc1e5'],
  ['azul-rey', 'Azul rey', '#0a44a6'],
  ['beige', 'Beige', '#cab397'],
  ['cafe', 'Café', '#815540'],
  ['crema', 'Crema', '#dbc4b2'],
  ['fucsia', 'Fucsia', '#e2187b'],
  ['gris-cenizo', 'Gris cenizo', '#5b5957'],
  ['gris', 'Gris', '#b8b8b8'],
  ['lila', 'Lila', '#cec1e1'],
  ['mostaza', 'Mostaza', '#f3b550'],
  ['naranja', 'Naranja', '#f97603'],
  ['roja', 'Roja', '#f0062c'],
  ['rosado-bajito', 'Rosado bajito', '#cfa1af'],
  ['rosado-barbie', 'Rosado barbie', '#f393a6'],
  ['verde-militar', 'Verde militar', '#48582a'],
  ['verde-navidad', 'Verde navidad', '#1d8c56'],
  ['vino-tinto', 'Vino tinto', '#892a39'],
]

/** Por prenda, cada vista de la foto base: sufijo del archivo, área y su ancho real en cm. */
const VISTAS: Record<Prenda, { view: Vista; sufijo: string; print_area: Area; print_width_cm: number }[]> = {
  camiseta: [
    { view: 'frente', sufijo: '', print_area: rect(0.31, 0.28, 0.36, 0.35), print_width_cm: 30 },
    { view: 'espalda', sufijo: '-espalda', print_area: rect(0.353, 0.3, 0.294, 0.3), print_width_cm: 35 },
  ],
  gorra: [
    { view: 'frente', sufijo: '', print_area: rect(0.29, 0.42, 0.42, 0.24), print_width_cm: 12 },
  ],
  'gorra-malla': [],
}

/** La negra de camiseta es otra foto: su propia área. */
const PROPIAS: Partial<Record<string, FotoMuestra[]>> = {
  'camiseta-negra': [
    { view: 'frente', image: archivo('camiseta-negra')!, print_area: rect(0.3, 0.25, 0.4, 0.38), print_width_cm: 30 },
    { view: 'espalda', image: archivo('camiseta-negra-espalda')!, print_area: rect(0.295, 0.27, 0.35, 0.34), print_width_cm: 35 },
  ],
}

const coloresDe = (garment: Prenda): ColorMuestra[] =>
  COLORES.map(([id, name, hex]) => ({
    id,
    garment,
    name,
    hex,
    photos:
      PROPIAS[`${garment}-${id}`] ??
      VISTAS[garment].flatMap(({ view, sufijo, ...area }) => {
        const image = archivo(`${garment}-${id}${sufijo}`)
        return image ? [{ view, image, ...area }] : []
      }),
  })).filter((c) => c.photos.length)

export const MUESTRA: Record<Prenda, ColorMuestra[]> = { camiseta: coloresDe('camiseta'), gorra: coloresDe('gorra'), 'gorra-malla': coloresDe('gorra-malla') }

/**
 * Publica cada foto optimizada en el mismo dominio (el canvas solo lee píxeles de su propio origen), en dos anchos. Son
 * muchas, pero la página solo baja la del color y la vista elegidos.
 */
export async function coloresMuestra(optimizar: (img: ImageMetadata, ancho: number) => Promise<string>): Promise<Record<Prenda, ColorPrenda[]>> {
  const pasar = (colores: ColorMuestra[]) =>
    Promise.all(
      colores.map(async ({ photos, ...c }) => ({
        ...c,
        photos: await Promise.all(photos.map(async ({ image, ...f }) => ({ ...f, image_url: await optimizar(image, 1080), image_url_movil: await optimizar(image, 720) }))),
      })),
    )
  return { camiseta: await pasar(MUESTRA.camiseta), gorra: await pasar(MUESTRA.gorra), 'gorra-malla': await pasar(MUESTRA['gorra-malla']) }
}
