import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Button } from "../../../../src/components/ui/Button";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { PinIcon } from "../../../../src/components/icons/PinIcon";
import { ADDRESS, CITY, DIRECTIONS_URL, EMAIL, HOURS, MAP_EMBED_URL, SOCIAL, WHATSAPP_URL } from "../../../../src/lib/business";
import { CATALOG_HREF, LOGO, PersonalizadorEntry, ProductItems, QuienesCopy, Razones } from "../../design-system/app-shell/portada";
import { InstagramIcon } from "../../../../src/components/icons/InstagramIcon";
import { TiktokIcon } from "../../../../src/components/icons/TiktokIcon";
import { FacebookIcon } from "../../../../src/components/icons/FacebookIcon";
// Fotos stock de Unsplash (licencia libre, sin atribución) hasta que lleguen las reales del local (PRI-150).
// unsplash.com/photos/8Ckj05B7LmM, GUdUmJua9cI, pyeUg7FylSw, O4QUJiQuQss, 0y3DOYVP2bs, KL8EGoKDNcQ, kixK2sNVPyo
import camisetas from "../../../../src/assets/images/stock/camisetas-estampadas.jpg";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import amigosGorras from "../../../../src/assets/images/stock/amigos-gorras.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";

/*
 * B ajustada (feedback de Said, 2026-10-05): B + fotos que muestran el resultado, bienvenida en el hero,
 * mapa de Google visible y movimiento en lugar de la mascota. Todo el movimiento es CSS (0 KB de JS),
 * se pausa con hover/foco y se apaga con prefers-reduced-motion.
 */

type Viewport = "mobile" | "desktop";
const FOLD = { mobile: { width: 390, height: 844 }, desktop: { width: 1280, height: 800 } };

const SLIDES = [
  { src: camisetas, caption: "Camisetas con tu diseño", alt: "Dos personas con camisetas negras estampadas", pos: "50% 35%" },
  { src: estampadoProceso, caption: "Estampado en el taller", alt: "Manos pasando el rasero sobre una plancha de estampado", pos: "50% 50%" },
  { src: gorraBordada, caption: "Gorras bordadas", alt: "Gorra blanca con bordado rojo", pos: "50% 40%" },
  { src: amigosGorras, caption: "Para tu equipo o tu grupo", alt: "Dos amigos con gorras personalizadas riéndose", pos: "50% 30%" },
];
const SLIDE_SECONDS = 6;

/**
 * Promos activas: salen de la tabla promos del admin (getActivePromos: title, slug, banner_url). Sin promos, nada cambia.
 * Hoy la base solo permite UNA activa (índice promos_one_active en supabase/02_promos.sql): para varias hay que quitar ese
 * índice (SQL nuevo) y dejar que serflow-admin active más de una.
 * Con promo: barra fija arriba de todo (no se mueve, se lee de un vistazo) que lleva a /promos/<slug>, y el banner
 * de la promo entra como primera foto del carrusel. Título, foto y activar/desactivar ya se manejan en serflow-admin.
 */
export type Promo = { title: string; href: string; image: string };
export const PROMO_DEMO: Promo = { title: "2x1 en gorras bordadas este fin de semana", href: "/promos/2x1-gorras", image: gorrasEstante };
export const PROMOS_DEMO: Promo[] = [
  PROMO_DEMO,
  { title: "10% en camisetas para equipos de fútbol", href: "/promos/equipos", image: camisetas },
];
const CYCLE = SLIDES.length * SLIDE_SECONDS;

const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: estampadoRasero },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: camisetaDtf },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: gorraBordada2 },
];

// Para qué te sirve, no qué técnica es. Propuesta para validar con el cliente; después, editable desde el admin (PRI-150).
const TICKER = [
  "Uniformes para tu equipo",
  "Gorras con el logo de tu negocio",
  "Camisetas para tu evento",
  "Camisetas de promoción",
  "Regalos con tu foto",
  "Dotación para tu empresa",
];

