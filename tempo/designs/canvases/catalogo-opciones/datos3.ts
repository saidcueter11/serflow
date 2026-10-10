/// <reference types="vite/client" />
import { Categories, mockProducts } from "../../../../src/mocks/mockProducts";
import { whatsappUrl } from "../../../../src/lib/business";
// Fotos de Unsplash que ya usa la portada (PRI-129), mientras llegan las reales (PRI-150).
import amigosGorras from "../../../../src/assets/images/stock/amigos-gorras.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import camisetasEstampadas from "../../../../src/assets/images/stock/camisetas-estampadas.jpg";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";

/*
 * Datos de la ronda 3 (PRI-130). Solo lo que hay en supabase/01_phase1_schema.sql:
 * categoría (label + image_url), varias fotos por prenda (image_urls), created_at y un número (legacy_id).
 * Nada de nombre, descripción, técnica ni cliente. La única pieza nueva es la frase de la categoría.
 */

export const SITE = "https://serflowctg.netlify.app";
const FILES = import.meta.glob<string>("../../../../src/assets/images/*/*.webp", { eager: true, import: "default" });

/** ratio = ancho / alto de la foto original (la del catálogo es 3:4). */
export type Foto = { src: string; ratio: number };

export type Prenda = {
  n: number;
  cat: string;
  label: string;
  fotos: Foto[];
  /** created_at hace menos de 21 días. */
  nuevo: boolean;
  /** Días desde created_at, para "Hace 3 días". */
  dias: number;
  href: string;
  alt: string;
};

export type Grupo = {
  slug: string;
  label: string;
  /** Frase de la categoría (columna nueva categories.tagline, opcional). Sin frase, se muestra solo el label. */
  frase?: string;
  /** categories.image_url */
  portada?: string;
  href: string;
  count: number;
  prendas: Prenda[];
};

export const DIAS_NUEVO = 21;

const CATALOGO = (p: string) => ({ src: FILES[`../../../../src/assets/images/${p}`], ratio: 3 / 4 });

function prenda(cat: string, label: string, n: number, fotos: Foto[], dias: number): Prenda {
  return {
    n,
    cat,
    label,
    fotos,
    dias,
    nuevo: dias < DIAS_NUEVO,
    href: `/products/${cat}/${cat}-${n}`,
    alt: `${label}, foto N.º ${n}`,
  };
}

/** Prendas del catálogo de hoy; cada cuarta trae 3 fotos (image_urls) para mostrar el carrusel del visor. */
function delCatalogo(key: Categories, cat: string, label: string, extras: Prenda[] = []): Prenda[] {
  const base = mockProducts.filter((m) => m.category === key);
  const propias = base.map((m, i) => {
    const fotos = [CATALOGO(m.imagePath)];
    if (i % 4 === 0) fotos.push(CATALOGO(base[(i + 1) % base.length].imagePath), CATALOGO(base[(i + 2) % base.length].imagePath));
    // Solo la primera de Béisbol es de este mes (la del visor); el resto, de hace meses.
    return prenda(cat, label, m.id, fotos, i === 0 && key === Categories.beisbol ? 4 : 30 + i * 9);
  });
  return [...extras, ...propias];
}

const g = (slug: string, label: string, prendas: Prenda[], frase?: string, portada?: string): Grupo => ({
  slug,
  label,
  frase,
  portada,
  href: `/products/${slug}`,
  count: prendas.length,
  prendas,
});

const S = (src: string, w: number, h: number): Foto => ({ src, ratio: w / h });

