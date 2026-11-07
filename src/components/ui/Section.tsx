import type { ReactNode } from 'react'
import { Button } from './Button'

/**
 * Sección de página con la cabecera del sistema medido (PRI-286): título h2, bajada pegada
 * a él y, si hay, una acción secundaria. En desktop la acción va en la fila del título, a la derecha; en el celular, al
 * pie de la sección y a lo ancho. Aire entre secciones y márgenes de la rejilla: .pf-sec y .pf-c (tokens.css), así que
 * va dentro de una página .pf. scroll-mt-4 basta porque el Header no es sticky: el ancla no queda tapada.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/app-shell/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Section({
  id,
  title,
  description,
  action,
  children,
}: {
  /** Ancla del nav (#que-hacemos, #disponible...). El título queda como <id>-titulo. */
  id?: string
  title: string
  description?: string
  /** Acción secundaria de la sección (p. ej. "Ver todo →"). */
  action?: { label: string; href: string }
  children: ReactNode
}) {
  const titleId = id ? `${id}-titulo` : undefined
  return (
    <section id={id} aria-labelledby={titleId} className="pf-sec pf-c scroll-mt-4 font-body text-ink">
      <div className="pf-head">
        <h2 id={titleId} className="pf-h2">
          {title}
        </h2>
        {description && <p className="pf-lead">{description}</p>}
        {action && (
          <div className="pf-accion">
            <Button variant="secondary" href={action.href}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
      {children}
      {action && (
        <div className="pf-accion-pie">
          <Button variant="secondary" href={action.href} fullWidth>
            {action.label}
          </Button>
        </div>
      )}
    </section>
  )
}
