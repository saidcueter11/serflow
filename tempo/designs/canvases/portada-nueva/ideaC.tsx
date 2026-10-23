import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Footer } from "../../../../src/components/ui/Footer";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { WhatsAppIcon } from "../../../../src/components/icons/WhatsappIcon";
import { whatsappUrl } from "../../../../src/lib/business";
import { CATALOGO, WA_IDEA, Hoja, LOGO, PASOS, PERSONALIZA, PRENDA, Prenda, PRODUCTOS, PROMOS, TALLER, TRABAJOS } from "./comun";
import { NAV_NUEVA } from "./ideaA";

/*
 * IDEA C · VITRINA (evolución: fotos a sangre, serif itálica Instrument Serif para titulares, noche más profunda).
 * Celular: capítulos de foto a pantalla completa y un dock fijo abajo con el personalizador (y WhatsApp dentro del dock:
 * el flotante se funde con él). Escritorio: pantalla partida en la primera pantalla, foto a la izquierda y el personalizador
 * a la derecha, con el flotante de WhatsApp y un link contextual bajo el botón.
 * Producción reutilizada: PromoBar, MapCard, Footer y el ícono de WhatsApp. Header transparente, dock y capítulos son propuestas.
 */

const FUENTE = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Titular({ palabras, className }: { palabras: string[]; className: string }) {
  return (
    <h1 className={`font-serif-c italic ${className}`}>
      {palabras.map((p, i) => (
        <span key={p} className="inline-block overflow-hidden pb-[.08em] align-bottom">
          <span className="pc-palabra" style={{ ["--d" as string]: `${0.2 + i * 0.08}s` }}>
            {p}&nbsp;
          </span>
        </span>
      ))}
    </h1>
  );
}

function HeaderSobreFoto() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 @4xl:px-10 @4xl:py-5">
      <a href="/" aria-label="Serflow, inicio" className={`flex min-h-11 items-center ${FOCUS}`}>
        <img src={LOGO} alt="Serflow" width={80} height={28} className="h-7 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.6)] @4xl:h-8" />
      </a>
      <nav aria-label="Principal" className="hidden gap-7 rounded-full bg-[var(--noche)]/70 px-6 backdrop-blur @4xl:flex">
        {NAV_NUEVA.map((l) => (
          <a key={l.href} href={l.href} className={`flex min-h-11 items-center text-[14px] font-medium text-ink/85 hover:text-ink ${FOCUS}`}>
            {l.label}
          </a>
        ))}
      </nav>
      <button type="button" aria-label="Abrir menú" className={`flex size-11 items-center justify-center rounded-full bg-[var(--noche)]/70 backdrop-blur @4xl:hidden ${FOCUS}`}>
        <span aria-hidden="true" className="block h-0.5 w-5 bg-ink shadow-[0_6px_0_var(--color-ink),0_-6px_0_var(--color-ink)]" />
      </button>
    </header>
  );
}

/** Miniatura de la vista previa del personalizador: la camiseta con el diseño que aterriza. */
function Mini({ className = "", land = "pc-land" }: { className?: string; land?: string }) {
  return (
    <div className={`fabric relative flex items-center justify-center overflow-hidden bg-surface-2 ${className}`}>
      <Prenda className="h-[82%]">
        <img src={PRENDA.sol} alt="Vista previa: un sol con CTG La Heroica en el pecho de una camiseta negra" className={`h-full w-full ${land}`} />
      </Prenda>
    </div>
  );
}

/** Dock del personalizador. En el sitio va fixed abajo en el celular; aquí se dibuja al final de la primera pantalla. */
function Dock() {
  return (
    <div className="pc-dock absolute inset-x-3 bottom-3 z-30 flex items-center gap-2 rounded-card border border-line bg-[var(--noche)]/92 p-2 shadow-[0_12px_32px_rgba(0,0,0,.55)] backdrop-blur @4xl:hidden">
      <a href={PERSONALIZA} className={`flex min-h-14 flex-1 items-center gap-3 rounded-tile pr-2 ${FOCUS}`}>
        <Mini className="size-14 shrink-0 rounded-tile" land="" />
        <span className="flex-1 leading-tight">
          <span className="block text-[16px] font-bold text-ink">Diseña la tuya</span>
          <span className="block text-[13px] text-muted">Mírala en la prenda antes de pedirla</span>
        </span>
        <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-accent text-[20px] font-bold text-primary">→</span>
      </a>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className={`flex size-14 shrink-0 items-center justify-center rounded-tile border border-line text-accent ${FOCUS}`}
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </div>
  );
}

