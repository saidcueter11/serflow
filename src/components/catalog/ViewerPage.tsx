import { fotoTitulo, pedirUrl } from '../../lib/catalog'
import type { CatalogItem } from '../../lib/catalog-view'
import { Button } from '../ui/Button'
import { Masonry } from '../ui/Masonry'
import { NewBadge } from '../ui/NewBadge'
import { PhotoCarousel, PhotoThumbs } from '../ui/PhotoCarousel'
import { Section } from '../ui/Section'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Visor de una foto del catálogo (PRI-130, dirección 2): la foto grande (4:5; en desktop a la izquierda y a la
 * derecha la categoría, el botón y las miniaturas), su categoría, "Pedir por WhatsApp" con el
 * mensaje que identifica la foto (categoría, número y link, nunca el nombre) y "Más de <categoría>" debajo.
 * Sin flotante de WhatsApp (Layout hideFab): el botón de la página es el único.
 */
export function ViewerPage({
  item,
  category,
  mas,
  back,
}: {
  item: CatalogItem
  category: { label: string; href: string; count: number }
  /** Las que siguen en la categoría: 12 (6 en el celular). */
  mas: CatalogItem[]
  /** La página de "Todo" donde está esta foto, con su ancla. */
  back: string
}) {
  const titulo = fotoTitulo(category.label, item.n)
  return (
    <main className="@container font-body text-ink">
      <div className="flex items-center justify-between gap-3 px-4 py-1 @3xl:px-12 @3xl:py-3">
        <a href={back} className={`inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink ${FOCUS}`}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Todas las fotos
        </a>
        <span className="text-[13px] text-muted">
          {item.n != null && `N.º ${item.n} · `}
          {item.hace}
        </span>
      </div>
      <div className="@3xl:grid @3xl:grid-cols-[28rem_minmax(0,1fr)] @3xl:items-start @3xl:gap-10 @3xl:px-12">
        <PhotoCarousel photos={item.photos} label={`Fotos de ${titulo}`} idPrefix={`p-${item.slug}`} />
        <div className="flex flex-col gap-4 px-4 pt-4 @3xl:gap-6 @3xl:px-0 @3xl:pt-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="sr-only">{titulo}</h1>
            <Button variant="secondary" href={category.href} icon={null}>
              {category.label}
            </Button>
            {item.tile.nuevo && <NewBadge />}
          </div>
          <div className="flex flex-col gap-2 @3xl:w-[300px]">
            <Button variant="whatsapp" href={pedirUrl(category.label, item.n, item.tile.href)} external fullWidth>
              Pedir por WhatsApp
            </Button>
            <p className="text-[13px] leading-snug text-muted @3xl:hidden">Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo.</p>
          </div>
          <PhotoThumbs photos={item.photos} idPrefix={`p-${item.slug}`} />
        </div>
      </div>
      {mas.length > 0 && (
        <Section id="mas" title={`Más de ${category.label}`}>
          <Masonry tiles={mas.map((m) => m.tile)} offset={3} mobileMax={6} />
          <div className="mt-3">
            <Button variant="ghost" href={category.href}>
              Ver las {category.count} de {category.label} →
            </Button>
          </div>
        </Section>
      )}
    </main>
  )
}
