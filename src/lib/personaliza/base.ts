// De las filas de garment_colors + garment_photos a los colores del personalizador (spec 6.7). Puro: lo prueba Vitest.
import { PRENDAS, colorCompleto, type Area, type ColorPrenda, type FotoColor, type Prenda, type Vista } from './datos'

export interface FilaFoto {
  view: Vista
  image_url: string
  print_area: unknown
  print_width_cm: number | null
}

export interface FilaColor {
  id: string
  garment: Prenda
  name: string
  hex: string
  garment_photos: FilaFoto[]
}

export type FotoOptimizada = Pick<FotoColor, 'image_url' | 'image_url_movil' | 'sombra_url'>

/**
 * Por prenda: cada color son hasta 2 fotos más que procesar en cada build, cada una en 2 anchos. serflow-admin no deja
 * prender uno más (MAX.colors, el mismo número): el sitio nunca recorta en silencio. Los 21 sembrados caben (PRI-427).
 */
export const MAX_COLORES = 30

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })

/**
 * Con la colocación libre, el área solo calibra los cm y la posición inicial. Estos valores suponen una foto vertical
 * 4:5 con la prenda centrada; el cliente nunca los toca y los cm siguen siendo "unos N". Salen de las fotos reales de
 * muestra.ts: el promedio de las dos camisetas y la gorra blanca, la que está de frente (la negra está en 3/4). El ancho
 * en cm es la propuesta de la spec 6.7.
 */
export const POR_DEFECTO: Record<Prenda, Partial<Record<Vista, Pick<FotoColor, 'print_area' | 'print_width_cm'>>>> = {
  camiseta: {
    frente: { print_area: rect(0.31, 0.27, 0.38, 0.36), print_width_cm: 30 },
    espalda: { print_area: rect(0.32, 0.29, 0.32, 0.32), print_width_cm: 35 },
  },
  // Sin lado: garment_photos todavía no acepta esa vista (la gorra acrílica del admin sale sin estampado, que va a los lados).
  gorra: {
    frente: { print_area: rect(0.29, 0.42, 0.42, 0.24), print_width_cm: 12 },
  },
  // La de malla aún no existe en el admin (garment_colors solo acepta camiseta y gorra).
  'gorra-malla': {},
}

/** Las vistas que pide la prenda (sin las opcionales): una foto de otra vista no se procesa. */
export const vistasDe = (prenda: Prenda): Vista[] => PRENDAS[prenda].ubicaciones.filter((u) => !u.opcional).map((u) => u.vista)

/**
 * Las filas que vale la pena procesar, antes de bajar ninguna foto: las primeras MAX_COLORES de cada prenda. Un color sin
 * fila para todas sus vistas no ocupa cupo. Uno cuya foto resulte mala sí: su cupo queda vacío y no entra el siguiente.
 */
export function recortarColores(filas: FilaColor[]): FilaColor[] {
  const usados: Record<Prenda, number> = { camiseta: 0, gorra: 0, 'gorra-malla': 0 }
  return filas.filter(({ garment, garment_photos }) => vistasDe(garment).every((v) => garment_photos.some((f) => f.view === v)) && usados[garment]++ < MAX_COLORES)
}

const esPunto = (p: unknown) => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === 'number' && n >= 0 && n <= 1)

/** La columna solo revisa las 4 llaves. Un área torcida o de ancho o alto cero rompería las cuentas del motor. */
function esArea(a: unknown): a is Area {
  if (typeof a !== 'object' || a === null) return false
  const { tl, tr, br, bl } = a as Record<string, unknown>
  if (![tl, tr, br, bl].every(esPunto)) return false
  const [p, q, r, s] = [tl, tr, br, bl] as number[][]
  return q[0] > p[0] && r[0] > s[0] && s[1] > p[1] && r[1] > q[1]
}

/**
 * urls: la foto optimizada de cada image_url, en sus dos anchos; la que no está no sirvió. Un color sale solo con todas
 * sus vistas (colorCompleto). Los cm y el área son opcionales: lo que falte, o no sirva, sale de POR_DEFECTO.
 */
export function armarColores(filas: FilaColor[], urls: Map<string, FotoOptimizada>): Record<Prenda, ColorPrenda[]> {
  const colores: Record<Prenda, ColorPrenda[]> = { camiseta: [], gorra: [], 'gorra-malla': [] }
  for (const { garment_photos, ...color } of filas) {
    const photos: FotoColor[] = []
    for (const f of garment_photos) {
      const optimizada = urls.get(f.image_url)
      const defecto = POR_DEFECTO[color.garment][f.view]
      if (!optimizada || !defecto) continue
      photos.push({
        view: f.view,
        ...optimizada,
        print_area: esArea(f.print_area) ? f.print_area : defecto.print_area,
        print_width_cm: f.print_width_cm ?? defecto.print_width_cm,
      })
    }
    const armado = { ...color, photos }
    if (colorCompleto(armado)) colores[color.garment].push(armado)
  }
  return colores
}
