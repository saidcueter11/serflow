import { Button } from './Button'

/** Lo que el modal muestra de una foto del catálogo. Va en data-foto del link de la foto (fotoAttrs). */
export type FotoModal = {
  /** "Beisbol N.º 26". */
  titulo: string
  categoria: string
  alt: string
  /** Link de "Pedir por WhatsApp" con la URL propia de la foto (pedirUrl). */
  pedir: string
  /** Fotos del producto: la primera es la del muro. r = ancho / alto, reserva la forma mientras carga (si falta, 4:5). */
  fotos: { src: string; srcSet?: string; r?: number }[]
  descripcion?: string | null
}

/**
 * Atributos del link de una foto que abre el modal: sus datos en JSON y sin prefetch (el modal no navega). La lista que
 * contiene las fotos lleva data-fotos: el modal recorre las fotos de esa lista.
 */
export const fotoAttrs = (f?: FotoModal) => (f ? { 'data-foto': JSON.stringify(f), 'data-astro-prefetch': 'false' } : {})

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

const ANT = 'M15 18l-6-6 6-6'
const SIG = 'M9 6l6 6-6 6'

/**
 * Foto abierta (PRI-286): un <dialog> encima del muro del catálogo o de Disponible ahora, en lugar de la página de detalle.
 * No es una tienda: la foto entera (contain), qué es y cómo pedirla. Escritorio: la foto centrada y debajo una franja
 * con la categoría y el nombre a la izquierda y "Pedir por WhatsApp" a la derecha; el nombre nunca se corta (la franja
 * puede ser más ancha que la foto y un nombre muy largo pasa a otra línea). Flechas a los lados, contador arriba a la
 * izquierda y la X arriba a la derecha. Celular: pantalla completa, las orillas de la anterior y la siguiente son botones
 * y la franja va fija abajo. Mientras baja, el marco ya tiene la forma de la foto y un brillo; la foto entra en fundido
 * y al pasar de foto se desliza en el sentido de la flecha (PRI-287).
 * Markup estático y vacío (uno por página): lo llena y lo maneja src/scripts/photo-modal.ts con los datos de la foto
 * tocada (fotoAttrs). showModal() trae el foco atrapado, aria-modal y Esc; el script agrega flechas, deslizar, clic
 * afuera, la URL propia de cada foto y el foco de vuelta a la foto al cerrar. Estilos: .mx-* en tokens.css.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PhotoModal() {
  return (
    <dialog className="mx font-body" aria-modal="true" aria-labelledby="mx-titulo" data-photo-modal>
      <div className="mx-velo" aria-hidden="true" />
      <div className="mx-caja">
        <div className="mx-barra">
          <p className="mx-contador" aria-live="polite" />
        </div>
        <button type="button" className="mx-x" aria-label="Cerrar" data-mx="cerrar">
          <Icono d="M6 6l12 12M18 6L6 18" />
        </button>
        <button type="button" className="mx-flecha mx-ant" aria-label="Foto anterior" data-mx="ant">
          <Icono d={ANT} />
        </button>
        <button type="button" className="mx-flecha mx-sig" aria-label="Foto siguiente" data-mx="sig">
          <Icono d={SIG} />
        </button>
        <div className="mx-centro">
          <div className="mx-pieza">
            <div className="mx-pista">
              <button type="button" className="mx-vecina mx-vecina-ant" aria-label="Foto anterior" data-mx="ant">
                <img alt="" />
              </button>
              <div className="mx-marco">
                <div className="mx-brillo pz-shimmer" aria-hidden="true" />
                <img className="mx-foto" alt="" draggable={false} />
              </div>
              <button type="button" className="mx-vecina mx-vecina-sig" aria-label="Foto siguiente" data-mx="sig">
                <img alt="" />
              </button>
            </div>
            <div className="mx-lado">
              <div className="mx-franja">
                <div className="mx-nombre">
                  <p className="mx-cat" />
                  <h2 id="mx-titulo" className="mx-titulo" />
                  <p className="mx-desc" hidden />
                </div>
                <div className="mx-pedir">
                  <Button variant="whatsapp" href="https://wa.me/" external>
                    Pedir por WhatsApp
                  </Button>
                  <p className="mx-nota">Se abre WhatsApp con el link de esta foto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
