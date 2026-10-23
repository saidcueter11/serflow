import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Footer } from "../../../../src/components/ui/Footer";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { CATALOGO, Hoja, LOGO, PERSONALIZA, PRENDA, Prenda, PRODUCTOS, PROMOS, TRABAJOS, WA_IDEA } from "./comun";
import { NAV_NUEVA } from "./ideaA";

/*
 * IDEA B · ORDEN DE TRABAJO (evolución: papel claro, tinta negra, dorado de resaltador, Archivo condensada).
 * El personalizador se presenta como la orden que llena el taller: prenda, color, diseño, lado. Los tokens nuevos
 * (--paper, --ink-strong, --tinta-roja, --font-poster) están en movimiento.css bajo .idea-b.
 * Producción reutilizada: PromoBar, MapCard, Footer y WhatsAppFab. Header claro, ticket y lista son propuestas.
 */

const FUENTE = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink-strong)]";
const COLORES = ["bg-primary", "bg-ink", "bg-[var(--tela-azul)]", "bg-[var(--tela-vino)]"];

function HeaderClaro() {
  return (
    <header className="flex items-center justify-between border-b-2 border-[var(--ink-strong)] px-4 py-2 @4xl:px-12 @4xl:py-4">
      <a href="/" aria-label="Serflow, inicio" className={`flex min-h-11 items-center ${FOCUS}`}>
        {/* Propuesta: logo en una tinta (archivo nuevo). Aquí se simula con un filtro. */}
        <img src={LOGO} alt="Serflow" width={80} height={28} className="h-7 w-auto brightness-0 @4xl:h-9" />
      </a>
      <nav aria-label="Principal" className="hidden gap-8 @4xl:flex">
        {NAV_NUEVA.map((l) => (
          <a key={l.href} href={l.href} className={`flex min-h-11 items-center text-[15px] font-semibold text-[var(--ink-soft)] hover:text-[var(--ink-strong)] ${FOCUS}`}>
            {l.label}
          </a>
        ))}
      </nav>
      <button type="button" aria-label="Abrir menú" className={`min-h-11 rounded-full border-2 border-[var(--ink-strong)] px-4 text-[14px] font-bold @4xl:hidden ${FOCUS}`}>
        Menú
      </button>
    </header>
  );
}

