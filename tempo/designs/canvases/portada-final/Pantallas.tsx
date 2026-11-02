/// <reference types="vite/client" />
import "./portada.css";
import "./pantallas.css";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../src/components/ui/Button";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { CategoryNav, type CategoryLink } from "../../../../src/components/ui/CategoryNav";
import { Masonry, type MasonryTile } from "../../../../src/components/ui/Masonry";
import { PhotoCarousel } from "../../../../src/components/ui/PhotoCarousel";
import { HeroCarousel } from "../../../../src/components/ui/HeroCarousel";
import { PromoCard } from "../../../../src/components/ui/PromoCard";
import { WHATSAPP_URL, whatsappUrl } from "../../../../src/lib/business";
import { promoWhatsapp, validaHasta, type PromoView } from "../../../../src/lib/promos";
import { Cabecera } from "./Portada";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import camisetasEstampadas from "../../../../src/assets/images/stock/camisetas-estampadas.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import kid1 from "../../../../src/assets/images/kids/kid1.webp";
import pz390 from "./capturas/personalizador-390.jpg";
import pz1280 from "./capturas/personalizador-1280.jpg";
import { Marco } from "../refresh-oro-viejo/comun";

/*
 * PRI-286 · el resto de las pantallas con el sistema de la portada (frame "Sistema (de Heirest)" y portada.css).
 * Mismo Marco (Header y Footer de producción con el refresh), mismas clases pf-* y los componentes de producción.
 * Contenido: solo textos de master (o del PR #36) y datos con la forma real de Supabase (2026-11-02).
 */

type W = 390 | 1280;

