/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { NAV_LINKS } from "../../../../src/components/ui/Header";
import type { CategoryLink } from "./propuestas/CategoryNav";
import type { Photo } from "./propuestas/PhotoGrid";
import { Categories, mockProducts } from "../../../../src/mocks/mockProducts";

export const LOGO: string = logo;
export const SITE = "https://serflowctg.netlify.app";

// Fotos del catálogo actual (src/assets/images): gorras sobre fondo gris, sin personas.
const FILES = import.meta.glob<string>("../../../../src/assets/images/*/*.webp", { eager: true, import: "default" });

// El número de cada foto es el de hoy en producción: legacy_id, que el seed tomó de src/mocks/mockProducts.ts y que
// también está en el slug (beisbol-26). Es único en todo el catálogo (Béisbol va del 26 al 49, Niños del 82 al 91).
export type Cat = CategoryLink & { slug: string; photos: Photo[] };

function cat(key: Categories, slug: string, label: string): Cat {
  const href = `/products/${slug}`;
  const photos = mockProducts
    .filter((m) => m.category === key)
    .map((m) => photo(slug, label, m.id, FILES[`../../../../src/assets/images/${m.imagePath}`]));
  return { slug, label, href, count: photos.length, photos };
}

const photo = (slug: string, label: string, n: number, src: string): Photo => ({
  n,
  src,
  thumb: src,
  alt: `${label}, foto N.º ${n}`,
  href: `/products/${slug}/${slug}-${n}`,
});

// Labels como los escribe Said. En la base hoy son "Beisbol" y "Basketball": se cambian en serflow-admin.
export const CATS: Cat[] = [
  cat(Categories.miTierraQuerida, "mi-tierra-querida", "Mi Tierra Querida"),
  cat(Categories.beisbol, "beisbol", "Béisbol"),
  cat(Categories.basketball, "basketball", "Básquet"),
  cat(Categories.moda, "moda", "Moda"),
  cat(Categories.kids, "kids", "Niños"),
];
export const [MTQ, BEISBOL, BASKET, MODA, NINOS] = CATS;

// Una categoría que el admin crea antes de subir fotos.
export const CAMISETAS: Cat = { slug: "camisetas", label: "Camisetas", href: "/products/camisetas", count: 0, photos: [] };
export const CATS_CON_VACIA: Cat[] = [...CATS, CAMISETAS];

// Categoría con cientos de fotos: las de Béisbol repetidas hasta 340, numeradas desde el 26.
export const BEISBOL_340: Cat = {
  ...BEISBOL,
  count: 340,
  photos: Array.from({ length: 340 }, (_, i) => photo(BEISBOL.slug, BEISBOL.label, 26 + i, BEISBOL.photos[i % BEISBOL.photos.length].src)),
};

// Una categoría con una sola foto (recién creada en el admin).
export const UNA_FOTO: Cat = {
  slug: "personalizadas",
  label: "Personalizadas",
  href: "/products/personalizadas",
  count: 1,
  photos: [photo("personalizadas", "Personalizadas", 92, MODA.photos[1].src)],
};

// Bordes: la primera categoría con fotos (destino de "Catálogo" y de la galería vacía) y el plural.
export const PRIMERA = CATS.find((c) => c.count > 0)!;
export const fotos = (n: number) => `${n} ${n === 1 ? "foto" : "fotos"}`;

/** Las fotos que siguen a la actual en su categoría (para "Más de X" en el visor). */
export const vecinas = (c: Cat, i: number, k = 6) => [...c.photos.slice(i + 1), ...c.photos.slice(0, i)].slice(0, k);

/** Header en el catálogo: se suma "Catálogo" al nav (pendiente de Said desde la ronda anterior), a la primera categoría con fotos. */
export const CATALOG_NAV = [{ label: "Catálogo", href: PRIMERA.href }, ...NAV_LINKS];
export const CATALOG_CURRENT = PRIMERA.href;

/** Foto que no ha cargado (señal lenta): se ve la trama del marco. */
export const SIN_CARGAR = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * Lo que abre "Pedir esta por WhatsApp". No usa nombre ni descripción: categoría + número + link al visor
 * (WhatsApp arma la vista previa con la foto, og:image). Pasa por whatsappUrl() (encodeURIComponent).
 */
export const pedido = (c: Cat, p: Photo) =>
  `¡Hola! Me gustó esta foto de ${c.label} (N.º ${p.n}). ¿Me dicen el precio y si me la pueden hacer?\n${SITE}${p.href}`;

/** Una descripción real que el admin escribió (opcional; la frase de relleno de hoy cuenta como vacía). */
export const DESCRIPCION = "Bordado en relieve al frente y a los lados. La hacemos en el color que quieras.";
