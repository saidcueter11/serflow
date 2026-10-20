import { whatsappUrl } from '../../lib/business'
import type { PromoView } from '../../lib/promos'
import { EmptyState } from '../ui/EmptyState'
import { Eyebrow } from '../ui/Eyebrow'
import { PromoAfiche } from '../ui/PromoAfiche'
import { PromoGrid } from '../ui/PromoGrid'

export const H1 = 'font-display font-medium leading-[1.05] tracking-[-0.01em]'

/** /promos (PRI-131, opción C): afiches con su botón de WhatsApp; sin promos, estado vacío a lo ancho. */
export function PromosPage({ promos }: { promos: PromoView[] }) {
  const n = promos.length
  return (
    <main className="@container font-body text-ink">
      <div className="px-4 pb-12 pt-6 @3xl:px-12 @3xl:pb-16 @3xl:pt-10">
        <div className="flex flex-col items-start gap-3 pb-6 @3xl:pb-8">
          {n > 0 && <Eyebrow>{n === 1 ? '1 promo activa' : `${n} promos activas`}</Eyebrow>}
          <h1 className={`${H1} text-[38px] @3xl:text-[68px]`}>{n > 0 ? 'Promos de hoy' : 'Promos'}</h1>
          {n > 0 && (
            <p className="max-w-[56ch] text-[16px] leading-relaxed text-muted @3xl:text-[19px]">
              Precios especiales por poco tiempo. Pide la que te guste por WhatsApp: el mensaje ya lleva el nombre de la promo.
            </p>
          )}
        </div>
        {n === 0 ? (
          <EmptyState
            title="Hoy no hay promos"
            description="Cuando lanzamos una, sale en la barra dorada de la portada. Mientras tanto, escríbenos y te contamos qué hay a buen precio en el taller."
            action={{ label: 'Pregunta por WhatsApp', href: whatsappUrl('¡Hola! Vi que hoy no hay promos. ¿Qué tienen a buen precio en el taller?') }}
          />
        ) : (
          <PromoGrid>{promos.map((p) => <PromoAfiche key={p.slug} promo={p} />)}</PromoGrid>
        )}
      </div>
    </main>
  )
}
