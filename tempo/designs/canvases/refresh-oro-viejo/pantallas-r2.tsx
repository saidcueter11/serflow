/// <reference types="vite/client" />
import type { ReactElement } from "react";
import { BoardPortada } from "../../design-system/app-shell/BoardPortada";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { CatalogPage } from "../../../../src/components/catalog/CatalogPage";
import { ViewerPage } from "../../../../src/components/catalog/ViewerPage";
import { PromosPage } from "../../../../src/components/promos/PromosPage";
import { PromoDetailPage } from "../../../../src/components/promos/PromoDetailPage";
import type { CatalogItem } from "../../../../src/lib/catalog-view";
import { AntesDespues, BANNER, CHIPS, Marco, PROMOS, TILES } from "./comun";
import { PortadaR2 } from "./propuesta/PortadaR2";
import pzAntes390 from "./capturas/r2/personalizador-antes-390.jpg";
import pzAntes1280 from "./capturas/r2/personalizador-antes-1280.jpg";
import pzR2390 from "./capturas/r2/personalizador-390.jpg";
import pzR21280 from "./capturas/r2/personalizador-1280.jpg";

/* Ronda 2 ("más fuerte"). Antes = master hoy. Después = los mismos componentes de producción con refresh.css +
   refresh-r2.css; en la portada, además, el orden nuevo (propuesta/PortadaR2.tsx). */

type W = 390 | 1280;

