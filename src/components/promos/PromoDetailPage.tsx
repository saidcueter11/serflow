import { promoWhatsapp, validaHasta, type Photo, type PromoView } from '../../lib/promos'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Eyebrow'
import { PromoCard } from '../ui/PromoCard'
import { PromoGrid } from '../ui/PromoGrid'
import { Section } from '../ui/Section'
import { StatusPill } from '../ui/StatusPill'
import { H1 } from './PromosPage'

/* Fila de una, dos, tres o cuatro fotos: la columna y la proporción van juntas para que la fila llene el ancho. */
const FILA = {
  1: '@4xl:col-span-12 @4xl:aspect-[21/9]',
  2: '@4xl:col-span-6 @4xl:aspect-[4/3]',
  3: '@4xl:col-span-4 @4xl:aspect-square',
  4: '@4xl:col-span-3 @4xl:aspect-square',
} as const

/**
 * Las fotos después del afiche, sin huecos con cualquier cantidad. Mobile: una fila que se desliza (con una sola
 * foto, a lo ancho). Desktop: filas de 4; la última se reparte el ancho. Sin fotos extra no se pinta.
 */
function MasFotos({ photos }: { photos: Photo[] }) {
  const n = photos.length
  if (n === 0) return null
  const ultima = (n % 4 || 4) as 1 | 2 | 3 | 4
  return (
    <div className="flex min-w-0 flex-col gap-3 px-4 @4xl:px-0">
      <h2>
        <Eyebrow>Más fotos</Eyebrow>
      </h2>
      <div
        className={`-mx-4 grid snap-x scroll-px-4 grid-flow-col gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] @4xl:mx-0 @4xl:auto-cols-auto @4xl:grid-flow-row @4xl:grid-cols-12 @4xl:overflow-visible @4xl:px-0 @4xl:pb-0 ${n === 1 ? 'auto-cols-[100%]' : 'auto-cols-[72%]'}`}
      >
        {photos.map((ph, i) => (
          <img
            key={i}
            src={ph.src}
            alt={ph.alt}
            loading="lazy"
            decoding="async"
            className={`fabric aspect-[4/5] h-auto w-full snap-start rounded-tile border border-line bg-surface-2 object-cover ${FILA[i >= n - ultima ? ultima : 4]}`}
          />
        ))}
      </div>
    </div>
  )
}

/** /promos/[slug] (PRI-131, opción B): afiche con título, vigencia, descripción y WhatsApp; luego más fotos y otras promos. */
export function PromoDetailPage({ promo, otras }: { promo: PromoView; otras: PromoView[] }) {
  const hasta = validaHasta(promo.endsAt)
  const hayOtras = otras.length > 0
  return (
    <main className="@container font-body text-ink">
      <div className={`flex flex-col gap-8 @4xl:gap-10 @4xl:px-12 @4xl:pt-6 ${hayOtras ? '' : 'pb-12 @4xl:pb-16'}`}>
        {/*
         * Mobile: foto 4:5 con el título encima; descripción y botón debajo.
         * Desktop: todo dentro del afiche (degradado de izquierda a derecha detrás del texto).
         */}
        <div className="relative grid overflow-hidden @4xl:min-h-[560px] @4xl:content-end @4xl:rounded-card @4xl:border @4xl:border-line">
          {promo.cover && (
            <img
              src={promo.cover.src}
              alt={promo.cover.alt}
              fetchPriority="high"
              className="fabric col-start-1 row-start-1 aspect-[4/5] h-auto w-full bg-surface-2 object-cover @4xl:absolute @4xl:inset-0 @4xl:col-start-auto @4xl:row-start-auto @4xl:aspect-auto @4xl:h-full"
            />
          )}
          <div className="pointer-events-none col-start-1 row-start-1 bg-gradient-to-t from-primary via-primary/60 to-transparent @4xl:absolute @4xl:inset-0 @4xl:col-start-auto @4xl:row-start-auto @4xl:bg-gradient-to-r @4xl:via-primary/80 @4xl:via-50% @4xl:to-85%" />
          <div className="absolute left-3 top-3 @4xl:left-6 @4xl:top-5">
            <span className="inline-flex rounded-full bg-primary/85 px-3">
              {hayOtras ? (
                <Button variant="ghost" href="/promos">
                  ← Volver a las promos
                </Button>
              ) : (
                <Button variant="ghost" href="/">
                  ← Volver al inicio
                </Button>
              )}
            </span>
          </div>
          <div className="anim-enter relative col-start-1 row-start-1 flex flex-col items-start gap-3 self-end p-4 pb-6 @4xl:max-w-[600px] @4xl:p-10 @4xl:pb-5">
            <Eyebrow>Campaña</Eyebrow>
            <h1 className={`${H1} text-[38px] @4xl:text-[60px]`}>{promo.title}</h1>
            {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
          </div>
          <div className="relative col-start-1 row-start-2 flex flex-col items-start gap-5 px-4 pt-2 @4xl:max-w-[600px] @4xl:px-10 @4xl:pb-10 @4xl:pt-0">
            {promo.description && <p className="text-[16px] leading-relaxed text-ink/85 @4xl:text-[18px]">{promo.description}</p>}
            <div className="flex w-full flex-col gap-2 @4xl:items-start">
              <div className="w-full @4xl:w-auto">
                <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth>
                  Pedir esta promo por WhatsApp
                </Button>
              </div>
              <p className="text-[13px] text-muted">El mensaje ya lleva el nombre de la promo.</p>
            </div>
          </div>
        </div>
        <MasFotos photos={promo.photos} />
      </div>
      {hayOtras && (
        <Section id="otras-promos" title="Otras promos">
          <PromoGrid>{otras.map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
        </Section>
      )}
    </main>
  )
}
