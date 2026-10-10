import type { ReactNode } from "react";
import { Button } from "../../../../src/components/ui/Button";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Section } from "../../../../src/components/ui/Section";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { NAV_LINKS } from "../../../../src/components/ui/Header";
import { Pantalla, type Viewport } from "./paginas";
import { LOGO } from "./data";
import { BIENVENIDA, CHIPS, GRUPOS, TODO, TODO_HREF, grupoDe, hace, mas, pedir, type Grupo, type Prenda } from "./datos3";
import { Bienvenida, FotoCard, FotosPrenda, Nuevo } from "./propuestas/Comunes";
import { Alfiler, Marquilla, Muro, Polaroid } from "./propuestas/Muro";
import { Masonry } from "./propuestas/Masonry";
import { GrupoUso, PortadaGrupo } from "./propuestas/GrupoUso";
import { Avatar, CabeceraPerfil, Destacadas, GrillaIG, destacadas } from "./propuestas/Perfil";

/*
 * Ronda 3 de PRI-130: las cuatro direcciones compuestas como páginas (Header, Footer y WhatsAppFab de Layout.astro
 * vía Pantalla). Todo lo que es UI sale de src/components/ui o de ./propuestas; aquí solo hay composición.
 * cat = la categoría elegida en los chips; sin cat, "Todo" (/products).
 */

const NAV = [{ label: "Catálogo", href: TODO_HREF }, ...NAV_LINKS];
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Pagina({ vp, fold = true, fab = true, children }: { vp: Viewport; fold?: boolean; fab?: boolean; children: ReactNode }) {
  return (
    <Pantalla viewport={vp} fold={fold} fab={fab} nav={NAV} current={TODO_HREF}>
      <main className="@container relative pb-4">{children}</main>
    </Pantalla>
  );
}

/** Categoría sin fotos: EmptyState del design system. WhatsApp ya está en el flotante; la salida es seguir mirando. */
function Vacia({ g }: { g: Grupo }) {
  return (
    <EmptyState
      title={`Todavía no hay fotos de ${g.label}`}
      description="Igual la hacemos por encargo, con el logo de tu empresa. Escríbenos por WhatsApp y te mostramos trabajos parecidos."
      action={{ label: "Ver lo más nuevo", href: TODO_HREF }}
    />
  );
}

function Volver({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={`inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink ${FOCUS}`}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {children}
    </a>
  );
}

function Pedir({ p, label = "Pedir una así", nota = true, center = false }: { p: Prenda; label?: string; nota?: boolean; center?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="whatsapp" href={pedir(p)} external fullWidth>
        {label}
      </Button>
      {nota && <p className={`text-[13px] leading-snug text-muted ${center ? "text-center" : ""}`}>Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo.</p>}
    </div>
  );
}

const lista = (cat?: Grupo) => (cat ? cat.prendas : TODO);

/* ===================== 1 · Muro del taller ===================== */

export function MuroGaleria({ vp, cat }: { vp: Viewport; cat?: Grupo }) {
  const prendas = lista(cat).slice(0, vp === "mobile" ? 8 : 15);
  const vacia = cat?.count === 0;
  return (
    <Pagina vp={vp}>
      <Bienvenida titulo={BIENVENIDA.titulo} texto={BIENVENIDA.texto} chips={CHIPS} current={cat?.href ?? TODO_HREF}>
        {/* Con categoría elegida: su marquilla y su frase. */}
        {cat?.frase && (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-[15px] text-ink">
            <Marquilla>{cat.label}</Marquilla> {cat.frase}
          </p>
        )}
      </Bienvenida>
      <div className="mt-6 @3xl:mt-8">
        <Muro prendas={prendas} hilo={vacia ? undefined : { width: vp === "mobile" ? 390 : 1184, height: 1600 }}>
          {vacia ? (
            <div className="relative mx-auto max-w-[440px] pt-2">
              <Alfiler />
              <Vacia g={cat} />
            </div>
          ) : undefined}
        </Muro>
      </div>
    </Pagina>
  );
}