export const BEISBOL = g(
  "beisbol",
  "Béisbol",
  delCatalogo(Categories.beisbol, "beisbol", "Béisbol", [prenda("beisbol", "Béisbol", 95, [S(gorraBordada, 1600, 2402)], 2)]),
  "Gorras bordadas para tu equipo o tu liga",
  gorraBordada,
);
export const MTQ = g(
  "mi-tierra-querida",
  "Mi Tierra Querida",
  delCatalogo(Categories.miTierraQuerida, "mi-tierra-querida", "Mi Tierra Querida"),
  "Cartagena y Colombia, bordadas en la gorra",
  FILES["../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp"],
);
export const MODA = g(
  "moda",
  "Moda",
  delCatalogo(Categories.moda, "moda", "Moda", [
    prenda("moda", "Moda", 96, [S(gorraBordada2, 1600, 2400)], 1),
    prenda("moda", "Moda", 97, [S(amigosGorras, 1600, 2386)], 35),
  ]),
  "Para el día a día, con tu estilo",
  amigosGorras,
);
export const NINOS = g(
  "kids",
  "Niños",
  delCatalogo(Categories.kids, "kids", "Niños", [prenda("kids", "Niños", 98, [S(gorrasEstante, 1600, 1067)], 25)]),
  "Para los pelaos de la casa",
  gorrasEstante,
);
export const BASQUET = g(
  "basketball",
  "Básquet",
  delCatalogo(Categories.basketball, "basketball", "Básquet"),
  "Para los que viven en la cancha",
  FILES["../../../../src/assets/images/basket/basket1.webp"],
);
export const CAMISETAS = g(
  "camisetas",
  "Camisetas",
  [
    prenda("camisetas", "Camisetas", 93, [S(camisetasEstampadas, 1600, 2400), S(estampadoProceso, 1600, 1067)], 2),
    prenda("camisetas", "Camisetas", 94, [S(camisetaDtf, 1600, 2000), S(estampadoRasero, 1600, 1060)], 40),
  ],
  "Estampadas con tu logo, para tu negocio o tu evento",
  camisetasEstampadas,
);
/** Categoría recién creada en el admin, todavía sin fotos. */
export const DOTACION = g("dotacion", "Dotación", [], "Uniformes para tu empresa");

export const GRUPOS: Grupo[] = [MODA, BEISBOL, CAMISETAS, MTQ, NINOS, BASQUET, DOTACION];

/**
 * "Todo": las nuevas primero (created_at), luego intercaladas por categoría para que el muro no sea 24 gorras de
 * béisbol seguidas. Al implementar: order by created_at desc y el intercalado en el build (sin JS en el cliente).
 */
export const TODO: Prenda[] = (() => {
  const todas = GRUPOS.flatMap((x) => x.prendas);
  const nuevas = todas.filter((p) => p.nuevo).sort((a, b) => a.dias - b.dias);
  const colas = GRUPOS.map((x) => x.prendas.filter((p) => !p.nuevo));
  const resto: Prenda[] = [];
  for (let i = 0; colas.some((c) => c[i]); i++) colas.forEach((c) => c[i] && resto.push(c[i]));
  return [...nuevas, ...resto];
})();

export const TODO_HREF = "/products";

/** Chips de categoría con conteo (CategoryNav): "Todo" primero. */
export const CHIPS = [
  { label: "Todo", href: TODO_HREF, count: TODO.length },
  ...GRUPOS.map((x) => ({ label: x.label, href: x.href, count: x.count, image: x.portada })),
];

export const BIENVENIDA = {
  titulo: "Así quedan los trabajos",
  texto: "Gorras y camisetas que salieron del taller. Toca la que te guste y te hacemos una igual, o a tu manera.",
};

export const hace = (d: number) => (d === 0 ? "Hoy" : d === 1 ? "Ayer" : d < 30 ? `Hace ${d} días` : d < 60 ? "Hace un mes" : `Hace ${Math.floor(d / 30)} meses`);

/** Mensaje de WhatsApp: categoría + número + link. Pasa por whatsappUrl() (encodeURIComponent). */
export const pedir = (p: Prenda) =>
  whatsappUrl(`¡Hola! Me gustó esta de ${p.label} (N.º ${p.n}). ¿Me hacen una así?\n${SITE}${p.href}`);

export const grupoDe = (p: Prenda) => GRUPOS.find((x) => x.slug === p.cat)!;
/** Las que siguen a la prenda en su categoría, para "Más de X". */
export const mas = (p: Prenda, k: number) => {
  const c = grupoDe(p).prendas;
  const i = c.indexOf(p);
  return [...c.slice(i + 1), ...c.slice(0, i)].slice(0, k);
};
