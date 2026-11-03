export type BannerSlide = { label: string; image?: { src: string; srcSet?: string } }

/**
 * Banner de categorías arriba del catálogo (PRI-130; a sangre en PRI-286): una lámina por categoría con su portada
 * (categories.image_url) y un velo abajo para el texto que la página pone encima (el nombre como h1 y la bajada, en el
 * margen de la rejilla: .pf-cat-texto). Sin "N productos": ya está en la pestaña. Muestra la de current; al cambiar de categoría la página la desliza hasta la nueva (data-banner-track, ver
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
    <div className="@container relative h-[340px] overflow-hidden bg-surface font-body text-ink @3xl:h-[520px]">
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
                sizes="100vw"
                alt=""
                loading={i === current ? 'eager' : 'lazy'}
                fetchPriority={i === current ? 'high' : undefined}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-primary via-primary/40 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
}
