/**
 * Panel de la lupa al lado (PRI-529): en escritorio, al pasar el mouse por la foto de GaleriaProducto, un recuadro dorado
 * marca la zona y este panel la muestra 2,5 veces más grande donde va la información; al salir, vuelve todo. Va dentro de
 * la columna de la información (relative) y la tapa entera; --lupa-inset lo corre (p. ej. [--lupa-inset:0_0_0_32px]).
 * Pide la versión zoom de la foto (data-zoom) solo al pasar el mouse, y cae a la normal si no hay.
 * En el celular la misma pieza es "Mantén para acercar" sobre la foto, sin panel. Uno por página.
 * Markup estático y vacío: lo maneja src/scripts/lupa.ts (importarlo en la página). Estilos: .lupa en tokens.css.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Lupa({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" data-lupa className={`lupa ${className}`} />
}
