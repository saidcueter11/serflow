import type { ReactNode } from "react";
import { Button } from "../../../../../src/components/ui/Button";
import { Footer } from "../../../../../src/components/ui/Footer";
import { Header } from "../../../../../src/components/ui/Header";
import { HeroCarousel } from "../../../../../src/components/ui/HeroCarousel";
import { MapCard } from "../../../../../src/components/ui/MapCard";
import { ProductCard } from "../../../../../src/components/ui/ProductCard";
import { PromoBar } from "../../../../../src/components/ui/PromoBar";
import { Section } from "../../../../../src/components/ui/Section";
import { ServiceCard } from "../../../../../src/components/ui/ServiceCard";
import { Ticker } from "../../../../../src/components/ui/Ticker";
import { WhatsAppFab } from "../../../../../src/components/ui/WhatsAppFab";
import { PinIcon } from "../../../../../src/components/icons/PinIcon";
import { WHATSAPP_URL } from "../../../../../src/lib/business";
import { CATALOG_HREF, HOME_IMAGES, HOME_SLIDES, LOGO, PRODUCTS, PROMOS_SAMPLE, QuienesCopy, Razones } from "../../../design-system/app-shell/portada";
import { EstilosMotion } from "../motion/estilos";
import { BloquePersonaliza, HeroPersonaliza, PERSONALIZA_HREF, TarjetaPersonaliza } from "./Personaliza";

/*
 * PROPUESTA (PRI-286) · Las tres portadas armadas con los componentes reales del design system y los datos de muestra
 * de la portada de hoy (design-system/app-shell/portada). Al construir, el orden escogido se aplica en HomePage.tsx;
 * PromoBar, Header, Footer y WhatsAppFab los sigue poniendo Layout.astro. El hilo (Thread) no se dibuja en el canvas.
 */

const USOS = ["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento", "Camisetas de promoción", "Regalos con tu foto", "Dotación para tu empresa"];

const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: HOME_IMAGES.estampado },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: HOME_IMAGES.dtf },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: HOME_IMAGES.bordado },
];

function Marco({ width, children }: { width: 390 | 1280; children: ReactNode }) {
  return (
    <div className="relative bg-primary font-body text-ink antialiased" style={{ width }}>
      <EstilosMotion />
      <PromoBar promos={PROMOS_SAMPLE} />
      <Header logoSrc={LOGO} />
      <div className="@container relative overflow-clip">
        <main className="relative z-10">{children}</main>
      </div>
      <Footer logoSrc={LOGO} />
      <div className="absolute bottom-5 right-4">
        <WhatsAppFab placement="inline" />
      </div>
    </div>
  );
}

/** Texto del hero de hoy. cta: whatsapp (como hoy, opción A) o personaliza (opción B). */
function HeroTexto({ cta }: { cta: "whatsapp" | "personaliza" }) {
  return (
    <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 pb-10 @4xl:gap-4 @4xl:p-10 @4xl:pb-12">
      <span className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
        <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
      </span>
      <h1 className="font-display text-[40px] font-medium leading-[1.02] tracking-[-0.01em] @4xl:text-[64px]">Bienvenido a Serflow</h1>
      <p className="max-w-[520px] text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">
        {cta === "whatsapp"
          ? "Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller."
          : "Camisetas y gorras con tu logo, tu equipo o tu idea. Diséñala aquí, mírala sobre la prenda y te la hacemos en el taller."}
      </p>
      <div className="mt-1 w-full @4xl:mt-2 @4xl:w-auto">
        {cta === "whatsapp" ? (
          <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
            Escríbenos por WhatsApp
          </Button>
        ) : (
          <Button variant="whatsapp" href={PERSONALIZA_HREF} icon={null} fullWidth>
            Diseñar mi prenda →
          </Button>
        )}
      </div>
    </div>
  );
}

function QueHacemos() {
  return (
    <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
      <div className="grid gap-3 @3xl:grid-cols-3 @3xl:gap-5">
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
        ))}
      </div>
    </Section>
  );
}

function Disponible() {
  return (
    <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
      <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:gap-4 @3xl:overflow-visible @3xl:px-0">
        {PRODUCTS.map((p) => (
          <div key={p.name} className="mo-card">
            <ProductCard name={p.name} meta={p.meta} href={CATALOG_HREF} image={{ src: p.src, alt: p.name }} />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Button variant="ghost" href={CATALOG_HREF}>
          Ver todo →
        </Button>
      </div>
    </Section>
  );
}

/** El mapa, igual en las tres: al final, junto a Quiénes somos, plegado (MapCard sin open). #visitanos sigue siendo el ancla del nav. */
function QuienesYVisitanos() {
  return (
    <Section id="quienes-somos" title="Quiénes somos">
      <div className="reveal-up grid gap-8 @3xl:grid-cols-[minmax(0,1fr)_380px] @3xl:gap-14">
        <div className="flex flex-col gap-6">
          <QuienesCopy className="text-[16px] @3xl:text-[18px]" />
          <Razones />
        </div>
        <div id="visitanos" className="scroll-mt-4">
          <MapCard title="Visítanos" />
        </div>
      </div>
    </Section>
  );
}

function Cinta() {
  return <Ticker items={USOS} />;
}

/** A · Después del hero: hero de hoy (con WhatsApp), cinta y el bloque completo. */
export function PortadaA({ width }: { width: 390 | 1280 }) {
  return (
    <Marco width={width}>
      <div className="@4xl:px-12 @4xl:pt-6">
        <HeroCarousel slides={HOME_SLIDES} className="h-[540px] @4xl:h-[520px] @4xl:rounded-card @4xl:border @4xl:border-line">
          <HeroTexto cta="whatsapp" />
        </HeroCarousel>
      </div>
      <div className="@4xl:mt-6">
        <Cinta />
      </div>
      <BloquePersonaliza />
      <QueHacemos />
      <Disponible />
      <QuienesYVisitanos />
    </Marco>
  );
}

/** B · En el hero: el botón del hero lleva al personalizador y la tarjeta ocupa el lugar del mapa. */
export function PortadaB({ width }: { width: 390 | 1280 }) {
  return (
    <Marco width={width}>
      <div className="grid grid-cols-[minmax(0,1fr)] @4xl:grid-cols-[minmax(0,1fr)_400px] @4xl:gap-6 @4xl:px-12 @4xl:pt-6">
        <HeroCarousel slides={HOME_SLIDES} className="h-[500px] @4xl:h-[560px] @4xl:rounded-card @4xl:border @4xl:border-line">
          <HeroTexto cta="personaliza" />
        </HeroCarousel>
        <div className="px-4 pt-4 @4xl:px-0 @4xl:pt-0">
          <TarjetaPersonaliza />
        </div>
      </div>
      <div className="mt-6">
        <Cinta />
      </div>
      <QueHacemos />
      <Disponible />
      <QuienesYVisitanos />
    </Marco>
  );
}

/** C · El personalizador es el hero; sin carrusel. */
export function PortadaC({ width }: { width: 390 | 1280 }) {
  return (
    <Marco width={width}>
      <HeroPersonaliza />
      <div className="mt-8 @4xl:mt-10">
        <Cinta />
      </div>
      <QueHacemos />
      <Disponible />
      <QuienesYVisitanos />
    </Marco>
  );
}
