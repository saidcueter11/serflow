import { fotoAttrs, type FotoModal } from './PhotoModal'

/** Una foto del muro. img ya optimizada (getImage). */
export type MasonryTile = {
  /** URL propia de la foto (/catalogo/<categoría>/<slug>). */
  href: string
  /** id del link, para abrir esta foto al cargar su URL (#f-<slug>). */
  id?: string
  img: { src: string; srcSet?: string; alt: string }
  /** Categoría: chip que aparece con el mouse o el foco de teclado. */
  label: string
  /** Cuántas fotos tiene la prenda (image_urls). Con 2 o más sale el contador. */
  photos?: number
  /** Datos del modal (PhotoModal). Sin ellos, el link navega a su URL. */
  modal?: FotoModal
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

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

function Tile({ t }: { t: MasonryTile }) {
  return (
    <a href={t.href} id={t.id} className={`group sf-foto relative block scroll-mt-4 overflow-hidden rounded-tile bg-surface-2 ${FOCUS}`} {...fotoAttrs(t.modal)}>
      <img
        src={t.img.src}
        srcSet={t.img.srcSet}
        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        alt={t.img.alt}
        width={400}
        height={500}
        loading="lazy"
        decoding="async"
        className="fabric reveal-wipe aspect-[4/5] h-auto w-full object-cover"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/80 to-transparent opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 left-2.5 rounded-full border border-line bg-primary/85 px-3 py-1.5 text-[13px] font-semibold leading-none text-ink opacity-0 transition-opacity duration-(--motion-med) group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {t.label}
      </span>
      {/* La foto se abre: el chevrón en un círculo, siempre visible (también sin mouse). */}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-primary/80 text-ink">
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </span>
      {(t.photos ?? 1) > 1 && <PhotoCount n={t.photos!} />}
    </a>
  )
}

/**
 * Muro de fotos del catálogo (PRI-130; rejilla pareja en PRI-286): columnas iguales y todas las fotos 4:5, 2 columnas,
 * 3 desde 40rem de muro y 4 desde 64rem; la última fila queda con las fotos que haya. Sin texto en la tarjeta (la
 * categoría va en el alt y en un chip con el mouse); el chevrón en un círculo dice que la foto se abre. Fotos lazy con
 * la trama (fabric) mientras cargan. Cada foto abre el modal (PhotoModal) y recorre las de este muro (data-fotos).
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function Masonry({ tiles }: { tiles: MasonryTile[] }) {
  return (
    <div className="@container">
      <ul data-fotos className="grid grid-cols-2 gap-2 @[40rem]:grid-cols-3 @[64rem]:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.href}>
            <Tile t={t} />
          </li>
        ))}
      </ul>
    </div>
  )
}
