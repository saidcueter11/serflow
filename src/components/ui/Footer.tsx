import type { ReactNode } from 'react'
import { CITY, EMAIL, SOCIAL } from '../../lib/business'
import { InstagramIcon } from '../icons/InstagramIcon'
import { TiktokIcon } from '../icons/TiktokIcon'
import { FacebookIcon } from '../icons/FacebookIcon'

const SOCIAL_ICONS: Record<(typeof SOCIAL)[number]['name'], ReactNode> = {
  Instagram: <InstagramIcon className="size-5" />,
  TikTok: <TiktokIcon className="size-5" />,
  Facebook: <FacebookIcon className="size-5" />,
}

const LINK =
  'flex min-h-11 items-center gap-2 text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Pie del sitio: logo, qué es Serflow, link a "Cómo llegar y horario" (el mapa de la portada), correo
 * y los íconos de las redes (SOCIAL) como botones de 44px. Sin dirección, horario ni WhatsApp: viven una
 * sola vez en Visítanos y en el WhatsAppFab (PRI-129). Sin fondo propio: deja ver el hilo de la portada.
 * pb-28 deja libre el WhatsAppFab fijo (56px + 20px de margen) sobre el último link.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/app-shell/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Footer({ logoSrc }: { logoSrc: string }) {
  return (
    <footer className="@container relative border-t border-line/60 font-body text-[14px] text-muted">
      <div className="flex flex-col gap-6 px-4 pb-28 pt-8 @3xl:flex-row @3xl:items-start @3xl:justify-between @3xl:px-12 @3xl:pt-10">
        <div className="flex flex-col gap-3">
          <img src={logoSrc} alt="Serflow" width={69} height={24} className="h-6 w-auto self-start" />
          <p>Camisetas y gorras personalizadas · {CITY}</p>
          <a href="/#visitanos" className={LINK}>
            Cómo llegar y horario →
          </a>
        </div>
        <ul className="flex flex-col">
          <li>
            <a href={`mailto:${EMAIL}`} className={`${LINK} min-w-0 break-all`}>
              {EMAIL}
            </a>
          </li>
          <li className="mt-2 flex gap-2">
            {SOCIAL.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Serflow en ${s.name}`}
                className="flex size-11 items-center justify-center rounded-full border border-line text-accent transition-colors duration-[var(--motion-fast)] hover:border-accent hover:bg-accent/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {SOCIAL_ICONS[s.name]}
              </a>
            ))}
          </li>
        </ul>
      </div>
    </footer>
  )
}
