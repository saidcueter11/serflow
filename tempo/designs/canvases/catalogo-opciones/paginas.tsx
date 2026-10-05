import type { ReactNode } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { Button } from "../../../../src/components/ui/Button";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Section } from "../../../../src/components/ui/Section";
import { Chip } from "../../../../src/components/ui/Chip";
import { whatsappUrl } from "../../../../src/lib/business";
import { CategoryNav, CategoryTiles, type CategoryLink } from "./propuestas/CategoryNav";
import { ProductGallery } from "./propuestas/ProductGallery";
import { CATALOG_CURRENT, CATALOG_NAV, LOGO, mensaje, mensajeGrupo, mensajeLogo, type Item, type Producto } from "./data";

/*
 * Páginas del catálogo para el canvas catalogo-opciones (PRI-130). Todo lo que es UI sale de src/components/ui
 * o de ./propuestas; aquí solo queda la composición de cada opción. Al implementar, la opción elegida pasa a
 * src/components/catalog/CategoryPage.tsx y ProductPage.tsx (React estático, como home/HomePage.tsx) y las
 * páginas .astro solo buscan datos y le pasan props.
 * Container queries (@3xl = 768 px, @4xl = 896 px) y no md:, así el canvas se ve igual que el sitio.
 */

export type Viewport = "mobile" | "desktop";
const SIZE = { mobile: { width: 390, fold: 844 }, desktop: { width: 1280, fold: 800 } };

/**
 * Marco de Layout.astro: Header + contenido + Footer + WhatsAppFab. fold = cortar en el pliegue (lo que se ve sin
 * scroll); sin fold, la página completa. fab null = la página no lleva el flotante (opción B de la ficha).
 */
export function Pantalla({
  viewport,
  fold = false,
  fab = "generico",
  fabText,
  bar,
  children,
}: {
  viewport: Viewport;
  fold?: boolean;
  fab?: "generico" | "producto" | null;
  fabText?: string;
  bar?: ReactNode;
  children: ReactNode;
}) {
  const s = SIZE[viewport];
  return (
    <div className="relative overflow-hidden bg-primary font-body text-ink antialiased" style={{ width: s.width, height: fold ? s.fold : undefined }}>
      <Header logoSrc={LOGO} links={CATALOG_NAV} current={CATALOG_CURRENT} />
      {children}
      {!fold && <Footer logoSrc={LOGO} />}
      {fab && (
        <div className="absolute bottom-5 right-4 z-30">
          <WhatsAppFab placement="inline" text={fab === "producto" ? fabText : undefined} />
        </div>
      )}
      {bar}
    </div>
  );
}

/* ================= Lista de categoría ================= */

const GRID = "grid grid-cols-2 gap-3 @3xl:grid-cols-4 @3xl:gap-4";

function Grid({ items }: { items: Item[] }) {
  return (
    <ul className={GRID}>
      {items.map((p) => (
        <li key={p.href} className="flex">
          <ProductCard name={p.name} meta={p.meta} href={p.href} image={p.image} />
        </li>
      ))}
    </ul>
  );
}

function Vacia({ label }: { label: string }) {
  return (
    <EmptyState
      title={`Todavía no hay nada en ${label}`}
      description="Lo hacemos por encargo con tu diseño, tu logo o tu equipo. Escríbenos y te contamos precio y tiempos."
      action={{ label: "Pídelo por WhatsApp", href: whatsappUrl(`Hola! Busco algo de ${label}, hecho por encargo.`) }}
    />
  );
}

const subtitulo = (count: number) =>
  count === 0 ? "Por encargo, con tu diseño." : `${count} diseños. Toca el que te guste y te damos precio por WhatsApp.`;

type ListaProps = { categories: CategoryLink[]; current: string; items: Item[] };

/** A · Directo: título, pestañas y grilla. Lo primero que se ve son prendas. */
export function ListaA({ categories, current, items }: ListaProps) {
  const cat = categories.find((c) => c.href === current)!;
  return (
    <main className="@container">
      <div className="px-4 pt-6 @3xl:px-12 @3xl:pt-10">
        <h1 className="stitch-title font-display text-[34px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[52px]">{cat.label}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted @3xl:text-[17px]">{subtitulo(cat.count)}</p>
        <div className="mt-5">
          <CategoryNav categories={categories} current={current} />
        </div>
      </div>
      <div className="px-4 pb-10 pt-5 @3xl:px-12 @3xl:pb-16 @3xl:pt-8">{items.length > 0 ? <Grid items={items} /> : <Vacia label={cat.label} />}</div>
    </main>
  );
}

