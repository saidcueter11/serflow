import type { CSSProperties, ReactNode } from 'react'

export type Slide = { src: string; srcSet?: string; alt: string; position?: string }

/** A sangre: la foto mide lo que mide la pantalla. */
export const HERO_SIZES = '100vw'

const SECONDS = 6
const FADE = 1

/**
 * Carrusel del hero: fotos que muestran el resultado (no decoración), a sangre, con fundido y zoom lento (PRI-286).
 * children va encima (el texto de bienvenida, con .pf-hero-texto). Las barras de avance (una por foto, la de la que se
 * ve se llena en sus 6 s) van en el margen de la rejilla: debajo del botón en el celular, abajo a la derecha en desktop.
 * Se pausa con el mouse o el foco; con "reducir movimiento" queda la primera foto y solo su barra llena (tokens.css).
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
  const fade = (FADE / cycle) * 100
  const css =
    n > 1
      ? `@keyframes sf-slide-${n} { 0%, ${show.toFixed(2)}% { opacity: 1 } ${(show + fade).toFixed(2)}%, ${(100 - fade).toFixed(2)}% { opacity: 0 } 100% { opacity: 1 } }
@keyframes sf-bar-${n} { 0% { transform: scaleX(0) } ${show.toFixed(2)}% { transform: scaleX(1) } ${(show + 0.01).toFixed(2)}%, 100% { transform: scaleX(0) } }
.anim-slide { animation: sf-slide-${n} ${cycle}s linear infinite both; animation-delay: var(--d); }
.anim-bar { transform-origin: left; animation: sf-bar-${n} ${cycle}s linear infinite both; animation-delay: var(--d); }
.hero-carousel:hover :is(.anim-slide, .anim-slide *, .anim-bar), .hero-carousel:focus-within :is(.anim-slide, .anim-slide *, .anim-bar) { animation-play-state: paused; }`
      : ''
  // La foto i se muestra en el segundo i*6; con delay negativo arrancan todas a la vez. Todas un fundido adelante: al
  // cargar, la última ya se fue y no tapa a la primera mientras esta se asienta (sf-asienta, tokens.css).
  const delay = (i: number) => ({ '--d': `${(i === 0 ? 0 : i * SECONDS - cycle) - FADE}s`, '--zoom-duration': `${cycle}s` }) as CSSProperties

  return (
    <div className={`hero-carousel relative overflow-hidden bg-surface-2 ${className}`} aria-roledescription="carrusel" aria-label="Trabajos de Serflow">
      {css && <style>{css}</style>}
      {slides.map((s, i) => (
        <figure key={s.src} className={`${n > 1 ? 'anim-slide' : ''} absolute inset-0 m-0`} style={delay(i)} aria-hidden={i !== 0 || undefined}>
          <img
            src={s.src}
            srcSet={s.srcSet}
            sizes={s.srcSet ? HERO_SIZES : undefined}
            alt={s.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            decoding="async"
            className="anim-zoom h-full w-full object-cover"
            style={{ objectPosition: s.position }}
          />
        </figure>
      ))}
      <div className="hero-velo pointer-events-none absolute inset-0" />
      {children}
      {n > 1 && (
        <div className="hero-barras" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.src} className="h-1 overflow-hidden rounded-full">
              <span className="anim-bar block h-full bg-ink" style={delay(i)} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
