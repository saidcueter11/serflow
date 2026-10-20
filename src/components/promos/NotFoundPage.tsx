import { whatsappUrl } from '../../lib/business'
import type { PromoView } from '../../lib/promos'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { NAV_LINKS } from '../ui/Header'
import { PromoCard } from '../ui/PromoCard'
import { PromoGrid } from '../ui/PromoGrid'
import { Section } from '../ui/Section'
import { H1 } from './PromosPage'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** 404 (PRI-131, opción C): titular y salidas; con promos vigentes, "Promos de hoy"; sin promos, "Lo que sí está". */
export function NotFoundPage({ promos }: { promos: PromoView[] }) {
  return (
    <main className="@container pb-4 font-body text-ink @3xl:pb-8">
      <div className="px-4 pb-6 pt-10 @3xl:px-12 @3xl:pt-16">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-5 text-center">
          <div className="anim-enter flex flex-col items-center gap-4">
            <Eyebrow>Error 404</Eyebrow>
            <h1 className={`${H1} text-[38px] @3xl:text-[68px]`}>Esta página no existe</h1>
            <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted @3xl:text-[19px]">
              Puede que el link esté viejo o mal copiado. Si venías por una promo, puede que ya haya terminado. Escríbenos y
              te mandamos lo que buscabas.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 @3xl:w-auto @3xl:flex-row">
            <div className="w-full @3xl:w-auto">
              <Button variant="whatsapp" href={whatsappUrl('¡Hola! Llegué a una página de Serflow que no existe. Estaba buscando...')} external fullWidth>
                Escríbenos por WhatsApp
              </Button>
            </div>
            <div className="w-full @3xl:w-auto">
              <Button variant="secondary" href="/" fullWidth>
                Ir al inicio
              </Button>
            </div>
          </div>
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
  )
}
