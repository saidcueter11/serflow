interface Props {
  /** vertical se estira al alto de su fila (va entre dos columnas de un flex o grid); horizontal, al ancho. */
  orientacion?: 'vertical' | 'horizontal'
  className?: string
}

/**
 * Costura de la ficha de producto (PRI-529): línea dorada punteada con una puntada en cada punta. Separa la foto de la
 * información: vertical en escritorio, entre las dos columnas, y mide lo que mide la fila; horizontal en el celular,
 * entre la foto y el texto. Decorativa (aria-hidden). Estilos: .costura en tokens.css.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Costura({ orientacion = 'vertical', className = '' }: Props) {
  return <span aria-hidden="true" data-orientacion={orientacion} className={`costura ${className}`} />
}
