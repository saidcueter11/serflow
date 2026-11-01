/// <reference types="vite/client" />
import type { ReactElement } from "react";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { CatalogPage } from "../../../../src/components/catalog/CatalogPage";
import { ViewerPage } from "../../../../src/components/catalog/ViewerPage";
import { PromosPage } from "../../../../src/components/promos/PromosPage";
import { PromoDetailPage } from "../../../../src/components/promos/PromoDetailPage";
import { NotFoundPage } from "../../../../src/components/promos/NotFoundPage";
import type { MasonryTile } from "../../../../src/components/ui/Masonry";
import type { CatalogItem } from "../../../../src/lib/catalog-view";
import { AntesDespues, BANNER, CHIPS, Marco, PROMOS, TILES } from "./comun";
import { PortadaR2 } from "./propuesta/PortadaR2";
import { Disponible, PortadaR3, QueHacemos } from "./propuesta/PortadaR3";
import pzR2390 from "./capturas/r2/personalizador-390.jpg";
import pzR21280 from "./capturas/r2/personalizador-1280.jpg";
import pzR3390 from "./capturas/r3/personalizador-390.jpg";
import pzR31280 from "./capturas/r3/personalizador-1280.jpg";

/* Ronda 3 (espacios). Antes = la ronda 2 tal como Said la comentó. Después = los mismos componentes de producción con
   refresh.css + refresh-r2.css + refresh-r3.css; en la portada, además, propuesta/PortadaR3.tsx. */

type W = 390 | 1280;
type R = { width: W; r3?: boolean };

/** El muro de la ronda 2 tenía 14 fotos; la 3 muestra páginas que cierran la última fila (múltiplo de 2, 3 y 4). */
function Catalogo({ width, r3, tiles, next }: R & { tiles: MasonryTile[]; next: number }) {
  return (
    <Marco width={width} r2={!r3} r3={r3} current="/products">
      <main className="@container">
        <CategoryBanner slides={BANNER} current={0} />
        <CatalogPage chips={CHIPS} current="/products" label="Todo" tiles={tiles} next={{ href: "/products/2", count: next }} />
      </main>
    </Marco>
  );
}

const BEISBOL = Object.values(
  import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" }),
).sort();

const ITEM: CatalogItem = {
  slug: "beisbol-4",
  n: 4,
  createdAt: "2026-10-20",
  hace: "Hace 10 días",
  tile: { href: "/products/beisbol/4", img: { src: BEISBOL[3], alt: "Beisbol, foto N.º 4", ratio: 3 / 4 }, label: "Beisbol", nuevo: true, photos: 3 },
  photos: [3, 4, 5].map((i) => ({ src: BEISBOL[i % BEISBOL.length], alt: `Beisbol, foto N.º 4 (${i - 2} de 3)` })),
  og: null,
};

const MAS: CatalogItem[] = BEISBOL.slice(5, 17).map((src, i) => ({
  ...ITEM,
  slug: `beisbol-${i + 5}`,
  n: i + 5,
  tile: { href: `/products/beisbol/${i + 5}`, img: { src, alt: `Beisbol, foto N.º ${i + 5}`, ratio: 3 / 4 }, label: "Beisbol" },
}));

function Visor({ width, r3 }: R) {
  return (
    <Marco width={width} r2={!r3} r3={r3} current="/products" fab={false}>
      <ViewerPage item={ITEM} category={{ label: "Beisbol", href: "/products/beisbol", count: 24 }} mas={MAS} back="/products#f-beisbol-4" />
    </Marco>
  );
}

function Promos({ width, r3 }: R) {
  return (
    <Marco width={width} r2={!r3} r3={r3} current="/promos">
      <PromosPage promos={PROMOS} />
    </Marco>
  );
}

function PromoDetalle({ width, r3 }: R) {
  return (
    <Marco width={width} r2={!r3} r3={r3} current="/promos">
      <PromoDetailPage promo={PROMOS[0]} otras={PROMOS.slice(1)} />
    </Marco>
  );
}

function NoExiste({ width, r3 }: R) {
  return (
    <Marco width={width} r2={!r3} r3={r3}>
      <NotFoundPage promos={PROMOS} />
    </Marco>
  );
}

function Captura({ src, width }: { src: string; width: number }) {
  return <img src={src} alt="" width={width} className="block h-auto" style={{ width }} />;
}

