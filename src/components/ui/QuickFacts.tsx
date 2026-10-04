import { PinIcon } from '../icons/PinIcon'
import { WhatsAppIcon } from '../icons/WhatsappIcon'
import { StatusPill } from './StatusPill'
import { ADDRESS, CITY, HOURS, WHATSAPP_DISPLAY, whatsappUrl } from '../../lib/business'

const ROW = 'flex min-h-14 items-center gap-3 px-4 text-[14px]'
const LINK_ROW = `${ROW} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent`

/**
 * Tarjeta de datos rápidos bajo el hero: dónde estamos, horario entre semana y WhatsApp.
 * Ubicación lleva a la sección del mapa (#ubicacion); WhatsApp abre el chat.
 * El sitio es estático y no sabe si el taller está abierto: openNow solo se muestra si quien
 * lo usa lo calcula y lo pasa (undefined = no se muestra nada).
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/business-info/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function QuickFacts({ openNow }: { openNow?: boolean }) {
  const weekday = HOURS[0]
  return (
    <ul className="divide-y divide-line rounded-card border border-line bg-surface font-body text-ink">
      <li>
        <a href="#ubicacion" className={LINK_ROW}>
          <PinIcon className="size-5 shrink-0 text-accent" />
          <span className="min-w-0">
            {CITY} · <span className="text-muted">{ADDRESS ?? 'Dirección por confirmar'}</span>
          </span>
          <span aria-hidden="true" className="ml-auto text-muted">›</span>
        </a>
      </li>
      <li className={`${ROW} justify-between`}>
        <span>
          {weekday.short} <span className="text-muted">{weekday.time}</span>
        </span>
        {openNow && <StatusPill tone="ok">Abierto ahora</StatusPill>}
      </li>
      <li>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={LINK_ROW}>
          <WhatsAppIcon className="size-5 shrink-0 text-accent" />
          <span className="min-w-0">
            {WHATSAPP_DISPLAY} <span className="text-muted">· te respondemos aquí</span>
          </span>
          <span aria-hidden="true" className="ml-auto text-muted">›</span>
        </a>
      </li>
    </ul>
  )
}
