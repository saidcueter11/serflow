/*
 * Colores y fotos de MUESTRA del personalizador, con la forma de garment_colors + garment_photos (spec 6.7).
 * Desde PRI-427 son filas de la base (supabase/migrations/20261108154523_sembrar_colores.sql, que siembra.test.ts compara
 * con este archivo) y el sitio solo lee la base: aquí quedan las fotos del repo a las que apuntan esas filas
 * (repo:personalizador/<archivo>.jpg, fotoDelRepo) y MUESTRA, los mismos colores para el canvas del personalizador.
 *
 * Los 21 colores del taller salen TEÑIDOS de la foto blanca de cada prenda y vista (PRI-122, método aprobado por Said el
 * 2026-11-07; v3 el 2026-11-08): la herramienta tinte pinta solo la tela blanca con el hex del color (el tono del pecho de
 * su foto de referencia), con borde suavizado y los pliegues de la base. Todos los colores de una prenda, la negra
 * incluida, comparten así la misma foto, el mismo encuadre, la misma área y el mismo mapa de sombreado: sombra-<prenda>
 * [-espalda].png, la luz de la base blanca relativa al pecho (200 = 1.0), con el que el motor integra el diseño a la tela.
 * Archivos: src/assets/personalizador/<prenda>-<color>[-espalda | -lado].jpg; un color sin la foto de una vista sale sin
 * esa ubicación (ubicacionesDe). Fotos base, licencias de uso comercial sin atribución obligatoria:
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

type FotoMuestra = Omit<FotoColor, 'image_url' | 'image_url_movil' | 'sombra_url'> & { image: ImageMetadata; sombra?: ImageMetadata }
type ColorMuestra = Omit<ColorPrenda, 'photos'> & { photos: FotoMuestra[] }

const ARCHIVOS = import.meta.glob<ImageMetadata>('../../assets/personalizador/*.jpg', { eager: true, import: 'default' })
const archivo = (nombre: string): ImageMetadata | undefined => ARCHIVOS[`../../assets/personalizador/${nombre}.jpg`]
const SOMBRAS = import.meta.glob<ImageMetadata>('../../assets/personalizador/sombra-*.png', { eager: true, import: 'default' })

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

const coloresDe = (garment: Prenda): ColorMuestra[] =>
  COLORES.map(([id, name, hex]) => ({
    id,
    garment,
    name,
    hex,
    photos: VISTAS[garment].flatMap(({ view, sufijo, ...area }) => {
      const image = archivo(`${garment}-${id}${sufijo}`)
      const sombra = SOMBRAS[`../../assets/personalizador/sombra-${garment}${sufijo}.png`]
      return image ? [{ view, image, sombra, ...area }] : []
    }),
  })).filter((c) => c.photos.length)

export const MUESTRA: Record<Prenda, ColorMuestra[]> = { camiseta: coloresDe('camiseta'), gorra: coloresDe('gorra'), 'gorra-malla': coloresDe('gorra-malla') }

/** La foto del repo de una referencia repo:personalizador/<archivo>.jpg de garment_photos; otra cosa, undefined. */
export function fotoDelRepo(url: string): ImageMetadata | undefined {
  const m = url.match(/^repo:personalizador\/([a-z0-9-]+)\.jpg$/)
  return m ? archivo(m[1]) : undefined
}

/** El mapa de sombreado de la base blanca de una prenda y vista: solo sirve para sus fotos teñidas, las del repo. */
export function sombraDe(garment: Prenda, view: Vista): ImageMetadata | undefined {
  const vista = VISTAS[garment].find((v) => v.view === view)
  return vista && SOMBRAS[`../../assets/personalizador/sombra-${garment}${vista.sufijo}.png`]
}
