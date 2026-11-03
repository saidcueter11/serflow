import type { CSSProperties, ReactNode } from 'react'

/**
 * Lista de PromoCard (Otras promos y la 404, PRI-286): una debajo de otra en el celular; en desktop una sola fila llena
 * (2 -> 6 columnas cada una, 3 -> 4). Va dentro de una página .pf (.pf-promo-tarjetas en tokens.css). Markup estático.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoGrid({ children }: { children: ReactNode[] }) {
  // ponytail: más de 3 promos hacen otra fila que no siempre queda llena; repartir la última si un día hay 4+.
  return (
    <ul className="pf-promo-tarjetas" style={{ '--n': Math.min(children.length, 3) } as CSSProperties}>
      {children.map((c, i) => (
        <li key={i} className="min-w-0">
          {c}
        </li>
      ))}
    </ul>
  )
}
