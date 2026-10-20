export type CarouselPhoto = { src: string; srcSet?: string; alt: string }

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Las fotos de una prenda en el visor del catálogo (PRI-130): carrusel con scroll-snap que se desliza con el dedo,
 * sin JS. La foto va entera (object-contain) sobre la trama, 4:5 en el celular y 16:9 desde @3xl. Con varias fotos:
 * "Desliza · N fotos" en el celular y, desde @3xl, miniaturas que son links a cada foto (#<idPrefix>-2).
 * La primera foto es el LCP del visor: va con fetchPriority high. label nombra la lista para lectores de pantalla.
 * No la uses para el muro de fotos (Masonry) ni para el hero (HeroCarousel).
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PhotoCarousel({ photos, label, idPrefix = 'foto' }: { photos: CarouselPhoto[]; label: string; idPrefix?: string }) {
  const many = photos.length > 1
  return (
    <div className="@container">
      <ul aria-label={label} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] @3xl:rounded-card">
        {photos.map((f, i) => (
          <li key={f.src} id={`${idPrefix}-${i + 1}`} className="fabric aspect-[4/5] w-full shrink-0 snap-center bg-surface-2 @3xl:aspect-video">
            <img
              src={f.src}
              srcSet={f.srcSet}
              sizes="(min-width: 1280px) 1200px, 100vw"
              alt={f.alt}
              width={900}
              height={1200}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              decoding="async"
              className="size-full object-contain"
            />
          </li>
        ))}
      </ul>
      {many && (
        <p className="mt-3 text-center text-[12px] text-muted @3xl:hidden" aria-hidden="true">
          Desliza · {photos.length} fotos
        </p>
      )}
      {many && (
        <ul aria-label="Elegir foto" className="mt-3 hidden justify-center gap-2 @3xl:flex">
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
      )}
    </div>
  )
}
