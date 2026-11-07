import { whatsappUrl } from '../../lib/business'
import type { PromoView } from '../../lib/promos'
import { EmptyState } from '../ui/EmptyState'
import { Palabras } from '../ui/Palabras'
import { PromoAfiche } from '../ui/PromoAfiche'

/** /promos (PRI-131; sistema medido de PRI-286): título de página y cada promo en su fila; sin promos, estado vacío. */
export function PromosPage({ promos }: { promos: PromoView[] }) {
  const n = promos.length
  return (
    <div className="pf font-body text-ink">
      <main className="pf-v pf-c">
        <div className="pf-pagina-titulo">
          {n > 0 && <p className="pf-pie">{n === 1 ? '1 promo activa' : `${n} promos activas`}</p>}
          <h1 className="pf-display">
            <Palabras text={n > 0 ? 'Promos de hoy' : 'Promos'} />
          </h1>
          {n > 0 && (
            <p className="pf-lead sf-bajada">
              <Palabras text="Precios especiales por poco tiempo. Pide la que te guste por WhatsApp: el mensaje ya lleva el nombre de la promo." />
            </p>
          )}
        </div>
        {n === 0 ? (
          <div className="pf-sec">
            <EmptyState
              title="Hoy no hay promos"
              description="Cuando lanzamos una, sale en la barra dorada de la portada. Mientras tanto, escríbenos y te contamos qué hay a buen precio en el taller."
              action={{ label: 'Pregunta por WhatsApp', href: whatsappUrl('¡Hola! Vi que hoy no hay promos. ¿Qué tienen a buen precio en el taller?') }}
            />
          </div>
        ) : (
          promos.map((p) => <PromoAfiche key={p.slug} promo={p} />)
        )}
      </main>
    </div>
  )
}
