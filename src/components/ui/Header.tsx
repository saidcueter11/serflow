import { Button } from './Button'
import { WHATSAPP_URL } from '../../lib/business'

type Link = { label: string; href: string }

// Con "/" delante para que funcionen desde cualquier página. Sin "Ubicación": decisión de Said (PRI-129),
// el mapa vive en lugares distintos en mobile y desktop.
export const NAV_LINKS: Link[] = [
  { label: 'Quiénes somos', href: '/#quienes-somos' },
  { label: 'Qué hacemos', href: '/#que-hacemos' },
  { label: 'Disponible ahora', href: '/#disponible' },
]

const LINK = {
  desktop: 'flex min-h-11 items-center text-[15px] font-medium transition-colors duration-(--motion-fast) hover:text-ink',
  mobile: 'flex min-h-12 items-center px-4 text-[16px] font-semibold',
}
const STATE = { current: 'text-ink', other: 'text-muted' }
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Cabecera del sitio. Desktop (desde 896px de ancho): logo + nav + Button whatsapp.
 * Móvil: logo + menú con <details>/<summary>, cero JS; el panel se abre encima del contenido.
 * No es sticky ni fixed: en móvil no le quita alto a la pantalla ni repinta con el scroll;
 * el WhatsAppFab ya da la acción principal siempre a mano.
 * Usa container queries (@container) y no md:, así se ve igual en la página y en el canvas.
 * logoSrc lo pasa quien la usa: en Astro `Logo.src`, en el canvas la URL del import.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/app-shell/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Header({ logoSrc, links = NAV_LINKS, current }: { logoSrc: string; links?: Link[]; current?: string }) {
  return (
    <header className="@container relative border-b border-line/60 bg-primary font-body text-ink">
      <div className="flex items-center justify-between gap-4 px-4 py-2 @4xl:px-12 @4xl:py-4">
        <a href="/" aria-label="Serflow, inicio" className={`flex min-h-11 items-center rounded-tile ${FOCUS}`}>
          <img src={logoSrc} alt="Serflow" width={80} height={28} className="h-7 w-auto @4xl:h-9" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-7 @4xl:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={l.href === current ? 'true' : undefined}
              className={`${LINK.desktop} ${STATE[l.href === current ? 'current' : 'other']} ${FOCUS}`}
            >
              {l.label}
            </a>
          ))}
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Escríbenos
          </Button>
        </nav>

        <details className="group @4xl:hidden">
          <summary
            aria-label="Abrir menú"
            className={`relative flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden ${FOCUS}`}
          >
            <span
              aria-hidden="true"
              className="block h-0.5 w-5 bg-ink shadow-[0_6px_0_var(--color-ink),0_-6px_0_var(--color-ink)] group-open:rotate-45 group-open:shadow-none"
            />
            <span aria-hidden="true" className="absolute hidden h-0.5 w-5 -rotate-45 bg-ink group-open:block" />
          </summary>
          <div className="absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-b border-line bg-surface pb-5 pt-2 shadow-[0_16px_32px_rgba(0,0,0,.45)]">
            <nav aria-label="Principal" className="flex flex-col divide-y divide-line">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={l.href === current ? 'true' : undefined}
                  className={`${LINK.mobile} ${STATE[l.href === current ? 'current' : 'other']} ${FOCUS}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="px-4">
              <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
                Escríbenos por WhatsApp
              </Button>
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}
