import { Button } from '../ui/Button'
import { Section } from '../ui/Section'
import { QuickFacts } from '../ui/QuickFacts'
import { MascotSlot } from '../ui/MascotSlot'
import { ServiceCard } from '../ui/ServiceCard'
import { ProductCard } from '../ui/ProductCard'
import { MapCard } from '../ui/MapCard'
import { EmptyState } from '../ui/EmptyState'
import { PinIcon } from '../icons/PinIcon'
import { WHATSAPP_URL } from '../../lib/business'
import { TITO_SALUDO } from '../../lib/mascot'

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

/**
 * Contenido de la portada (PRI-129), igual al canvas tempo/designs/canvases/portada-final.
 * Header, Footer y WhatsAppFab los pone Layout.astro. Markup estático: Astro lo renderiza sin JS.
 * Mobile primero; desde md el mapa sube al hero y la sección "Dónde estamos" se oculta.
 */
export function HomePage({ products, images, catalogHref }: { products: HomeProduct[]; images: HomeImages; catalogHref: string }) {
  const services = [
    { title: 'Estampado', description: 'Mate, toma la textura de la tela. Ideal para camisetas.', src: images.estampado },
    { title: 'DTF', description: 'Colores vivos y con brillo. Fotos y degradados.', src: images.dtf },
    { title: 'Bordado', description: 'Hilo con relieve. El clásico de las gorras.', src: images.bordado },
  ]

  return (
    <main className="font-body text-ink">
      <section className="fabric relative px-4 pb-8 pt-6 md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-14 md:px-12 md:py-16">
        <div>
          <h1 className="font-display text-[38px] font-medium leading-[1.05] tracking-[-0.01em] md:text-[68px]">
            Camisetas y gorras con tu sello.
          </h1>
          <div className="mt-3 flex items-start gap-2 md:mt-5">
            <p className="flex-1 text-[16px] leading-relaxed text-muted md:max-w-[500px] md:text-[19px]">
              Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos.
            </p>
            {/* Una sola mascota por página: el hero. */}
            <MascotSlot size="lg" clip={TITO_SALUDO} />
          </div>
          <div className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row">
            <Button variant="whatsapp" href={WHATSAPP_URL} external>
              Escríbenos por WhatsApp
            </Button>
            {/* En desktop "Cómo llegar" ya está en la tarjeta del mapa. */}
            <span className="md:hidden">
              <Button variant="secondary" href="#ubicacion" fullWidth icon={<PinIcon className="size-4" />}>
                Cómo llegar
              </Button>
            </span>
          </div>
          <div className="mt-6 md:mt-8 md:max-w-[520px]">
            <QuickFacts />
          </div>
        </div>
        <div className="hidden md:block">
          <MapCard tall />
        </div>
      </section>

      <Section id="quienes-somos" title="Quiénes somos">
        <div className="grid gap-6 md:grid-cols-2 md:gap-14">
          <p className="text-[16px] leading-relaxed text-muted md:text-[18px]">
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

      <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {services.map((s) => (
            <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
          ))}
        </div>
      </Section>

      <div className="px-4 py-8 md:px-12 md:py-14">
        <div className="fabric grid overflow-hidden rounded-card border border-secondary/50 bg-surface md:grid-cols-[1fr_1.1fr] md:items-center">
          <div className="relative h-[220px] bg-muted md:h-[380px]">
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
          <div className="p-5 md:p-10">
            <h2 className="font-display text-[26px] font-medium leading-tight md:text-[34px]">Diseña la tuya</h2>
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

      <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
        {products.length > 0 ? (
          <>
            <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid-flow-row md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
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

      {/* En desktop el mapa está en el hero. */}
      <div className="md:hidden">
        <Section id="ubicacion" title="Dónde estamos">
          <MapCard />
        </Section>
      </div>

      <Section id="contacto" title="Hablemos" description="Mándanos tu idea, una foto o el logo de tu negocio." tone="panel">
        <Button variant="whatsapp" href={WHATSAPP_URL} external>
          Escríbenos por WhatsApp
        </Button>
      </Section>
    </main>
  )
}
