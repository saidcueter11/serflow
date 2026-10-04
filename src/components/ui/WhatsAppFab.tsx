import { WhatsAppIcon } from '../icons/WhatsappIcon'
import { whatsappUrl } from '../../lib/business'

interface Props {
  /** Mensaje prellenado. Por defecto, WHATSAPP_DEFAULT_TEXT. */
  text?: string
  /** fixed flota sobre la página; inline lo deja en el flujo (canvases, layouts de prueba). */
  placement?: 'fixed' | 'inline'
}

const PLACEMENT = {
  fixed: 'fixed bottom-5 right-4 z-50',
  inline: 'relative',
}

/**
 * Botón flotante de WhatsApp: uno por página, abre el chat con el taller.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/buttons/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function WhatsAppFab({ text, placement = 'fixed' }: Props) {
  return (
    <a
      href={whatsappUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`${PLACEMENT[placement]} flex size-14 items-center justify-center rounded-full bg-accent text-primary shadow-[0_8px_24px_rgba(0,0,0,.5)] transition-transform duration-[var(--motion-fast)] ease-out active:scale-95`}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  )
}
