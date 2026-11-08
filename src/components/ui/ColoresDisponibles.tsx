import { bordeMuestra, CLASES_COLORES } from '../../lib/colores-producto'
import type { ProductColor } from '../../lib/types'

/**
 * Colores en que viene un producto (PRI-455): círculo con la muestra y el nombre al lado, siempre visible (no solo el
 * color). Es información, no un selector: para elegir un color usa Colores (personalizador). Sin colores no pinta
 * nada. El modal (photo-modal.ts) arma la misma lista en el navegador con CLASES_COLORES.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function ColoresDisponibles({ colores }: { colores?: ProductColor[] }) {
  if (!colores?.length) return null
  return (
    <ul aria-label="Colores disponibles" className={CLASES_COLORES.lista} data-colores>
      {colores.map((c) => (
        <li key={c.name} className={CLASES_COLORES.item}>
          <span aria-hidden="true" className={`${CLASES_COLORES.punto} ${bordeMuestra(c.hex)}`} style={{ background: c.hex }} />
          {c.name}
        </li>
      ))}
    </ul>
  )
}