const NAV = [
  { label: "Qué hacemos", href: "#que-hacemos" },
  { label: "Disponible ahora", href: "#disponible" },
  { label: "Visítanos", href: "#visitanos" },
];

// Al implementar va en src/styles/tokens.css.
const MOTION_CSS = `
@keyframes sf-fade { 0% { opacity: 1 } 25% { opacity: 1 } 29% { opacity: 0 } 96% { opacity: 0 } 100% { opacity: 1 } }
@keyframes sf-zoom { from { transform: scale(1) } to { transform: scale(1.08) } }
@keyframes sf-bar { 0% { transform: scaleX(0) } 25% { transform: scaleX(1) } 25.01%, 100% { transform: scaleX(0) } }
@keyframes sf-ticker { to { transform: translateX(-50%) } }
@keyframes sf-cap { 0%, 3% { opacity: 0 } 5%, 23% { opacity: 1 } 25%, 100% { opacity: 0 } }
.sf-slide { animation: sf-fade ${CYCLE}s linear infinite both; animation-delay: var(--d); }
.sf-slide figcaption { animation: sf-cap ${CYCLE}s linear infinite both; animation-delay: var(--d); }
.sf-slide img { animation: sf-zoom ${CYCLE}s ease-out infinite alternate; }
.sf-bar { transform-origin: left; animation: sf-bar ${CYCLE}s linear infinite both; }
.sf-ticker { animation: sf-ticker 40s linear infinite; }
.sf-carousel:hover :is(.sf-slide, .sf-slide img, .sf-slide figcaption, .sf-bar), .sf-carousel:focus-within :is(.sf-slide, .sf-slide img, .sf-slide figcaption, .sf-bar) { animation-play-state: paused; }
@keyframes sf-up { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
.sf-enter > * { animation: sf-up .7s cubic-bezier(.2,.7,.2,1) both; }
.sf-enter > :nth-child(2) { animation-delay: .1s } .sf-enter > :nth-child(3) { animation-delay: .2s } .sf-enter > :nth-child(4) { animation-delay: .3s }
@supports (animation-timeline: view()) {
  .sf-reveal, .sf-reveal-each > * { animation: sf-up linear both; animation-timeline: view(); animation-range: entry 0% entry 35%; }
}
@keyframes sf-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes sf-wipe { from { clip-path: inset(0 0 100% 0) } to { clip-path: inset(0) } }
.sf-stitch h2::after { content: ""; display: block; width: 84px; height: 3px; margin-top: 12px; transform-origin: left; background: repeating-linear-gradient(90deg, var(--color-accent) 0 9px, transparent 9px 15px); }
@supports (animation-timeline: view()) {
  .sf-stitch h2::after { animation: sf-grow linear both; animation-timeline: view(); animation-range: entry 20% entry 80%; }
  .sf-wipe img { animation: sf-wipe linear both; animation-timeline: view(); animation-range: entry 10% entry 70%; }
}
.sf-lift > * { transition: transform .25s ease-out, border-color .25s; }
.sf-lift > *:hover { transform: translateY(-4px); border-color: var(--color-secondary); }
.sf-lift img { transition: transform .5s ease-out; }
.sf-lift > *:hover img { transform: scale(1.06); }
@keyframes sf-ring { from { box-shadow: 0 0 0 0 rgb(255 215 0 / .6) } to { box-shadow: 0 0 0 20px rgb(255 215 0 / 0) } }
.sf-fab { border-radius: 9999px; animation: sf-ring 1.6s ease-out 4s 3; }
@keyframes sf-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes sf-follow { from { offset-distance: 0% } to { offset-distance: 100% } }
@keyframes sf-glint { 0%, 100% { opacity: .1; transform: scale(.6) } 50% { opacity: .45; transform: scale(1.2) } }
.sf-glint { transform-box: fill-box; transform-origin: center; animation: sf-glint 1.4s ease-in-out infinite; }
@supports (animation-timeline: scroll()) {
  .sf-thread-reveal { animation: sf-draw linear both; animation-timeline: scroll(root); }
  .sf-needle { animation: sf-follow linear both; animation-timeline: scroll(root); }
}
@media (prefers-reduced-motion: reduce) {
  .sf-slide, .sf-slide img, .sf-slide figcaption, .sf-bar, .sf-ticker, .sf-enter > *, .sf-reveal, .sf-reveal-each > *, .sf-fab, .sf-thread-reveal, .sf-needle, .sf-stitch h2::after, .sf-wipe img, .sf-glint { animation: none; }
  .sf-lift > *, .sf-lift img { transition: none; }
  .sf-slide:not(:first-child) { opacity: 0; }
  .sf-needle { display: none; }
}
`;

