import { Button } from "../../../../../src/components/ui/Button";
import { Eyebrow } from "../../../../../src/components/ui/Eyebrow";
import { HeroCarousel } from "../../../../../src/components/ui/HeroCarousel";
import { MapCard } from "../../../../../src/components/ui/MapCard";
import { ProductCard } from "../../../../../src/components/ui/ProductCard";
import { Section } from "../../../../../src/components/ui/Section";
import { ServiceCard } from "../../../../../src/components/ui/ServiceCard";
import { Thread } from "../../../../../src/components/ui/Thread";
import { PinIcon } from "../../../../../src/components/icons/PinIcon";
import { CATALOG_HREF, PRODUCTS, QuienesCopy, Razones } from "../../../design-system/app-shell/portada";
import { FOTOS, Marco, SLIDES_SIN_MODELOS } from "../comun";
import { PERSONALIZA_HREF } from "./Portada";

/*
 * PROPUESTA ronda 3 (PRI-286, espacios). Parte de la ronda 2 (PortadaR2.tsx) y corrige lo que Said comentó el 2026-11-01.
 * Al construir, va en src/components/home/HomePage.tsx.
 */

const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: FOTOS.estampadoRasero },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: FOTOS.mtq5 },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: FOTOS.gorraBordada2 },
];

/** Los 3 pasos reales de /personaliza, en una línea cada uno. */
const PASOS = ["Sube tu logo, un dibujo o una foto.", "Elige la prenda, el color y la técnica.", "Nos llega tu pedido por WhatsApp."];

/**
 * Banda del personalizador, ronda 3 (Said: "muy grande y no aprovecha los espacios"). Un bloque de 480 px de alto en
 * 1280: texto en 5 columnas (arriba titular, abajo frase, pasos y botón, alineados con el borde de la foto) y la foto
 * en 7. En el celular: titular, foto, pasos y botón.
 */
export function BandaPersonalizaR3() {
  return (
    <section aria-labelledby="personaliza-titulo" className="sf-seccion @container">
      <div className="grid gap-6 px-4 @3xl:grid-cols-12 @3xl:grid-rows-[auto_1fr] @3xl:gap-x-12 @3xl:gap-y-0 @3xl:px-12">
        <div className="flex flex-col items-start gap-4 @3xl:col-span-5 @3xl:gap-5">
          <Eyebrow>Personalizador</Eyebrow>
          <h2 id="personaliza-titulo" className="sf-t-h2 sf-entra-scroll">
            Tu idea, en tu prenda.
          </h2>
          <p className="sf-t-lead text-muted">Sube tu diseño, míralo sobre la camiseta o la gorra y te la hacemos aquí en el taller.</p>
        </div>
        {/* La foto del proceso con el recuadro de la vista previa de /personaliza encima. */}
        <div className="sf-banda-foto sf-foto relative overflow-hidden rounded-tile @3xl:col-span-7 @3xl:col-start-6 @3xl:row-span-2 @3xl:row-start-1">
          <img
            src={FOTOS.mtq2}
            alt="Gorra con un diseño bordado y el recuadro donde va tu diseño"
            width={1200}
            height={840}
            loading="lazy"
            decoding="async"
            className="h-[300px] w-full object-cover @3xl:h-[480px]"
            style={{ objectPosition: "50% 40%" }}
          />
          <span aria-hidden="true" className="absolute left-1/2 top-[22%] h-[40%] w-[40%] -translate-x-1/2 rounded-tile border border-dashed border-accent @3xl:w-[30%]" />
          <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink @3xl:bottom-5 @3xl:left-5">Vista previa</span>
        </div>
        <div className="flex flex-col items-start gap-6 @3xl:col-span-5 @3xl:row-start-2 @3xl:justify-end">
          <ol className="flex w-full flex-col border-t border-line">
            {PASOS.map((p, i) => (
              <li key={p} className="flex items-baseline gap-4 border-b border-line py-3 text-[16px] leading-snug">
                <span className="w-6 shrink-0 font-display text-[14px] text-muted">0{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
          <div className="w-full @3xl:w-auto">
            <Button variant="whatsapp" href={PERSONALIZA_HREF} icon={null} fullWidth>
              Diseñar mi prenda
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTexto() {
  return (
    <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 p-4 pb-12 @4xl:gap-6 @4xl:p-12 @4xl:pb-20">
      <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[.16em] text-accent">
        <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
      </span>
      <h1 className="sf-lineas sf-t-display font-display">
        <span>
          <span>Bienvenido</span>
        </span>
        <span>
          <span>a Serflow</span>
        </span>
      </h1>
      <p className="sf-t-lead max-w-[30ch] text-ink/85">Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.</p>
      <div className="w-full @4xl:w-auto">
        {/* Un solo dorado por bloque y WhatsApp solo en el flotante: el hero lleva al catálogo. */}
        <Button variant="secondary" href={CATALOG_HREF} fullWidth>
          Ver el catálogo
        </Button>
      </div>
    </div>
  );
}

export function PortadaR3({ width }: { width: 390 | 1280 }) {
  return (
    <Marco width={width} r3>
      <div className="@container relative overflow-clip font-body text-ink">
        <Thread />
        <main className="relative z-10">
          <HeroCarousel slides={SLIDES_SIN_MODELOS} className="h-[640px] @4xl:h-[760px]">
            <HeroTexto />
          </HeroCarousel>

          <BandaPersonalizaR3 />

          {/* Sin Ticker (Said, 2026-11-01: "no tiene sentido el banner tan abajo"). */}

          <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
            <div className="grid gap-10 @3xl:grid-cols-3 @3xl:gap-8">
              {SERVICES.map((s) => (
                <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
              ))}
            </div>
          </Section>

          <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
            <div className="-mx-4 grid snap-x auto-cols-[240px] grid-flow-col gap-4 overflow-x-auto px-4 pb-2 pt-1 @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:gap-6 @3xl:overflow-visible @3xl:px-0">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.name} name={p.name} meta={p.meta} href={CATALOG_HREF} image={{ src: p.src, alt: p.name }} />
              ))}
            </div>
            <div className="mt-6">
              <Button variant="ghost" href={CATALOG_HREF}>
                Ver todo el catálogo →
              </Button>
            </div>
          </Section>

          {/* El mapa al final y plegado: calles en CSS, el de Google solo al tocar. #visitanos sigue siendo el ancla del menú. */}
          <Section id="quienes-somos" title="Quiénes somos">
            <div className="grid gap-10 @3xl:grid-cols-[minmax(0,1fr)_400px] @3xl:items-start @3xl:gap-20">
              <div className="flex flex-col gap-8">
                <QuienesCopy className="sf-t-lead" />
                <Razones />
              </div>
              <div id="visitanos" className="scroll-mt-4">
                <MapCard title="Visítanos" />
              </div>
            </div>
          </Section>
        </main>
      </div>
    </Marco>
  );
}
