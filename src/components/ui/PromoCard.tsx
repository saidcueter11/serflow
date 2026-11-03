import { hastaCorto, type PromoView } from '../../lib/promos'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Una promo en "Otras promos" del detalle y en la 404 cuando hay promos vigentes (PRI-286): se lee como promo y no como
 * otra foto. Tarjeta horizontal con caja (superficie, borde, radio): la foto a todo el alto a la izquierda (112 px;
 * 200 desde 30rem de tarjeta, cuando sale también la descripción) y a la derecha la vigencia (etiqueta oro), el título
 * y "Ver promo" con forma de botón al fondo, así en una fila todas cierran igual. Toda la card es un link al detalle.
 * Sin endsAt no hay vigencia (en una fila de desktop el título baja a la línea de los vecinos); sin foto, no hay foto.
 * Fluida: el ancho lo pone PromoGrid. Markup estático, sin JS.
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
      className={`group sf-foto @container block h-full w-full overflow-hidden rounded-card border border-line bg-surface text-ink no-underline ${FOCUS}`}
    >
      <div className={`grid h-full ${promo.cover ? 'grid-cols-[112px_minmax(0,1fr)] @[30rem]:grid-cols-[200px_minmax(0,1fr)]' : ''}`}>
        {promo.cover && (
          <div className="relative min-h-[140px] overflow-hidden">
            <img
              src={promo.cover.src}
              alt={promo.cover.alt}
              width={400}
              height={500}
              loading="lazy"
              decoding="async"
              className="fabric absolute inset-0 size-full bg-surface-2 object-cover"
            />
          </div>
        )}
        <div className="flex flex-col items-start p-4 @3xl/pf:p-6">
          {hasta && <span className="text-[13px] font-semibold uppercase leading-4 tracking-[.14em] text-accent">{hasta}</span>}
          <H className={`mb-4 font-display text-[18px] font-medium leading-tight @[30rem]:mb-0 @3xl/pf:text-[22px] ${hasta ? 'mt-2' : '@3xl/pf:mt-6'}`}>
            {promo.title}
          </H>
          {promo.description && <p className="mb-6 mt-2 hidden max-w-[44ch] text-[16px] leading-normal text-muted @[30rem]:block">{promo.description}</p>}
          <span className="mt-auto inline-flex min-h-11 items-center rounded-full border border-line px-5 text-[16px] font-semibold transition-colors duration-(--motion-med) group-hover:border-ink group-focus-visible:border-ink">
            Ver promo →
          </span>
        </div>
      </div>
    </a>
  )
}