function PanelPersonalizador() {
  return (
    <div className="flex h-full flex-col justify-center gap-5 bg-[var(--noche)] px-12 pt-16">
      <span className="text-[12px] font-semibold uppercase tracking-[.16em] text-accent">El personalizador</span>
      <Mini className="h-[320px] rounded-card border border-line" />
      <ol className="flex flex-col gap-2.5">
        {PASOS.map((p, i) => (
          <li key={p} className="flex items-center gap-3 text-[15px] text-ink/90">
            <span className="font-serif-c text-[24px] italic leading-none text-accent">{i + 1}.</span>
            {p}
          </li>
        ))}
      </ol>
      <a href={PERSONALIZA} className={`flex min-h-12 items-center justify-center self-start rounded-full bg-accent px-10 text-[16px] font-bold text-primary ${FOCUS}`}>
        Diseñar mi prenda →
      </a>
      <a href={WA_IDEA} target="_blank" rel="noopener noreferrer" className={`-mt-2 flex min-h-11 items-center self-start gap-2 text-[14px] font-semibold text-muted hover:text-ink ${FOCUS}`}>
        <WhatsAppIcon className="size-4 text-accent" /> ¿Mejor nos cuentas tu idea? Escríbenos
      </a>
    </div>
  );
}

function Portada() {
  return (
    <section className="relative h-[780px] @4xl:grid @4xl:grid-cols-2">
      <HeaderSobreFoto />
      <div className="relative h-full overflow-hidden">
        <img src={TRABAJOS[3].src} alt="Dos amigos con gorras, riéndose" fetchPriority="high" className="pc-kb absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_13_9/.8)_0%,transparent_20%,transparent_34%,rgb(14_13_9/.96)_72%)]" />
        <div className="absolute inset-x-4 bottom-[104px] @4xl:inset-x-10 @4xl:bottom-12">
          <Titular palabras={["Lo", "tuyo,", "hecho", "en", "Cartagena."]} className="text-[54px] leading-[.95] text-ink @4xl:text-[84px]" />
          <p className="mt-3 max-w-[34ch] text-[16px] leading-relaxed text-ink/80 @4xl:text-[18px]">
            Camisetas y gorras con tu diseño: estampado, DTF y bordado en nuestro taller del Mercado Bazurto.
          </p>
        </div>
      </div>
      <div className="hidden @4xl:block">
        <PanelPersonalizador />
      </div>
      <Dock />
    </section>
  );
}

const CAPITULOS = [
  { n: "01", t: "Estampado", c: "Tinta que toma la textura de la tela.", src: TALLER.rasero, alt: "Rasero pasando tinta sobre una plancha de estampado", pos: "50% 50%" },
  { n: "02", t: "Bordado", c: "Hilo con relieve. El clásico de las gorras.", src: TRABAJOS[4].src, alt: TRABAJOS[4].alt, pos: "50% 40%" },
  { n: "03", t: "Para tu grupo", c: "Uniformes, eventos, la familia entera.", src: TRABAJOS[0].src, alt: "Dos personas con camisetas negras estampadas", pos: "50% 30%" },
];

