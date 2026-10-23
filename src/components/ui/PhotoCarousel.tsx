export type CarouselPhoto = { src: string; srcSet?: string; alt: string }

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Las fotos de una prenda en el visor del catálogo (PRI-130): carrusel con scroll-snap que se desliza con el dedo,
 * sin JS. Marco 4:5 (el formato de las fotos) que la foto llena (object-cover), sin trama ni franjas: en el celular
 * ocupa el ancho; desde @3xl va en la columna izquierda del visor, con esquinas redondeadas. Con varias fotos,
 * "Desliza · N fotos" debajo en el celular; desde @3xl las miniaturas son PhotoThumbs, que el visor pone en la
 * columna derecha. Las variantes @3xl miran el contenedor de la página (este componente no es @container).
 * La primera foto es el LCP del visor: va con fetchPriority high. label nombra la lista para lectores de pantalla.
 * No la uses para el muro de fotos (Masonry) ni para el hero (HeroCarousel).
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PhotoCarousel({ photos, label, idPrefix = 'foto' }: { photos: CarouselPhoto[]; label: string; idPrefix?: string }) {
  return (
    <div>
      <ul aria-label={label} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] @3xl:rounded-card">
        {photos.map((f, i) => (
          <li key={f.src} id={`${idPrefix}-${i + 1}`} className="aspect-[4/5] w-full shrink-0 snap-center">
            <img
              src={f.src}
              srcSet={f.srcSet}
              sizes="(min-width: 768px) 448px, 100vw"
              alt={f.alt}
              width={900}
              height={1125}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              className="size-full object-cover"
            />
          </li>
        ))}
      </ul>
      {photos.length > 1 && (
        <p className="mt-3 text-center text-[12px] text-muted @3xl:hidden" aria-hidden="true">
          Desliza · {photos.length} fotos
        </p>
      )}
    </div>
  )
}

/** Miniaturas de PhotoCarousel, solo desde @3xl: links a cada foto (#<idPrefix>-2), sin JS. Con una foto no sale. */
export function PhotoThumbs({ photos, idPrefix = 'foto' }: { photos: CarouselPhoto[]; idPrefix?: string }) {
  if (photos.length < 2) return null
  return (
    <ul aria-label="Elegir foto" className="hidden flex-wrap gap-2 @3xl:flex">
      {photos.map((f, i) => (
        <li key={f.src}>
          <a
            href={`#${idPrefix}-${i + 1}`}
            aria-label={`Ver foto ${i + 1} de ${photos.length}`}
            className={`block size-14 overflow-hidden rounded-tile border-2 border-line hover:border-muted ${FOCUS}`}
          >
            <img src={f.src} srcSet={f.srcSet} sizes="56px" alt="" width={56} height={56} loading="lazy" className="size-full object-cover" />
          </a>
        </li>
      ))}
    </ul>
  )
}
