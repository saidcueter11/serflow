import { whatsappUrl } from '../../lib/business'
import type { PromoView } from '../../lib/promos'
import { Button } from '../ui/Button'
import { NAV_LINKS } from '../ui/Header'
import { Palabras } from '../ui/Palabras'
import { PromoCard } from '../ui/PromoCard'
import { PromoGrid } from '../ui/PromoGrid'
import { Section } from '../ui/Section'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** 404 (PRI-131; sistema medido de PRI-286): título de página con sus dos salidas; con promos vigentes, "Promos de hoy" en
 * tarjetas; sin promos, "Lo que sí está". */
export function NotFoundPage({ promos }: { promos: PromoView[] }) {
  return (
    <div className="pf font-body text-ink">
      <main className="pf-v">
        <div className="pf-c pf-pagina-titulo">
          <p className="pf-pie">Error 404</p>
          <h1 className="pf-display">
            <Palabras text="Esta página no existe" />
          </h1>
          <p className="pf-lead sf-bajada">
            <Palabras text="Puede que el link esté viejo o mal copiado. Si venías por una promo, puede que ya haya terminado. Escríbenos y te mandamos lo que buscabas." />
          </p>
          <div className="pf-404-botones">
            <Button variant="whatsapp" href={whatsappUrl('¡Hola! Llegué a una página de Serflow que no existe. Estaba buscando...')} external>
              Escríbenos por WhatsApp
            </Button>
            <Button variant="secondary" href="/">
              Ir al inicio
            </Button>
          </div>
        </div>
        {promos.length > 0 ? (
          <Section id="promos-de-hoy" title="Promos de hoy">
            <PromoGrid>{promos.map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
          </Section>
        ) : (
          <Section id="lo-que-si-esta" title="Lo que sí está">
            {/* Mobile: lista. Desktop: tres a lo ancho, sin un bloque angosto con media pantalla vacía. */}
            <ul className="grid divide-y divide-line overflow-hidden rounded-card border border-line bg-surface @3xl:grid-cols-3 @3xl:divide-x @3xl:divide-y-0">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`flex min-h-12 items-center justify-between px-4 text-[16px] font-semibold text-ink hover:text-accent @3xl:min-h-20 @3xl:px-6 @3xl:text-[18px] ${FOCUS}`}
                  >
                    {l.label}
                    <span aria-hidden="true" className="text-accent">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </div>
  )
}
