import { Fragment, type CSSProperties } from 'react'

/**
 * Titular palabra por palabra (PRI-287, efecto 3): cada palabra sube desde atrás de una línea, con un giro leve. Va dentro
 * del h1 o de su bajada (p.sf-bajada, que llega después y sin máscara). El texto sigue siendo uno solo para los lectores
 * de pantalla. Solo CSS (.sf-palabra, tokens.css), 0 KB de JS: sin JS, con reducir movimiento o con mala señal no anima y
 * el texto está ahí desde el principio. Para cortar la línea en un punto fijo: dos Palabras con un <br /> en medio, y la
 * segunda con desde = cuántas palabras van antes, para que siga el escalón.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Palabras({ text, desde = 0 }: { text: string; desde?: number }) {
  return (
    <>
      {text
        .trim()
        .split(/\s+/)
        .map((palabra, i) => (
          <Fragment key={i}>
            <span className="sf-palabra" style={{ '--i': desde + i } as CSSProperties}>
              <span>{palabra}</span>
            </span>{' '}
          </Fragment>
        ))}
    </>
  )
}
