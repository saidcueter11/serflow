import s from '../../assets/monograma-s.svg?raw'

// La S trazada del ícono (src/assets/monograma-s.svg) como máscara: el color lo pone el brillo de .monograma.
const MASCARA = `url("data:image/svg+xml,${encodeURIComponent(s)}")`

/**
 * Monograma de la ficha de producto (PRI-529): la S de Serflow entera detrás del nombre, el precio y los colores, con un
 * brillo dorado que la recorre despacio (--motion-monograma). Decorativo (aria-hidden) y sin eventos. Con reducir
 * movimiento queda quieto. Va absolute dentro de un padre relative, detrás del texto (el texto en relative z-10); el
 * puesto y el tamaño los pone className (escritorio: h-[80%] centrada; celular: w-[72%] max-w-[300px]).
 * Estilos: .monograma en tokens.css. Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Monograma({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`monograma ${className}`} style={{ WebkitMaskImage: MASCARA, maskImage: MASCARA }} />
}
