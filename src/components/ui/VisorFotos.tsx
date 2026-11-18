const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

/**
 * Visor de fotos de la ficha de producto (PRI-529): un <dialog> a pantalla completa con la foto entera y zoom. Lo abre
 * tocar o hacer clic en la foto de GaleriaProducto, con todas sus fotos. Escritorio: la rueda acerca hacia el puntero,
 * + − y Ajustar, arrastrar, flechas y miniaturas (se esconden mientras está acercada). Celular: pellizco, doble toque,
 * arrastrar con un dedo, deslizar de lado para cambiar de foto y hacia abajo para cerrar; acercada, el pie se esconde.
 * Teclado: ← → cambian de foto, Enter o espacio sobre la foto acerca y aleja, Esc cierra; el foco queda atrapado adentro
 * y vuelve a la foto al cerrar. Baja la versión zoom de la foto (PRI-546) solo al abrir, y si no hay usa la normal.
 * No reemplaza a PhotoModal: ese sigue siendo la foto abierta del muro del catálogo.
 * Markup estático y vacío (uno por página): lo llena y lo maneja src/scripts/visor-fotos.ts (importarlo en la página).
 * Estilos: .vf-* en tokens.css.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function VisorFotos({ titulo }: { titulo: string }) {
  return (
    <dialog className="vf font-body" aria-label={`${titulo}, fotos`} data-visor>
      <div className="vf-arriba">
        <p className="vf-contador" aria-live="polite" data-vf-contador />
        <button type="button" className="vf-x" aria-label="Cerrar" data-vf="cerrar">
          <Icono d="M6 6l12 12M18 6L6 18" />
        </button>
      </div>
      <div className="vf-zona" tabIndex={0} role="img" aria-label="Foto ampliada. Enter para acercar o alejar" data-vf-zona>
        <img className="vf-foto" alt="" draggable={false} />
      </div>
      <button type="button" className="vf-flecha vf-ant" aria-label="Foto anterior" data-vf="ant">
        <Icono d="M15 18l-6-6 6-6" />
      </button>
      <button type="button" className="vf-flecha vf-sig" aria-label="Foto siguiente" data-vf="sig">
        <Icono d="M9 6l6 6-6 6" />
      </button>
      <div className="vf-pie">
        <div className="vf-ctrl">
          <button type="button" aria-label="Alejar" data-vf="menos">
            −
          </button>
          <output data-vf-pct>100 %</output>
          <button type="button" aria-label="Acercar" data-vf="mas">
            +
          </button>
          <button type="button" className="vf-ajustar" data-vf="ajustar">
            Ajustar
          </button>
        </div>
        <div className="vf-minis" role="group" aria-label="Fotos" data-vf-minis />
        <p className="vf-ayuda">Pellizca o toca dos veces para acercar</p>
      </div>
    </dialog>
  )
}
