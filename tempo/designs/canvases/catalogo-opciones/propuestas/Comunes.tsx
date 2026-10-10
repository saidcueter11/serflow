import type { ReactNode } from 'react'
import type { Foto, Prenda } from '../datos3'
import { CategoryNav, type CategoryLink } from './CategoryNav'

/*
 * PROPUESTA (PRI-130, ronda 3). Piezas que comparten las cuatro direcciones. Al aprobar, van a src/components/ui/
 * con su defineAsset; FotoCard no se crea: ProductCard gana name opcional (variante "solo foto").
 * Ninguna depende de nombre ni descripción de la prenda.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** "Nuevo": created_at de hace menos de 21 días. pill = píldora dorada; cinta = tira de cinta pegada (muro). */
export function Nuevo({ tone = 'pill', className = '' }: { tone?: 'pill' | 'cinta'; className?: string }) {
  const look =
    tone === 'cinta'
      ? 'rotate-6 px-3 py-1 shadow-[0_3px_8px_rgba(0,0,0,.4)] [clip-path:polygon(4%_0,100%_6%,96%_100%,0_94%)]'
      : 'rounded-full px-2.5 py-1 shadow-[0_2px_8px_rgba(0,0,0,.35)]'
  return <span className={`pointer-events-none inline-block bg-accent font-body text-[11px] font-bold uppercase leading-none tracking-[.08em] text-primary ${look} ${className}`}>Nuevo</span>
}

/** La prenda tiene varias fotos (image_urls): ícono de fotos apiladas + cuántas, como en Instagram. */
export function MasFotos({ n, className = '' }: { n: number; className?: string }) {
  if (n < 2) return null
  return (
    <span className={`pointer-events-none inline-flex items-center gap-1 rounded-full bg-primary/80 px-2 py-1 text-[12px] font-semibold leading-none text-ink ${className}`}>
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </svg>
      {n}
      <span className="sr-only">fotos</span>
    </span>
  )
}

/**
 * Una prenda como card de la portada (el lift, el zoom y el destape de ProductCard), solo foto: sin texto debajo.
 * La categoría y el número van en el alt. aspect por defecto 4:5.
 */
export function FotoCard({ p, aspect = '4 / 5', className = '' }: { p: Prenda; aspect?: string; className?: string }) {
  return (
    <a
      href={p.href}
      id={`f-${p.n}`}
      className={`group relative block w-full overflow-hidden rounded-card border border-line bg-surface no-underline transition-[transform,border-color] duration-(--motion-slow) ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:border-secondary ${FOCUS} ${className}`}
    >
      <div className="overflow-hidden">
        <img
          src={p.fotos[0].src}
          alt={p.alt}
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: aspect }}
          className="fabric reveal-wipe h-auto w-full bg-surface-2 object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />
      </div>
      {p.nuevo && <Nuevo className="absolute left-2.5 top-2.5" />}
      <MasFotos n={p.fotos.length} className="absolute right-2.5 top-2.5" />
    </a>
  )
}

/**
 * Las fotos de UNA prenda en el visor: carrusel con scroll-snap (se desliza sin JS). Puntos debajo; con ~10 líneas
 * de JS el punto activo sigue al scroll. La foto va entera (object-contain) sobre la trama.
 */
export function FotosPrenda({ p, aspect = '3 / 4', className = '', rounded = '', papel = false }: { p: Prenda; aspect?: string; className?: string; rounded?: string; /** Sobre el papel claro del muro: puntos y texto oscuros. */ papel?: boolean }) {
  return (
    <div className={className}>
      <ul aria-label={`Fotos de ${p.label} N.º ${p.n}`} className={`flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] ${rounded}`}>
        {p.fotos.map((f: Foto, i) => (
          <li key={f.src + i} id={`p${p.n}-${i + 1}`} className="fabric w-full shrink-0 snap-center bg-surface-2" style={{ aspectRatio: aspect }}>
            <img
              src={f.src}
              alt={i === 0 ? p.alt : `${p.alt}, foto ${i + 1} de ${p.fotos.length}`}
              width={900}
              height={1200}
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              className="size-full object-contain"
            />
          </li>
        ))}
      </ul>
      {p.fotos.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2 @3xl:hidden" aria-hidden="true">
          {p.fotos.map((f, i) => (
            <span key={f.src + i} className={`h-1.5 rounded-full ${i === 0 ? `w-5 ${papel ? 'bg-accent-deep' : 'bg-accent'}` : `w-1.5 ${papel ? 'bg-primary/35' : 'bg-muted/60'}`}`} />
          ))}
          <span className={`ml-1 text-[12px] ${papel ? 'text-primary/80' : 'text-muted'}`}>Desliza · {p.fotos.length} fotos</span>
        </div>
      )}
      {/* Desde @3xl (mouse y teclado): miniaturas que son links a cada foto del carrusel (#p26-2), sin JS. */}
      {p.fotos.length > 1 && (
        <ul aria-label="Elegir foto" className="mt-3 hidden justify-center gap-2 @3xl:flex">
          {p.fotos.map((f, i) => (
            <li key={f.src + i}>
              <a
                href={`#p${p.n}-${i + 1}`}
                aria-label={`Ver foto ${i + 1} de ${p.fotos.length}`}
                aria-current={i === 0 ? 'true' : undefined}
                className={`block size-14 overflow-hidden rounded-tile border-2 ${i === 0 ? 'border-accent' : papel ? 'border-primary/20 hover:border-primary/60' : 'border-line hover:border-muted'} ${FOCUS}`}
              >
                <img src={f.src} alt="" width={56} height={56} className="size-full object-cover" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Bienvenida del catálogo: h1 con costura, una línea cálida y las categorías con conteo. children va entre texto y chips. */
export function Bienvenida({
  titulo,
  texto,
  chips,
  current,
  children,
  center = false,
}: {
  titulo: string
  texto: string
  chips?: CategoryLink[]
  current?: string
  children?: ReactNode
  center?: boolean
}) {
  return (
    <div className={`@container px-4 pt-6 @3xl:px-12 @3xl:pt-10 ${center ? 'text-center' : ''}`}>
      <h1 className={`stitch-title font-display text-[38px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[64px] ${center ? '[&::after]:mx-auto' : ''}`}>{titulo}</h1>
      <p className={`mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted @3xl:text-[18px] ${center ? 'mx-auto' : ''}`}>{texto}</p>
      {children}
      {chips && (
        <div className="mt-5">
          <CategoryNav categories={chips} current={current ?? ''} />
        </div>
      )}
    </div>
  )
}