/** B · Con portada: la foto de la categoría (categories.image_url) arriba, con el título encima. */
export function ListaB({ categories, current, items }: ListaProps) {
  const cat = categories.find((c) => c.href === current)!;
  return (
    <main className="@container">
      <div className="px-4 pt-4 @3xl:px-12 @3xl:pt-8">
        <div className="fabric relative flex h-[220px] flex-col justify-end overflow-hidden rounded-card border border-line bg-surface p-4 @3xl:h-[300px] @3xl:p-10">
          {cat.image && (
            <>
              <img src={cat.image} alt="" className="anim-zoom absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 45%" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-transparent" />
            </>
          )}
          <div className="anim-enter relative">
            <h1 className="font-display text-[36px] font-medium leading-[1.02] tracking-[-0.01em] @3xl:text-[60px]">{cat.label}</h1>
            <p className="mt-2 text-[15px] text-ink/85 @3xl:text-[17px]">{subtitulo(cat.count)}</p>
          </div>
        </div>
        <div className="mt-4">
          <CategoryNav categories={categories} current={current} />
        </div>
      </div>
      <div className="px-4 pb-10 pt-5 @3xl:px-12 @3xl:pb-16 @3xl:pt-8">{items.length > 0 ? <Grid items={items} /> : <Vacia label={cat.label} />}</div>
    </main>
  );
}

/** C · Categorías con foto: las categorías son tarjetas con foto; debajo, la grilla de la elegida. */
export function ListaC({ categories, current, items }: ListaProps) {
  const cat = categories.find((c) => c.href === current)!;
  return (
    <main className="@container">
      <div className="px-4 pt-6 @3xl:px-12 @3xl:pt-10">
        <h1 className="font-display text-[28px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[40px]">Catálogo</h1>
        <div className="mt-4">
          <CategoryTiles categories={categories} current={current} />
        </div>
      </div>
      <div className="px-4 pb-10 pt-7 @3xl:px-12 @3xl:pb-16 @3xl:pt-10">
        <h2 className="stitch-title font-display text-[22px] font-medium leading-tight @3xl:text-[30px]">{cat.label}</h2>
        <p className="mt-3 text-[15px] text-muted">{subtitulo(cat.count)}</p>
        <div className="mt-5">{items.length > 0 ? <Grid items={items} /> : <Vacia label={cat.label} />}</div>
      </div>
    </main>
  );
}

/* ================= Ficha de producto ================= */

// Link de vuelta en gris y no Button ghost: el ghost es dorado y en la ficha el único dorado es el botón de WhatsApp.
function Volver({ cat }: { cat: Producto["category"] }) {
  return (
    <a
      href={cat.href}
      className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {cat.label}
    </a>
  );
}

