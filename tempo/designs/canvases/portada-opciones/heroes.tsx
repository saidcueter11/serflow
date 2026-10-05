import type { ReactNode } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Button } from "../../../../src/components/ui/Button";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { PinIcon } from "../../../../src/components/icons/PinIcon";
import { ADDRESS, DIRECTIONS_URL, HOURS, WHATSAPP_URL } from "../../../../src/lib/business";
import { CATALOG_HREF, DisponibleSinProductos, LOGO, ProductItems, SERVICES } from "../../design-system/app-shell/portada";
// Foto de ejemplo del catálogo actual. Todas las fotos de src/assets/images son gorras: no hay camisetas.
import capCartagena from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida7.webp";

/*
 * Primeras pantallas de las 3 opciones de jerarquía del doc de Producto (PRI-129).
 * Composición de página con componentes de src/components/ui; el hero elegido va en la portada
 * (HomePage), no en el design system. Lo que no existe todavía está marcado como "Propuesta".
 */

export type Viewport = "mobile" | "desktop";

const FOLD = { mobile: { width: 390, height: 844 }, desktop: { width: 1280, height: 800 } };

type Link = { label: string; href: string };
const QUE_HACEMOS: Link = { label: "Qué hacemos", href: "#que-hacemos" };
const DISPONIBLE: Link = { label: "Disponible ahora", href: "#disponible" };
const VISITANOS: Link = { label: "Visítanos", href: "#visitanos" };
const QUIENES: Link = { label: "Quiénes somos", href: "#quienes-somos" };
export const NAV = {
  a: [QUE_HACEMOS, DISPONIBLE, VISITANOS],
  b: [QUE_HACEMOS, DISPONIBLE, QUIENES],
  c: [DISPONIBLE, QUE_HACEMOS, VISITANOS],
};

const H1 = "font-display font-medium leading-[1.05] tracking-[-0.01em]";
const TITLE = "Camisetas y gorras personalizadas en Cartagena";
const FRASE = "Las hacemos en nuestro taller con tu logo, tu equipo o tu idea.";
const TECNICAS = ["Estampado", "DTF", "Bordado"];
const PHOTO_ALT = "Gorra azul oscuro con la palabra Cartagena bordada en relieve";

/**
 * Lo que se ve sin hacer scroll: Header sin WhatsApp, el hero, el comienzo de Qué hacemos y la entrada flotante.
 * fab="pill" es la pastilla con texto de la opción A; "icon" es el WhatsAppFab de hoy.
 */
export function Screen({ viewport, links, fab, children }: { viewport: Viewport; links: Link[]; fab: "pill" | "icon"; children: ReactNode }) {
  const desktop = viewport === "desktop";
  return (
    <div className="relative overflow-hidden bg-primary font-body text-ink antialiased" style={FOLD[viewport]}>
      {/* El Header pierde el botón de WhatsApp (desktop y menú móvil): cambio en Header.tsx al implementar. */}
      <div className="[&_a[href^=https]]:hidden">
        <Header logoSrc={LOGO} links={links} />
      </div>
      <main>
        {children}
        <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
          <div className={`grid gap-3 ${desktop ? "grid-cols-3 gap-5" : ""}`}>
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
            ))}
          </div>
        </Section>
      </main>
      <div className={`absolute bottom-5 ${desktop ? "right-6" : "right-4"}`}>
        {fab === "pill" ? <PillFab /> : <WhatsAppFab placement="inline" />}
      </div>
    </div>
  );
}

/**
 * Propuesta: WhatsAppFab con texto. Se dibuja con el Button whatsapp; al implementar es una prop `label`
 * de WhatsAppFab (fixed abajo a la derecha, 48px de alto, el texto dice qué pasa al tocar).
 */
function PillFab() {
  return (
    <div className="rounded-full shadow-[0_8px_24px_rgba(0,0,0,.5)]">
      <Button variant="whatsapp" href={WHATSAPP_URL} external>
        Pide por WhatsApp
      </Button>
    </div>
  );
}

/** Una foto de prenda. Sin src (señal lenta) queda el marco del color de superficie con su alto fijo: nada salta. */
function Photo({ className, loading = false }: { className: string; loading?: boolean }) {
  return (
    <div className={`overflow-hidden bg-surface-2 ${className}`}>
      {!loading && <img src={capCartagena} alt={PHOTO_ALT} className="h-full w-full object-cover" />}
    </div>
  );
}

