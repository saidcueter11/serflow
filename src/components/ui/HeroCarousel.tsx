import type { CSSProperties, ReactNode } from 'react'

export type Slide = { src: string; alt: string; caption: string; promo?: boolean; position?: string }

const SECONDS = 6

/**
 * Carrusel del hero: fotos que muestran el resultado (no decoración), con fundido y zoom lento.
 * Cada foto lleva su etiqueta ("Gorras bordadas"); la de una promo va en dorado. children va encima
 * (el texto de bienvenida). Se pausa con el mouse o el foco y se queda quieto con "reducir movimiento".
 * CSS puro: las keyframes se generan para la cantidad de fotos. Markup estático, sin JS.
 * La primera foto carga eager (es el LCP); las demás lazy.
 *
 * The canvas for this component is at tempo/designs/design-system/motion/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function HeroCarousel({ slides, children, className = '' }: { slides: Slide[]; children?: ReactNode; className?: string }) {
  const n = slides.length
  const cycle = n * SECONDS
  const show = 100 / n
  const fade = (1 / cycle) * 100 // 1 s de fundido
  const css =
    n > 1
      ? `@keyframes sf-slide-${n} { 0%, ${show.toFixed(2)}% { opacity: 1 } ${(show + fade).toFixed(2)}%, ${(100 - fade).toFixed(2)}% { opacity: 0 } 100% { opacity: 1 } }
@keyframes sf-cap-${n} { 0%, ${(fade / 2).toFixed(2)}% { opacity: 0 } ${fade.toFixed(2)}%, ${(show - fade / 2).toFixed(2)}% { opacity: 1 } ${show.toFixed(2)}%, 100% { opacity: 0 } }
@keyframes sf-bar-${n} { 0% { transform: scaleX(0) } ${show.toFixed(2)}% { transform: scaleX(1) } ${(show + 0.01).toFixed(2)}%, 100% { transform: scaleX(0) } }
.anim-slide { animation: sf-slide-${n} ${cycle}s linear infinite both; animation-delay: var(--d); }
.anim-slide figcaption { animation: sf-cap-${n} ${cycle}s linear infinite both; animation-delay: var(--d); }
.anim-bar { transform-origin: left; animation: sf-bar-${n} ${cycle}s linear infinite both; animation-delay: var(--d); }
.hero-carousel:hover :is(.anim-slide, .anim-slide *, .anim-bar), .hero-carousel:focus-within :is(.anim-slide, .anim-slide *, .anim-bar) { animation-play-state: paused; }`
      : ''
  // La foto i se muestra en el segundo i*6; con delay negativo arrancan todas a la vez.
  const delay = (i: number) => ({ '--d': `${i === 0 ? 0 : i * SECONDS - cycle}s`, '--zoom-duration': `${cycle}s` }) as CSSProperties

  return (
    <div className={`hero-carousel relative overflow-hidden bg-surface-2 ${className}`} aria-roledescription="carrusel" aria-label="Trabajos de Serflow">
      {css && <style>{css}</style>}
      {slides.map((s, i) => (
        <figure key={s.src} className={`${n > 1 ? 'anim-slide' : ''} absolute inset-0 m-0`} style={delay(i)} aria-hidden={i !== 0 || undefined}>
          <img
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            decoding="async"
            className="anim-zoom h-full w-full object-cover"
            style={{ objectPosition: s.position }}
          />
          <figcaption
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[13px] font-semibold ${s.promo ? 'bg-accent text-primary' : 'bg-primary/80 text-ink'}`}
          >
            {s.caption}
          </figcaption>
        </figure>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
      {children}
      {n > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.src} className="h-1 w-7 overflow-hidden rounded-full bg-ink/25">
              <span className="anim-bar block h-full bg-accent" style={delay(i)} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
