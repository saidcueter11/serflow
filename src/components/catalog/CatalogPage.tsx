import { TODO_HREF } from '../../lib/catalog'
import { Button } from '../ui/Button'
import { CategoryNav, type CategoryLink } from '../ui/CategoryNav'
import { EmptyState } from '../ui/EmptyState'
import { Masonry, type MasonryTile } from '../ui/Masonry'

/** Bajada del catálogo: va con el nombre (h1) encima del banner (CatalogView.astro). */
export const CATALOG_LEAD = 'Gorras y camisetas que salieron del taller. Toca la que te guste y te hacemos una igual, o a tu manera.'

/**
 * Galería del catálogo (PRI-130; sistema medido de PRI-286): pestañas de categoría con conteo y el muro de fotos, en el
 * margen de la rejilla. El banner con el nombre (h1) y la bajada va arriba, fuera de este componente, porque se conserva
 * entre páginas (CatalogView.astro). Cada foto abre el modal (PhotoModal). Sin tarjeta de cierre: la última fila queda
 * con las fotos que haya. Categoría sin fotos: EmptyState con salida a lo más nuevo (WhatsApp ya está en el flotante).
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
    <>
      <div className="pf-c pf-cat-chips">
        <CategoryNav categories={chips} current={current} />
      </div>
      <div className="pf-c pf-cat-muro">
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
    </>
  )
}