function Titulo({ p }: { p: Producto }) {
  return (
    <>
      <h1 className="font-display text-[28px] font-medium leading-[1.08] tracking-[-0.01em] @4xl:text-[40px]">{p.name}</h1>
      {p.description && <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted @4xl:text-[17px]">{p.description}</p>}
    </>
  );
}

const PRECIO = "El precio, los colores y si está disponible te los damos por WhatsApp.";

function Cta({ p, note = true }: { p: Producto; note?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="whatsapp" href={whatsappUrl(mensaje(p))} external fullWidth>
        Contactar por WhatsApp
      </Button>
      {note && <p className="text-center text-[13px] leading-snug text-muted @4xl:text-left">Se abre WhatsApp con este producto en el mensaje.</p>}
    </div>
  );
}

function Relacionados({ p, items }: { p: Producto; items: Item[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="relacionados" title={`Más de ${p.category.label}`}>
      <ul className="-mx-4 grid snap-x scroll-px-4 auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] @3xl:mx-0 @3xl:grid-flow-row @3xl:grid-cols-4 @3xl:gap-4 @3xl:overflow-visible @3xl:px-0">
        {items.map((r) => (
          <li key={r.href} className="flex snap-start">
            <ProductCard name={r.name} meta={r.meta} href={r.href} image={r.image} />
          </li>
        ))}
      </ul>
      <div className="mt-2">
        <Button variant="ghost" href={p.category.href}>
          Ver los {p.category.count} de {p.category.label} →
        </Button>
      </div>
    </Section>
  );
}

type FichaProps = { p: Producto; related: Item[]; zoomOpen?: boolean };

/** Dos columnas desde @4xl: galería a la izquierda, datos a la derecha. sticky = la columna de datos acompaña el scroll. */
function Ficha({ p, zoomOpen, info, sticky = false }: { p: Producto; zoomOpen?: boolean; info: ReactNode; sticky?: boolean }) {
  return (
    <div className="px-4 pt-2 @3xl:px-12 @4xl:pt-6">
      <Volver cat={p.category} />
      <div className="mt-2 grid gap-5 @4xl:grid-cols-[560px_minmax(0,1fr)] @4xl:items-start @4xl:gap-14">
        <ProductGallery images={p.images} name={p.name} zoomOpen={zoomOpen} />
        <div className={`flex flex-col gap-5 @4xl:pt-2 ${sticky ? "@4xl:sticky @4xl:top-6" : ""}`}>{info}</div>
      </div>
    </div>
  );
}

/** A · Vitrina: el botón va en el flujo, debajo del nombre. El flotante se queda y lleva el producto en el mensaje. */
export function FichaA({ p, related, zoomOpen }: FichaProps) {
  return (
    <main className="@container pb-4">
      <Ficha
        p={p}
        zoomOpen={zoomOpen}
        info={
          <>
            <div>
              <Titulo p={p} />
            </div>
            <p className="text-[15px] leading-relaxed text-ink">{PRECIO}</p>
            <div className="@4xl:max-w-[360px]">
              <Cta p={p} />
            </div>
          </>
        }
      />
      <Relacionados p={p} items={related} />
    </main>
  );
}

/**
 * B · Barra fija: en el celular el botón vive en una barra pegada abajo, siempre a mano, y reemplaza al flotante
 * en esta página. En desktop la columna de datos acompaña el scroll con el botón.
 */
export function FichaB({ p, related, zoomOpen }: FichaProps) {
  return (
    <main className="@container pb-4">
      <Ficha
        p={p}
        zoomOpen={zoomOpen}
        sticky
        info={
          <>
            <div>
              <Titulo p={p} />
            </div>
            <p className="text-[15px] leading-relaxed text-ink">{PRECIO}</p>
            <div className="hidden @4xl:block @4xl:max-w-[360px]">
              <Cta p={p} />
            </div>
          </>
        }
      />
      <Relacionados p={p} items={related} />
    </main>
  );
}

/** La barra de B. En el sitio: fixed bottom-0, solo debajo de @4xl; Layout.astro recibe hideFab en la ficha. */
export function BarraWhatsApp({ p }: { p: Producto }) {
  return (
    <div className="@container absolute inset-x-0 bottom-0 z-40">
      <div className="border-t border-line bg-primary/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 @4xl:hidden">
        <Cta p={p} note={false} />
      </div>
    </div>
  );
}

const PEDIDO_CSS = `
.pedido [data-msg] { display: none; }
.pedido:has(input[value="tal-cual"]:checked) [data-msg="tal-cual"],
.pedido:has(input[value="logo"]:checked) [data-msg="logo"],
.pedido:has(input[value="grupo"]:checked) [data-msg="grupo"] { display: block; }`;

/**
 * C · A tu gusto: antes del botón, Chip para decir cómo la quiere. El botón cambia el mensaje de WhatsApp con
 * CSS (:has), sin JS. El flotante genérico se queda.
 */
export function FichaC({ p, related, zoomOpen }: FichaProps) {
  const ctas = [
    { value: "tal-cual", text: mensaje(p) },
    { value: "logo", text: mensajeLogo(p) },
    { value: "grupo", text: mensajeGrupo(p) },
  ];
  return (
    <main className="@container pb-4">
      <style>{PEDIDO_CSS}</style>
      <Ficha
        p={p}
        zoomOpen={zoomOpen}
        info={
          <>
            <div>
              <Titulo p={p} />
            </div>
            <div className="pedido flex flex-col gap-4 @4xl:max-w-[420px]">
              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-2.5 text-[15px] font-semibold">¿Cómo lo quieres?</legend>
                <div className="flex flex-wrap gap-2">
                  <Chip name="pedido" value="tal-cual" label="Así como está" selected />
                  <Chip name="pedido" value="logo" label="Con mi logo o nombre" />
                  <Chip name="pedido" value="grupo" label="Varias, para un grupo" />
                </div>
              </fieldset>
              <p className="text-[14px] leading-relaxed text-muted">{PRECIO}</p>
              {ctas.map((c) => (
                <div key={c.value} data-msg={c.value}>
                  <Button variant="whatsapp" href={whatsappUrl(c.text)} external fullWidth>
                    Contactar por WhatsApp
                  </Button>
                </div>
              ))}
            </div>
          </>
        }
      />
      <Relacionados p={p} items={related} />
    </main>
  );
}