export function MuroVisor({ vp, p }: { vp: Viewport; p: Prenda }) {
  const g = grupoDe(p);
  const otras = mas(p, 4);
  return (
    <Pagina vp={vp} fold={false} fab={false}>
      <div className="px-4 pt-2 @3xl:px-12 @3xl:pt-4">
        <Volver href={`${TODO_HREF}#f-${p.n}`}>Volver al muro</Volver>
      </div>
      <div className="mt-2">
        {/* Sin hilo: aquí pasaría por detrás del texto y del botón. */}
        <Muro prendas={[]}>
          <div className="grid gap-8 @3xl:grid-cols-[minmax(0,1fr)_380px] @3xl:items-center @3xl:gap-16">
            <div className="mx-auto w-full max-w-[520px] -rotate-1">
              <Polaroid p={p} grande>
                <FotosPrenda p={p} aspect="3 / 4" papel />
              </Polaroid>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h1 className="font-display text-[30px] font-medium leading-[1.08] tracking-[-0.01em] @3xl:text-[42px]">{g.frase ?? g.label}</h1>
              {/* "Nuevo" ya va en la cinta de la foto. */}
              <p className="text-[14px] text-muted">Salió del taller {hace(p.dias).toLowerCase()}</p>
              <div className="w-full">
                <Pedir p={p} />
              </div>
            </div>
          </div>
        </Muro>
      </div>
      {otras.length > 0 && (
        <Section id="mas" title={`Más de ${g.label}`}>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 pt-2 @3xl:grid-cols-4 @3xl:gap-x-8">
            {otras.map((o, i) => (
              <li key={o.href}>
                <Polaroid p={o} i={i + 1} />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <VerTodas g={g} />
          </div>
        </Section>
      )}
    </Pagina>
  );
}

/* ===================== 2 · Pinterest / Unsplash ===================== */

export function MasonryGaleria({ vp, cat }: { vp: Viewport; cat?: Grupo }) {
  return (
    <Pagina vp={vp}>
      <Bienvenida titulo={BIENVENIDA.titulo} texto={BIENVENIDA.texto} chips={CHIPS} current={cat?.href ?? TODO_HREF} />
      <div className="px-2 pt-5 @3xl:px-12 @3xl:pt-8">
        {cat?.count === 0 ? (
          <div className="px-2 @3xl:px-0">
            <Vacia g={cat} />
          </div>
        ) : (
          <Masonry prendas={lista(cat).slice(0, vp === "mobile" ? 10 : 20)} />
        )}
      </div>
    </Pagina>
  );
}

function VerTodas({ g }: { g: Grupo }) {
  return (
    <Button variant="ghost" href={g.href}>
      Ver las {g.count} de {g.label} →
    </Button>
  );
}

export function MasonryVisor({ vp, p }: { vp: Viewport; p: Prenda }) {
  const g = grupoDe(p);
  return (
    <Pagina vp={vp} fold={false} fab={false}>
      <div className="flex items-center justify-between gap-3 px-4 py-1 @3xl:px-12 @3xl:py-3">
        <Volver href={`${TODO_HREF}#f-${p.n}`}>Todas las fotos</Volver>
        <span className="text-[13px] text-muted">
          N.º {p.n} · {hace(p.dias)}
        </span>
      </div>
      <div className="@3xl:px-12">
        <FotosPrenda p={p} aspect={vp === "mobile" ? "4 / 5" : "16 / 9"} rounded="@3xl:rounded-card" />
      </div>
      <div className="flex flex-col gap-4 px-4 pt-4 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:px-12 @3xl:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" href={g.href} icon={null}>
            {g.label}
          </Button>
          {p.nuevo && <Nuevo />}
          {g.frase && <span className="text-[14px] text-muted">{g.frase}</span>}
        </div>
        <div className="@3xl:w-[300px]">
          <Pedir p={p} nota={vp === "mobile"} />
        </div>
      </div>
      <Section id="mas" title={`Más de ${g.label}`}>
        <div className="-mx-2 @3xl:mx-0">
          <Masonry prendas={mas(p, vp === "mobile" ? 6 : 12)} offset={3} />
        </div>
        <div className="mt-3">
          <VerTodas g={g} />
        </div>
      </Section>
    </Pagina>
  );
}

/* ===================== 3 · Fotos por uso ===================== */

export function UsoGaleria({ vp, cat }: { vp: Viewport; cat?: Grupo }) {
  return (
    <Pagina vp={vp}>
      <Bienvenida titulo={BIENVENIDA.titulo} texto={BIENVENIDA.texto} chips={CHIPS} current={cat?.href ?? TODO_HREF} />
      {cat ? (
        <div className="flex flex-col gap-4 px-4 pt-6 @3xl:px-12 @3xl:pt-8">
          <PortadaGrupo g={cat} h="h2" enlace={false} />
          {cat.count === 0 ? (
            <Vacia g={cat} />
          ) : (
            <ul className="grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4">
              {cat.prendas.map((p) => (
                <li key={p.href}>
                  <FotoCard p={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6">
            <Ticker items={GRUPOS.filter((x) => x.count > 0 && x.frase).map((x) => x.frase!)} />
          </div>
          <div className="flex flex-col gap-10 px-4 pt-8 @3xl:gap-14 @3xl:px-12 @3xl:pt-10">
            {GRUPOS.filter((x) => x.count > 0).map((x) => (
              <GrupoUso key={x.href} g={x} />
            ))}
          </div>
        </>
      )}
    </Pagina>
  );
}

export function UsoVisor({ vp, p }: { vp: Viewport; p: Prenda }) {
  const g = grupoDe(p);
  return (
    <Pagina vp={vp} fold={false} fab={false}>
      <div className="px-4 pt-2 @3xl:px-12 @3xl:pt-4">
        <Volver href={`${g.href}#f-${p.n}`}>{g.label}</Volver>
      </div>
      <div className="grid gap-5 px-4 pt-2 @3xl:grid-cols-[minmax(0,1fr)_400px] @3xl:items-center @3xl:gap-14 @3xl:px-12">
        <div className="relative overflow-hidden rounded-card border border-line">
          <FotosPrenda p={p} aspect="4 / 5" className="[&>div]:pb-3" />
          {p.nuevo && <Nuevo className="absolute left-3 top-3" />}
        </div>
        <div className="flex flex-col items-start gap-4">
          <span className="text-[13px] font-semibold uppercase tracking-[.14em] text-accent">
            {g.label} · N.º {p.n}
          </span>
          <h1 className="stitch-title font-display text-[32px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[46px]">{g.frase ?? g.label}</h1>
          <p className="text-[15px] text-muted">Así quedó, {hace(p.dias).toLowerCase()}.</p>
          <div className="w-full">
            <Pedir p={p} label="Quiero una así" />
          </div>
        </div>
      </div>
      <Section id="mas" title={`Más de ${g.label}`}>
        <ul className="-mx-4 grid snap-x scroll-px-4 auto-cols-[44%] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-6 @3xl:px-0">
          {mas(p, 6).map((o) => (
            <li key={o.href} className="snap-start">
              <FotoCard p={o} />
            </li>
          ))}
        </ul>
        <div className="mt-1">
          <VerTodas g={g} />
        </div>
      </Section>
    </Pagina>
  );
}

/* ===================== 4 · Perfil de Instagram ===================== */

const DESTACADAS = destacadas(GRUPOS, { count: TODO.length, portada: TODO[0].fotos[0].src }, TODO_HREF);

export function PerfilGaleria({ vp, cat }: { vp: Viewport; cat?: Grupo }) {
  return (
    <Pagina vp={vp}>
      <div className="@3xl:mx-auto @3xl:max-w-[1000px]">
        <CabeceraPerfil logo={LOGO} trabajos={TODO.length} categorias={GRUPOS.length} titulo={BIENVENIDA.titulo} texto={BIENVENIDA.texto} />
        <div className="mt-5 @3xl:mt-10">
          <Destacadas items={DESTACADAS} current={cat?.href ?? TODO_HREF} />
        </div>
        <div className="mt-3 border-t border-line pt-0.5 @3xl:mx-12 @3xl:mt-8 @3xl:pt-1">
          {cat?.count === 0 ? (
            <div className="px-4 pt-6 @3xl:px-0">
              <Vacia g={cat} />
            </div>
          ) : (
            <GrillaIG prendas={lista(cat).slice(0, vp === "mobile" ? 15 : 12)} />
          )}
        </div>
      </div>
    </Pagina>
  );
}

function CabeceraPost({ g, p }: { g: Grupo; p: Prenda }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 @3xl:px-5 @3xl:py-4">
      <Avatar logo={LOGO} size="sm" />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-[15px] font-bold">serflow</p>
        <a href={g.href} className={`inline-flex min-h-11 items-center text-[13px] text-muted hover:text-ink ${FOCUS}`}>
          {g.label} · N.º {p.n}
        </a>
      </div>
      {p.nuevo && <Nuevo />}
    </div>
  );
}

function Pie({ g, p }: { g: Grupo; p: Prenda }) {
  return (
    <>
      <p className="text-[15px] leading-relaxed">
        <span className="font-bold">serflow</span> {g.frase ?? g.label}. ¿Te gusta? Te hacemos una igual o con tu logo.
      </p>
      <p className="text-[12px] uppercase tracking-[.06em] text-muted">{hace(p.dias)}</p>
    </>
  );
}

export function PerfilVisor({ vp, p }: { vp: Viewport; p: Prenda }) {
  const g = grupoDe(p);
  const masDe = (
    <section aria-labelledby="mas-ig" className="mt-8 border-t border-line pt-4 @3xl:mt-12">
      <h2 id="mas-ig" className="px-4 pb-3 text-[15px] font-semibold text-muted @3xl:px-0">
        Más de {g.label}
      </h2>
      <GrillaIG prendas={mas(p, vp === "mobile" ? 9 : 6)} />
      <div className="px-4 pt-3 @3xl:px-0">
        <VerTodas g={g} />
      </div>
    </section>
  );
  if (vp === "mobile")
    return (
      <Pagina vp={vp} fold={false} fab={false}>
        <div className="px-4">
          <Volver href={`${g.href}#f-${p.n}`}>{g.label}</Volver>
        </div>
        <article>
          <CabeceraPost g={g} p={p} />
          <FotosPrenda p={p} aspect="1 / 1" />
          <div className="flex flex-col gap-3 px-4 pt-4">
            <Pedir p={p} label="Pedir uno así" nota={false} />
            <Pie g={g} p={p} />
          </div>
        </article>
        {masDe}
      </Pagina>
    );
  return (
    <Pagina vp={vp} fold={false} fab={false}>
      <div className="mx-auto max-w-[1000px] px-12 pt-4">
        <Volver href={`${g.href}#f-${p.n}`}>{g.label}</Volver>
        <article className="mt-2 grid grid-cols-[minmax(0,1fr)_380px] overflow-hidden rounded-card border border-line bg-surface">
          <FotosPrenda p={p} aspect="1 / 1" className="[&>div]:pb-3" />
          <div className="flex flex-col border-l border-line">
            <CabeceraPost g={g} p={p} />
            <div className="flex flex-1 flex-col gap-3 border-t border-line p-5">
              <Pie g={g} p={p} />
            </div>
            <div className="border-t border-line p-5">
              <Pedir p={p} label="Pedir uno así" />
            </div>
          </div>
        </article>
        {masDe}
      </div>
    </Pagina>
  );
}

