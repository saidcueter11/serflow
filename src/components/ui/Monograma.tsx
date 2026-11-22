import s from '../../assets/monograma-s.svg?raw'

// La S trazada del ícono (src/assets/monograma-s.svg) como máscara: el color lo pone el fondo de .monograma.
const MASCARA = `url("data:image/svg+xml,${encodeURIComponent(s)}")`

/**
 * Monograma: la S de Serflow entera como marca de fondo. Decorativo (aria-hidden) y sin eventos. Markup estático: Astro
 * lo renderiza sin directivas de cliente. Estilos: .monograma en tokens.css. variante:
 * - brillo (ficha de producto, PRI-529): detrás del nombre, el precio y los colores, con un brillo dorado que la recorre
 *   despacio (--motion-monograma); con reducir movimiento queda quieta. Una por página: es la protagonista.
 * - quieta (404, PRI-562): grande y sin brillo, en el tono discreto de la ficha.
 * - sello (pie, PRI-562): firma dorada pequeña junto al logo, sin brillo.
 * brillo y quieta van absolute dentro de un padre relative, detrás del texto (el texto en relative); el puesto y el
 * tamaño los pone className (ficha, escritorio: h-[80%] centrada; celular: w-[72%] max-w-[300px]).
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Monograma({ variante = 'brillo', className = '' }: { variante?: 'brillo' | 'quieta' | 'sello'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-variante={variante}
      className={`monograma ${className}`}
      style={{ WebkitMaskImage: MASCARA, maskImage: MASCARA }}
    />
  )
}
