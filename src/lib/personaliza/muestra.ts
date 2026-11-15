/*
 * Colores y fotos de MUESTRA del personalizador, con la forma de garment_colors + garment_photos (spec 6.7).
 * Desde PRI-427 son filas de la base (supabase/migrations/20261108154523_sembrar_colores.sql, que siembra.test.ts compara
 * con este archivo) y el sitio solo lee la base: aquí quedan las fotos del repo a las que apuntan esas filas
 * (repo:personalizador/<archivo>.jpg, fotoDelRepo) y MUESTRA, los mismos colores para el canvas del personalizador.
 *
 * Los 21 colores del taller salen TEÑIDOS de la foto blanca de frente de cada prenda (PRI-122, método aprobado por Said el
 * 2026-11-07; v3 el 2026-11-08): la herramienta tinte pinta solo la tela blanca con el hex del color (el tono del pecho de
 * su foto de referencia), con borde suavizado y los pliegues de la base. Todos los colores de una prenda, la negra
 * incluida, comparten así la misma foto, el mismo encuadre, la misma área y el mismo mapa de sombreado: sombra-<prenda>.png,
 * la luz de la base blanca relativa al pecho (200 = 1.0), con el que el motor integra el diseño a la tela.
 * Archivos: src/assets/personalizador/<prenda>-<color>.jpg. Fotos base, licencias de uso comercial sin atribución obligatoria:
 * - camiseta-blanca: Avtar Singh, unsplash.com/photos/8ACmRoleM24
 * - gorra-blanca (base de la acrílica): personalgraphic.com, unsplash.com/photos/ozdzzeBu4Go
 * Sin foto base libre todavía (PRI-122, 2026-11-08: Pexels y Pixabay solo traen gorras blancas puestas, con marca o de
 * color): la gorra de malla, que sale apagada. Al llegar: su foto blanca, teñirla y agregarla aquí.
 *
 * El diseño va solo al frente (Said, PRI-522). Las fotos de espalda (camiseta-<color>-espalda.jpg, base de Estefania
 * Milazzo, pexels.com/photo/17858291) y sombra-camiseta-espalda.png siguen en la carpeta pero ya no se importan: no
 * entran al build ni bajan al navegador. Las filas sembradas que apuntan a ellas se ignoran (base.ts, fotoDeFrente).
 *
 * Para cambiar una foto base: reemplaza sus archivos (4:5, 1080 × 1350), vuelve a teñir y recalibra aquí su área
 * (fracciones de la foto) y sus cm (lo que mide esa área en la prenda real).
 */
import type { ImageMetadata } from 'astro'
import type { Area, ColorPrenda, FotoColor, Prenda } from './datos'

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })

type FotoMuestra = Omit<FotoColor, 'image_url' | 'image_url_movil' | 'sombra_url'> & { image: ImageMetadata; sombra?: ImageMetadata }
type ColorMuestra = Omit<ColorPrenda, 'foto'> & { foto: FotoMuestra }

const ARCHIVOS = import.meta.glob<ImageMetadata>(['../../assets/personalizador/*.jpg', '!**/*-espalda.jpg'], { eager: true, import: 'default' })
const archivo = (nombre: string): ImageMetadata | undefined => ARCHIVOS[`../../assets/personalizador/${nombre}.jpg`]
const SOMBRAS = import.meta.glob<ImageMetadata>(['../../assets/personalizador/sombra-*.png', '!**/*-espalda.png'], { eager: true, import: 'default' })

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

/** Por prenda, la foto base de frente: su área y el ancho real en cm. La de malla no tiene foto todavía. */
const AREAS: Partial<Record<Prenda, Pick<FotoColor, 'print_area' | 'print_width_cm'>>> = {
  camiseta: { print_area: rect(0.31, 0.28, 0.36, 0.35), print_width_cm: 30 },
  gorra: { print_area: rect(0.29, 0.42, 0.42, 0.24), print_width_cm: 12 },
}

const coloresDe = (garment: Prenda): ColorMuestra[] =>
  COLORES.flatMap(([id, name, hex]) => {
    const image = archivo(`${garment}-${id}`)
    const area = AREAS[garment]
    return image && area ? [{ id, garment, name, hex, foto: { image, sombra: sombraDe(garment), ...area } }] : []
  })

export const MUESTRA: Record<Prenda, ColorMuestra[]> = { camiseta: coloresDe('camiseta'), gorra: coloresDe('gorra'), 'gorra-malla': coloresDe('gorra-malla') }

/** La foto del repo de una referencia repo:personalizador/<archivo>.jpg de garment_photos; otra cosa, undefined. */
export function fotoDelRepo(url: string): ImageMetadata | undefined {
  const m = url.match(/^repo:personalizador\/([a-z0-9-]+)\.jpg$/)
  return m ? archivo(m[1]) : undefined
}

/** El mapa de sombreado de la base blanca de una prenda: solo sirve para sus fotos teñidas, las del repo. */
export function sombraDe(garment: Prenda): ImageMetadata | undefined {
  return SOMBRAS[`../../assets/personalizador/sombra-${garment}.png`]
}
