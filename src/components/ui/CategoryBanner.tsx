export type BannerSlide = { label: string; count: number; image?: { src: string; srcSet?: string } }

/**
 * Banner de categorías arriba del catálogo (PRI-130; el carrusel de ProductCardList.astro pasado al design system):
 * una lámina por categoría con su portada (categories.image_url), su nombre y cuántos productos tiene. Muestra la
 * de current; al cambiar de categoría la página la desliza hasta la nueva (data-banner-track, ver
 * src/pages/products/[...gallery].astro). Sin portada queda la trama. Solo la lámina actual carga su foto de una.
 * Uno por página, solo en la galería del catálogo; no es el hero de la portada (HeroCarousel) ni una galería de fotos.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function CategoryBanner({ slides, current }: { slides: BannerSlide[]; current: number }) {
  const n = slides.length || 1
  return (
    <div className="@container relative h-48 overflow-hidden rounded-card border border-line bg-surface font-body text-ink @3xl:h-56">
      <div
        data-banner-track
        className="flex h-full ease-out motion-safe:transition-transform motion-safe:duration-(--motion-slow)"
        style={{ width: `${n * 100}%`, transform: `translateX(-${(current / n) * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={s.label} data-banner-slide aria-hidden={i === current ? undefined : true} className="fabric relative h-full shrink-0 bg-surface-2" style={{ width: `${100 / n}%` }}>
            {s.image && (
              <img
                src={s.image.src}
                srcSet={s.image.srcSet}
                sizes="(min-width: 1280px) 1200px, 100vw"
                alt=""
                loading={i === current ? 'eager' : 'lazy'}
                fetchPriority={i === current ? 'high' : undefined}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 @3xl:p-8">
              <p className="font-display text-[28px] font-medium leading-[1.05] @3xl:text-[40px]">{s.label}</p>
              <p className="mt-1.5 text-[14px] text-muted">
                {s.count} producto{s.count === 1 ? '' : 's'} disponible{s.count === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
