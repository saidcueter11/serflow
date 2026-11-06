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

/** Por prenda: cada color son hasta 2 fotos más que procesar en cada build. */
export const MAX_COLORES = 12

const rect = (x: number, y: number, w: number, h: number): Area => ({ tl: [x, y], tr: [x + w, y], br: [x + w, y + h], bl: [x, y + h] })

/**
 * Con la colocación libre, el área solo calibra los cm y la posición inicial. Estos valores suponen una foto vertical
 * 4:5 con la prenda centrada; el cliente nunca los toca y los cm siguen siendo "unos N". Medidos sobre fotos reales de
 * camiseta y gorra; el ancho en cm es la propuesta de la spec 6.7.
 */
export const POR_DEFECTO: Record<Prenda, Partial<Record<Vista, Pick<FotoColor, 'print_area' | 'print_width_cm'>>>> = {
  camiseta: {
    frente: { print_area: rect(0.3, 0.26, 0.4, 0.36), print_width_cm: 30 },
    espalda: { print_area: rect(0.32, 0.28, 0.36, 0.34), print_width_cm: 35 },
  },
  gorra: {
    frente: { print_area: rect(0.29, 0.46, 0.42, 0.24), print_width_cm: 12 },
  },
}

/** Las vistas que usa la prenda: una foto de otra vista no se procesa. */
export const vistasDe = (prenda: Prenda): Vista[] => PRENDAS[prenda].ubicaciones.map((u) => u.vista)

/**
 * Las filas que vale la pena procesar, antes de bajar ninguna foto: las primeras MAX_COLORES de cada prenda. Un color sin
 * fila para todas sus vistas no ocupa cupo. Uno cuya foto resulte mala sí: su cupo queda vacío y no entra el siguiente.
 */
export function recortarColores(filas: FilaColor[]): FilaColor[] {
  const usados: Record<Prenda, number> = { camiseta: 0, gorra: 0 }
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
 * urls: la foto optimizada de cada image_url; la que no está no sirvió. Un color sale solo con todas sus vistas
 * (colorCompleto). Los cm y el área son opcionales: lo que falte, o no sirva, sale de POR_DEFECTO.
 */
export function armarColores(filas: FilaColor[], urls: Map<string, string>): Record<Prenda, ColorPrenda[]> {
  const colores: Record<Prenda, ColorPrenda[]> = { camiseta: [], gorra: [] }
  for (const { garment_photos, ...color } of filas) {
    const photos: FotoColor[] = []
    for (const f of garment_photos) {
      const url = urls.get(f.image_url)
      const defecto = POR_DEFECTO[color.garment][f.view]
      if (!url || !defecto) continue
      photos.push({
        view: f.view,
        image_url: url,
        print_area: esArea(f.print_area) ? f.print_area : defecto.print_area,
        print_width_cm: f.print_width_cm ?? defecto.print_width_cm,
      })
    }
    const armado = { ...color, photos }
    if (colorCompleto(armado)) colores[color.garment].push(armado)
  }
  return colores
}
