import { whatsappUrl } from '../../lib/business'
import { WhatsAppIcon } from '../icons/WhatsappIcon'
import { Button } from './Button'

type Kind = 'offline' | 'load'

interface Props {
  /**
   * offline: el navegador no tiene señal (navigator.onLine false) cuando un bloque que se carga en el
   * cliente lo necesita, p. ej. el personalizador de PRI-122. load: hay señal pero la carga falló.
   * Las páginas SSG no llegan a ninguno de los dos: si Supabase falla en el build, el build falla.
   */
  kind: Kind
  /**
   * A dónde lleva "Reintentar": la URL de la página actual (en Astro, Astro.url.pathname).
   * Es un link normal, así que funciona sin JS. No se usa href="": Button lo trata como sin href
   * y renderiza un <button> que sin JS no hace nada.
   */
  retryHref: string
  title?: string
  description?: string
}

const COPY: Record<Kind, { title: string; description: string }> = {
  offline: {
    title: 'Sin conexión',
    description:
      'Parece que se fue la señal. Cuando vuelva, toca Reintentar. Por WhatsApp también nos puedes escribir: el mensaje sale apenas tengas señal.',
  },
  load: {
    title: 'No pudimos cargar esto',
    description: 'Algo falló al traer la información. Intenta otra vez o escríbenos por WhatsApp y te contamos.',
  },
}

/**
 * Algo falló: sin conexión o error al cargar. Siempre ofrece Reintentar (link, sin JS) y WhatsApp.
 * role="status": avisa sin interrumpir (nada aquí es urgente ni pierde datos).
 * No es para listas vacías (usa EmptyState) ni para la página 404.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/states/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function ErrorState({ kind, retryHref, title, description }: Props) {
  const copy = COPY[kind]
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-card border border-line bg-surface px-5 py-8 text-center font-body"
    >
      <span aria-hidden="true" className="flex size-14 items-center justify-center rounded-full bg-surface-2 text-danger">
        {kind === 'offline' ? (
          // Wifi tachado
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
            <path d="M3 3l18 18" />
          </svg>
        ) : (
          // Nube con signo de exclamación
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 18a4.5 4.5 0 0 1-.6-9 6 6 0 0 1 11.4 1.5A3.75 3.75 0 0 1 17.25 18Z" />
            <path d="M12 10v3.5" />
            <circle cx="12" cy="15.75" r=".6" fill="currentColor" />
          </svg>
        )}
      </span>
      <div className="flex max-w-[34ch] flex-col gap-2">
        <p className="font-display text-[18px] font-bold leading-snug text-ink">{title ?? copy.title}</p>
        <p className="text-[15px] leading-relaxed text-muted">{description ?? copy.description}</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="secondary"
          href={retryHref}
          icon={
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
            </svg>
          }
        >
          Reintentar
        </Button>
        <Button variant="ghost" href={whatsappUrl()} external icon={<WhatsAppIcon className="size-5" />}>
          Escríbenos por WhatsApp
        </Button>
      </div>
    </div>
  )
}
