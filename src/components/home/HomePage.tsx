import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { ServiceCard } from '../ui/ServiceCard'
import { ProductCard } from '../ui/ProductCard'
import { MapCard } from '../ui/MapCard'
import { EmptyState } from '../ui/EmptyState'
import { HeroCarousel, type Slide } from '../ui/HeroCarousel'
import type { FotoModal } from '../ui/PhotoModal'
import { PinIcon } from '../icons/PinIcon'
import { WHATSAPP_URL } from '../../lib/business'

export interface HomeProduct {
  name: string
  meta: string
  href: string
  image: { src: string; alt: string }
  /** Tocarla abre la foto en el modal, encima de la portada. */
  modal?: FotoModal
}

export interface HomeImages {
  estampado: string
  dtf: string
  bordado: string
  personalizador: { src: string; srcSet?: string; alt: string }
}

const RAZONES = [
  { title: 'A tu gusto', copy: 'Cada prenda sale de tu idea. Nada genérico.' },
  { title: 'Acabados que duran', copy: 'Bordado y estampado con materiales de calidad.' },
  { title: 'Atención directa', copy: 'Te asesoramos por WhatsApp, sin vueltas.' },
]

const PASOS = ['Sube tu diseño o una foto', 'Elige prenda, color y técnica', 'Mándanoslo por WhatsApp']

/**
 * Contenido de la portada (PRI-286, canvas tempo/designs/canvases/portada-final). Header, Footer, PromoBar y
 * WhatsAppFab los pone Layout.astro. Sistema medido de tokens.css (.pf-*): rejilla de 12 columnas, margen 48 / 16 y
 * el mismo aire entre secciones. Orden: hero en carrusel, Diseña la tuya, Qué hacemos, Disponible ahora y Quiénes
 * somos con Visítanos (el mapa plegado) al final. Markup estático: el único JS es el del modal de las prendas
 * (src/scripts/photo-modal.ts, lo carga index.astro).
 */
export function HomePage({
  slides,
  products,
  images,
  catalogHref,
}: {
  slides: Slide[]
  products: HomeProduct[]
  images: HomeImages
  catalogHref: string
}) {
  const services = [
    { title: 'Estampado', description: 'Mate, toma la textura de la tela. Ideal para camisetas.', src: images.estampado },
    { title: 'DTF', description: 'Colores vivos y con brillo. Fotos y degradados.', src: images.dtf },
    { title: 'Bordado', description: 'Hilo con relieve. El clásico de las gorras.', src: images.bordado },
  ]
  const foto = (
    <div className="pf-pz-foto sf-foto">
      <img
        src={images.personalizador.src}
        srcSet={images.personalizador.srcSet}
        sizes="(min-width: 768px) 50vw, 100vw"
        alt={images.personalizador.alt}
        width={1200}
        height={900}
        loading="lazy"
        decoding="async"
      />
    </div>
  )

  return (
    <div className="pf font-body text-ink">
      <main className="pf-v">
        <HeroCarousel slides={slides} className="pf-hero">
          <div className="pf-hero-texto anim-enter">
            <span className="pf-pie flex items-center gap-1.5">
              <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
            </span>
            <h1 className="pf-display sf-lineas" aria-label="Bienvenido a Serflow">
              <span aria-hidden="true">
                <span>Bienvenido</span>
              </span>
              <span aria-hidden="true">
                <span>a Serflow</span>
              </span>
            </h1>
            <p className="pf-lead">Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.</p>
            <div>
              <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
                Escríbenos por WhatsApp
              </Button>
            </div>
          </div>
        </HeroCarousel>

        <section aria-labelledby="personaliza-titulo" className="pf-sec pf-c">
          <div className="pf-grid">
            <div className="pf-pz-texto">
              <h2 id="personaliza-titulo" className="pf-h2 sf-entra-scroll">
                Diseña la tuya
              </h2>
              <p className="pf-lead">Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.</p>
              <div className="@3xl:hidden">{foto}</div>
              <ol className="pf-pasos">
                {PASOS.map((p, i) => (
                  <li key={p}>
                    <span>{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
              <div>
                <Button variant="whatsapp" href="/personaliza" icon={null} fullWidth>
                  Diseñar mi prenda
                </Button>
              </div>
            </div>
            <div className="hidden @3xl:contents">{foto}</div>
          </div>
        </section>

        <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
          <div className="pf-servicios">
            {services.map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
            ))}
          </div>
        </Section>

        <Section
          id="disponible"
          title="Disponible ahora"
          description="Lo que hay en el taller esta semana."
          action={products.length > 0 ? { label: 'Ver todo →', href: catalogHref } : undefined}
        >
          {products.length > 0 ? (
            <div className="pf-prendas" data-fotos>
              {products.map((p) => (
                <ProductCard key={p.href} name={p.name} meta={p.meta} href={p.href} image={p.image} modal={p.modal} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay prendas disponibles en este momento"
              description="Lo que llega al taller se vende rápido. Escríbenos y te contamos qué hay hoy, o mándanos tu idea y la hacemos."
              action={{ label: 'Escríbenos por WhatsApp', href: WHATSAPP_URL }}
            />
          )}
        </Section>

        <section id="quienes-somos" aria-labelledby="quienes-somos-titulo" className="pf-sec pf-c">
          <div className="pf-grid">
            <div className="pf-quienes">
              <h2 id="quienes-somos-titulo" className="pf-h2 sf-entra-scroll">
                Quiénes somos
              </h2>
              <p className="pf-lead">
                Somos un taller en <span className="text-ink">Cartagena</span> que hace prendas personalizadas. La ropa no solo se usa,{' '}
                <span className="text-ink">se vive</span>: por eso cada pieza lleva algo tuyo.
              </p>
              <ul className="pf-razones">
                {RAZONES.map((r) => (
                  <li key={r.title}>
                    <h3>{r.title}</h3>
                    <p>{r.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* #visitanos sigue siendo el ancla del menú y del footer. Dirección y horario salen una sola vez: aquí. */}
            <div id="visitanos" className="pf-visita scroll-mt-4">
              <h2 className="pf-h2 sf-entra-scroll">Visítanos</h2>
              <MapCard
                title={
                  <>
                    <span className="@3xl/pf:hidden">Serflow · Cartagena</span>
                    <span className="hidden @3xl/pf:inline">Visítanos</span>
                  </>
                }
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