const H1 = "font-display font-medium leading-[1.02] tracking-[-0.01em]";

/** Carrusel: crossfade + zoom lento. Cada foto dice qué muestra (el resultado), no es decoración. */
function Carousel({ className, children, promo }: { className: string; children: ReactNode; promo?: Promo }) {
  const slides = promo
    ? [{ src: promo.image, caption: "Promo", alt: promo.title, pos: "50% 50%", promo: true }, ...SLIDES.slice(0, 3)]
    : SLIDES;
  return (
    <div className={`sf-carousel relative overflow-hidden bg-surface-2 ${className}`} aria-roledescription="carrusel" aria-label="Trabajos de Serflow">
      {slides.map((s, i) => (
        <figure
          key={s.caption}
          className="sf-slide absolute inset-0 m-0"
          style={{ "--d": `${i === 0 ? 0 : i * SLIDE_SECONDS - CYCLE}s` } as CSSProperties}
          aria-hidden={i !== 0}
        >
          <img src={s.src} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" style={{ objectPosition: s.pos }} />
          <figcaption className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[13px] font-semibold ${"promo" in s ? "bg-accent text-primary" : "bg-primary/80 text-ink"}`}>
            {s.caption}
          </figcaption>
        </figure>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
      {children}
      <div className="absolute bottom-4 right-4 flex gap-1.5" aria-hidden>
        {SLIDES.map((s, i) => (
          <span key={s.caption} className="h-1 w-7 overflow-hidden rounded-full bg-ink/25">
            <span className="sf-bar block h-full bg-accent" style={{ animationDelay: `${i === 0 ? 0 : i * SLIDE_SECONDS - CYCLE}s` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function Welcome({ desktop }: { desktop: boolean }) {
  return (
    <div className={`sf-enter absolute inset-x-0 bottom-0 flex flex-col items-start ${desktop ? "gap-4 p-10 pb-12" : "gap-3 p-4 pb-10"}`}>
      <span className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
        <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
      </span>
      <h1 className={`${H1} ${desktop ? "text-[64px]" : "text-[40px]"}`}>Bienvenido a Serflow</h1>
      <p className={`max-w-[520px] leading-relaxed text-ink/85 ${desktop ? "text-[19px]" : "text-[16px]"}`}>
        Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.
      </p>
      <div className={desktop ? "mt-2" : "mt-1 w-full"}>
        <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth={!desktop}>
          Escríbenos por WhatsApp
        </Button>
      </div>
    </div>
  );
}

/**
 * Barra de promos: fija arriba de todo, solo si hay promos activas en el admin. Con una, se queda quieta.
 * Con varias, rotan cada 5 s (sube una, entra la otra) y se pausa al pasar el mouse. CSS puro.
 */
function PromoBar({ promos, desktop }: { promos: Promo[]; desktop: boolean }) {
  const n = promos.length;
  const step = 5;
  const show = 100 / n;
  const css =
    n > 1
      ? `@keyframes sf-promo { 0%, ${(show * 0.92).toFixed(2)}% { opacity: 1; transform: none } ${show.toFixed(2)}% { opacity: 0; transform: translateY(-100%) } ${(show + 0.01).toFixed(2)}%, ${(100 - show * 0.08).toFixed(2)}% { opacity: 0; transform: translateY(100%) } 100% { opacity: 1; transform: none } }
.sf-promo-item { animation: sf-promo ${n * step}s linear infinite both; animation-delay: var(--d); }
.sf-promo:hover .sf-promo-item { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .sf-promo-item { animation: none; } .sf-promo-item:not(:first-child) { visibility: hidden; } }`
      : "";
  return (
    <div className={`sf-promo flex items-center gap-3 overflow-hidden bg-accent text-primary ${desktop ? "justify-center px-12 py-2.5" : "px-4 py-2.5"}`}>
      {css && <style>{css}</style>}
      <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[.12em] text-accent">{n > 1 ? `${n} promos` : "Promo"}</span>
      <div className={`grid min-w-0 ${desktop ? "" : "flex-1"}`}>
        {promos.map((p, i) => (
          <a
            key={p.href}
            href={p.href}
            className={`${n > 1 ? "sf-promo-item" : ""} col-start-1 row-start-1 flex items-center gap-3`}
            style={{ "--d": `${i === 0 ? 0 : i * step - n * step}s` } as CSSProperties}
          >
            <span className={`min-w-0 font-semibold leading-snug ${desktop ? "text-[16px]" : "text-[14px]"}`}>{p.title}</span>
            <span className={`shrink-0 font-bold underline underline-offset-4 ${desktop ? "text-[15px]" : "ml-auto text-[14px]"}`}>Ver promo</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/** Cinta que corre: dice qué hacen en una línea, y le da vida a la página sin mascota. */
function Ticker() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {TICKER.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 font-display text-[18px] font-medium text-accent">
          {t}
          <span className="text-secondary/60">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-surface py-3">
      <div className="sf-ticker flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Visítanos con el mapa de Google visible (lo pidió el cliente). Única vez que salen dirección y horario. */
function Visitanos({ mapHeight, className = "" }: { mapHeight: number; className?: string }) {
  return (
    <section id="visitanos" aria-labelledby="visitanos-b2" className={`sf-reveal overflow-hidden rounded-card border border-line bg-surface ${className}`}>
      <iframe
        src={MAP_EMBED_URL}
        title="Mapa de Serflow en el Mercado Bazurto"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full border-0"
        style={{ height: mapHeight }}
      />
      <div className="flex flex-col gap-3 p-4">
        <div>
          <h2 id="visitanos-b2" className="text-[17px] font-bold">
            Visítanos
          </h2>
          <p className="text-[14px] text-muted">{ADDRESS}</p>
        </div>
        <dl className="flex flex-col gap-0.5 text-[14px]">
          {HOURS.map((h) => (
            <div key={h.days} className="flex justify-between gap-3">
              <dt className="text-muted">{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
        <Button variant="secondary" href={DIRECTIONS_URL} external fullWidth icon={<PinIcon className="size-4" />}>
          Cómo llegar
        </Button>
      </div>
    </section>
  );
}

/**
 * Hilo de bordado: una costura dorada que se va cosiendo por la página a medida que bajas, con la aguja en la punta.
 * Pasa por detrás de las fotos y tarjetas (como si las atravesara) y se ve en los espacios entre secciones.
 * Lo mueve el scroll del navegador (animation-timeline: scroll()), sin JS; aquí React solo mide el alto para trazarlo.
 */
function Thread({ width }: { width: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // El hilo va de 0.7 a (alto - 0.3) pantallas: así la aguja queda siempre a ~70% de la pantalla mientras bajas.
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  // Cruza la página de lado a lado, por detrás de fotos, tarjetas y texto (el contenido va en z-10, el hilo en z-0).
  const L = 14;
  const R = width - 14;
  const y0 = Math.round(vh * 0.7);
  const span = Math.max(h - vh, 0);
  const n = Math.max(Math.ceil(span / 620), 1);
  const step = span / n;
  let d = `M ${R} ${y0}`;
  for (let i = 0; i < n; i++) {
    const y = y0 + i * step;
    const x = i % 2 ? R : L;
    d += ` C ${i % 2 ? L : R} ${y + step * 0.45}, ${x} ${y + step * 0.55}, ${x} ${y + step}`;
  }
  // Puntos de cruce (cada vuelta del hilo): ahí queda una puntada en X, como en un bordado.
  const turns = Array.from({ length: n }, (_, i) => ({ x: i % 2 ? R : L, y: y0 + (i + 1) * step }));
  const end = turns[turns.length - 1] ?? { x: R, y: y0 };
  return (
    <svg ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0" width={width} height={h} viewBox={`0 0 ${width} ${h}`}>
      {h > 0 && (
        <>
          <defs>
            {/* La máscara avanza con el scroll: todo lo que está dentro (hilo, puntadas, nudo) aparece cuando la aguja llega. */}
            <mask id="sf-thread-mask" maskUnits="userSpaceOnUse">
              <path className="sf-thread-reveal" d={d} pathLength={1} fill="none" stroke="white" strokeWidth={40} strokeDasharray="1 1" />
            </mask>
          </defs>
          <g mask="url(#sf-thread-mask)">
            {/* Hilo de dos colores: puntadas doradas alternadas con puntadas claras */}
            <path d={d} fill="none" stroke="var(--color-accent)" strokeOpacity={0.85} strokeWidth={2.5} strokeDasharray="8 6" strokeLinecap="round" />
            <path d={d} fill="none" stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="5 9" strokeDashoffset={-9} strokeLinecap="round" />
            {turns.slice(0, -1).map((t) => (
              <g key={t.y} transform={`translate(${t.x} ${t.y})`} stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round">
                <path d="M-7 -7 L7 7 M7 -7 L-7 7" />
              </g>
            ))}
            {/* Nudo y moño al final del recorrido */}
            <g transform={`translate(${end.x} ${end.y})`} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round">
              <path d="M0 0 C-14 -12 -18 6 0 0 C14 -12 18 6 0 0" />
              <path d="M0 0 L-6 14 M0 0 L6 14" />
              <circle r="3.5" fill="var(--color-accent)" stroke="none" />
            </g>
          </g>
          <g className="sf-needle" style={{ offsetPath: `path("${d}")`, offsetRotate: "auto 90deg" } as CSSProperties}>
            <circle className="sf-glint" r="9" cy="-22" fill="var(--color-accent)" opacity=".35" />
            <path d="M0 -24 L3 14 Q0 21 -3 14 Z" fill="var(--color-ink)" />
            <ellipse cx="0" cy="-15" rx="1.1" ry="3.8" fill="var(--color-primary)" />
            <circle r="4.5" cy="19" fill="var(--color-accent)" />
          </g>
        </>
      )}
    </svg>
  );
}

function QuienesSomos({ desktop }: { desktop: boolean }) {
  return (
    <Section id="quienes-somos" title="Quiénes somos">
      <div className={`sf-reveal grid gap-6 ${desktop ? "grid-cols-2 gap-14" : ""}`}>
        <QuienesCopy className={desktop ? "text-[18px]" : "text-[16px]"} />
        <Razones />
      </div>
    </Section>
  );
}

const SOCIAL_ICONS = { Instagram: InstagramIcon, TikTok: TiktokIcon, Facebook: FacebookIcon };

/** Propuesta del Footer: sin horario, dirección ni WhatsApp (ya están en Visítanos y en el botón flotante). */
function FooterPropuesta({ desktop }: { desktop: boolean }) {
  return (
    <footer className="relative border-t border-line/60 text-[14px] text-muted">
      <div className={`flex gap-6 pb-28 pt-8 ${desktop ? "items-start justify-between px-12" : "flex-col px-4"}`}>
        <div className="flex flex-col gap-3">
          <img src={LOGO} alt="Serflow" className="h-6 w-auto self-start" />
          <p>Camisetas y gorras personalizadas · {CITY}</p>
          <a href="#visitanos" className="text-ink hover:text-accent">
            Cómo llegar y horario →
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <a href={`mailto:${EMAIL}`} className="text-ink hover:text-accent">
            {EMAIL}
          </a>
          <div className="flex gap-2">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.name];
              return (
                <a key={s.name} href={s.url} aria-label={`Serflow en ${s.name}`} className="flex size-11 items-center justify-center rounded-full border border-line hover:border-accent">
                  <Icon className="size-5 text-accent" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Shell({ viewport, children, height, promos }: { viewport: Viewport; children: ReactNode; height?: number | "auto"; promos?: Promo[] }) {
  const desktop = viewport === "desktop";
  return (
    <div className="relative overflow-clip bg-primary font-body text-ink antialiased" style={{ width: FOLD[viewport].width, height: height ?? FOLD[viewport].height }}>
      <style>{MOTION_CSS}</style>
      {promos && promos.length > 0 && <PromoBar promos={promos} desktop={desktop} />}
      <div className="[&_a[href^=https]]:hidden">
        <Header logoSrc={LOGO} links={NAV} />
      </div>
      {height === "auto" && <Thread width={FOLD[viewport].width} />}
      <main className="relative z-10">{children}</main>
      <div className={`sf-fab z-30 ${height === "auto" ? "fixed" : "absolute"} bottom-5 ${desktop ? "right-6" : "right-4"}`}>
        <WhatsAppFab placement="inline" />
      </div>
    </div>
  );
}

function QueHacemos({ desktop }: { desktop: boolean }) {
  return (
    <Section id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño.">
      <div className={`sf-lift sf-wipe sf-reveal-each grid gap-3 ${desktop ? "grid-cols-3 gap-5" : ""}`}>
        {SERVICES.map((s) => (
          <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
        ))}
      </div>
    </Section>
  );
}

function Disponible({ desktop }: { desktop: boolean }) {
  return (
    <Section id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana.">
      <div className={desktop ? "sf-lift sf-wipe sf-reveal-each grid grid-cols-4 gap-4" : "sf-lift -mx-4 grid snap-x auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1"}>
        <ProductItems count={4} />
      </div>
      <div className="mt-2">
        <Button variant="ghost" href={CATALOG_HREF}>
          Ver todo →
        </Button>
      </div>
    </Section>
  );
}

type Props = { height?: number | "auto"; promos?: Promo[] };

export function B2Mobile({ height, promos }: Props) {
  const promo = promos?.[0];
  return (
    <Shell viewport="mobile" height={height} promos={promos}>
      <Carousel className="h-[540px]" promo={promo}>
        <Welcome desktop={false} />
      </Carousel>
      <Ticker />
      <div className="px-4 pt-8">
        <Visitanos mapHeight={200} />
      </div>
      <div className="sf-stitch"><QueHacemos desktop={false} /></div>
      <div className="sf-stitch"><Disponible desktop={false} /></div>
      <div className="sf-reveal px-4 py-8">
        <PersonalizadorEntry />
      </div>
      <div className="sf-stitch"><QuienesSomos desktop={false} /></div>
      <FooterPropuesta desktop={false} />
    </Shell>
  );
}

export function B2Desktop({ height, promos }: Props) {
  const promo = promos?.[0];
  return (
    <Shell viewport="desktop" height={height} promos={promos}>
      <section className="grid grid-cols-[1fr_400px] gap-6 px-12 pt-6">
        <Carousel className="h-[560px] rounded-card border border-line" promo={promo}>
          <Welcome desktop />
        </Carousel>
        <Visitanos mapHeight={340} className="self-start" />
      </section>
      <div className="mt-8">
        <Ticker />
      </div>
      <div className="sf-stitch"><QueHacemos desktop /></div>
      <div className="sf-stitch"><Disponible desktop /></div>
      <div className="sf-reveal px-12 py-14">
        <PersonalizadorEntry desktop />
      </div>
      <div className="sf-stitch"><QuienesSomos desktop /></div>
      <FooterPropuesta desktop />
    </Shell>
  );
}

/** Las 4 fotos del carrusel, una al lado de la otra: en la captura estática solo se ve una. */
export function B2Slides() {
  return (
    <div className="flex gap-4 rounded-card border border-line bg-surface p-6 font-body text-ink antialiased">
      {SLIDES.map((s, i) => (
        <figure key={s.caption} className="m-0 flex w-[240px] flex-col gap-2">
          <img src={s.src} alt={s.alt} className="h-[300px] w-full rounded-tile object-cover" style={{ objectPosition: s.pos }} />
          <figcaption className="text-[14px]">
            <span className="text-accent">{i + 1}.</span> {s.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function NotaB2() {
  const items: [string, ReactNode][] = [
    ["Fotos", "Stock libres (Unsplash) que muestran el resultado: gente usando las camisetas y gorras, y el estampado en proceso. Se cambian por fotos reales desde el admin (PRI-150)."],
    ["Bienvenida", <>Vuelve "Bienvenido a Serflow", y debajo una línea que dice qué hacen. Alternativas: "Hola, somos Serflow" o "Tu prenda, a tu manera".</>],
    ["Mapa", "Mapa de Google visible, sin tocar nada. En desktop está al lado del carrusel, en la primera pantalla. En el celular aparece justo después de la cinta."],
    ["Movimiento", "1) Carrusel con fundido y zoom lento, cada foto cambia a los 6 s. 2) Cinta dorada que corre con lo que hacen. Todo CSS, se pausa al pasar el mouse, y se apaga si el celular tiene 'reducir movimiento'."],
    ["Más movimiento", "3) El texto del hero entra escalonado al cargar. 4) Las secciones y tarjetas suben suavemente al llegar con el scroll. 5) Las tarjetas se levantan y su foto hace zoom al pasar el mouse. 6) El botón de WhatsApp late 3 veces a los 4 s, una sola vez."],
    ["Hilo", "7) Una costura de dos colores (dorado y claro) que se cose por la página mientras bajas, con la aguja brillando en la punta. En cada vuelta deja una puntada en X y al final hace un nudo con moño. Pasa por detrás de fotos y tarjetas. Necesita scroll real: se ve en el preview, no en el canvas."],
    ["Promos", "Pueden ser varias: la barra rota entre ellas cada 5 s (se pausa con el mouse). Hoy la base solo deja UNA activa; para varias: un SQL que quita esa regla y un cambio en serflow-admin. Antes: solo con una promo activa en serflow-admin (título, foto y activar/desactivar ya existen ahí): barra dorada fija arriba de todo, que se lee sin moverse, y el banner entra como primera foto del carrusel. Sin promo, no aparece nada. La cinta que corre es siempre la de técnicas."],
    ["Detalles", "8) Los títulos de sección tienen una costura dorada que se cose al aparecer. 9) Las fotos de las tarjetas se destapan de arriba abajo al llegar con el scroll."],
    ["Mascota", "Fuera del hero. Opciones en la lámina \"Mascota\" del canvas: no se decide aquí."],
    ["Cinta", "Ya no son palabras sueltas: dice para qué sirve (uniformes para tu equipo, gorras con el logo de tu negocio...). Validar con el cliente."],
    ["Página completa", "Hero + Visítanos, cinta, Qué hacemos, Disponible ahora, Diseña la tuya, Quiénes somos y Footer (sin horario, dirección ni WhatsApp)."],
    ["WhatsApp", "Botón del hero + el flotante. Nada más (igual que B)."],
  ];
  return (
    <div className="flex w-[400px] flex-col gap-5 rounded-card border border-secondary/60 bg-surface p-8 font-body text-ink antialiased">
      <div className="text-[12px] uppercase tracking-[.14em] text-accent">B ajustada · feedback de Said</div>
      <h1 className="font-display text-[28px] font-bold leading-[1.1]">B con fotos que venden, bienvenida, mapa y movimiento</h1>
      {items.map(([label, body]) => (
        <div key={label} className="flex flex-col gap-1">
          <div className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">{label}</div>
          <div className="text-[15px] leading-relaxed">{body}</div>
        </div>
      ))}
    </div>
  );
}
