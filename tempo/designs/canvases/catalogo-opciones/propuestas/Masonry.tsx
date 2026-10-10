import type { Prenda } from '../datos3'
import { MasFotos, Nuevo } from './Comunes'

/*
 * PROPUESTA (PRI-130, ronda 3 · dirección 2 "Pinterest / Unsplash"). Fotos protagonistas en columnas de alturas
 * mezcladas, sin texto. La categoría sale como chip al pasar el mouse o al enfocar con teclado; en el celular
 * no hay hover, así que va en el alt y en el visor.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Las fotos del catálogo son todas 3:4 con la prenda al centro: el ritmo de alturas sale de recortarlas con este
 * patrón fijo (la prenda sigue entera en 1:1). Las de gente (Unsplash) mantienen su proporción.
 */
const RITMO = [3 / 4, 1, 4 / 5, 2 / 3, 1, 3 / 4, 4 / 5, 1]

const ratio = (p: Prenda, i: number) => (p.fotos[0].ratio === 3 / 4 ? RITMO[i % RITMO.length] : p.fotos[0].ratio)

export function TileMasonry({ p, i }: { p: Prenda; i: number }) {
  return (
    <a href={p.href} id={`f-${p.n}`} className={`group relative block overflow-hidden rounded-tile bg-surface-2 ${FOCUS}`}>
      <img
        src={p.fotos[0].src}
        alt={p.alt}
        width={400}
        height={Math.round(400 / ratio(p, i))}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: ratio(p, i) }}
        className="fabric reveal-wipe h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/80 to-transparent opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 left-2.5 rounded-full border border-line bg-primary/85 px-3 py-1.5 text-[13px] font-semibold leading-none text-ink opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {p.label}
      </span>
      {p.nuevo && <Nuevo className="absolute left-2.5 top-2.5" />}
      <MasFotos n={p.fotos.length} className="absolute right-2.5 top-2.5" />
    </a>
  )
}

/** Columnas CSS (sin JS ni librería): 2 en el celular, 3 desde @3xl, 4 desde @6xl. El orden baja por columna. */
export function Masonry({ prendas, offset = 0 }: { prendas: Prenda[]; offset?: number }) {
  return (
    <div className="@container">
      <ul className="columns-2 gap-2 @3xl:columns-3 @3xl:gap-3 @6xl:columns-4">
        {prendas.map((p, i) => (
          <li key={p.href} className="mb-2 break-inside-avoid @3xl:mb-3">
            <TileMasonry p={p} i={i + offset} />
          </li>
        ))}
      </ul>
    </div>
  )
}
