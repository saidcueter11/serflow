import { useEffect, useRef, type ReactNode } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { Button } from "../../../../src/components/ui/Button";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Section } from "../../../../src/components/ui/Section";
import { CategoryNav } from "./propuestas/CategoryNav";
import { PhotoGrid, PhotoShelf, type Photo } from "./propuestas/PhotoGrid";
import { PhotoViewer } from "./propuestas/PhotoViewer";
import { CATALOG_CURRENT, CATALOG_NAV, LOGO, PRIMERA, fotos, pedido, vecinas, type Cat } from "./data";

/*
 * Páginas del catálogo para el canvas catalogo-opciones (PRI-130). Lo que es UI sale de src/components/ui o de
 * ./propuestas; aquí solo queda la composición de cada opción. Al implementar, la opción elegida pasa a
 * src/components/catalog/ (React estático, como home/HomePage.tsx) y las páginas .astro solo buscan datos.
 * Container queries (@3xl = 768 px, @4xl = 896 px) y no md:, así el canvas se ve igual que el sitio.
 */

export type Viewport = "mobile" | "desktop";
const SIZE = { mobile: { width: 390, fold: 844 }, desktop: { width: 1280, fold: 800 } };

/**
 * Marco de Layout.astro: Header + contenido + Footer + WhatsAppFab. fold = cortar en el pliegue (lo que se ve sin
 * scroll); sin fold, la página completa. fab false = la página no lleva el flotante (el visor tiene su botón).
 * translateZ(0): lo que es fixed en el sitio (la capa de B) queda dentro del marco.
 * Solo canvas: las fotos lazy pasan a eager, porque la captura no hace scroll y las dejaría sin cargar.
 */
export function Pantalla({ viewport, fold = false, fab = true, header = true, children }: {
  viewport: Viewport;
  fold?: boolean;
  fab?: boolean;
  header?: boolean;
  children: ReactNode;
}) {
  const s = SIZE[viewport];
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach((img) => (img.loading = "eager")), []);
  return (
    <div ref={ref} className="relative overflow-hidden bg-primary font-body text-ink antialiased [transform:translateZ(0)]" style={{ width: s.width, height: fold ? s.fold : undefined }}>
      {header && <Header logoSrc={LOGO} links={CATALOG_NAV} current={CATALOG_CURRENT} />}
      {children}
      {!fold && <Footer logoSrc={LOGO} />}
      {fab && (
        <div className="absolute bottom-5 right-4 z-30">
          <WhatsAppFab placement="inline" />
        </div>
      )}
    </div>
  );
}

/* ================= Galería de una categoría (A y B) ================= */

function Vacia({ c }: { c: Cat }) {
  return (
    <div className="px-4 @3xl:px-12">
      <EmptyState
        title={`Todavía no hay fotos de ${c.label}`}
        description="Igual lo hacemos por encargo, con tu diseño o tu logo. Escríbenos por WhatsApp (el botón dorado de abajo) y te mostramos ejemplos."
        action={{ label: `Mira ${PRIMERA.label}`, href: PRIMERA.href }}
      />
    </div>
  );
}

const subtitulo = (c: Cat) => `${fotos(c.count)} de lo que hacemos. Toca la que te guste y pídela por WhatsApp.`;

/**
 * Link viejo a una foto que se borró (de un chat o de Google): una regla de Netlify manda /products/<cat>/<lo-que-sea>
 * que no exista a /products/<cat>#quitada, y este aviso se muestra con :target. Sin JS. Toca netlify.toml (Seguridad).
 */
function Quitada({ c }: { c: Cat }) {
  return (
    <p id="quitada" role="status" className="mx-4 mb-4 rounded-tile border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed @3xl:mx-0">
      Esa foto ya no está en el catálogo. Estas son las de {c.label} que hay ahora.
    </p>
  );
}

type GaleriaProps = { c: Cat; cats: Cat[]; photos?: Photo[]; more?: Parameters<typeof PhotoGrid>[0]["more"]; quitada?: boolean };

