import type { ReactNode } from 'react'
import { PinIcon } from '../icons/PinIcon'
import { ClockIcon } from '../icons/ClockIcon'
import { WhatsAppIcon } from '../icons/WhatsappIcon'
import { StatusPill } from './StatusPill'
import { ADDRESS, HOURS, WHATSAPP_DISPLAY, whatsappUrl } from '../../lib/business'

const ITEM = 'flex min-h-12 min-w-0 items-center gap-3 text-left'
const LINK = `${ITEM} rounded-tile focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[12px] text-muted">{label}</span>
        <span className="text-[14px] font-semibold leading-snug text-ink">{children}</span>
      </span>
    </>
  )
}

/**
 * Datos rápidos bajo el titular: dónde estamos, horario y WhatsApp. Sin caja: tres datos con ícono,
 * apilados en teléfono y en fila cuando el contenedor tiene espacio.
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
    <div className="@container font-body">
      <ul className="grid gap-3 @2xl:grid-cols-3 @2xl:gap-6">
        <li>
          <a href="#ubicacion" className={LINK}>
            <Fact icon={<PinIcon className="size-5" />} label="Dónde estamos">
              {ADDRESS ?? 'Dirección por confirmar'}
            </Fact>
          </a>
        </li>
        <li className={ITEM}>
          <Fact icon={<ClockIcon className="size-5" />} label={weekday.days}>
            {weekday.time}
          </Fact>
          {openNow && (
            <span className="ml-auto">
              <StatusPill tone="ok">Abierto ahora</StatusPill>
            </span>
          )}
        </li>
        <li>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={LINK}>
            <Fact icon={<WhatsAppIcon className="size-5" />} label="WhatsApp">
              {WHATSAPP_DISPLAY}
            </Fact>
          </a>
        </li>
      </ul>
    </div>
  )
}
