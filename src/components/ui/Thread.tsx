import { threadSvg } from '../../lib/thread'

/**
 * Hilo de bordado que se cose por la página con el scroll, con la aguja en la punta (PRI-129).
 * Va detrás del contenido: el padre debe ser `relative` y el contenido ir en `relative z-10`.
 * En el sitio el tamaño real lo pone src/scripts/thread.ts (alto de la página, ancho y alto de pantalla);
 * con width/height/viewport (canvas) se dibuja directo. El avance lo hace CSS (animation-timeline: scroll()).
 * Una sola vez por página.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Thread({ width, height, viewport }: { width?: number; height?: number; viewport?: number }) {
  const sized = width !== undefined && height !== undefined && viewport !== undefined
  return (
    <svg
      data-thread
      aria-hidden="true"
      // Con tamaño fijo no hay scroll que lo mueva: se muestra completo, con la aguja al final.
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 ${sized ? '[&_.thread-needle]:[animation:none] [&_.thread-needle]:[offset-distance:100%] [&_.thread-reveal]:[animation:none] [&_.thread-reveal]:[stroke-dashoffset:0]' : ''}`}
      width={width}
      height={height}
      viewBox={sized ? `0 0 ${width} ${height}` : undefined}
      dangerouslySetInnerHTML={sized ? { __html: threadSvg(width, height, viewport) } : undefined}
    />
  )
}
