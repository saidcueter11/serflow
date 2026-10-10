import type { ReactNode } from 'react'

/**
 * Lista de PromoCard o PromoAfiche que nunca deja columnas vacías: hasta 3 por fila en desktop y 2 en tablet;
 * la última fila se reparte el ancho que sobra. Con 1 promo, o con 4 (3 + 1), la que queda sola ocupa todo el
 * ancho y su card se pone horizontal sola (container query). Markup estático, sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoGrid({ children }: { children: ReactNode[] }) {
  return (
    <ul className="flex flex-wrap gap-4 @4xl:gap-5">
      {children.map((c, i) => (
        <li key={i} className="flex min-w-0 grow basis-full @3xl:basis-[calc(50%-8px)] @4xl:basis-[calc(33.333%-14px)]">
          {c}
        </li>
      ))}
    </ul>
  )
}