function Catalogo({ width, r2 }: { width: W; r2?: boolean }) {
  return (
    <Marco width={width} r2={r2} current="/products">
      <main className="@container">
        {/* Ronda 2: el banner va a sangre (sin el px-4 / px-12 de alrededor). */}
        <div className={r2 ? "" : "px-4 pt-4 @3xl:px-12 @3xl:pt-6"}>
          <CategoryBanner slides={BANNER} current={0} />
        </div>
        <CatalogPage chips={CHIPS} current="/products" label="Todo" tiles={TILES} next={{ href: "/products/2", count: 78 }} />
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

function Visor({ width, r2 }: { width: W; r2?: boolean }) {
  return (
    <Marco width={width} r2={r2} current="/products" fab={false}>
      <ViewerPage item={ITEM} category={{ label: "Beisbol", href: "/products/beisbol", count: 24 }} mas={MAS} back="/products#f-beisbol-4" />
    </Marco>
  );
}

function Promos({ width, r2 }: { width: W; r2?: boolean }) {
  return (
    <Marco width={width} r2={r2} current="/promos">
      <PromosPage promos={PROMOS} />
    </Marco>
  );
}

function PromoDetalle({ width, r2 }: { width: W; r2?: boolean }) {
  return (
    <Marco width={width} r2={r2} current="/promos">
      <PromoDetailPage promo={PROMOS[0]} otras={PROMOS.slice(1)} />
    </Marco>
  );
}

function Captura({ src, width }: { src: string; width: number }) {
  return <img src={src} alt="" width={width} className="block h-auto" style={{ width }} />;
}

const NOTA_PORTADA = (
  <>
    Lo que se nota quieto: el hero ocupa todo el ancho sin marco, el titular pasa a 88 px liviano y su botón deja de ser un segundo WhatsApp (Ver el catálogo; WhatsApp queda en el flotante); el personalizador va justo
    después, como en Heirest (titular, una frase, <b className="text-ink">Diseñar mi prenda</b> y la foto a sangre); las tarjetas
    pierden la caja; el ticker deja de ser dorado; entre secciones hay 50 % más de aire; el mapa queda al final, plegado.
  </>
);
const NOTA_CATALOGO = (
  <>
    El banner va a sangre y más alto (340 / 520 px) con el nombre a 80 px. La pestaña actual pasa de dorada a
    tinta y las demás pierden el borde. El muro no cambia.
  </>
);
const NOTA_VISOR = (
  <>
    La foto crece (columna 1.15 : 1 en desktop) y el nombre de la foto se ve grande (hoy solo lo lee el lector de pantalla).
    Pedir por WhatsApp sigue siendo el único botón dorado, con su nota también en desktop. Sin flotante, como hoy.
  </>
);
const NOTA_PROMOS = (
  <>
    Promos de hoy a 80 px con su bajada. La primera promo va a lo ancho con la foto a sangre; las demás son foto + pie, sin
    caja. La vigencia queda como etiqueta dorada pequeña, sin fondo.
  </>
);
const NOTA_DETALLE = (
  <>
    El afiche va a sangre (sin margen, borde ni radio) y más alto (680 px en desktop). Más fotos y Otras promos sin cajas.
  </>
);
const NOTA_PERSONALIZADOR = (
  <>
    /personaliza del PR #36 (sin mergear) como está hoy en su deploy preview, capturada con el navegador (la vista previa carga de
    verdad); el después es la misma página con refresh.css + refresh-r2.css inyectadas. h1 a 80 px con aire debajo, pasos a 24 px,
    vista previa sin borde, opciones elegidas en tinta, el ícono de subir sin relleno dorado y más aire entre pasos. El único
    dorado grande es el botón de envío.
  </>
);

const fila = (titulo: string, nota: ReactElement, width: W, Antes: ReactElement, Despues: ReactElement) => (
  <AntesDespues r2 titulo={titulo} nota={nota} width={width} antes={Antes} despues={Despues} />
);

export const R2PortadaMobile = () => fila("Portada · 390", NOTA_PORTADA, 390, <BoardPortada width={390} />, <PortadaR2 width={390} />);
export const R2PortadaDesktop = () => fila("Portada · 1280", NOTA_PORTADA, 1280, <BoardPortada width={1280} />, <PortadaR2 width={1280} />);
export const R2CatalogoMobile = () => fila("Catálogo · categoría · 390", NOTA_CATALOGO, 390, <Catalogo width={390} />, <Catalogo width={390} r2 />);
export const R2CatalogoDesktop = () => fila("Catálogo · categoría · 1280", NOTA_CATALOGO, 1280, <Catalogo width={1280} />, <Catalogo width={1280} r2 />);
export const R2VisorMobile = () => fila("Catálogo · visor · 390", NOTA_VISOR, 390, <Visor width={390} />, <Visor width={390} r2 />);
export const R2VisorDesktop = () => fila("Catálogo · visor · 1280", NOTA_VISOR, 1280, <Visor width={1280} />, <Visor width={1280} r2 />);
export const R2PromosMobile = () => fila("Promos · lista · 390", NOTA_PROMOS, 390, <Promos width={390} />, <Promos width={390} r2 />);
export const R2PromosDesktop = () => fila("Promos · lista · 1280", NOTA_PROMOS, 1280, <Promos width={1280} />, <Promos width={1280} r2 />);
export const R2DetalleMobile = () => fila("Promos · detalle · 390", NOTA_DETALLE, 390, <PromoDetalle width={390} />, <PromoDetalle width={390} r2 />);
export const R2DetalleDesktop = () => fila("Promos · detalle · 1280", NOTA_DETALLE, 1280, <PromoDetalle width={1280} />, <PromoDetalle width={1280} r2 />);
export const R2PersonalizadorMobile = () => (
  <AntesDespues r2 titulo="Personalizador · 390" nota={NOTA_PERSONALIZADOR} width={390} detalleAntes="PR #36" antes={<Captura src={pzAntes390} width={390} />} despues={<Captura src={pzR2390} width={390} />} />
);
export const R2PersonalizadorDesktop = () => (
  <AntesDespues r2 titulo="Personalizador · 1280" nota={NOTA_PERSONALIZADOR} width={1280} detalleAntes="PR #36" antes={<Captura src={pzAntes1280} width={1280} />} despues={<Captura src={pzR21280} width={1280} />} />
);
