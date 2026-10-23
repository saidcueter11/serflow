import { Button } from '../ui/Button'
import { CategoryNav, type CategoryLink } from '../ui/CategoryNav'
import { EmptyState } from '../ui/EmptyState'
import { Masonry, type MasonryTile } from '../ui/Masonry'

export const TODO_HREF = '/products'

/**
 * Galería del catálogo (PRI-130, dirección 2): bienvenida, categorías con conteo y el muro de fotos. El banner de
 * categorías va arriba, fuera de este componente, porque se conserva entre páginas (ver [...gallery].astro). Sin
 * eslogan: el nombre que muestra el banner es el h1 (sr-only; "Catálogo" en Todo).
 * Categoría sin fotos: EmptyState con salida a lo más nuevo (WhatsApp ya está en el flotante).
 */
export function CatalogPage({
  chips,
  current,
  label,
  tiles,
  next,
}: {
  chips: CategoryLink[]
  /** href de la pestaña actual. */
  current: string
  /** Categoría actual, para el estado vacío. */
  label: string
  tiles: MasonryTile[]
  /** Siguiente bloque de fotos, si hay. */
  next?: { href: string; count: number }
}) {
  return (
    <div className="@container font-body text-ink">
      <div className="px-4 pt-6 @3xl:px-12 @3xl:pt-10">
        <h1 className="sr-only">{current === TODO_HREF ? 'Catálogo' : label}</h1>
        <p className="max-w-[52ch] text-[15px] leading-relaxed text-muted @3xl:text-[18px]">
          Gorras y camisetas que salieron del taller. Toca la que te guste y te hacemos una igual, o a tu manera.
        </p>
        <div className="mt-5">
          <CategoryNav categories={chips} current={current} />
        </div>
      </div>
      <div className="px-4 pb-12 pt-5 @3xl:px-12 @3xl:pb-16 @3xl:pt-8">
        {tiles.length === 0 ? (
          <EmptyState
            title={`Todavía no hay fotos de ${label}`}
            description="Igual te lo hacemos por encargo, con tu logo o tu diseño. Escríbenos por el botón de WhatsApp y te mostramos trabajos parecidos."
            action={{ label: 'Ver lo más nuevo', href: TODO_HREF }}
          />
        ) : (
          <Masonry tiles={tiles} />
        )}
        {next && (
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" href={next.href}>
              Ver {next.count} más
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
