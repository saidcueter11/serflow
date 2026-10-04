import { EMAIL, SOCIAL, WHATSAPP_DISPLAY, whatsappUrl } from '../../lib/business'

const ROW =
  'flex min-h-14 items-center justify-between gap-3 px-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent'
const LABEL = 'shrink-0 text-[13px] uppercase tracking-[.08em] text-muted'

/**
 * Lista de contacto: WhatsApp, correo y redes (SOCIAL en business.ts), una fila tocable de 56px cada una.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/business-info/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function ContactList() {
  return (
    <ul className="divide-y divide-line rounded-card border border-line bg-surface font-body text-ink">
      <li>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={ROW}>
          <span className={LABEL}>WhatsApp</span>
          <span className="text-[15px] font-semibold">{WHATSAPP_DISPLAY}</span>
        </a>
      </li>
      <li>
        <a href={`mailto:${EMAIL}`} className={ROW}>
          <span className={LABEL}>Correo</span>
          <span className="min-w-0 truncate text-[13px]">{EMAIL}</span>
        </a>
      </li>
      {SOCIAL.map((s) => (
        <li key={s.name}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" className={ROW}>
            <span className={LABEL}>{s.name}</span>
            <span className="text-[15px]">{s.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
