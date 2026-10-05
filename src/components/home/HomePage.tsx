import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { ServiceCard } from '../ui/ServiceCard'
import { ProductCard } from '../ui/ProductCard'
import { MapCard } from '../ui/MapCard'
import { EmptyState } from '../ui/EmptyState'
import { HeroCarousel, type Slide } from '../ui/HeroCarousel'
import { Ticker } from '../ui/Ticker'
import { Thread } from '../ui/Thread'
import { PinIcon } from '../icons/PinIcon'
import { WHATSAPP_URL } from '../../lib/business'

export interface HomeProduct {
  name: string
  meta: string
  href: string
  image: { src: string; alt: string }
}

export interface HomeImages {
  estampado: string
  dtf: string
  bordado: string
  personalizador: string
}

const RAZONES = [
  { n: '01', title: 'A tu gusto', copy: 'Cada prenda sale de tu idea. Nada genérico.' },
  { n: '02', title: 'Acabados que duran', copy: 'Bordado y estampado con materiales de calidad.' },
  { n: '03', title: 'Atención directa', copy: 'Te asesoramos por WhatsApp, sin vueltas.' },
]

const PASOS = ['Sube tu diseño o una foto', 'Elige prenda, color y técnica', 'Mándanoslo por WhatsApp']

// Para qué le sirve al cliente, no qué técnica es. Por validar con el cliente; luego editable desde el admin (PRI-150).
const USOS = [
  'Uniformes para tu equipo',
  'Gorras con el logo de tu negocio',
  'Camisetas para tu evento',
  'Camisetas de promoción',
  'Regalos con tu foto',
  'Dotación para tu empresa',
]

/**
 * Contenido de la portada (PRI-129, "B ajustada" del canvas tempo/designs/canvases/portada-opciones).
 * Header, Footer, PromoBar y WhatsAppFab los pone Layout.astro. Markup estático: Astro lo renderiza sin JS;
 * el único script es el que traza el hilo (src/scripts/thread.ts, lo carga index.astro).
 * Container queries (@3xl = 768px, @4xl = 896px) y no md:, así el canvas la muestra igual que el sitio.
 * Desde @4xl el mapa (Visítanos) sube al lado del carrusel; debajo, en el celular.
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

  return (
    <div className="@container relative overflow-clip font-body text-ink">
      <Thread />
      <main className="relative z-10">
        <div className="grid grid-cols-[minmax(0,1fr)] @4xl:grid-cols-[minmax(0,1fr)_400px] @4xl:gap-6 @4xl:px-12 @4xl:pt-6">
          <HeroCarousel slides={slides} className="h-[540px] @4xl:h-[560px] @4xl:rounded-card @4xl:border @4xl:border-line">
            <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 pb-10 @4xl:gap-4 @4xl:p-10 @4xl:pb-12">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
                <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
              </span>
              <h1 className="font-display text-[40px] font-medium leading-[1.02] tracking-[-0.01em] @4xl:text-[64px]">Bienvenido a Serflow</h1>
              <p className="max-w-[520px] text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">
                Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.
              </p>
              <div className="mt-1 w-full @4xl:mt-2 @4xl:w-auto">
                <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
                  Escríbenos por WhatsApp
                </Button>
              </div>
            </div>
          </HeroCarousel>

          <div className="@4xl:order-3 @4xl:col-span-2 @4xl:-mx-12 @4xl:mt-2">
            <Ticker items={USOS} />
          </div>

          {/* Dirección y horario salen una sola vez en la página: aquí. */}
          <section id="visitanos" aria-label="Visítanos" className="reveal-up scroll-mt-4 self-start px-4 pt-8 @4xl:order-2 @4xl:px-0 @4xl:pt-0">
            <MapCard open title="Visítanos" />
          </section>
        </div>

        <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
          <div className="grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
            {services.map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
            ))}
          </div>
        </Section>

        <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
          {products.length > 0 ? (
            <>
              <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:gap-4 @3xl:overflow-visible @3xl:px-0">
                {products.map((p) => (
                  <ProductCard key={p.href} name={p.name} meta={p.meta} href={p.href} image={p.image} />
                ))}
              </div>
              <div className="mt-2">
                <Button variant="ghost" href={catalogHref}>
                  Ver todo →
                </Button>
              </div>
            </>
          ) : (
            <EmptyState
              title="No hay prendas disponibles en este momento"
              description="Lo que llega al taller se vende rápido. Escríbenos y te contamos qué hay hoy, o mándanos tu idea y la hacemos."
              action={{ label: 'Escríbenos por WhatsApp', href: WHATSAPP_URL }}
            />
          )}
        </Section>

        <div className="reveal-up px-4 py-8 @3xl:px-12 @3xl:py-14">
          <div className="fabric grid overflow-hidden rounded-card border border-secondary/50 bg-surface @3xl:grid-cols-[1fr_1.1fr] @3xl:items-center">
            <div className="relative h-[220px] bg-muted @3xl:h-[380px]">
              <img
                src={images.personalizador}
                alt="Gorra con un diseño bordado"
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1/2 top-[30%] h-[28%] w-[42%] -translate-x-1/2 rounded-tile border-2 border-dashed border-accent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">Vista previa</span>
            </div>
            <div className="p-5 @3xl:p-10">
              <h2 className="font-display text-[26px] font-medium leading-tight @3xl:text-[34px]">Diseña la tuya</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.
              </p>
              <ol className="mt-5 flex flex-col gap-3">
                {PASOS.map((p, i) => (
                  <li key={p} className="flex items-center gap-3 text-[15px]">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent font-display text-[14px] font-medium text-accent">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
              <div className="mt-6">
                {/* Decisión de Said: el botón se ve pero no hace nada hasta que exista el personalizador. */}
                <Button variant="whatsapp" icon={null}>
                  Diseñar mi prenda →
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Section id="quienes-somos" title="Quiénes somos">
          <div className="reveal-up grid gap-6 @3xl:grid-cols-2 @3xl:gap-14">
            <p className="text-[16px] leading-relaxed text-muted @3xl:text-[18px]">
              Somos un taller en <span className="text-ink">Cartagena</span> que hace prendas personalizadas. La ropa no solo se usa,{' '}
              <span className="text-ink">se vive</span>: por eso cada pieza lleva algo tuyo.
            </p>
            <ul className="flex flex-col gap-4">
              {RAZONES.map((r) => (
                <li key={r.n} className="flex gap-4">
                  <span className="font-display text-[22px] font-medium leading-none text-accent">{r.n}</span>
                  <div>
                    <h3 className="text-[16px] font-bold">{r.title}</h3>
                    <p className="mt-0.5 text-[14px] text-muted">{r.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>
    </div>
  )
}
