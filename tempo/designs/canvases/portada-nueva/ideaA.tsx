import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Button } from "../../../../src/components/ui/Button";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Section } from "../../../../src/components/ui/Section";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { CATALOGO, Hoja, LOGO, PASOS, PERSONALIZA, PRENDA, Prenda, PRODUCTOS, PROMOS, TALLER, TRABAJOS, WA_IDEA } from "./comun";

/*
 * IDEA A · TALLER EN VIVO (dentro de la marca: Noche caribe, dorado, Space Grotesk).
 * Propuesta para el canvas: la vista previa (TallerVivo) y el mosaico serían componentes nuevos de src/components/ui
 * al construir. Lo demás es producción: PromoBar, Header, Ticker, Section, ProductCard, ServiceCard, MapCard, Footer,
 * Button, Eyebrow y WhatsAppFab.
 */

// Nav nueva de la portada: el personalizador y el catálogo entran al menú; "Qué hacemos" sale.
export const NAV_NUEVA = [
  { label: "Diseña la tuya", href: PERSONALIZA },
  { label: "Catálogo", href: CATALOGO },
  { label: "Promos", href: "/promos" },
  { label: "Visítanos", href: "/#visitanos" },
];

// Las mismas tres razones de la portada de hoy (HomePage.tsx).
const RAZONES = [
  { n: "01", title: "A tu gusto", copy: "Cada prenda sale de tu idea. Nada genérico." },
  { n: "02", title: "Acabados que duran", copy: "Bordado y estampado con materiales de calidad." },
  { n: "03", title: "Te mostramos antes", copy: "Ves tu diseño en la prenda antes de que la hagamos." },
];

const USOS = ["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento", "Regalos con tu foto", "Dotación para tu empresa"];

