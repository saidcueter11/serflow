/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { NAV_LINKS } from "../../../../src/components/ui/Header";
import type { CategoryLink } from "./propuestas/CategoryNav";
import type { Photo } from "./propuestas/PhotoGrid";

export const LOGO: string = logo;
export const SITE = "https://serflowctg.netlify.app";

// Fotos del catálogo actual (src/assets/images): gorras sobre fondo gris, sin personas.
const FILES: Record<string, Record<string, string>> = {
  "mi-tierra-querida": import.meta.glob<string>("../../../../src/assets/images/miTierraQuerida/*.webp", { eager: true, import: "default" }),
  beisbol: import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" }),
  basketball: import.meta.glob<string>("../../../../src/assets/images/basket/*.webp", { eager: true, import: "default" }),
  moda: import.meta.glob<string>("../../../../src/assets/images/moda/*.webp", { eager: true, import: "default" }),
  kids: import.meta.glob<string>("../../../../src/assets/images/kids/*.webp", { eager: true, import: "default" }),
};

// El número de la foto sale del archivo (beisbol12.webp -> 12; beisbol.webp -> 1). En el sitio sale del slug
// de hoy (beisbol-26 -> 26) y serflow-admin le da el siguiente a cada foto nueva: no se reutiliza ni se renumera.
const num = (path: string) => Number(path.match(/(\d+)\.webp$/)?.[1] ?? 1);

export type Cat = CategoryLink & { slug: string; photos: Photo[] };

function cat(slug: string, label: string): Cat {
  const href = `/products/${slug}`;
  const photos = Object.entries(FILES[slug])
    .map(([path, src]) => ({ n: num(path), src }))
    .sort((a, b) => a.n - b.n)
    .map(({ n, src }) => photo(slug, label, n, src));
  return { slug, label, href, count: photos.length, photos };
}

const photo = (slug: string, label: string, n: number, src: string): Photo => ({
  n,
  src,
  alt: `${label}, foto N.º ${n}`,
  href: `/products/${slug}/${slug}-${n}`,
});

// Labels como los escribe Said. En la base hoy son "Beisbol" y "Basketball": se cambian en serflow-admin.
export const CATS: Cat[] = [
  cat("mi-tierra-querida", "Mi Tierra Querida"),
  cat("beisbol", "Béisbol"),
  cat("basketball", "Básquet"),
  cat("moda", "Moda"),
  cat("kids", "Niños"),
];
export const [MTQ, BEISBOL, BASKET, MODA, NINOS] = CATS;

// Una categoría que el admin crea antes de subir fotos.
export const CAMISETAS: Cat = { slug: "camisetas", label: "Camisetas", href: "/products/camisetas", count: 0, photos: [] };
export const CATS_CON_VACIA: Cat[] = [...CATS, CAMISETAS];

// Categoría con cientos de fotos: las 23 de Béisbol repetidas hasta 340.
export const BEISBOL_340: Cat = {
  ...BEISBOL,
  count: 340,
  photos: Array.from({ length: 340 }, (_, i) => photo(BEISBOL.slug, BEISBOL.label, i + 1, BEISBOL.photos[i % BEISBOL.photos.length].src)),
};

/** Las fotos que siguen a la actual en su categoría (para "Más de X" en el visor). */
export const vecinas = (c: Cat, i: number, k = 6) => [...c.photos.slice(i + 1), ...c.photos.slice(0, i)].slice(0, k);

/** Header en el catálogo: se suma "Catálogo" al nav (pendiente de Said desde la ronda anterior). */
export const CATALOG_NAV = [{ label: "Catálogo", href: MTQ.href }, ...NAV_LINKS];
export const CATALOG_CURRENT = MTQ.href;

/** Foto que no ha cargado (señal lenta): se ve la trama del marco. */
export const SIN_CARGAR = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * Lo que abre "Pedir esta por WhatsApp". No usa nombre ni descripción: categoría + número + link al visor
 * (WhatsApp arma la vista previa con la foto, og:image). Pasa por whatsappUrl() (encodeURIComponent).
 */
export const pedido = (c: Cat, p: Photo) =>
  `Hola! Me gustó esta foto de ${c.label} (N.º ${p.n}). ¿Me dicen el precio y si me la pueden hacer?\n${SITE}${p.href}`;

/** Una descripción real que el admin escribió (opcional; la frase de relleno de hoy cuenta como vacía). */
export const DESCRIPCION = "Bordado en relieve al frente y a los lados. La hacemos en el color que quieras.";
