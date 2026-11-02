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
import { Cabecera } from "./Portada";
import { WHATSAPP_URL } from "../../../../src/lib/business";
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

export const CatalogoMobile =() => <Catalogo width={390} cat="beisbol" />;
export const CatalogoDesktop = () => <Catalogo width={1280} cat="beisbol" />;
export const Catalogo10Mobile = () => <Catalogo width={390} cat="basketball" />;
export const Catalogo10Desktop = () => <Catalogo width={1280} cat="basketball" />;