function Capitulos() {
  return (
    <section aria-label="Lo que hacemos" className="@4xl:grid @4xl:grid-cols-3">
      {CAPITULOS.map((c) => (
        <figure key={c.n} className="relative h-[560px] overflow-hidden @4xl:h-[640px]">
          <img src={c.src} alt={c.alt} loading="lazy" className="pc-capitulo absolute inset-0 h-full w-full object-cover" style={{ objectPosition: c.pos }} />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(14_13_9/.9)_88%)]" />
          <figcaption className="absolute inset-x-4 bottom-8 @4xl:inset-x-8">
            <span className="font-mono text-[12px] text-accent">{c.n}</span>
            <h2 className="font-serif-c text-[44px] italic leading-none text-ink">{c.t}</h2>
            <p className="mt-2 text-[15px] text-ink/80">{c.c}</p>
            <a href={PERSONALIZA} className={`mt-3 inline-flex min-h-11 items-center text-[14px] font-semibold text-accent underline-offset-4 hover:underline ${FOCUS}`}>
              Diseña la tuya →
            </a>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

function AhoraTu() {
  return (
    <section className="px-4 py-14 @4xl:hidden">
      <span className="text-[12px] font-semibold uppercase tracking-[.16em] text-accent">El personalizador</span>
      <h2 className="mt-2 font-serif-c text-[48px] italic leading-[.95]">Ahora la tuya.</h2>
      <Mini className="mt-6 h-[360px] rounded-card border border-line" land="pc-land-scroll" />
      <ol className="mt-6 flex flex-col gap-2.5">
        {PASOS.map((p, i) => (
          <li key={p} className="flex items-center gap-3 text-[15px] text-ink/90">
            <span className="font-serif-c text-[24px] italic leading-none text-accent">{i + 1}.</span>
            {p}
          </li>
        ))}
      </ol>
      <a href={PERSONALIZA} className={`mt-6 flex min-h-12 items-center justify-center rounded-full bg-accent text-[16px] font-bold text-primary ${FOCUS}`}>
        Diseñar mi prenda →
      </a>
      <a href={WA_IDEA} target="_blank" rel="noopener noreferrer" className={`mt-2 flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-muted ${FOCUS}`}>
        <WhatsAppIcon className="size-4 text-accent" /> ¿Mejor nos cuentas tu idea? Escríbenos
      </a>
    </section>
  );
}

function Vitrina() {
  return (
    <section className="py-12 @4xl:px-10 @4xl:py-20">
      <div className="mb-6 flex items-end justify-between px-4 @4xl:px-0">
        <h2 className="font-serif-c text-[40px] italic leading-none @4xl:text-[56px]">En vitrina</h2>
        <a href={CATALOGO} className={`min-h-11 content-center text-[14px] font-semibold text-accent ${FOCUS}`}>
          Ver catálogo →
        </a>
      </div>
      <div className="grid snap-x auto-cols-[260px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 @4xl:grid-flow-row @4xl:grid-cols-4 @4xl:gap-6 @4xl:px-0">
        {PRODUCTOS.map((p) => (
          <a key={p.href} href={p.href} className={`group snap-start ${FOCUS}`}>
            <div className="overflow-hidden rounded-tile">
              <img src={p.image.src} alt={p.image.alt} loading="lazy" className="h-[320px] w-full object-cover transition-transform duration-(--motion-slow) group-hover:scale-105 @4xl:h-[380px]" />
            </div>
            <span className="mt-3 block font-serif-c text-[24px] italic leading-tight">{p.name}</span>
            <span className="block text-[13px] text-muted">{p.meta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function PaginaC() {
  return (
    <>
      <link rel="stylesheet" href={FUENTE} />
      <PromoBar promos={PROMOS} />
      <main>
        <Portada />
        <Capitulos />
        <AhoraTu />
        <Vitrina />
        <section id="visitanos" aria-label="Visítanos" className="border-t border-line px-4 py-12 @4xl:grid @4xl:grid-cols-[1fr_420px] @4xl:items-center @4xl:gap-16 @4xl:px-10 @4xl:py-20">
          <h2 className="mb-6 font-serif-c text-[40px] italic leading-[1] @4xl:mb-0 @4xl:text-[64px]">Estamos en el Mercado Bazurto. Pasa cuando quieras.</h2>
          <MapCard title="Serflow · Mercado Bazurto" />
        </section>
      </main>
      <Footer logoSrc={LOGO} />
    </>
  );
}

export function CMobile() {
  return (
    <Hoja width={390} fold={844} className="idea-c" fab={false}>
      <PaginaC />
    </Hoja>
  );
}

export function CDesktop() {
  return (
    <Hoja width={1280} fold={800} className="idea-c">
      <PaginaC />
    </Hoja>
  );
}
