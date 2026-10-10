import type { CSSProperties } from 'react'

export type PromoLink = { title: string; href: string }

const SECONDS = 5

/**
 * Barra dorada de promos, fija arriba de todo (encima del Header). Solo se pinta si hay promos vigentes.
 * Con una, se queda quieta y enlaza a su detalle. Con varias, toda la barra es un solo link a /promos ("Ver las N"
 * quieto a la derecha) y los títulos rotan cada 5 s (sube uno, entra el otro), en pausa con el mouse o el foco y
 * quietos con reducir movimiento; para el lector de pantalla el link dice "Ver las N promos de hoy" y los títulos
 * que rotan quedan ocultos. No corre como la cinta: tiene que leerse de un vistazo. Markup estático, sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoBar({ promos }: { promos: PromoLink[] }) {
  const n = promos.length
  if (n === 0) return null
  const show = 100 / n
  const css =
    n > 1
      ? `@keyframes sf-promo-${n} { 0%, ${(show * 0.92).toFixed(2)}% { opacity: 1; transform: none } ${show.toFixed(2)}% { opacity: 0; transform: translateY(-100%) } ${(show + 0.01).toFixed(2)}%, ${(100 - show * 0.08).toFixed(2)}% { opacity: 0; transform: translateY(100%) } 100% { opacity: 1; transform: none } }
.anim-promo { animation: sf-promo-${n} ${n * SECONDS}s linear infinite both; animation-delay: var(--d); }
.promo-bar:hover .anim-promo, .promo-bar:focus-within .anim-promo { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .anim-promo { animation: none; } .anim-promo:not(:first-child) { visibility: hidden; } }`
      : ''
  return (
    <div className="promo-bar @container overflow-hidden bg-accent font-body text-primary">
      {css && <style>{css}</style>}
      <a
        href={n > 1 ? '/promos' : promos[0].href}
        className="flex min-h-16 items-center gap-3 px-4 py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary @4xl:justify-center @4xl:px-12"
        aria-label={n > 1 ? `Ver las ${n} promos de hoy` : undefined}
      >
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-[.12em] text-accent">
          {n > 1 ? `${n} promos` : 'Promo'}
        </span>
        <span className="grid min-w-0 flex-1 @4xl:flex-none" aria-hidden={n > 1 ? true : undefined}>
          {promos.map((p, i) => (
            <span
              key={p.href}
              className={`${n > 1 ? 'anim-promo' : ''} col-start-1 row-start-1 line-clamp-2 text-[14px] font-semibold leading-snug @4xl:text-[16px]`}
              style={{ '--d': `${i === 0 ? 0 : i * SECONDS - n * SECONDS}s` } as CSSProperties}
            >
              {p.title}
            </span>
          ))}
        </span>
        <span className="ml-auto shrink-0 text-[14px] font-bold underline underline-offset-4 @4xl:ml-0 @4xl:text-[15px]">
          {n > 1 ? `Ver las ${n}` : 'Ver promo'}
        </span>
      </a>
    </div>
  )
}