function Galeria({ c, cats, photos = c.photos, more, quitada, size }: GaleriaProps & { size: "dense" | "comfy" }) {
  return (
    <main className="@container">
      <div className="px-4 pt-6 @3xl:px-12 @3xl:pt-10">
        <h1 className="stitch-title font-display text-[34px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[52px]">{c.label}</h1>
        {c.count > 0 && <p className="mt-3 text-[15px] leading-relaxed text-muted @3xl:text-[17px]">{subtitulo(c)}</p>}
        <div className="mt-5">
          <CategoryNav categories={cats} current={c.href} />
        </div>
      </div>
      <div className={`pb-12 pt-5 @3xl:px-12 @3xl:pb-16 @3xl:pt-8 ${size === "comfy" ? "px-4" : ""}`}>
        {quitada && <Quitada c={c} />}
        {photos.length > 0 ? <PhotoGrid photos={photos} size={size} more={more} /> : <Vacia c={c} />}
      </div>
    </main>
  );
}

/** A · Muro: 3 columnas pegadas (6 en desktop). Se recorren muchas fotos rápido; el detalle está en el visor. */
export const GaleriaA = (p: GaleriaProps) => <Galeria {...p} size="dense" />;

/** B · Fotos grandes: 2 columnas con aire (4 en desktop). La capa del visor se abre encima. */
export const GaleriaB = (p: GaleriaProps) => <Galeria {...p} size="comfy" />;

/** El cierre de un bloque de 60 en una categoría con cientos (vista recortada: lo de arriba son las fotos 1 a 51). */
export function FinDeBloque({ photos, more }: { photos: Photo[]; more: NonNullable<GaleriaProps["more"]> }) {
  return (
    <main className="@container pb-12 pt-1">
      <p className="px-4 pb-3 text-center text-[12px] uppercase tracking-[.14em] text-muted">… fotos 1 a {photos[0].n - 1} arriba</p>
      <PhotoGrid photos={photos} more={more} />
    </main>
  );
}

/* ================= Visor (A y C: página propia) ================= */

/** Galería a la que vuelve: la página del bloque de 60 donde está la foto (la 61 está en /p/2), anclada en ella. */
const galeria = (c: Cat, i: number) => (i < 60 ? c.href : `${c.href}/p/${Math.floor(i / 60) + 1}`);

export function VisorPagina({ c, i, description, loading }: { c: Cat; i: number; description?: string; loading?: boolean }) {
  const p = c.photos[i];
  const mas = vecinas(c, i);
  return (
    <main className="@container pb-4 pt-1">
      <PhotoViewer
        photo={p}
        category={{ label: c.label, href: galeria(c, i) }}
        prevHref={c.photos[i - 1]?.href}
        nextHref={c.photos[i + 1]?.href}
        waText={pedido(c, p)}
        description={description}
        loading={loading}
      />
      {mas.length > 0 && (
        <Section id="mas" title={`Más de ${c.label}`}>
          <div className="-mx-4 @3xl:mx-0">
            <PhotoGrid photos={mas} eager={0} />
          </div>
          <div className="mt-3">
            <Button variant="ghost" href={`${galeria(c, i)}#f-${p.n}`}>
              Ver las {c.count} de {c.label} →
            </Button>
          </div>
        </Section>
      )}
    </main>
  );
}

/* ================= B: capa encima de la galería ================= */

export function CapaB({ c, cats, i }: { c: Cat; cats: Cat[]; i: number }) {
  const p = c.photos[i];
  return (
    <>
      <GaleriaB c={c} cats={cats} />
      <PhotoViewer variant="layer" photo={p} category={c} prevHref={c.photos[i - 1]?.href} nextHref={c.photos[i + 1]?.href} waText={pedido(c, p)} />
    </>
  );
}

/* ================= C: estantes por categoría ================= */

/** C · Estantes: /products muestra todas las categorías, una fila de fotos cada una. "Ver las N" lleva a la galería de A. */
export function EstantesC({ cats }: { cats: Cat[] }) {
  return (
    <main className="@container">
      <div className="px-4 pt-6 @3xl:px-12 @3xl:pt-10">
        <h1 className="stitch-title font-display text-[34px] font-medium leading-[1.05] tracking-[-0.01em] @3xl:text-[52px]">Catálogo</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted @3xl:text-[17px]">
          Fotos de lo que hacemos, por categoría. Toca la que te guste y pídela por WhatsApp.
        </p>
      </div>
      <div className="flex flex-col gap-8 px-4 pb-12 pt-7 @3xl:gap-12 @3xl:px-12 @3xl:pb-16 @3xl:pt-10">
        {cats.filter((c) => c.count > 0).map((c) => (
          <PhotoShelf key={c.href} label={c.label} href={c.href} count={c.count} photos={c.photos.slice(0, 6)} />
        ))}
      </div>
    </main>
  );
}
