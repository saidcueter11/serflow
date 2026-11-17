import type { CSSProperties } from 'react'
import { promoModal, promoWhatsapp, validaHasta, type PromoView } from '../../lib/promos'
import { Button } from '../ui/Button'
import { HeroCarousel } from '../ui/HeroCarousel'
import { fotoAttrs } from '../ui/PhotoModal'
import { Palabras } from '../ui/Palabras'
import { PromoCard } from '../ui/PromoCard'
import { PromoGrid } from '../ui/PromoGrid'
import { StatusPill } from '../ui/StatusPill'
import { Section } from '../ui/Section'

/**
 * /promos/[slug] (PRI-131; sistema medido de PRI-286): "Volver" en su fila y el hero de la portada con la foto de la
 * promo (vigencia, título, días si aplica solo algunos, descripción y WhatsApp); luego Más fotos en una fila llena y
 * Otras promos en tarjetas. La
 * portada del hero y cada foto de Más fotos abren el modal de foto (PhotoModal, PRI-523) con todas las de la promo; la página lo monta.
 */
export function PromoDetailPage({ promo, otras }: { promo: PromoView; otras: PromoView[] }) {
  const hasta = validaHasta(promo.endsAt)
  const hayOtras = otras.length > 0
  // Hasta 4 por fila: 1 -> 21:9, 2 -> 4:3, 3 o 4 -> 1:1 (pf-mas-fotos en tokens.css).
  const n = Math.min(promo.photos.length, 4)
  const modal = promoModal(promo)
  // PRI-535: en desktop el hero mide hasta 1920 x 720; una portada más angosta que 16:9 (cuadrada, vertical) a sangre se
  // estira y solo deja ver una franja. Esa se muestra entera (pf-promo-entera en tokens.css).
  const entera = (promo.cover?.r ?? Infinity) < 16 / 9
  return (
    <div className="pf font-body text-ink">
      <main className="pf-v">
        <div className="pf-c">
          <a href={hayOtras ? '/promos' : '/'} className="pf-volver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {hayOtras ? 'Volver a las promos' : 'Volver al inicio'}
          </a>
        </div>
        <HeroCarousel slides={promo.cover ? [promo.cover] : []} className={`pf-hero pf-promo-hero${entera ? ' pf-promo-entera' : ''}`}>
          {/* PRI-523: tocar la portada abre el modal en la primera foto (PRI-535: el banner no entra); el texto deja pasar el toque. */}
          {/* PRI-535: el resto del hero lo llena la misma portada, desenfocada y oscura (solo desktop, tokens.css). */}
          {entera && <img src={promo.cover!.src} alt="" aria-hidden="true" className="pf-promo-fondo" />}
          {promo.cover && modal && (
            <a
              href={`/promos/${promo.slug}`}
              className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
              aria-label={`Ver las fotos de ${promo.title}`}
              {...fotoAttrs(modal)}
            />
          )}
          <div className="pf-hero-texto anim-enter">
            {hasta && <span className="pf-pie">{hasta}</span>}
            <h1 className="pf-display">
              <Palabras text={promo.title} />
            </h1>
            {promo.dias && (
              <p>
                <StatusPill tone="accent">{promo.dias}</StatusPill>
              </p>
            )}
            {promo.description && (
              <p className="pf-lead sf-bajada">
                <Palabras text={promo.description} />
              </p>
            )}
            <div>
              <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth>
                Pedir esta promo por WhatsApp
              </Button>
            </div>
          </div>
        </HeroCarousel>
        {n > 0 && (
          <Section id="mas-fotos" title="Más fotos">
            <ul className="pf-mas-fotos" data-n={n} style={{ '--n': n } as CSSProperties}>
              {promo.photos.map((ph, i) => (
                <li key={i}>
                  {/* PRI-523: abre el modal de foto en esta foto y recorre las de la promo (la portada es la 0 si no es el banner). */}
                  <a
                    href={`/promos/${promo.slug}`}
                    className="block rounded-tile focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    data-foto-j={i + (promo.cover && !promo.cover.banner ? 1 : 0)}
                    {...fotoAttrs(modal)}
                  >
                    <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" className="fabric" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {hayOtras && (
          <Section id="otras-promos" title="Otras promos">
            <PromoGrid>{otras.map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
          </Section>
        )}
      </main>
    </div>
  )
}
