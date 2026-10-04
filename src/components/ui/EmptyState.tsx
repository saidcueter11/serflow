import { Button } from './Button'
import { MascotSlot } from './MascotSlot'

interface Props {
  /** Qué no hay, en una frase corta: "No hay prendas disponibles en este momento". */
  title: string
  /** Qué puede hacer el cliente ahora. */
  description: string
  /**
   * La salida. Un link de WhatsApp (https://wa.me/, de whatsappUrl() en src/lib/business) se pinta
   * con el botón whatsapp y abre en otra pestaña; cualquier otro href, con el botón secondary.
   */
  action?: { label: string; href: string }
  /**
   * Muestra la mascota (MascotSlot md) en vez del ícono. Solo si no hay otra mascota en la página:
   * la regla de una por página es de composición y este componente no la puede ver. Por defecto false.
   */
  mascot?: boolean
}

/**
 * "Todavía no hay nada aquí": una lista o sección que el cliente vino a ver y hoy está vacía
 * (Disponible ahora sin prendas confirmadas, una categoría sin productos). No es un error (usa
 * ErrorState) y no es para secciones opcionales vacías: esas no se renderizan.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/states/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function EmptyState({ title, description, action, mascot = false }: Props) {
  const isWhatsApp = action?.href.startsWith('https://wa.me/') ?? false
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface px-5 py-8 text-center font-body">
      {mascot ? (
        <MascotSlot size="md" />
      ) : (
        <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-accent">
          {/* Camiseta en contorno */}
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M8 3 3.5 5.5 2 10l3 1v10h14V11l3-1-1.5-4.5L16 3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3Z" />
          </svg>
        </span>
      )}
      <div className="flex max-w-[34ch] flex-col gap-2">
        <p className="font-display text-[18px] font-bold leading-snug text-ink">{title}</p>
        <p className="text-[15px] leading-relaxed text-muted">{description}</p>
      </div>
      {action && (
        <Button variant={isWhatsApp ? 'whatsapp' : 'secondary'} href={action.href} external={isWhatsApp}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
