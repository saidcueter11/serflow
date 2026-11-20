export type BannerSlide = { label: string; image?: { src: string; srcSet?: string } }

/**
 * Banner de categorías arriba del catálogo (PRI-130; a sangre en PRI-286): una lámina por categoría con su portada
 * (categories.image_url) y un velo abajo para el texto que la página pone encima (el nombre como h1 y la bajada, en el
 * margen de la rejilla: .pf-cat-texto). Sin "N productos": ya está en la pestaña. Muestra la de current; al cambiar de
 * categoría la nueva entra en fundido encima cuando su foto ya está lista (PRI-556, src/scripts/movimiento.ts): el banner
 * nunca queda vacío. Sin portada queda la trama. Solo la lámina actual carga su foto.
 * Uno por página, solo en la galería del catálogo; no es el hero de la portada (HeroCarousel) ni una galería de fotos.
 * Markup estático: Astro lo renderiza sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/media/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function CategoryBanner({ slides, current }: { slides: BannerSlide[]; current: number }) {
  return (
    <div className="@container relative h-[340px] overflow-hidden bg-surface font-body text-ink @3xl:h-[520px]">
      {/* Las láminas apiladas; solo se ve la actual y las demás ni bajan su foto (hidden). */}
      <div data-banner-track className="isolate grid h-full">
        {slides.map((s, i) => (
          <div key={s.label} data-banner-slide hidden={i !== current} className="fabric relative col-start-1 row-start-1 h-full bg-surface-2">
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
