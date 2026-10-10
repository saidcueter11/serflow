import { hastaCorto, type PromoView } from '../../lib/promos'
import { StatusPill } from './StatusPill'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Una promo en "Otras promos" del detalle y en la 404 cuando hay promos vigentes. Toda la card es un link al
 * detalle: foto 4:3, vigencia en StatusPill accent, título, descripción a 2 líneas y "Ver promo". Sin endsAt no hay
 * píldora; sin descripción, no hay párrafo; sin foto, no hay foto. Fluida: el ancho lo pone PromoGrid.
 * Desde 576 px de ancho se pone horizontal (una card sola en su fila). Markup estático, sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoCard({ promo, headingLevel = 2 }: { promo: PromoView; headingLevel?: 2 | 3 }) {
  const hasta = hastaCorto(promo.endsAt)
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <a
      href={`/promos/${promo.slug}`}
      className={`group @container block h-full w-full overflow-hidden rounded-card border border-line bg-surface text-ink no-underline transition-[transform,border-color] duration-(--motion-slow) ease-out hover:-translate-y-1 hover:border-secondary ${FOCUS}`}
    >
      <div className="flex h-full flex-col @xl:grid @xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {promo.cover && (
          <div className="overflow-hidden">
            <img
              src={promo.cover.src}
              alt={promo.cover.alt}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="fabric reveal-wipe aspect-[4/3] h-auto w-full bg-surface-2 object-cover transition-transform duration-500 ease-out group-hover:scale-105 @xl:h-full"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-start gap-2 p-4 @xl:justify-center @xl:p-6 @3xl:gap-3 @3xl:p-10">
          {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
          <H className="font-display text-[22px] font-bold leading-tight @3xl:text-[30px]">{promo.title}</H>
          {promo.description && (
            <p className="line-clamp-2 text-[15px] leading-relaxed text-muted @xl:line-clamp-none @3xl:text-[17px]">{promo.description}</p>
          )}
          <span className="mt-auto pt-1 text-[14px] font-semibold text-accent group-hover:underline group-hover:underline-offset-4 @xl:mt-1">
            Ver promo →
          </span>
        </div>
      </div>
    </a>
  )
}