const NOTA_PORTADA = <>Aire entre secciones de vuelta a 72 / 128 px (la ronda 2 tenía 96 / 176).</>;
const NOTA_CATALOGO = <>Aire de la cabecera de vuelta a la escala de antes.</>;
const NOTA_VISOR = <>Aire de vuelta a la escala de antes.</>;
const NOTA_PROMOS = <>Aire de la cabecera y entre afiches de vuelta a la escala de antes.</>;
const NOTA_DETALLE = <>Afiche y Más fotos un poco más juntos (56 → 40 px).</>;
const NOTA_404 = <>Sin comentarios tuyos; revisado con la misma regla de vacíos.</>;
const NOTA_PERSONALIZADOR = <>/personaliza del PR #36 (sin mergear) desde su deploy preview, con refresh.css + r2 + r3 inyectadas.</>;

const fila = (titulo: string, nota: ReactElement, width: W, Antes: ReactElement, Despues: ReactElement) => (
  <AntesDespues r3 titulo={titulo} nota={nota} width={width} detalleAntes="ronda 2 · la que comentaste" antes={Antes} despues={Despues} />
);

const TILES_R3 = TILES.slice(0, 12);

export const R3PortadaMobile = () => fila("Portada · 390", NOTA_PORTADA, 390, <PortadaR2 width={390} />, <PortadaR3 width={390} />);
export const R3PortadaDesktop = () => fila("Portada · 1280", NOTA_PORTADA, 1280, <PortadaR2 width={1280} />, <PortadaR3 width={1280} />);
export const R3CatalogoMobile = () =>
  fila("Catálogo · categoría · 390", NOTA_CATALOGO, 390, <Catalogo width={390} tiles={TILES} next={78} />, <Catalogo width={390} r3 tiles={TILES_R3} next={80} />);
export const R3CatalogoDesktop = () =>
  fila("Catálogo · categoría · 1280", NOTA_CATALOGO, 1280, <Catalogo width={1280} tiles={TILES} next={78} />, <Catalogo width={1280} r3 tiles={TILES_R3} next={80} />);
export const R3VisorMobile = () => fila("Catálogo · visor · 390", NOTA_VISOR, 390, <Visor width={390} />, <Visor width={390} r3 />);
export const R3VisorDesktop = () => fila("Catálogo · visor · 1280", NOTA_VISOR, 1280, <Visor width={1280} />, <Visor width={1280} r3 />);
export const R3PromosMobile = () => fila("Promos · lista · 390", NOTA_PROMOS, 390, <Promos width={390} />, <Promos width={390} r3 />);
export const R3PromosDesktop = () => fila("Promos · lista · 1280", NOTA_PROMOS, 1280, <Promos width={1280} />, <Promos width={1280} r3 />);
export const R3DetalleMobile = () => fila("Promos · detalle · 390", NOTA_DETALLE, 390, <PromoDetalle width={390} />, <PromoDetalle width={390} r3 />);
export const R3DetalleDesktop = () => fila("Promos · detalle · 1280", NOTA_DETALLE, 1280, <PromoDetalle width={1280} />, <PromoDetalle width={1280} r3 />);
export const R3NoExisteMobile = () => fila("404 · 390", NOTA_404, 390, <NoExiste width={390} />, <NoExiste width={390} r3 />);
export const R3NoExisteDesktop = () => fila("404 · 1280", NOTA_404, 1280, <NoExiste width={1280} />, <NoExiste width={1280} r3 />);
export const R3PersonalizadorMobile = () =>
  fila("Personalizador · 390", NOTA_PERSONALIZADOR, 390, <Captura src={pzR2390} width={390} />, <Captura src={pzR3390} width={390} />);
export const R3PersonalizadorDesktop = () =>
  fila("Personalizador · 1280", NOTA_PERSONALIZADOR, 1280, <Captura src={pzR21280} width={1280} />, <Captura src={pzR31280} width={1280} />);

/** Las dos familias de tarjetas solas, a 1280: mismo JSX, la ronda 3 solo suma refresh-r3.css. */
function Tarjetas({ r3 }: { r3?: boolean }) {
  return (
    <div className={`sf-refresh sf-r2 ${r3 ? "sf-r3" : ""} @container bg-primary font-body text-ink`} style={{ width: 1280 }}>
      <QueHacemos />
      <Disponible />
    </div>
  );
}

const NOTA_TARJETAS = (
  <>
    Las dos con foto 4:5 (Disponible ahora era 4:3 y se veía chata al lado de Qué hacemos). Pie con jerarquía: título 24 y bajada 16 a 34ch en
    Qué hacemos, nombre 18 y detalle 14 en Disponible ahora. La bajada de la sección sube al lado del título (columnas 8-12) y deja de dejar media
    cabecera vacía.
  </>
);
export const R3Tarjetas = () => (
  <AntesDespues r3 titulo="Tarjetas de la portada · 1280" nota={NOTA_TARJETAS} width={1280} detalleAntes="ronda 2 · la que comentaste" antes={<Tarjetas />} despues={<Tarjetas r3 />} />
);
