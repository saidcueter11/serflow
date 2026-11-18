import { Button } from './Button'

interface Props {
  /** Link de WhatsApp con la URL del producto (pedirUrl). */
  href: string
  /** fija se pega abajo de la pantalla; sin fija queda en el flujo (canvases). */
  fija?: boolean
}

/**
 * Barra de pedir de la ficha de producto en el celular (PRI-529): fija abajo, solo el Button whatsapp a todo el ancho,
 * sin repetir el nombre ni el precio. Es el único botón de WhatsApp de esa pantalla: en la ficha reemplaza al
 * WhatsAppFab (hideFab en el Layout). Sticky al final del contenido de la página (dentro de .pf, como BarraEnvio):
 * desde 48rem de página se esconde y el botón va junto a la información.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/buttons/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function BarraPedir({ href, fija = true }: Props) {
  return (
    <div
      className={`${fija ? 'sticky bottom-0 z-30' : ''} border-t border-line bg-primary px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] font-body @3xl:hidden`}
    >
      <Button variant="whatsapp" href={href} external fullWidth>
        Pedir por WhatsApp
      </Button>
    </div>
  )
}
