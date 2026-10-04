import type { ReactNode } from 'react'
import { EMAIL, SOCIAL, WHATSAPP_DISPLAY, whatsappUrl } from '../../lib/business'
import { WhatsAppIcon } from '../icons/WhatsappIcon'
import { MailIcon } from '../icons/MailIcon'
import { InstagramIcon } from '../icons/InstagramIcon'
import { TiktokIcon } from '../icons/TiktokIcon'
import { FacebookIcon } from '../icons/FacebookIcon'

const ICON = 'size-5'
const SOCIAL_ICONS: Record<(typeof SOCIAL)[number]['name'], ReactNode> = {
  Instagram: <InstagramIcon className={ICON} />,
  TikTok: <TiktokIcon className={ICON} />,
  Facebook: <FacebookIcon className={ICON} />,
}

function Tile({ href, icon, name, value, external = true }: { href: string; icon: ReactNode; name: string; value: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex min-h-16 min-w-0 items-center gap-3 rounded-tile border border-line bg-surface px-3 py-2 transition-colors duration-[var(--motion-fast)] hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">{icon}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[12px] text-muted">{name}</span>
        <span className="truncate text-[14px] font-semibold text-ink">{value}</span>
      </span>
    </a>
  )
}

/**
 * Formas de contacto como tarjetas tocables (64px): WhatsApp, correo y redes (SOCIAL en business.ts).
 * Una columna en teléfono; dos cuando el contenedor tiene espacio. WhatsApp va primero y ocupa el ancho.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/business-info/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function ContactList() {
  return (
    <ul className="@container grid gap-2 font-body">
      <li>
        <Tile href={whatsappUrl()} icon={<WhatsAppIcon className={ICON} />} name="WhatsApp" value={WHATSAPP_DISPLAY} />
      </li>
      <li className="grid gap-2 @md:grid-cols-2">
        <Tile href={`mailto:${EMAIL}`} icon={<MailIcon className={ICON} />} name="Correo" value={EMAIL} external={false} />
        {SOCIAL.map((s) => (
          <Tile key={s.name} href={s.url} icon={SOCIAL_ICONS[s.name]} name={s.name} value={s.handle} />
        ))}
      </li>
    </ul>
  )
}
