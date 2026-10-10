import type { ReactNode } from 'react'
import { Thread } from '../../../../../src/components/ui/Thread'
import type { Prenda } from '../datos3'
import { MasFotos, Nuevo } from './Comunes'

/*
 * PROPUESTA (PRI-130, ronda 3 · dirección 1 "Muro del taller"). El catálogo como el muro de un taller: fotos
 * impresas con borde de papel, pegadas con cinta o clavadas con alfiler, un poco torcidas, cada una con su
 * marquilla cosida (categoría + número). El hilo de la portada cruza el muro por detrás.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/** Giro fijo por posición (no aleatorio: el muro se ve igual en cada visita y en el canvas). */
const GIRO = ['-rotate-2', 'rotate-1', 'rotate-[-1deg]', 'rotate-2', 'rotate-[1.5deg]', 'rotate-[-1.5deg]', 'rotate-[0.5deg]', '-rotate-1']

/** Marquilla cosida: etiqueta oscura con puntada dorada por dentro. */
export function Marquilla({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block max-w-full truncate rounded-[3px] bg-primary px-2 py-1.5 font-display text-[12px] font-bold uppercase leading-none tracking-[.06em] text-accent @3xl:px-2.5 @3xl:tracking-[.12em] outline-1 -outline-offset-[3px] outline-accent/70 [outline-style:dashed] ${className}`}
    >
      {children}
    </span>
  )
}

/** Alfiler dorado, centrado arriba de un padre relative. */
export const Alfiler = () => (
  <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full bg-accent shadow-[0_4px_4px_rgba(0,0,0,.55)] ring-2 ring-accent-deep" />
)

function Fijacion({ i }: { i: number }) {
  // Cinta en 2 de cada 3; alfiler en la tercera.
  return i % 3 === 2 ? (
    <Alfiler />
  ) : (
    <span aria-hidden="true" className={`absolute -top-3 left-1/2 z-10 h-6 w-[38%] -translate-x-1/2 bg-secondary/45 shadow-[0_1px_2px_rgba(0,0,0,.25)] ${i % 2 ? 'rotate-3' : '-rotate-3'}`} />
  )
}

/**
 * Una prenda impresa en el muro. Toda es un link al visor. Al pasar el mouse se endereza y sube (el lift de
 * ProductCard) y la foto hace zoom; al entrar en pantalla se destapa (reveal-wipe). grande = la del visor, derecha.
 */
export function Polaroid({ p, i = 0, grande = false, children }: { p: Prenda; i?: number; grande?: boolean; children?: ReactNode }) {
  const papel = `relative block bg-ink p-2 pb-3 shadow-[0_12px_24px_rgba(0,0,0,.5)] @3xl:p-3 @3xl:pb-4`
  const contenido = (
    <>
      <Fijacion i={grande ? 0 : i} />
      <div className={`overflow-hidden ${children ? '' : 'bg-surface-2'}`}>
        {children ?? (
          <img
            src={p.fotos[0].src}
            alt={p.alt}
            width={400}
            height={500}
            loading="lazy"
            decoding="async"
            className="fabric reveal-wipe aspect-[4/5] h-auto w-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        )}
      </div>
      {/* Varias fotos: en la esquina de la foto, así la marquilla tiene la fila entera. */}
      <MasFotos n={grande ? 0 : p.fotos.length} className="absolute bottom-12 right-3.5 z-10 @3xl:bottom-14 @3xl:right-5" />
      <div className="mt-2 flex min-w-0 @3xl:mt-3">
        {/* En el celular solo la categoría (el número está en el alt y en el visor); desde @3xl, también el N.º. */}
        <Marquilla>
          {p.label}
          <span className={grande ? '' : 'hidden @3xl:inline @6xl:hidden'}> · N.º {p.n}</span>
        </Marquilla>
      </div>
      {p.nuevo && <Nuevo tone="cinta" className="absolute -right-2 top-5 z-10" />}
    </>
  )
  if (grande) return <figure className={`m-0 ${papel}`}>{contenido}</figure>
  return (
    <a
      href={p.href}
      id={`f-${p.n}`}
      className={`group ${papel} ${GIRO[i % GIRO.length]} transition-transform duration-(--motion-slow) ease-out motion-reduce:transition-none hover:-translate-y-1 motion-reduce:hover:translate-y-0 hover:rotate-0 ${FOCUS}`}
    >
      {contenido}
    </a>
  )
}

/**
 * El muro: superficie con trama, el hilo de la portada detrás (Thread con tamaño fijo en el canvas; en el sitio
 * lo dibuja src/scripts/thread.ts) y las prendas en 2 columnas (4 desde @3xl, 5 desde @6xl).
 * hilo = alto del muro para el canvas; en el sitio va sin props.
 */
export function Muro({ prendas, hilo, children }: { prendas: Prenda[]; hilo?: { width: number; height: number }; children?: ReactNode }) {
  return (
    <div className="@container">
      <div className="fabric relative overflow-hidden border-y border-line bg-surface @3xl:mx-12 @3xl:rounded-card @3xl:border">
        {hilo && <Thread width={hilo.width} height={hilo.height} viewport={260} />}
        <div className="relative z-10 px-5 pb-10 pt-8 @3xl:px-10 @3xl:pb-14 @3xl:pt-12">
          {children ?? (
            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-8 @3xl:gap-y-12 @6xl:grid-cols-5">
              {prendas.map((p, i) => (
                <li key={p.href}>
                  <Polaroid p={p} i={i} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
