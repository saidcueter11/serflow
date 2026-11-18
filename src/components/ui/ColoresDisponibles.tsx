import { bordeMuestra, CLASES_COLORES } from '../../lib/colores-producto'
import type { ProductColor } from '../../lib/types'

// La variante de la ficha (PRI-529).
const PILDORAS = {
  lista: 'flex flex-wrap gap-2 text-[14px] leading-tight text-ink',
  item: 'inline-flex min-h-9 items-center gap-2 rounded-full border border-line pr-3.5 pl-2',
  punto: 'size-5 shrink-0 rounded-full border',
}

/**
 * Colores en que viene un producto (PRI-455): círculo con la muestra y el nombre al lado, siempre visible (no solo el
 * color). Es información, no un selector: para elegir un color usa Colores (personalizador). Sin colores no pinta
 * nada. El modal (photo-modal.ts) arma la misma lista en el navegador con CLASES_COLORES.
 * variante: compacta (la de siempre: punto de 14 px y nombre de 13 px en gris; modal y ProductCard) o pildoras (PRI-529,
 * la ficha de producto: píldoras de 36 px con borde, punto de 20 px y nombre de 14 px en tinta).
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function ColoresDisponibles({ colores, variante = 'compacta' }: { colores?: ProductColor[]; variante?: 'compacta' | 'pildoras' }) {
  if (!colores?.length) return null
  const k = variante === 'pildoras' ? PILDORAS : CLASES_COLORES
  return (
    <ul aria-label="Colores disponibles" className={k.lista} data-colores>
      {colores.map((c) => (
        <li key={c.name} className={k.item}>
          <span aria-hidden="true" className={`${k.punto} ${bordeMuestra(c.hex)}`} style={{ background: c.hex }} />
          {c.name}
        </li>
      ))}
    </ul>
  )
}
