import type { ReactNode } from 'react'

/** Una foto del producto. zoom es la versión grande solo para la lupa y el visor (PRI-546); sin ella usan src. */
export type FotoProducto = { src: string; srcSet?: string; alt: string; zoom?: string | null }

// Celular: la foto ocupa la pantalla menos la orilla de la siguiente; escritorio: 480 de ancho (3:4 de 640).
const SIZES = '(min-width: 48rem) 480px, calc(100vw - 48px)'

const Icono = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

/**
 * Galería de la ficha de producto (PRI-529). Celular: carrusel con la siguiente foto asomada, contador "1 / N" y puntos;
 * cada foto lleva "Mantén para acercar" (la lupa del celular), que se va después del primer uso. Escritorio (página
 * desde 48rem): miniaturas a la izquierda y una foto 3:4 de 640 de alto (--gp-alto la cambia) con "Pasa el mouse" (la
 * lupa al lado, panel Lupa). Con una sola foto no hay miniaturas, contador ni puntos. Tocar o hacer clic en la foto abre
 * VisorFotos con todas las fotos (data-fotos); el toque largo de la lupa no lo abre. La foto entra creciendo.
 * Un solo juego de <img>: en escritorio la pista se recorta a una foto y las miniaturas la corren.
 * Markup estático: la interacción es de src/scripts/lupa.ts y visor-fotos.ts (importarlos en la página). Va dentro de
 * .pf (las medidas de escritorio miden ese contenedor). Estilos: .gp-* en tokens.css.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function GaleriaProducto({ fotos, className = '' }: { fotos: FotoProducto[]; className?: string }) {
  const n = fotos.length
  return (
    <div data-galeria data-fotos={JSON.stringify(fotos)} data-n={n} className={`gp ${className}`}>
      {n > 1 && (
        <div className="gp-minis" role="group" aria-label="Fotos">
          {fotos.map((f, i) => (
            <button key={i} type="button" data-gp-ir={i} aria-label={`Ver foto ${i + 1}`} aria-current={i === 0}>
              <img src={f.src} srcSet={f.srcSet} sizes="72px" alt="" loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      )}
      <div className="gp-carrusel">
        <div className="gp-pista" data-gp-pista>
          {fotos.map((f, i) => (
            <button
              key={i}
              type="button"
              className="gp-foto"
              data-visor-abrir={i}
              aria-label={n > 1 ? `Ampliar foto ${i + 1} de ${n}` : 'Ampliar foto'}
            >
              <img
                src={f.src}
                srcSet={f.srcSet}
                sizes={SIZES}
                alt={f.alt}
                data-zoom={f.zoom || undefined}
                loading={i ? 'lazy' : 'eager'}
                fetchPriority={i ? undefined : 'high'}
                decoding="async"
                draggable={false}
              />
              <span className="gp-lente" aria-hidden="true" />
              <span className="gp-chip gp-chip-mouse" aria-hidden="true">
                <Icono>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </Icono>
                Pasa el mouse
              </span>
              <span className="gp-chip gp-chip-mantener" aria-hidden="true">
                <Icono>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
                </Icono>
                Mantén para acercar
              </span>
            </button>
          ))}
        </div>
        {n > 1 && (
          <>
            <span className="gp-contador" aria-hidden="true" data-gp-contador>{`1 / ${n}`}</span>
            <div className="gp-puntos" aria-hidden="true">
              {fotos.map((_, i) => (
                <span key={i} data-on={i === 0 || undefined} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