/** Vista previa que se estampa sola: el rasero baja, el diseño aparece, la camiseta cambia de color. Toda es un link a /personaliza. */
export function TallerVivo({ className = "" }: { className?: string }) {
  return (
    <a
      href={PERSONALIZA}
      aria-label="Abrir el personalizador"
      className={`fabric group relative block overflow-hidden rounded-card border border-line bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--color-primary-lighter),transparent_70%)]" />
      <Prenda blancaClass="pa-blanca" className="absolute left-1/2 top-[8%] h-[68%] -translate-x-1/2">
        <div className="relative h-full w-full rounded-tile border-2 border-dashed border-accent/70">
          <img src={PRENDA.sol} alt="Diseño de ejemplo, un sol con CTG La Heroica, puesto en el pecho de la camiseta" className="pa-diseno h-full w-full p-[8%]" />
          <span aria-hidden="true" className="pa-rasero absolute -inset-x-4 h-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_var(--color-accent)]" />
        </div>
      </Prenda>
      <span className="absolute left-3 top-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] font-semibold text-ink">Vista previa en vivo</span>
      <div aria-hidden="true" className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-tile bg-primary/85 p-2 @4xl:right-auto @4xl:gap-6">
        <div className="flex gap-1">
          <span className="rounded-full bg-accent px-3 py-1.5 text-[13px] font-bold text-primary">Camiseta</span>
          <span className="rounded-full border border-line px-3 py-1.5 text-[13px] text-muted">Gorra</span>
        </div>
        <div className="flex items-center gap-2.5 pr-1">
          <span className="pa-dot-negra size-6 rounded-full border border-line bg-primary" />
          <span className="pa-dot-blanca size-6 rounded-full bg-ink" />
        </div>
      </div>
    </a>
  );
}

function Hero() {
  return (
    <section className="grid gap-5 px-4 pb-8 pt-5 @4xl:grid-cols-[minmax(0,1fr)_540px] @4xl:gap-x-16 @4xl:gap-y-6 @4xl:px-12 @4xl:pb-16 @4xl:pt-12">
      <div className="anim-enter flex flex-col items-start gap-3 @4xl:justify-end @4xl:gap-5">
        <Eyebrow>Nuevo: el personalizador</Eyebrow>
        <h1 className="font-display text-[34px] font-medium leading-[1.04] tracking-[-0.01em] @4xl:text-[60px]">
          Diseña tu prenda y mírala antes de que la hagamos
        </h1>
      </div>
      <TallerVivo className="h-[320px] @4xl:col-start-2 @4xl:row-span-2 @4xl:row-start-1 @4xl:h-[540px]" />
      <div className="flex flex-col gap-5 @4xl:col-start-1 @4xl:row-start-2">
        <p className="hidden max-w-[52ch] text-[18px] leading-relaxed text-muted @4xl:block">
          Sube tu logo o una foto, ponlo en una camiseta o una gorra y mándanos el diseño listo. Lo estampamos o lo bordamos aquí, en Cartagena.
        </p>
        <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-center @4xl:gap-6">
          <Button variant="whatsapp" icon={null} href={PERSONALIZA} fullWidth>
            Diseñar mi prenda →
          </Button>
          <p className="-mt-1 text-center text-[13px] leading-snug text-muted @4xl:hidden">Gratis. Te llega por WhatsApp y te respondemos con el precio.</p>
          <a href={WA_IDEA} target="_blank" rel="noopener noreferrer" className="min-h-11 content-center pr-20 text-left text-[14px] font-semibold text-muted underline underline-offset-4 hover:text-ink @4xl:whitespace-nowrap @4xl:pr-0">
            ¿Mejor nos cuentas tu idea? Escríbenos
          </a>
        </div>
        <ol className="hidden grid-cols-3 gap-2 border-t border-line pt-4 @4xl:grid @4xl:max-w-[560px]">
          {PASOS.map((p, i) => (
            <li key={p} className="flex flex-col gap-1.5 text-[13px] leading-snug text-muted @4xl:text-[14px]">
              <span className="font-display text-[20px] font-medium leading-none text-accent">0{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AsiQuedan() {
  return (
    <Section id="trabajos" title="Así puede quedar la tuya" description="Estampado, DTF y bordado en camisetas y gorras. Con el personalizador ves la tuya antes de pedirla.">
      <div className="-mx-4 grid snap-x auto-cols-[230px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 @3xl:mx-0 @3xl:auto-cols-auto @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:grid-rows-[260px_260px] @3xl:gap-4 @3xl:overflow-visible @3xl:px-0">
        {TRABAJOS.map((t, i) => (
          <figure
            key={t.alt}
            className={`reveal-up relative snap-start overflow-hidden rounded-card border border-line bg-surface ${i === 0 ? "@3xl:col-span-2 @3xl:row-span-2" : ""} ${i === 5 ? "@3xl:hidden" : ""}`}
          >
            <img src={t.src} alt={t.alt} loading="lazy" className="h-[300px] w-full object-cover @3xl:h-full" style={{ objectPosition: t.pos }} />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] font-semibold text-ink">{t.tecnica}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function PaginaA({ promos = PROMOS, productos = PRODUCTOS }: { promos?: typeof PROMOS; productos?: typeof PRODUCTOS }) {
  return (
    <>
      <PromoBar promos={promos} />
      <Header logoSrc={LOGO} links={NAV_NUEVA} />
      <main>
        <Hero />
        <Ticker items={USOS} />
        <AsiQuedan />
        <Section id="disponible" title="Listo para llevar" description="Lo que ya está hecho en el taller esta semana.">
          {productos.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
                {productos.map((p) => (
                  <ProductCard key={p.href} {...p} />
                ))}
              </div>
              <div className="mt-5">
                <Button variant="secondary" href={CATALOGO}>
                  Ver todo el catálogo →
                </Button>
              </div>
            </>
          ) : (
            <EmptyState
              title="Hoy no hay prendas listas para llevar"
              description="Lo que sale del taller se va rápido. Diseña la tuya y la hacemos, o escríbenos y te contamos qué llega esta semana."
              action={{ label: "Escríbenos por WhatsApp", href: WA_IDEA }}
            />
          )}
        </Section>
        <Section id="que-hacemos" title="Con qué lo hacemos" description="Te recomendamos la técnica según tu diseño y la prenda.">
          <div className="grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
            <ServiceCard title="Estampado" description="Mate, toma la textura de la tela. Ideal para camisetas." image={{ src: TALLER.rasero, alt: "Rasero sobre una plancha de estampado" }} />
            <ServiceCard title="DTF" description="Colores vivos y con brillo. Fotos y degradados." image={{ src: TRABAJOS[2].src, alt: "Camiseta con estampado DTF" }} />
            <ServiceCard title="Bordado" description="Hilo con relieve. El clásico de las gorras." image={{ src: TALLER.gorraBordada2, alt: "Gorra con bordado" }} />
          </div>
        </Section>
        <Section id="quienes-somos" title="Quiénes somos">
          <div className="grid gap-6 @3xl:grid-cols-[1fr_420px] @3xl:items-start @3xl:gap-14">
            <div className="flex flex-col gap-8">
              <p className="reveal-up text-[16px] leading-relaxed text-muted @3xl:text-[18px]">
                Somos un taller en el <span className="text-ink">Mercado Bazurto</span> que hace camisetas y gorras con lo que tú traigas: tu logo, tu equipo, tu foto.
                Te asesoramos por WhatsApp y te mostramos cómo queda antes de hacerla.
              </p>
              <ul className="flex flex-col gap-5">
                {RAZONES.map((r) => (
                  <li key={r.n} className="flex gap-4 border-t border-line pt-5">
                    <span className="font-display text-[22px] font-medium leading-none text-accent">{r.n}</span>
                    <div>
                      <h3 className="text-[16px] font-bold">{r.title}</h3>
                      <p className="mt-0.5 text-[14px] text-muted">{r.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div id="visitanos" className="scroll-mt-4">
              <MapCard title="Visítanos en el taller" />
            </div>
          </div>
        </Section>
      </main>
      <Footer logoSrc={LOGO} />
    </>
  );
}

export function AMobile() {
  return (
    <Hoja width={390} fold={844} className="bg-primary text-ink">
      <PaginaA />
    </Hoja>
  );
}

export function ADesktop() {
  return (
    <Hoja width={1280} fold={800} className="bg-primary text-ink">
      <PaginaA />
    </Hoja>
  );
}