function Tecnicas() {
  return (
    <ul aria-label="Técnicas" className="flex flex-wrap gap-2">
      {TECNICAS.map((t) => (
        <li key={t}>
          <StatusPill tone="muted" dot={false}>
            {t}
          </StatusPill>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- A · Vitrina ---------------- */

export function HeroA({ viewport, loading = false }: { viewport: Viewport; loading?: boolean }) {
  if (viewport === "desktop")
    return (
      <section className="fabric grid grid-cols-[1.1fr_1fr] items-center gap-14 px-12 py-10">
        <div className="flex flex-col items-start gap-5">
          <h1 className={`${H1} text-[60px]`}>{TITLE}</h1>
          <p className="max-w-[500px] text-[19px] leading-relaxed text-muted">{FRASE}</p>
          <Tecnicas />
          <div className="mt-3">
            <Button variant="secondary" href="#que-hacemos">
              Ver lo que hacemos ↓
            </Button>
          </div>
        </div>
        <Photo loading={loading} className="h-[560px] rounded-card border border-line" />
      </section>
    );
  return (
    <section className="fabric pb-6">
      <Photo loading={loading} className="h-[300px]" />
      <div className="flex flex-col gap-3 px-4 pt-5">
        <h1 className={`${H1} text-[32px]`}>{TITLE}</h1>
        <p className="text-[16px] leading-relaxed text-muted">{FRASE}</p>
        <Tecnicas />
        <div className="mt-2">
          <Button variant="secondary" href="#que-hacemos" fullWidth>
            Ver lo que hacemos ↓
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- B · Taller ---------------- */

/**
 * Propuesta: variante compacta de MapCard. Es EL bloque de ubicación de la página (#visitanos):
 * dirección y los dos horarios una sola vez, y Cómo llegar abre Google Maps.
 */
function VisitanosCompacto() {
  return (
    <section id="visitanos" aria-labelledby="visitanos-titulo" className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
          <PinIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="visitanos-titulo" className="text-[16px] font-bold">
            Visítanos
          </h2>
          <p className="text-[14px] text-muted">{ADDRESS ?? "Dirección por confirmar"}</p>
          <dl className="mt-2 flex flex-col gap-0.5 text-[13px]">
            {HOURS.map((h) => (
              <div key={h.days} className="flex justify-between gap-3">
                <dt className="text-muted">{h.short}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-3">
        <Button variant="secondary" href={DIRECTIONS_URL} external fullWidth icon={<PinIcon className="size-4" />}>
          Cómo llegar
        </Button>
      </div>
    </section>
  );
}

export function HeroB({ viewport }: { viewport: Viewport }) {
  if (viewport === "desktop")
    return (
      <section className="fabric grid grid-cols-[1.2fr_1fr] items-center gap-14 px-12 py-10">
        <div className="flex flex-col items-start gap-5">
          <h1 className={`${H1} text-[60px]`}>{TITLE}</h1>
          <p className="max-w-[500px] text-[19px] leading-relaxed text-muted">{FRASE}</p>
          <Button variant="whatsapp" href={WHATSAPP_URL} external>
            Escríbenos por WhatsApp
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <Photo className="h-[300px] rounded-card border border-line" />
          <VisitanosCompacto />
        </div>
      </section>
    );
  return (
    <section className="fabric flex flex-col gap-4 px-4 pb-6 pt-5">
      <h1 className={`${H1} text-[30px]`}>{TITLE}</h1>
      <Photo className="h-[190px] rounded-card border border-line" />
      <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
        Escríbenos por WhatsApp
      </Button>
      <VisitanosCompacto />
    </section>
  );
}

/* ---------------- C · Tienda ---------------- */

export function HeroC({ viewport, vacio = false }: { viewport: Viewport; vacio?: boolean }) {
  const desktop = viewport === "desktop";
  const productos = vacio ? (
    <DisponibleSinProductos estado="vacio" />
  ) : desktop ? (
    <div className="grid grid-cols-4 gap-4">
      <ProductItems count={4} />
    </div>
  ) : (
    <div className="-mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-1">
      <ProductItems count={4} />
    </div>
  );
  return (
    <section id="disponible" className={`fabric ${desktop ? "px-12 py-10" : "px-4 pb-6 pt-5"}`}>
      <Eyebrow>Taller en Cartagena</Eyebrow>
      <h1 className={`${H1} mt-3 ${desktop ? "text-[56px]" : "text-[32px]"}`}>Camisetas y gorras personalizadas</h1>
      <div className={`flex items-center justify-between gap-3 ${desktop ? "mt-8" : "mt-5"}`}>
        <h2 className="font-display text-[20px] font-medium">Disponible ahora</h2>
        {!vacio && (
          <Button variant="ghost" href={CATALOG_HREF}>
            Ver todo →
          </Button>
        )}
      </div>
      <div className="mt-3">{productos}</div>
      {!vacio && (
        <div className="mt-3">
          <Button variant="ghost" href="#que-hacemos">
            ¿La quieres con tu diseño? Mira lo que hacemos ↓
          </Button>
        </div>
      )}
    </section>
  );
}
