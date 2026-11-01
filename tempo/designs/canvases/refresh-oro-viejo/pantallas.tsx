/// <reference types="vite/client" />
import { useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../src/components/ui/Button";
import { BoardPortada } from "../../design-system/app-shell/BoardPortada";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { CatalogPage } from "../../../../src/components/catalog/CatalogPage";
import { ViewerPage } from "../../../../src/components/catalog/ViewerPage";
import { PromosPage } from "../../../../src/components/promos/PromosPage";
import { PromoDetailPage } from "../../../../src/components/promos/PromoDetailPage";
import { NotFoundPage } from "../../../../src/components/promos/NotFoundPage";
import { Masonry, type MasonryTile } from "../../../../src/components/ui/Masonry";
import type { CatalogItem } from "../../../../src/lib/catalog-view";
import { AntesDespues, BANNER, CHIPS, FOTOS, Marco, NUEVO, PROMOS, TILES } from "./comun";
import { Portada } from "./propuesta/Portada";
import { ConCierre } from "./propuesta/CierreMuro";
import pzAntes390 from "./capturas/personalizador-antes-390.jpg";
import pzAntes1280 from "./capturas/personalizador-antes-1280.jpg";
import pz390 from "./capturas/personalizador-390.jpg";
import pz1280 from "./capturas/personalizador-1280.jpg";
import b13Bordado from "./capturas/beisbol13-bordado.jpg";
import b13Costado from "./capturas/beisbol13-costado.jpg";
import { ConPasos } from "./propuesta/PasosPedido";

/* Pantallas. Antes = producción hoy (master; el personalizador, el PR #36 tal cual). Después = los mismos componentes de
   producción con refresh.css + refresh-r2.css + refresh-r3.css; en la portada, además, propuesta/Portada.tsx. */

type W = 390 | 1280;
type R = { width: W; nuevo?: boolean };

function Catalogo({ width, nuevo, tiles, next, basket }: R & { tiles: MasonryTile[]; next?: number; basket?: boolean }) {
  return (
    <Marco width={width} nuevo={nuevo} current="/products">
      <main className="@container">
        <CategoryBanner slides={basket ? [{ label: "Basket", count: 10, image: { src: FOTOS.gorrasEstante } }] : BANNER} current={0} />
        <ConCierre>
          <CatalogPage
            chips={CHIPS}
            current={basket ? "/products/basket" : "/products"}
            label={basket ? "Basket" : "Todo"}
            tiles={tiles}
            next={next ? { href: "/products/2", count: next } : undefined}
          />
        </ConCierre>
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
  // Otras vistas de la MISMA gorra (ronda 5). Las dos de cerca son recortes de la foto de frente hasta que lleguen fotos de varios ángulos.
  photos: [
    { src: BEISBOL[3], alt: "Beisbol N.º 4, de frente" },
    { src: b13Bordado, alt: "Beisbol N.º 4, el bordado de cerca" },
    { src: b13Costado, alt: "Beisbol N.º 4, el parche y la visera" },
  ],
  og: null,
};

/** El mismo producto con una sola foto: sin otras vistas. */
const ITEM_1: CatalogItem = { ...ITEM, tile: { ...ITEM.tile, photos: 1 }, photos: ITEM.photos.slice(0, 1) };

const MAS: CatalogItem[] = BEISBOL.slice(5, 17).map((src, i) => ({
  ...ITEM,
  slug: `beisbol-${i + 5}`,
  n: i + 5,
  tile: { href: `/products/beisbol/${i + 5}`, img: { src, alt: `Beisbol, foto N.º ${i + 5}`, ratio: 3 / 4 }, label: "Beisbol" },
}));

function Visor({ width, nuevo, unaFoto }: R & { unaFoto?: boolean }) {
  const pagina = (
    <ViewerPage item={unaFoto ? ITEM_1 : ITEM} category={{ label: "Beisbol", href: "/products/beisbol", count: 24 }} mas={MAS} back="/products#f-beisbol-4" />
  );
  return (
    <Marco width={width} nuevo={nuevo} current="/products" fab={false}>
      {nuevo ? (
        <ConCabecera seccion="mas" bajada="Otras de esta categoría. Te hacemos cualquiera igual o con tu logo.">
          {unaFoto ? <ConPasos>{pagina}</ConPasos> : pagina}
        </ConCabecera>
      ) : (
        pagina
      )}
    </Marco>
  );
}

function Promos({ width, nuevo }: R) {
  return (
    <Marco width={width} nuevo={nuevo} current="/promos">
      <PromosPage promos={PROMOS} />
    </Marco>
  );
}

function PromoDetalle({ width, nuevo }: R) {
  return (
    <Marco width={width} nuevo={nuevo} current="/promos">
      <PromoDetailPage promo={PROMOS[0]} otras={PROMOS.slice(1)} />
    </Marco>
  );
}

/** PROPUESTA (ronda 5): cabecera completa para las Section que hoy solo traen título. En el PR son las props description y
 *  action de Section; aquí la bajada se inserta después del h2 y la acción con un portal, para no tocar src/. El CSS
 *  (refresh-r3.css, "Cabeceras en una fila") arma la fila título | bajada | acción en desktop. */
function ConCabecera({ seccion, bajada, accion, children }: { seccion: string; bajada: string; accion?: { label: string; href: string }; children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [destino, setDestino] = useState<Element | null>(null);
  useLayoutEffect(() => {
    const h2 = caja.current?.querySelector(`#${seccion} h2.stitch-title`);
    if (!h2) return;
    const p = document.createElement("p");
    p.className = "mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted @3xl:text-[17px]";
    p.textContent = bajada;
    h2.after(p);
    setDestino(caja.current?.querySelector(`#${seccion} div.mt-5`) ?? null);
    return () => p.remove();
  }, [seccion, bajada]);
  return (
    <div ref={caja}>
      {children}
      {accion &&
        destino &&
        createPortal(
          <div className="mt-6">
            <Button variant="ghost" href={accion.href}>
              {accion.label}
            </Button>
          </div>,
          destino,
        )}
    </div>
  );
}

function NoExiste({ width, nuevo }: R) {
  const pagina = <NotFoundPage promos={PROMOS} />;
  return (
    <Marco width={width} nuevo={nuevo}>
      {nuevo ? (
        <ConCabecera seccion="promos-de-hoy" bajada="Lo que está a buen precio en el taller esta semana." accion={{ label: "Ver todas las promos →", href: "/promos" }}>
          {pagina}
        </ConCabecera>
      ) : (
        pagina
      )}
    </Marco>
  );
}

function Captura({ src, width }: { src: string; width: number }) {
  return <img src={src} alt="" width={width} className="block h-auto" style={{ width }} />;
}

const NOTA_PORTADA = (
  <>
    Sin el ticker. El personalizador va en un bloque de dos columnas (texto y pasos | foto). Tarjetas 4:5. Cada cabecera es una fila a
    todo el ancho: título | bajada cosida con un filete | acción (Ver todo el catálogo sube al final de la fila). Quiénes somos en 12
    columnas con el mapa desde el título hasta las razones. Ver el catálogo y Diseñar mi prenda en oro viejo.
  </>
);
const NOTA_CATALOGO = <>Rejilla pareja 4:5; la página cierra la última fila (12 aquí; 60 en producción). Chip elegido en oro viejo, chips de 48 / 52 px.</>;
const NOTA_CIERRE = (
  <>
    Una categoría real de 10 fotos: a 4 columnas faltan 2 celdas. Las cierra la tarjeta &quot;¿No ves la que buscas?&quot;: una celda de texto con
    Escríbenos en oro viejo y una foto del taller en la otra. Los otros casos, en el frame de al lado.
  </>
);
const NOTA_VISOR = (
  <>
    Sin la línea N.º y hace, y sin Nuevo. Las miniaturas son Otras vistas de la misma gorra (de frente, el bordado, el parche y la visera;
    recortes de la foto de frente hasta que haya fotos de varios ángulos). Desktop: 5 columnas compartidas con Más de, foto 4:5 en 2 y panel
    en 3, mismo borde arriba y abajo. Más de: 10 fotos; cabecera con bajada y Ver las 24 de Beisbol.
  </>
);
const NOTA_VISOR_1 = (
  <>
    El mismo producto con una sola foto. Sin miniaturas, el panel no queda corto: donde iban, Así la pides (3 pasos con filetes, como Quiénes
    somos) reparte su alto hasta el borde de abajo de la foto. Dirección y horario salen de business.ts. En el celular, debajo del botón.
  </>
);
const NOTA_PROMOS = (
  <>
    La cabecera es una fila a todo el ancho: Promos de hoy y, pegada a él tras un filete, la bajada en tres líneas hasta el borde (~40 % menos
    alto, sin hueco a la derecha). Cada afiche termina con su texto; Pedir por WhatsApp en oro y Ver las fotos con borde, en fila.
  </>
);
const NOTA_DETALLE = <>Afiche y Más fotos un poco más juntos (56 → 40 px).</>;
const NOTA_404 = (
  <>
    En desktop: texto y botones en 7 columnas, foto del taller en 5, mismo alto. Promos de hoy lleva bajada y Ver todas las promos en su
    cabecera (no queda un título solo con la fila vacía).
  </>
);
const NOTA_PERSONALIZADOR = (
  <>
    /personaliza del PR #36 (sin mergear) desde su deploy preview, con el refresh inyectado. Cabecera en una fila: Diseña tu prenda | la
    bajada. En desktop las dos columnas empiezan y terminan en el mismo borde; la vista previa sigue 4:5. Elegidos en oro viejo.
  </>
);

const fila = (titulo: string, nota: ReactElement, width: W, Antes: ReactElement, Despues: ReactElement) => (
  <AntesDespues titulo={titulo} nota={nota} width={width} antes={Antes} despues={Despues} />
);

const TILES_12 = TILES.slice(0, 12);
const TILES_10 = TILES.slice(0, 10).map((t) => ({ ...t, label: "Basket", img: { ...t.img, alt: t.img.alt.replace(/^[^,]+/, "Basket") } }));

export const PortadaMobile = () => fila("Portada · 390", NOTA_PORTADA, 390, <BoardPortada width={390} />, <Portada width={390} />);
export const PortadaDesktop = () => fila("Portada · 1280", NOTA_PORTADA, 1280, <BoardPortada width={1280} />, <Portada width={1280} />);
export const CatalogoMobile = () =>
  fila("Catálogo · categoría · 390", NOTA_CATALOGO, 390, <Catalogo width={390} tiles={TILES} next={78} />, <Catalogo width={390} nuevo tiles={TILES_12} next={80} />);
export const CatalogoDesktop = () =>
  fila("Catálogo · categoría · 1280", NOTA_CATALOGO, 1280, <Catalogo width={1280} tiles={TILES} next={78} />, <Catalogo width={1280} nuevo tiles={TILES_12} next={80} />);
export const CatalogoCierre = () =>
  fila("Catálogo · categoría de 10 fotos · 1280", NOTA_CIERRE, 1280, <Catalogo width={1280} tiles={TILES_10} basket />, <Catalogo width={1280} nuevo tiles={TILES_10} basket />);
export const VisorMobile = () => fila("Catálogo · visor · 390", NOTA_VISOR, 390, <Visor width={390} />, <Visor width={390} nuevo />);
export const VisorDesktop = () => fila("Catálogo · visor · 1280", NOTA_VISOR, 1280, <Visor width={1280} />, <Visor width={1280} nuevo />);
export const VisorUnaFotoMobile = () =>
  fila("Catálogo · visor · sin variantes · 390", NOTA_VISOR_1, 390, <Visor width={390} unaFoto />, <Visor width={390} nuevo unaFoto />);
export const VisorUnaFotoDesktop = () =>
  fila("Catálogo · visor · sin variantes · 1280", NOTA_VISOR_1, 1280, <Visor width={1280} unaFoto />, <Visor width={1280} nuevo unaFoto />);
export const PromosMobile = () => fila("Promos · lista · 390", NOTA_PROMOS, 390, <Promos width={390} />, <Promos width={390} nuevo />);
export const PromosDesktop = () => fila("Promos · lista · 1280", NOTA_PROMOS, 1280, <Promos width={1280} />, <Promos width={1280} nuevo />);
export const DetalleMobile = () => fila("Promos · detalle · 390", NOTA_DETALLE, 390, <PromoDetalle width={390} />, <PromoDetalle width={390} nuevo />);
export const DetalleDesktop = () => fila("Promos · detalle · 1280", NOTA_DETALLE, 1280, <PromoDetalle width={1280} />, <PromoDetalle width={1280} nuevo />);
export const NoExisteMobile = () => fila("404 · 390", NOTA_404, 390, <NoExiste width={390} />, <NoExiste width={390} nuevo />);
export const NoExisteDesktop = () => fila("404 · 1280", NOTA_404, 1280, <NoExiste width={1280} />, <NoExiste width={1280} nuevo />);
export const PersonalizadorMobile = () =>
  fila("Personalizador · 390", NOTA_PERSONALIZADOR, 390, <Captura src={pzAntes390} width={390} />, <Captura src={pz390} width={390} />);
export const PersonalizadorDesktop = () =>
  fila("Personalizador · 1280", NOTA_PERSONALIZADOR, 1280, <Captura src={pzAntes1280} width={1280} />, <Captura src={pz1280} width={1280} />);

/* ---------- La tarjeta de cierre en los tres anchos (Said: "que sea responsiva y se adapte bien") ---------- */

/** Solo el muro, con el padding real de CatalogPage, para ver la última fila con 1, 2 y 3 celdas libres. */
function Muro({ width, fotos }: { width: number; fotos: number }) {
  const columnas = width < 700 ? 2 : width < 1100 ? 3 : 4;
  const faltan = (columnas - (fotos % columnas)) % columnas;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14px] text-muted">
        <b className="text-ink">{width} px</b> · {columnas} columnas · {fotos} fotos · {faltan === 1 ? "falta 1 celda" : `faltan ${faltan} celdas`}
      </p>
      <div className={`${NUEVO} @container overflow-hidden rounded-tile bg-primary font-body text-ink ring-1 ring-line`} style={{ width }}>
        <div className="px-4 py-6 @3xl:px-12 @3xl:py-8">
          <ConCierre>
            <Masonry tiles={TILES_10.slice(0, fotos)} />
          </ConCierre>
        </div>
      </div>
    </div>
  );
}

export const CierreResponsivo = () => (
  <div className="bg-primary-light p-10 font-body text-ink" style={{ width: 390 + 768 + 1280 + 2 * 80 + 80 }}>
    <div className="max-w-[900px] pb-8">
      <h2 className="text-[28px] font-bold leading-tight">Tarjeta de cierre · 390, 768 y 1280</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        Siempre una celda de texto del tamaño de una foto (nunca más chica ni más ancha) con Escríbenos en oro viejo. Si faltan 2 o 3
        celdas, una foto del taller ocupa las demás. Con la fila completa no aparece.
      </p>
    </div>
    <div className="flex items-start gap-20">
      <div className="flex flex-col gap-10">
        <Muro width={390} fotos={3} />
      </div>
      <div className="flex flex-col gap-10">
        <Muro width={768} fotos={5} />
        <Muro width={768} fotos={4} />
      </div>
      <div className="flex flex-col gap-10">
        <Muro width={1280} fotos={7} />
        <Muro width={1280} fotos={6} />
        <Muro width={1280} fotos={5} />
      </div>
    </div>
  </div>
);
