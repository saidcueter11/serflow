import { Button } from "../../../../../src/components/ui/Button";
import { Eyebrow } from "../../../../../src/components/ui/Eyebrow";
import { HeroCarousel } from "../../../../../src/components/ui/HeroCarousel";
import { MapCard } from "../../../../../src/components/ui/MapCard";
import { ProductCard } from "../../../../../src/components/ui/ProductCard";
import { Section } from "../../../../../src/components/ui/Section";
import { ServiceCard } from "../../../../../src/components/ui/ServiceCard";
import { Ticker } from "../../../../../src/components/ui/Ticker";
import { Thread } from "../../../../../src/components/ui/Thread";
import { PinIcon } from "../../../../../src/components/icons/PinIcon";
import { WHATSAPP_URL } from "../../../../../src/lib/business";
import { CATALOG_HREF, PRODUCTS, QuienesCopy, Razones } from "../../../design-system/app-shell/portada";
import { FOTOS, Marco, SLIDES_SIN_MODELOS } from "../comun";

/*
 * PROPUESTA (PRI-286) · La portada de master con dos cambios: el personalizador sube justo después del hero (banda
 * estilo Heirest: foto del proceso, frase corta, un botón) y el mapa pierde peso (al final, junto a Quiénes somos,
 * MapCard cerrada). Todo lo demás es HomePage.tsx de hoy con el acabado nuevo. Al construir, este orden y
 * BandaPersonaliza van en src/components/home/HomePage.tsx (BandaPersonaliza es un bloque de la portada, no del
 * design system, como hoy "Diseña la tuya").
 */

const USOS = ["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento", "Camisetas de promoción", "Regalos con tu foto", "Dotación para tu empresa"];

const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: FOTOS.estampadoRasero },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: FOTOS.mtq5 },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: FOTOS.gorraBordada2 },
];

export const PERSONALIZA_HREF = "/personaliza";

/** Banda del personalizador: foto del proceso a sangre, frase corta y un solo botón. */
export function BandaPersonaliza() {
  return (
    <section aria-labelledby="personaliza-titulo" className="px-4 pt-8 @3xl:px-12 @3xl:pt-14">
      <article className="group grid overflow-hidden rounded-card border border-line bg-surface @3xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* El proceso del personalizador: tu diseño puesto sobre la prenda (la vista previa de /personaliza). */}
        <div className="relative overflow-hidden bg-surface-2">
          <img
            src={FOTOS.mtq2}
            alt="Gorra con un diseño bordado y el recuadro donde va tu diseño"
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover @3xl:aspect-auto @3xl:h-[460px]"
          />
          <span aria-hidden="true" className="absolute left-1/2 top-[30%] h-[30%] w-[40%] -translate-x-1/2 rounded-tile border-2 border-dashed border-accent" />
          <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">Vista previa</span>
        </div>
        <div className="flex flex-col items-start justify-center gap-4 p-5 pb-6 @3xl:gap-5 @3xl:p-12">
          <Eyebrow>Personalizador</Eyebrow>
          <h2 id="personaliza-titulo" className="sf-entra-scroll font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.022em] @3xl:text-[46px]">
            Tu idea, en tu prenda.
          </h2>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted @3xl:text-[17px]">
            Sube tu diseño, míralo sobre la camiseta o la gorra y te la hacemos aquí en el taller.
          </p>
          <div className="mt-1 w-full @3xl:w-auto">
            <Button variant="whatsapp" href={PERSONALIZA_HREF} icon={null} fullWidth>
              Diseñar mi prenda
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}

/** Texto del hero: el de hoy, con el titular partido en dos líneas que suben una tras otra. */
function HeroTexto() {
  return (
    <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 pb-10 @4xl:gap-4 @4xl:p-12 @4xl:pb-14">
      <span className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
        <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
      </span>
      <h1 className="sf-lineas font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.025em] @4xl:text-[72px]">
        <span>
          <span>Bienvenido</span>
        </span>
        <span>
          <span>a Serflow</span>
        </span>
      </h1>
      <p className="max-w-[520px] text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">
        Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.
      </p>
      <div className="mt-1 w-full @4xl:mt-2 @4xl:w-auto">
        <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
          Escríbenos por WhatsApp
        </Button>
      </div>
    </div>
  );
}

export function PortadaRefresh({ width }: { width: 390 | 1280 }) {
  return (
    <Marco width={width} refresh>
      <div className="@container relative overflow-clip font-body text-ink">
        {/* El hilo se queda: en el sitio lo dibuja src/scripts/thread.ts con el scroll; en el canvas no se pinta. */}
        <Thread />
        <main className="relative z-10">
          <div className="@4xl:px-12 @4xl:pt-6">
            <HeroCarousel slides={SLIDES_SIN_MODELOS} className="h-[560px] @4xl:h-[600px] @4xl:rounded-card @4xl:border @4xl:border-line">
              <HeroTexto />
            </HeroCarousel>
          </div>
          <div className="@4xl:mt-6">
            <Ticker items={USOS} />
          </div>

          <BandaPersonaliza />

          <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
            <div className="grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
              {SERVICES.map((s) => (
                <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
              ))}
            </div>
          </Section>

          <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
            <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:gap-4 @3xl:overflow-visible @3xl:px-0">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.name} name={p.name} meta={p.meta} href={CATALOG_HREF} image={{ src: p.src, alt: p.name }} />
              ))}
            </div>
            <div className="mt-2">
              <Button variant="ghost" href={CATALOG_HREF}>
                Ver todo →
              </Button>
            </div>
          </Section>

          {/* El mapa baja al final y queda plegado: calles en CSS y el de Google solo al tocar. #visitanos sigue siendo el ancla del menú. */}
          <Section id="quienes-somos" title="Quiénes somos">
            <div className="grid gap-8 @3xl:grid-cols-[minmax(0,1fr)_380px] @3xl:items-start @3xl:gap-14">
              <div className="flex flex-col gap-6">
                <QuienesCopy className="text-[16px] @3xl:text-[18px]" />
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