function Orden({ className = "" }: { className?: string }) {
  const filas = [
    ["Prenda", "Camiseta"],
    ["Lado", "Frente"],
    ["Diseño", "sol-heroica.png"],
  ];
  return (
    <div className={`relative ${className}`}>
      {/* Boca de la impresora: el ticket sale de aquí al cargar */}
      <div aria-hidden="true" className="relative z-10 mx-2 h-3 rounded-full bg-[var(--ink-strong)]" />
      <div className="-mt-1.5 overflow-hidden px-4">
        <div className="pb-ticket relative border-x-2 border-b-2 border-dashed border-[var(--ink-strong)] bg-[var(--ticket)] px-4 pb-5 pt-5 shadow-[0_10px_0_var(--paper-2)]">
          <div className="flex items-baseline justify-between border-b-2 border-[var(--ink-strong)] pb-2">
            <span className="font-poster text-[24px] leading-none">Orden de trabajo</span>
            <span className="font-mono text-[13px] text-[var(--ink-soft)]">Nº 0001</span>
          </div>
          <a href={PERSONALIZA} className={`mt-4 grid grid-cols-[112px_1fr] gap-4 @4xl:grid-cols-[180px_1fr] @4xl:gap-6 ${FOCUS}`}>
            <div className="flex h-[140px] items-center justify-center border-2 @4xl:h-[220px] border-[var(--ink-strong)] bg-[var(--paper-2)]">
              <Prenda className="w-[100px] @4xl:w-[160px]">
                <img src={PRENDA.sol} alt="Vista previa: un sol con CTG La Heroica en el pecho de una camiseta negra" className="h-full w-full" />
              </Prenda>
            </div>
            <dl className="flex flex-col gap-1.5 text-[14px] @4xl:justify-center @4xl:gap-3 @4xl:text-[16px]">
              {filas.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 border-b border-dotted border-[var(--ink-soft)] pb-1">
                  <dt className="text-[var(--ink-soft)]">{k}</dt>
                  <dd className="truncate font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <dt className="text-[var(--ink-soft)]">Color</dt>
                <dd className="flex gap-1.5">
                  {COLORES.map((c, i) => (
                    <span key={c} className={`size-4 rounded-full border border-[var(--ink-strong)] ${c} ${i === 0 ? "ring-2 ring-accent ring-offset-1 ring-offset-[var(--ticket)]" : ""}`} />
                  ))}
                </dd>
              </div>
            </dl>
          </a>
          <span aria-hidden="true" className="pb-sello absolute left-5 top-[196px] @4xl:top-[276px] border-[3px] border-[var(--tinta-roja)] px-2 py-0.5 font-poster text-[22px] leading-none text-[var(--tinta-roja)] opacity-90">
            Visto bueno
          </span>
          <a href={PERSONALIZA} className={`mt-5 flex min-h-12 items-center justify-center bg-[var(--ink-strong)] text-[16px] font-bold text-[var(--paper)] ${FOCUS}`}>
            Diseñar mi prenda →
          </a>
          <p className="mt-2.5 text-center text-[13px] text-[var(--ink-soft)]">Gratis. Te llega por WhatsApp y te respondemos con el precio.</p>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-6 px-4 pb-10 pt-6 @4xl:grid-cols-[minmax(0,1fr)_560px] @4xl:items-center @4xl:gap-16 @4xl:px-12 @4xl:pb-8 @4xl:pt-12">
      <div>
        <h1 className="font-poster text-[62px] leading-[.86] @4xl:text-[116px]">
          Tu idea,
          <br />
          nuestro taller,
          <br />
          <span className="pb-marca px-1">tu prenda.</span>
        </h1>
        <p className="mt-5 hidden max-w-[46ch] text-[18px] leading-relaxed text-[var(--ink-soft)] @4xl:block">
          Camisetas y gorras con estampado, DTF y bordado, hechas en el Mercado Bazurto. Arma la tuya en el personalizador y mírala antes de pedirla.
        </p>
        <a href={WA_IDEA} target="_blank" rel="noopener noreferrer" className={`mt-4 hidden min-h-11 items-center text-[15px] font-bold underline decoration-2 underline-offset-4 @4xl:inline-flex ${FOCUS}`}>
          ¿No tienes diseño? Cuéntanos la idea por WhatsApp
        </a>
      </div>
      <Orden />
      <a href={WA_IDEA} target="_blank" rel="noopener noreferrer" className={`-mt-2 min-h-11 content-center pr-20 text-left text-[14px] font-bold underline decoration-2 underline-offset-4 @4xl:hidden ${FOCUS}`}>
        ¿No tienes diseño? Cuéntanos la idea
      </a>
    </section>
  );
}

function Titulo({ kicker, children }: { kicker: string; children: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-[var(--ink-strong)] pb-2">
      <h2 className="font-poster text-[40px] leading-none @4xl:text-[64px]">{children}</h2>
      <span className="shrink-0 whitespace-nowrap pb-1 font-mono text-[12px] text-[var(--ink-soft)]">{kicker}</span>
    </div>
  );
}

const GIROS = ["-2deg", "1.5deg", "1deg", "-1.5deg", "2deg", "-1deg"];

function HechoAqui() {
  return (
    <section className="px-4 py-10 @4xl:px-12 @4xl:py-16">
      <Titulo kicker="Estampado · DTF · Bordado">Ideas para la tuya</Titulo>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 @4xl:grid-cols-3 @4xl:gap-x-10 @4xl:gap-y-12">
        {TRABAJOS.map((t, i) => (
          <figure key={t.alt} className="pb-foto relative bg-[var(--ticket)] p-2 pb-3 shadow-[0_6px_14px_rgb(23_22_15/0.14)]" style={{ ["--r" as string]: GIROS[i] }}>
            <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-4deg] bg-accent/70" />
            <img src={t.src} alt={t.alt} loading="lazy" className="h-[180px] w-full object-cover @4xl:h-[300px]" style={{ objectPosition: t.pos }} />
            <figcaption className="mt-2 text-[13px] font-semibold @4xl:text-[15px]">{t.tecnica}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function LoQueHay() {
  return (
    <section className="px-4 py-10 @4xl:px-12 @4xl:py-16">
      <Titulo kicker="Listo para llevar">Lo que hay hoy</Titulo>
      <ul className="grid @4xl:grid-cols-2 @4xl:gap-x-12">
        {PRODUCTOS.map((p) => (
          <li key={p.href}>
            <a href={p.href} className={`flex min-h-[84px] items-center gap-4 border-b border-dotted border-[var(--ink-soft)] py-3 ${FOCUS}`}>
              <img src={p.image.src} alt={p.image.alt} loading="lazy" className="size-20 border-2 border-[var(--ink-strong)] object-cover @4xl:size-24" />
              <span className="flex-1">
                <span className="block text-[16px] font-bold">{p.name}</span>
                <span className="block text-[13px] text-[var(--ink-soft)]">{p.meta}</span>
              </span>
              <span className="text-[14px] font-bold">Ver →</span>
            </a>
          </li>
        ))}
      </ul>
      <a href={CATALOGO} className={`mt-6 inline-flex min-h-12 items-center border-2 border-[var(--ink-strong)] px-6 text-[15px] font-bold hover:bg-[var(--ink-strong)] hover:text-[var(--paper)] ${FOCUS}`}>
        Ver todo el catálogo →
      </a>
    </section>
  );
}

const COMO = [
  { n: "01", t: "Lo diseñas", c: "En el personalizador: tu logo o tu foto sobre la prenda y el color que quieras." },
  { n: "02", t: "Te confirmamos", c: "Nos llega por WhatsApp. Te decimos precio, técnica y cuándo está." },
  { n: "03", t: "Lo hacemos", c: "Estampado, DTF o bordado, aquí en el taller. Lo recoges o te lo mandamos." },
];

export function PaginaB() {
  return (
    <>
      <link rel="stylesheet" href={FUENTE} />
      <PromoBar promos={PROMOS} />
      <HeaderClaro />
      <main>
        <Hero />
        <HechoAqui />
        <LoQueHay />
        <section className="px-4 py-10 @4xl:px-12 @4xl:py-16">
          <Titulo kicker="Sin vueltas">Cómo trabajamos</Titulo>
          <ol className="grid gap-6 @4xl:grid-cols-3 @4xl:gap-10">
            {COMO.map((s) => (
              <li key={s.n} className="flex gap-4 @4xl:flex-col @4xl:gap-2">
                <span className="font-poster text-[56px] leading-[.8] text-[var(--tinta-roja)] @4xl:text-[88px]">{s.n}</span>
                <div>
                  <h3 className="text-[18px] font-bold">{s.t}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--ink-soft)]">{s.c}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section id="visitanos" aria-label="Visítanos" className="bg-primary px-4 py-10 text-ink @4xl:grid @4xl:grid-cols-[1fr_420px] @4xl:items-center @4xl:gap-16 @4xl:px-12 @4xl:py-16">
          <div className="mb-6 @4xl:mb-0">
            <h2 className="font-poster text-[44px] leading-[.9] text-accent @4xl:text-[72px]">Pasa por el taller</h2>
            <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-muted">Somos un taller del Mercado Bazurto. Trae tu prenda o tu idea y la vemos juntos.</p>
          </div>
          <MapCard title="Serflow · Mercado Bazurto" />
        </section>
      </main>
      <div className="bg-primary text-ink">
        <Footer logoSrc={LOGO} />
      </div>
    </>
  );
}

export function BMobile() {
  return (
    <Hoja width={390} fold={844} className="idea-b">
      <PaginaB />
    </Hoja>
  );
}

export function BDesktop() {
  return (
    <Hoja width={1280} fold={800} className="idea-b">
      <PaginaB />
    </Hoja>
  );
}
