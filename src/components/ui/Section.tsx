import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'

const TONE = {
  plain: '',
  panel: 'fabric rounded-card border border-line bg-surface p-5 @3xl:p-10',
}

/**
 * Envoltorio de sección del home: Eyebrow opcional, título h2 con costura dorada (stitch-title,
 * se cose al aparecer), descripción y contenido.
 * Padding px-4 py-8 en móvil, px-12 py-14 desde 768px de ancho (container query, no md:,
 * para que el canvas lo muestre igual). tone panel = superficie con trama (para "Hablemos").
 * scroll-mt-4 basta porque el Header no es sticky: el ancla no queda tapada.
 * Markup estático: Astro lo renderiza sin directivas de cliente.
 *
 * The canvas for this component is at tempo/designs/design-system/app-shell/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = 'plain',
}: {
  /** Ancla del nav (#quienes-somos, #que-hacemos, #disponible, #ubicacion). */
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  tone?: 'plain' | 'panel'
}) {
  const titleId = id ? `${id}-titulo` : undefined
  return (
    <section id={id} aria-labelledby={titleId} className="@container scroll-mt-4 font-body text-ink">
      <div className="px-4 py-8 @3xl:px-12 @3xl:py-14">
        <div className={TONE[tone]}>
          {eyebrow && (
            <div className="mb-4">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
          <h2 id={titleId} className="stitch-title font-display text-[28px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[40px]">
            {title}
          </h2>
          {description && <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted @3xl:text-[17px]">{description}</p>}
          <div className="mt-5 @3xl:mt-6">{children}</div>
        </div>
      </div>
    </section>
  )
}
