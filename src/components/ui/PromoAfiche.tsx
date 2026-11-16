import { promoModal, promoWhatsapp, validaHasta, type PromoView } from '../../lib/promos'
import { Button } from './Button'
import { fotoAttrs } from './PhotoModal'

/**
 * Una promo en /promos (PRI-286): cada promo es una sección de la rejilla, con el texto en 5 columnas y la foto 16:9 en
 * 6 desde la 7 (en el celular la foto va primero, 4:3). Vigencia, título, descripción completa, su propio botón de
 * WhatsApp con el mensaje de esa promo ya escrito y "Ver las N fotos" al detalle, en una fila desde @3xl. Excepción a
 * "un WhatsApp por sección": cada promo es su propia sección. La foto abre el modal de foto (PhotoModal, PRI-523) con
 * las fotos de la promo; la página que la usa monta el modal y marca la lista (data-fotos). Va dentro de una página .pf.
 * Markup estático.
 *
 * The canvas for this component is at tempo/designs/design-system/cards/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset declaration stay consistent.
 */
export function PromoAfiche({ promo }: { promo: PromoView }) {
  const hasta = validaHasta(promo.endsAt)
  const total = promo.photos.length + (promo.cover ? 1 : 0)
  const id = `promo-${promo.slug}`
  return (
    <section aria-labelledby={id} className="pf-promo pf-grid">
      <div className="pf-promo-texto">
        <div>
          {hasta && <p className="pf-pie">{hasta}</p>}
          <h2 id={id} className="pf-h2">
            {promo.title}
          </h2>
          {promo.description && <p className="pf-lead">{promo.description}</p>}
        </div>
        <div className="pf-promo-botones">
          <Button variant="whatsapp" href={promoWhatsapp(promo)} external>
            Pedir por WhatsApp<span className="sr-only">: {promo.title}</span>
          </Button>
          <Button variant="secondary" href={`/promos/${promo.slug}`}>
            {total > 1 ? `Ver las ${total} fotos →` : 'Ver la promo →'}
            <span className="sr-only"> de {promo.title}</span>
          </Button>
        </div>
      </div>
      {promo.cover && (
        <a
          href={`/promos/${promo.slug}`}
          className="pf-promo-foto sf-foto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          {...fotoAttrs(promoModal(promo))}
        >
          <img src={promo.cover.src} alt={promo.cover.alt} width={1200} height={800} loading="lazy" decoding="async" />
        </a>
      )}
    </section>
  )
}
