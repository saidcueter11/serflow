import { CITY, EMAIL, HOURS, WHATSAPP_DISPLAY, whatsappUrl } from '../../lib/business'

const LINK =
  'flex min-h-11 items-center gap-2 text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Pie del sitio: logo, qué es Serflow, horario y contacto (WhatsApp y correo), todo de
 * src/lib/business.ts. Sin íconos de redes "próximamente": se agregan cuando existan las cuentas.
 * pb-28 deja libre el WhatsAppFab fijo (56px + 20px de margen) sobre el último link.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/app-shell/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Footer({ logoSrc }: { logoSrc: string }) {
  return (
    <footer className="@container border-t border-line/60 bg-primary font-body text-[14px] text-muted">
      <div className="flex flex-col gap-6 px-4 pb-28 pt-8 @3xl:flex-row @3xl:items-start @3xl:justify-between @3xl:px-12 @3xl:pt-10">
        <div className="flex flex-col gap-3">
          <img src={logoSrc} alt="Serflow" width={69} height={24} className="h-6 w-auto self-start" />
          <p>Camisetas y gorras personalizadas · {CITY}</p>
        </div>
        <dl className="flex flex-col gap-1">
          {HOURS.map((h) => (
            <div key={h.days} className="flex gap-3">
              <dt>{h.days}</dt>
              <dd className="text-ink">{h.time}</dd>
            </div>
          ))}
        </dl>
        <ul className="flex flex-col">
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={LINK}>
              <span className="text-muted">WhatsApp</span> {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a href={`mailto:${EMAIL}`} className={`${LINK} min-w-0 break-all`}>
              {EMAIL}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
