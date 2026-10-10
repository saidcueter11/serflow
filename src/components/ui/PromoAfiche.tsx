import { promoWhatsapp, validaHasta, type PromoView } from '../../lib/promos'
import { Button } from './Button'
import { StatusPill } from './StatusPill'

/**
 * Una promo en /promos: foto, vigencia, título, descripción completa y su propio botón de WhatsApp con el mensaje
 * de esa promo ya escrito. "Ver las N fotos" lleva al detalle. Desde 672 px de ancho se pone horizontal (una promo
 * sola en su fila). Excepción a "un WhatsApp por sección": cada afiche es su propia sección. Markup estático, sin JS.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoAfiche({ promo }: { promo: PromoView }) {
  const hasta = validaHasta(promo.endsAt)
  const total = promo.photos.length + (promo.cover ? 1 : 0)
  return (
    <article className="@container w-full overflow-hidden rounded-card border border-line bg-surface">
      <div className="flex h-full flex-col @2xl:grid @2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {promo.cover && (
          <img
            src={promo.cover.src}
            alt={promo.cover.alt}
            width={1200}
            height={750}
            className="fabric aspect-[16/10] h-auto w-full bg-surface-2 object-cover @2xl:aspect-[4/3] @2xl:h-full"
          />
        )}
        <div className="flex flex-1 flex-col items-start gap-3 p-5 @2xl:justify-center @2xl:gap-4 @2xl:p-10">
          {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
          <h2 className="font-display text-[22px] font-bold leading-tight @2xl:text-[34px]">{promo.title}</h2>
          {promo.description && <p className="text-[15px] leading-relaxed text-muted @2xl:text-[17px]">{promo.description}</p>}
          <div className="mt-auto flex w-full flex-col gap-1 pt-2 @2xl:mt-2 @2xl:max-w-[340px]">
            <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth>
              Pedir por WhatsApp<span className="sr-only">: {promo.title}</span>
            </Button>
            <Button variant="ghost" href={`/promos/${promo.slug}`}>
              {total > 1 ? `Ver las ${total} fotos →` : 'Ver la promo →'}
              <span className="sr-only"> de {promo.title}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
