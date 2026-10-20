import { NewBadge } from './NewBadge'

/** Una foto del muro. img ya optimizada (getImage); ratio = ancho / alto de la foto original. */
export type MasonryTile = {
  href: string
  /** id del link, para volver a esta foto desde el visor (#f-<slug>). */
  id?: string
  img: { src: string; srcSet?: string; alt: string; ratio: number }
  /** Categoría: chip que aparece con el mouse o el foco de teclado. */
  label: string
  nuevo?: boolean
  /** Cuántas fotos tiene la prenda (image_urls). Con 2 o más sale el contador. */
  photos?: number
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Las fotos del catálogo son todas 3:4 con la prenda al centro: el ritmo de alturas sale de recortarlas con este
 * patrón fijo (la prenda sigue entera en 1:1). Las de otra proporción mantienen la suya.
 */
const RITMO = [3 / 4, 1, 4 / 5, 2 / 3, 1, 3 / 4, 4 / 5, 1]
const ratioOf = (r: number, i: number) => (Math.abs(r - 3 / 4) < 0.02 ? RITMO[i % RITMO.length] : r)

/** La prenda tiene varias fotos: ícono de fotos apiladas + cuántas, como en Instagram. */
function PhotoCount({ n }: { n: number }) {
  return (
    <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-primary/80 px-2 py-1 text-[12px] font-semibold leading-none text-ink">
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </svg>
      {n}
      <span className="sr-only">fotos</span>
    </span>
  )
}

function Tile({ t, i }: { t: MasonryTile; i: number }) {
  const ratio = ratioOf(t.img.ratio, i)
  return (
    <a href={t.href} id={t.id} className={`group relative block scroll-mt-4 overflow-hidden rounded-tile bg-surface-2 ${FOCUS}`}>
      <img
        src={t.img.src}
        srcSet={t.img.srcSet}
        sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
        alt={t.img.alt}
        width={400}
        height={Math.round(400 / ratio)}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: ratio }}
        className="fabric reveal-wipe h-auto w-full object-cover transition-transform duration-(--motion-slow) ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/80 to-transparent opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 left-2.5 rounded-full border border-line bg-primary/85 px-3 py-1.5 text-[13px] font-semibold leading-none text-ink opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {t.label}
      </span>
      {t.nuevo && <NewBadge className="absolute left-2.5 top-2.5" />}
      {(t.photos ?? 1) > 1 && <PhotoCount n={t.photos!} />}
    </a>
  )
}

/**
 * Muro de fotos del catálogo (PRI-130, dirección "Pinterest / Unsplash"): columnas CSS de alturas mezcladas, sin
 * texto en la tarjeta (la categoría va en el alt y en un chip con el mouse). 2 columnas, 3 desde @3xl y 4 desde @6xl;
 * el orden baja por columna. Fotos lazy con la trama (fabric) mientras cargan. Sin JS ni librería.
 * offset corre el ritmo de alturas (para que "Más de" no repita el del muro). mobileMax esconde las que pasan de
 * ese número debajo de @3xl (p. ej. 6 en el celular y 12 en desktop).
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Masonry({ tiles, offset = 0, mobileMax }: { tiles: MasonryTile[]; offset?: number; mobileMax?: number }) {
  return (
    <div className="@container">
      <ul className="columns-2 gap-2 @3xl:columns-3 @3xl:gap-3 @6xl:columns-4">
        {tiles.map((t, i) => (
          <li key={t.href} className={`mb-2 break-inside-avoid @3xl:mb-3 ${mobileMax !== undefined && i >= mobileMax ? '@max-3xl:hidden' : ''}`}>
            <Tile t={t} i={i + offset} />
          </li>
        ))}
      </ul>
    </div>
  )
}
