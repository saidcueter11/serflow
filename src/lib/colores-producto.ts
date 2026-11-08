// Colores disponibles de un producto (PRI-455): lo comparten ColoresDisponibles (ficha) y photo-modal.ts (modal).
import type { ProductColor } from './types'

const HEX = /^#[0-9a-fA-F]{6}$/

/**
 * Filas de product_colors (ya en orden) agrupadas por producto. La base valida nombre y muestra; aquí se vuelve a
 * mirar porque la muestra va en un style: una fila que no sea un #rrggbb y un nombre con texto no sale.
 */
export function coloresPorProducto(rows: { product_id: string; name: string; hex: string }[]): Map<string, ProductColor[]> {
  const out = new Map<string, ProductColor[]>()
  for (const r of rows) {
    const name = r.name?.trim()
    if (!name || !HEX.test(r.hex)) continue
    out.set(r.product_id, [...(out.get(r.product_id) ?? []), { name, hex: r.hex }])
  }
  return out
}

/** Borde del círculo: claro sobre los colores oscuros, para que no se pierdan en el fondo negro (como Colores). */
export function bordeMuestra(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b < 70 ? 'border-muted' : 'border-line'
}

/** Clases de la lista: el modal la arma en el navegador con las mismas. */
export const CLASES_COLORES = {
  lista: 'flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] leading-tight text-muted',
  item: 'inline-flex items-center gap-1.5',
  punto: 'size-3.5 shrink-0 rounded-full border',
}