const fotos = (g: Record<string, string>) => Object.entries(g).sort(([a], [b]) => a.localeCompare(b, "es", { numeric: true })).map(([, src]) => src);
const BEISBOL = fotos(import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" }));
const BASKET = fotos(import.meta.glob<string>("../../../../src/assets/images/basket/*.webp", { eager: true, import: "default" }));

/** Portadas reales de las categorías (categories.image_url). */
const PORTADA = (slug: string, ext = "jpg") => `https://wqaanuipdclpfajaiamv.supabase.co/storage/v1/object/public/category-images/${slug}/hero.${ext}`;

/** Pestañas con los conteos reales de hoy (productos activos con foto). */
const CHIPS: CategoryLink[] = [
  { label: "Todo", href: "/products", count: 92 },
  { label: "Mi Tierra Querida", href: "/products/mi-tierra-querida", count: 26 },
  { label: "Beisbol", href: "/products/beisbol", count: 23 },
  { label: "Basketball", href: "/products/basketball", count: 10 },
  { label: "Moda", href: "/products/moda", count: 23 },
  { label: "Niños", href: "/products/kids", count: 10 },
];

/** Las fotos de una categoría, lo más nuevo primero: N.º alto arriba, como el catálogo real. */
const tiles = (label: string, slug: string, srcs: string[], primero: number): MasonryTile[] =>
  srcs.map((src, i) => ({
    href: `/products/${slug}/${slug}-${primero - i}`,
    img: { src, alt: `${label}, foto N.º ${primero - i}`, ratio: 3 / 4 },
    label,
  }));

const CATEGORIAS = {
  beisbol: { label: "Beisbol", slug: "beisbol", cover: PORTADA("beisbol"), tiles: tiles("Beisbol", "beisbol", BEISBOL, 49) },
  basketball: { label: "Basketball", slug: "basketball", cover: PORTADA("basketball"), tiles: tiles("Basketball", "basketball", BASKET, 59) },
};

/* ---------- 1. Catálogo, categoría ---------- */

/**
 * PROPUESTA: la tarjeta que cierra la última fila del muro. Solo texto y botón, sin foto; ocupa todas las celdas que
 * faltan. Al construir es el último <li> de la lista de Masonry en CatalogPage y su ancho sale de :nth-child (ver
 * pantallas.css); aquí se calcula con el ancho del frame y se agrega con un portal para no tocar src/.
 */
function Cierre({ faltan }: { faltan: number }) {
  return (
    <li className="pf-cierre" style={{ gridColumn: `span ${faltan}` }}>
      <div>
        <h2>¿No ves la que buscas?</h2>
        <p>Igual te lo hacemos por encargo, con tu logo o tu diseño.</p>
        <Button variant="whatsapp" href={WHATSAPP_URL} external>
          <span>
            Escríbenos<span className="pf-cierre-largo"> por WhatsApp</span>
          </span>
        </Button>
      </div>
    </li>
  );
}

function ConCierre({ faltan, children }: { faltan: number; children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [muro, setMuro] = useState<Element | null>(null);
  useLayoutEffect(() => setMuro(caja.current?.querySelector("ul.columns-2") ?? null), []);
  return (
    <div ref={caja}>
      {children}
      {faltan > 0 && muro && createPortal(<Cierre faltan={faltan} />, muro)}
    </div>
  );
}

export function Catalogo({ width, cat }: { width: W; cat: keyof typeof CATEGORIAS }) {
  const c = CATEGORIAS[cat];
  const columnas = width === 1280 ? 4 : 2;
  const faltan = (columnas - (c.tiles.length % columnas)) % columnas;
  return (
    <Marco width={width} nuevo current="/products">
      <div className="pf font-body text-ink">
        <main className="pf-v">
          {/* PROPUESTA: el banner a sangre como el hero; el nombre (h1) y la bajada van en él, en el margen de la rejilla.
              Al construir: CategoryBanner sin borde ni radio y con children para el texto; sin "N productos" (ya está en la pestaña). */}
          <div className="pf-cat-banner">
            <CategoryBanner slides={[{ label: c.label, count: c.tiles.length, image: { src: c.cover } }]} current={0} />
            <div className="pf-cat-texto">
              <h1 className="pf-display">{c.label}</h1>
              <p className="pf-lead">Gorras y camisetas que salieron del taller. Toca la que te guste y te hacemos una igual, o a tu manera.</p>
            </div>
          </div>
          <div className="pf-c pf-cat-chips">
            <CategoryNav categories={CHIPS} current={`/products/${c.slug}`} />
          </div>
          <div className="pf-c pf-cat-muro">
            <ConCierre faltan={faltan}>
              <Masonry tiles={c.tiles} />
            </ConCierre>
          </div>
        </main>
      </div>
    </Marco>
  );
}

/* ---------- 2. Visor de producto ---------- */

/*
 * Hoy ningún producto activo tiene más de una foto (Supabase, 2026-11-02: 0 de 92), así que no hay "Otras vistas":
 * PhotoThumbs no se pinta con una foto. El panel lleva lo que hay en master: la categoría (como etiqueta-link, no como
 * segundo botón), el nombre, Pedir por WhatsApp y su nota. Sin N.º ni "hace", sin Nuevo.
 */
const PRODUCTOS = {
  beisbol: { nombre: "Beisbol #49", cat: CATEGORIAS.beisbol, count: 23 },
  ninos: { nombre: "Niños #91", cat: { label: "Niños", slug: "kids", tiles: tiles("Niños", "kids", fotos(import.meta.glob<string>("../../../../src/assets/images/kids/*.webp", { eager: true, import: "default" })), 91) }, count: 10 },
};

export function Visor({ width, producto }: { width: W; producto: keyof typeof PRODUCTOS }) {
  const desktop = width === 1280;
  const p = PRODUCTOS[producto];
  const [foto, ...resto] = p.cat.tiles;
  // Más de: las que siguen en la categoría, en filas completas del muro (12 / 6 en master; con 9 quedan 8).
  const mas = resto.slice(0, desktop ? Math.min(12, resto.length - (resto.length % 4)) : 6);
  const href = `/products/${p.cat.slug}`;
  const verTodas = (
    <Button variant="secondary" href={href} fullWidth={!desktop}>
      Ver las {p.count} de {p.cat.label} →
    </Button>
  );
  const volver = (
    <a href={`/products#f-${p.cat.slug}`} className="pf-visor-volver">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Todas las fotos
    </a>
  );
  return (
    <Marco width={width} nuevo current="/products" fab={false}>
      <div className="pf font-body text-ink">
        <main className="pf-v">
          <div className="pf-c">{volver}</div>
          <div className="pf-visor">
            <div className="pf-visor-foto">
              <PhotoCarousel photos={[{ src: foto.img.src, alt: foto.img.alt }]} label={`Fotos de ${p.nombre}`} />
            </div>
            <div className="pf-visor-panel">
              <a href={href} className="pf-pie pf-visor-cat">
                {p.cat.label}
              </a>
              <h1 className="pf-display">{p.nombre}</h1>
              <div className="pf-visor-boton">
                <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth={!desktop}>
                  Pedir por WhatsApp
                </Button>
              </div>
              <p className="pf-visor-nota">Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo.</p>
            </div>
          </div>
          <section id="mas-de" aria-labelledby="mas-de-titulo" className="pf-sec pf-c">
            <Cabecera id="mas-de" title={`Más de ${p.cat.label}`} action={desktop ? verTodas : undefined} />
            <Masonry tiles={mas} />
            {!desktop && <div className="pf-mas-accion">{verTodas}</div>}
          </section>
        </main>
      </div>
    </Marco>
  );
}

export const VisorMobile = () => <Visor width={390} producto="beisbol" />;
export const VisorDesktop = () => <Visor width={1280} producto="beisbol" />;
export const VisorUnaFotoMobile = () => <Visor width={390} producto="ninos" />;
export const VisorUnaFotoDesktop = () => <Visor width={1280} producto="ninos" />;

/* ---------- 3. Promos: lista y detalle ---------- */

/*
 * Hoy no hay promos vigentes en Supabase; estas son las de ejemplo del design system de master (BoardPromoCard.tsx):
 * mismos títulos y descripciones, con la forma real de PromoView. Fechas corridas a noviembre para que sigan vigentes
 * y fotos del taller en vez de los dibujos SVG.
 */
const PROMOS: PromoView[] = [
  {
    slug: "2x1-gorras-bordadas",
    title: "2x1 en gorras bordadas",
    description: "Llevas dos gorras con el mismo bordado y pagas una. Aplica para bordados de hasta 10 cm.",
    endsAt: "2026-11-08T23:59:00-05:00",
    cover: { src: gorraBordada, alt: "2x1 en gorras bordadas" },
    photos: [
      { src: gorraBordada2, alt: "2x1 en gorras bordadas, foto 2" },
      { src: gorrasEstante, alt: "2x1 en gorras bordadas, foto 3" },
    ],
  },
  {
    slug: "camisetas-equipos",
    title: "10% en camisetas para equipos de fútbol",
    description: "Desde 10 camisetas con nombre y número. Estampado o DTF, en el color de tu equipo.",
    endsAt: "2026-11-30T23:59:00-05:00",
    cover: { src: camisetasEstampadas, alt: "10% en camisetas para equipos de fútbol" },
    photos: [{ src: camisetaDtf, alt: "10% en camisetas para equipos de fútbol, foto 2" }],
  },
  {
    slug: "gorras-ninos-nombre",
    title: "Gorras para niños con su nombre bordado",
    description: "El nombre va gratis en cualquier gorra infantil de la vitrina.",
    endsAt: null,
    cover: { src: kid1, alt: "Gorras para niños con su nombre bordado" },
    photos: [],
  },
];

/** Una promo de la lista: texto en 5 columnas y foto en 6 desde la 7, como Diseña la tuya de la portada. */
function PromoFila({ promo, desktop }: { promo: PromoView; desktop: boolean }) {
  const hasta = validaHasta(promo.endsAt);
  const total = promo.photos.length + (promo.cover ? 1 : 0);
  const id = `promo-${promo.slug}`;
  return (
    <section aria-labelledby={id} className="pf-promo pf-grid">
      <div className="pf-promo-texto">
        <div>
          {hasta && <p className="pf-pie">{hasta}</p>}
          <h2 id={id} className="pf-h2">
            {promo.title}
          </h2>
          {promo.description && <p className="pf-lead">{promo.description}</p>}
        </div>
        <div className="pf-promo-botones">
          <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth={!desktop}>
            Pedir por WhatsApp<span className="sr-only">: {promo.title}</span>
          </Button>
          <Button variant="secondary" href={`/promos/${promo.slug}`} fullWidth={!desktop}>
            {total > 1 ? `Ver las ${total} fotos →` : "Ver la promo →"}
            <span className="sr-only"> de {promo.title}</span>
          </Button>
        </div>
      </div>
      {promo.cover && (
        <div className="pf-promo-foto">
          <img src={promo.cover.src} alt={promo.cover.alt} width={1200} height={800} loading="lazy" decoding="async" />
        </div>
      )}
    </section>
  );
}

export function Promos({ width }: { width: W }) {
  const desktop = width === 1280;
  const n = PROMOS.length;
  return (
    <Marco width={width} nuevo current="/promos">
      <div className="pf font-body text-ink">
        <main className="pf-v pf-c">
          <div className="pf-pagina-titulo">
            <p className="pf-pie">{n === 1 ? "1 promo activa" : `${n} promos activas`}</p>
            <h1 className="pf-display">Promos de hoy</h1>
            <p className="pf-lead">Precios especiales por poco tiempo. Pide la que te guste por WhatsApp: el mensaje ya lleva el nombre de la promo.</p>
          </div>
          {PROMOS.map((p) => (
            <PromoFila key={p.slug} promo={p} desktop={desktop} />
          ))}
        </main>
      </div>
    </Marco>
  );
}

/** Tarjetas de promo (Otras promos y la 404): PromoCard de producción sin caja, una fila completa con cualquier cantidad. */
function PromoTarjetas({ promos }: { promos: PromoView[] }) {
  return (
    <ul className="pf-promo-tarjetas" style={{ "--n": promos.length } as React.CSSProperties}>
      {promos.map((p) => (
        <li key={p.slug}>
          <PromoCard promo={p} headingLevel={3} />
        </li>
      ))}
    </ul>
  );
}

export function PromoDetalle({ width }: { width: W }) {
  const desktop = width === 1280;
  const promo = PROMOS[0];
  const otras = PROMOS.slice(1);
  const hasta = validaHasta(promo.endsAt);
  const fotos = promo.photos;
  return (
    <Marco width={width} nuevo current="/promos">
      <div className="pf font-body text-ink">
        <main className="pf-v">
          {/* Volver en su fila (como Todas las fotos del visor) y el hero de la portada con la foto de la promo. */}
          <div className="pf-c">
            <a href="/promos" className="pf-visor-volver">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Volver a las promos
            </a>
          </div>
          <HeroCarousel slides={[{ src: promo.cover!.src, alt: promo.cover!.alt, caption: "" }]} className="pf-hero pf-promo-hero">
            <div className="pf-hero-texto">
              {hasta && <span className="pf-pie">{hasta}</span>}
              <h1 className="pf-display">{promo.title}</h1>
              {promo.description && <p className="pf-lead">{promo.description}</p>}
              <div>
                <Button variant="whatsapp" href={promoWhatsapp(promo)} external fullWidth={!desktop}>
                  Pedir esta promo por WhatsApp
                </Button>
              </div>
            </div>
          </HeroCarousel>
          {fotos.length > 0 && (
            <section aria-labelledby="mas-fotos-titulo" className="pf-sec pf-c">
              <Cabecera id="mas-fotos" title="Más fotos" />
              <ul className="pf-mas-fotos" data-n={Math.min(fotos.length, 4)} style={{ "--n": Math.min(fotos.length, 4) } as React.CSSProperties}>
                {fotos.map((f) => (
                  <li key={f.src}>
                    <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {otras.length > 0 && (
            <section aria-labelledby="otras-promos-titulo" className="pf-sec pf-c">
              <Cabecera id="otras-promos" title="Otras promos" />
              <PromoTarjetas promos={otras} />
            </section>
          )}
        </main>
      </div>
    </Marco>
  );
}

/* ---------- 5. 404 ---------- */

/** El texto y las dos salidas de master como cabecera de página; con promos vigentes, Promos de hoy en tarjetas. */
export function NoExiste({ width }: { width: W }) {
  const desktop = width === 1280;
  return (
    <Marco width={width} nuevo>
      <div className="pf font-body text-ink">
        <main className="pf-v pf-c">
          <div className="pf-pagina-titulo">
            <p className="pf-pie">Error 404</p>
            <h1 className="pf-display">Esta página no existe</h1>
            <p className="pf-lead">
              Puede que el link esté viejo o mal copiado. Si venías por una promo, puede que ya haya terminado. Escríbenos y te mandamos lo que buscabas.
            </p>
            <div className="pf-404-botones">
              <Button variant="whatsapp" href={whatsappUrl("¡Hola! Llegué a una página de Serflow que no existe. Estaba buscando...")} external fullWidth={!desktop}>
                Escríbenos por WhatsApp
              </Button>
              <Button variant="secondary" href="/" fullWidth={!desktop}>
                Ir al inicio
              </Button>
            </div>
          </div>
          <section aria-labelledby="promos-de-hoy-titulo" className="pf-sec">
            <Cabecera id="promos-de-hoy" title="Promos de hoy" />
            <PromoTarjetas promos={PROMOS} />
          </section>
        </main>
      </div>
    </Marco>
  );
}

export const NoExisteMobile = () => <NoExiste width={390} />;
export const NoExisteDesktop = () => <NoExiste width={1280} />;

export const PromosMobile = () => <Promos width={390} />;
export const PromosDesktop = () => <Promos width={1280} />;
export const PromoDetalleMobile = () => <PromoDetalle width={390} />;
export const PromoDetalleDesktop = () => <PromoDetalle width={1280} />;

/* ---------- 4. Personalizador (/personaliza, PR #36) ---------- */

/*
 * PersonalizaPage vive en el PR #36 (sin mergear), no en esta rama: el frame es la captura de su deploy preview con
 * refresh + portada.css + pantallas.css (sección 4) encima, hecha con capturar-personalizador.mjs. Todo el texto es el
 * del PR. Desktop: título de página interior; vista previa en 6 columnas con Camiseta / Gorra arriba y el paso 3 con
 * Enviar debajo; pasos 1 y 2 en 5 columnas desde la 8; las dos columnas cierran en el mismo borde.
 */
export function Personalizador({ width }: { width: W }) {
  return (
    <img
      src={width === 1280 ? pz1280 : pz390}
      alt={`Personalizador en ${width} px: Diseña tu prenda, vista previa, pasos y Enviar a Serflow por WhatsApp`}
      width={width}
      style={{ display: "block", width }}
    />
  );
}

export const PersonalizadorMobile = () => <Personalizador width={390} />;
export const PersonalizadorDesktop = () => <Personalizador width={1280} />;

export const CatalogoMobile = () => <Catalogo width={390} cat="beisbol" />;
export const CatalogoDesktop = () => <Catalogo width={1280} cat="beisbol" />;
export const Catalogo10Mobile = () => <Catalogo width={390} cat="basketball" />;
export const Catalogo10Desktop = () => <Catalogo width={1280} cat="basketball" />;
