import type { ReactNode } from "react";
import { Header, NAV_LINKS } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { Button } from "../../../../src/components/ui/Button";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Section } from "../../../../src/components/ui/Section";
import { whatsappUrl } from "../../../../src/lib/business";
import { hastaCorto, LOGO, promoWhatsapp, validaHasta, type PromoDemo } from "./data";
import { PromoBarPropuesta, PromoCard, PromoGallery, type PromoLink } from "./propuestas";

/*
 * Pantallas completas de PRI-131 dentro del marco real de Layout.astro (Header, Footer y WhatsAppFab de
 * src/components/ui). El contenido usa container queries (@3xl = 768, @4xl = 896), así que el mismo
 * componente se ve a 390 y a 1280 igual que en el sitio.
 */

export type Width = 390 | 1280;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const H1 = "font-display font-medium leading-[1.05] tracking-[-0.01em]";
const PAD = "px-4 @3xl:px-12";

export function Shell({ width, bar, fabText, children }: { width: Width; bar?: PromoLink[]; fabText?: string; children: ReactNode }) {
  return (
    <div className="relative bg-primary font-body text-ink antialiased" style={{ width }}>
      {bar && <PromoBarPropuesta promos={bar} />}
      <Header logoSrc={LOGO} />
      <main className="@container">{children}</main>
      <Footer logoSrc={LOGO} />
      <div className="absolute bottom-5 right-4">
        <WhatsAppFab placement="inline" text={fabText} />
      </div>
    </div>
  );
}

export const barLinks = (promos: PromoDemo[]): PromoLink[] => promos.map((p) => ({ title: p.title, href: `/promos/${p.slug}` }));

/* ---------------- /promos ---------------- */

export type ListaOpcion = "tarjetas" | "destacada" | "afiches";

function ListaHeader({ n }: { n: number }) {
  return (
    <div className="flex flex-col items-start gap-3 pb-6 @3xl:pb-8">
      {n > 0 && <Eyebrow>{n === 1 ? "1 promo activa" : `${n} promos activas`}</Eyebrow>}
      <h1 className={`${H1} text-[38px] @3xl:text-[68px]`}>{n > 0 ? "Promos de hoy" : "Promos"}</h1>
      {n > 0 && (
        <p className="max-w-[56ch] text-[16px] leading-relaxed text-muted @3xl:text-[19px]">
          Precios especiales por poco tiempo. Toca una para ver las fotos y pedirla por WhatsApp.
        </p>
      )}
    </div>
  );
}

/** B · la primera promo grande; las demás en filas compactas. */
function Destacada({ promo }: { promo: PromoDemo }) {
  const hasta = validaHasta(promo.endsAt);
  return (
    <a
      href={`/promos/${promo.slug}`}
      className={`group grid overflow-hidden rounded-card border border-line bg-surface text-ink no-underline hover:border-secondary @4xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] ${FOCUS}`}
    >
      <img src={promo.cover.src} alt={promo.cover.alt} className="fabric aspect-[4/3] h-auto w-full bg-surface-2 object-cover @4xl:h-full" />
      <div className="flex flex-col items-start gap-3 p-5 @4xl:justify-center @4xl:p-10">
        {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
        <h2 className="font-display text-[28px] font-bold leading-tight @4xl:text-[40px]">{promo.title}</h2>
        {promo.description && <p className="text-[15px] leading-relaxed text-muted @4xl:text-[19px]">{promo.description}</p>}
        <span className="mt-1 text-[15px] font-semibold text-accent group-hover:underline group-hover:underline-offset-4">Ver fotos y pedirla →</span>
      </div>
    </a>
  );
}

function Fila({ promo }: { promo: PromoDemo }) {
  const hasta = hastaCorto(promo.endsAt);
  return (
    <a
      href={`/promos/${promo.slug}`}
      className={`flex min-h-[104px] items-center gap-4 rounded-card border border-line bg-surface p-3 text-ink no-underline hover:border-secondary ${FOCUS}`}
    >
      <img src={promo.cover.src} alt="" className="fabric size-20 shrink-0 rounded-tile bg-surface-2 object-cover" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <h2 className="font-display text-[16px] font-bold leading-snug">{promo.title}</h2>
        {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
      </div>
      <span aria-hidden className="pr-1 text-[20px] text-accent">→</span>
    </a>
  );
}

/** C · cada promo con su propio botón de WhatsApp: se pide desde la lista, sin entrar al detalle. */
function Afiche({ promo }: { promo: PromoDemo }) {
  const hasta = validaHasta(promo.endsAt);
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <img src={promo.cover.src} alt={promo.cover.alt} className="fabric aspect-[16/10] h-auto w-full bg-surface-2 object-cover" />
      <div className="flex flex-1 flex-col items-start gap-3 p-5">
        {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
        <h2 className="font-display text-[22px] font-bold leading-tight">{promo.title}</h2>
        {promo.description && <p className="text-[15px] leading-relaxed text-muted">{promo.description}</p>}
        <div className="mt-auto flex w-full flex-col gap-1 pt-2">
          <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth>
            Pedir por WhatsApp
          </Button>
          <Button variant="ghost" href={`/promos/${promo.slug}`}>
            Ver las {promo.photos.length + 1} fotos →
          </Button>
        </div>
      </div>
    </article>
  );
}

export function PromosLista({ promos, opcion = "tarjetas" }: { promos: PromoDemo[]; opcion?: ListaOpcion }) {
  const n = promos.length;
  return (
    <div className={`${PAD} pb-12 pt-6 @3xl:pb-16 @3xl:pt-10`}>
      <ListaHeader n={n} />
      {n === 0 && (
        <div className="max-w-[560px]">
          <EmptyState
            title="Hoy no hay promos"
            description="Cuando lanzamos una, sale en la barra dorada de la portada. Mientras tanto, escríbenos y te contamos qué hay a buen precio en el taller."
            action={{ label: "Pregunta por WhatsApp", href: whatsappUrl("Hola! Vi que hoy no hay promos. ¿Qué tienen a buen precio en el taller?") }}
          />
        </div>
      )}
      {n > 0 && opcion === "tarjetas" && (
        <ul className={`grid gap-4 @3xl:grid-cols-2 @4xl:grid-cols-3 @4xl:gap-5 ${n === 1 ? "max-w-[420px] @3xl:grid-cols-1 @4xl:grid-cols-1" : ""}`}>
          {promos.map((p) => (
            <li key={p.slug} className="reveal-up">
              <PromoCard promo={p} />
            </li>
          ))}
        </ul>
      )}
      {n > 0 && opcion === "destacada" && (
        <div className="flex flex-col gap-4 @4xl:gap-5">
          <Destacada promo={promos[0]} />
          {n > 1 && (
            <ul className="grid gap-3 @4xl:grid-cols-2 @4xl:gap-5">
              {promos.slice(1).map((p) => (
                <li key={p.slug}>
                  <Fila promo={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {n > 0 && opcion === "afiches" && (
        <ul className="grid gap-5 @3xl:grid-cols-2 @4xl:grid-cols-3">
          {promos.map((p) => (
            <li key={p.slug} className="flex">
              <Afiche promo={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- /promos/[slug] ---------------- */

export type DetalleOpcion = "ficha" | "afiche";

function Volver({ hayOtras }: { hayOtras: boolean }) {
  return hayOtras ? (
    <Button variant="ghost" href="/promos">
      ← Todas las promos
    </Button>
  ) : (
    <Button variant="ghost" href="/">
      ← Volver al inicio
    </Button>
  );
}

function Pedir({ promo }: { promo: PromoDemo }) {
  return (
    <div className="flex w-full flex-col gap-2 @4xl:items-start">
      <div className="w-full @4xl:w-auto">
        <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth>
          Pedir esta promo por WhatsApp
        </Button>
      </div>
      <p className="text-[13px] text-muted">El mensaje ya lleva el nombre de la promo.</p>
    </div>
  );
}

function OtrasPromos({ promos }: { promos: PromoDemo[] }) {
  if (promos.length === 0) return null;
  return (
    <Section title="Otras promos">
      <ul className="grid gap-4 @3xl:grid-cols-2 @4xl:grid-cols-3 @4xl:gap-5">
        {promos.map((p) => (
          <li key={p.slug}>
            <PromoCard promo={p} headingLevel={3} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function PromoDetalle({ promo, otras, opcion = "ficha" }: { promo: PromoDemo; otras: PromoDemo[]; opcion?: DetalleOpcion }) {
  const hasta = validaHasta(promo.endsAt);
  const fotos = [promo.cover, ...promo.photos];

  if (opcion === "afiche") {
    return (
      <>
        <div className="@4xl:px-12 @4xl:pt-6">
          <div className="relative overflow-hidden bg-surface-2 @4xl:rounded-card @4xl:border @4xl:border-line">
            <img src={promo.cover.src} alt={promo.cover.alt} className="fabric aspect-[4/5] h-auto w-full object-cover @4xl:aspect-[21/9]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
            <div className="absolute left-3 top-3 @4xl:left-6 @4xl:top-5">
              <span className="inline-flex rounded-full bg-primary/85 px-3">
                <Volver hayOtras={otras.length > 0} />
              </span>
            </div>
            <div className="anim-enter absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 pb-6 @4xl:p-10">
              <Eyebrow>Promo</Eyebrow>
              <h1 className={`${H1} text-[38px] @4xl:text-[68px]`}>{promo.title}</h1>
              {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
            </div>
          </div>
        </div>
        <div className={`${PAD} grid gap-8 pb-12 pt-6 @4xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @4xl:gap-10 @4xl:pt-10`}>
          <div className="flex flex-col items-start gap-5">
            {promo.description && <p className="text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">{promo.description}</p>}
            <Pedir promo={promo} />
          </div>
          {promo.photos.length > 0 && (
            <div className="flex min-w-0 flex-col gap-3">
              <h2 className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Más fotos</h2>
              <div className="-mx-4 grid snap-x scroll-px-4 auto-cols-[72%] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] @4xl:mx-0 @4xl:auto-cols-auto @4xl:grid-flow-row @4xl:grid-cols-2 @4xl:px-0">
                {promo.photos.map((ph) => (
                  <img key={ph.src} src={ph.src} alt={ph.alt} loading="lazy" className="fabric aspect-[4/5] h-auto w-full snap-start rounded-tile border border-line bg-surface-2 object-cover @4xl:aspect-square" />
                ))}
              </div>
            </div>
          )}
        </div>
        <OtrasPromos promos={otras} />
      </>
    );
  }

  return (
    <>
      <div className={`${PAD} grid gap-6 pb-12 pt-4 @4xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @4xl:gap-12 @4xl:pt-8`}>
        <div className="flex flex-col items-start gap-4 @4xl:sticky @4xl:top-6 @4xl:self-start">
          <Volver hayOtras={otras.length > 0} />
          <div className="anim-enter flex flex-col items-start gap-4">
            <Eyebrow>Promo</Eyebrow>
            <h1 className={`${H1} text-[38px] @4xl:text-[40px]`}>{promo.title}</h1>
            {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
            {promo.description && <p className="text-[16px] leading-relaxed text-ink/85 @4xl:text-[19px]">{promo.description}</p>}
          </div>
          <Pedir promo={promo} />
        </div>
        <PromoGallery photos={fotos} />
      </div>
      <OtrasPromos promos={otras} />
    </>
  );
}

/* ---------------- 404 ---------------- */

export type NotFoundOpcion = "directa" | "hilo" | "salidas";

/**
 * Lugar reservado para la mascota (PRI-124, en pausa), con la proporción de MascotSlot (160:190).
 * En el sitio es una caja vacía aria-hidden del mismo tamaño (el layout no salta cuando llegue la mascota);
 * el borde punteado y el texto existen solo en el canvas.
 */
function EspacioMascota() {
  return (
    <div
      aria-hidden
      className="flex aspect-[160/190] w-[72px] shrink-0 items-center justify-center rounded-card border-2 border-dashed border-line p-1.5 text-center text-[12px] leading-tight text-muted @3xl:w-[120px]"
    >
      Mascota
    </div>
  );
}

/** Propuesta · ilustración de la 404 "Hilo suelto": la costura de la portada que se corta y queda colgando. CSS puro. */
function HiloSuelto() {
  const d = "M4 70 C 50 20, 90 110, 140 62 S 220 30, 250 78";
  return (
    <svg viewBox="0 0 300 130" className="h-auto w-[240px] @3xl:w-[300px]" aria-hidden>
      <style>{`.nf-draw { animation: sf-draw 1.8s cubic-bezier(.2,.7,.2,1) .2s both; }
.nf-swing { transform-origin: 250px 78px; animation: nf-swing 3s ease-in-out 2s 2 alternate both; }
@keyframes nf-swing { from { transform: rotate(0) } to { transform: rotate(8deg) } }
@media (prefers-reduced-motion: reduce) { .nf-draw, .nf-swing { animation: none; } }`}</style>
      <defs>
        <mask id="nf-mask" maskUnits="userSpaceOnUse">
          <path className="nf-draw" d={d} pathLength={1} fill="none" stroke="white" strokeWidth={30} strokeDasharray="1 1" />
        </mask>
      </defs>
      <g mask="url(#nf-mask)">
        <path d={d} fill="none" stroke="var(--color-accent)" strokeOpacity={0.9} strokeWidth={3} strokeDasharray="9 7" strokeLinecap="round" />
        <path d={d} fill="none" stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="5 11" strokeDashoffset={-10} strokeLinecap="round" />
        <path d="M133 55 L147 69 M147 55 L133 69" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" />
      </g>
      <g className="nf-swing">
        {/* Punta deshilachada donde se cortó */}
        <path d="M250 78 l10 -6 M250 78 l12 2 M250 78 l8 9" stroke="var(--color-accent)" strokeWidth={2} strokeLinecap="round" />
        {/* Aguja colgando de la punta del hilo */}
        <path d="M250 78 L262 112" stroke="var(--color-accent)" strokeOpacity={0.9} strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />
        <path d="M262 108 L268 128 Q267 134 263 130 L258 110 Z" fill="var(--color-ink)" />
      </g>
    </svg>
  );
}

function SalidasLinks() {
  return (
    <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {NAV_LINKS.map((l) => (
        <li key={l.href}>
          <a href={l.href} className={`flex min-h-12 items-center justify-between px-4 text-[16px] font-semibold text-ink hover:text-accent ${FOCUS}`}>
            {l.label}
            <span aria-hidden className="text-accent">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function NotFound({ opcion, promos = [] }: { opcion: NotFoundOpcion; promos?: PromoDemo[] }) {
  const hilo = opcion === "hilo";
  const salidas = opcion === "salidas" || (hilo && promos.length > 0);
  return (
    <div className="pb-4 @3xl:pb-8">
      <div className={`${PAD} pb-6 pt-10 @3xl:pt-16`}>
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-5 text-center">
          {hilo ? (
            <div className="flex items-end gap-1">
              <HiloSuelto />
              <EspacioMascota />
            </div>
          ) : (
            <EspacioMascota />
          )}
          <div className="anim-enter flex flex-col items-center gap-4">
            <Eyebrow>Error 404</Eyebrow>
            <h1 className={`${H1} text-[38px] @3xl:text-[68px]`}>{hilo ? "Se nos soltó el hilo" : "Esta página no existe"}</h1>
            <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted @3xl:text-[19px]">
              {hilo
                ? "Esta página no existe o ya la quitamos. Si venías por una promo, puede que ya haya terminado."
                : "Puede que el link esté viejo o mal copiado. Escríbenos y te mandamos lo que buscabas."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 @3xl:w-auto @3xl:flex-row">
            <div className="w-full @3xl:w-auto">
              <Button variant="whatsapp" href={whatsappUrl("Hola! Llegué a una página de Serflow que no existe. Estaba buscando...")} external fullWidth>
                Escríbenos por WhatsApp
              </Button>
            </div>
            <div className="w-full @3xl:w-auto">
              <Button variant="secondary" href="/" fullWidth>
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
      {salidas &&
        (promos.length > 0 ? (
          <Section title="Promos de hoy">
            <ul className={`grid gap-4 @3xl:grid-cols-2 @4xl:grid-cols-3 @4xl:gap-5 ${promos.length === 1 ? "max-w-[420px] @3xl:grid-cols-1 @4xl:grid-cols-1" : ""}`}>
              {promos.map((p) => (
                <li key={p.slug}>
                  <PromoCard promo={p} headingLevel={3} />
                </li>
              ))}
            </ul>
          </Section>
        ) : (
          <Section title="Lo que sí está">
            <div className="max-w-[480px]">
              <SalidasLinks />
            </div>
          </Section>
        ))}
    </div>
  );
}
