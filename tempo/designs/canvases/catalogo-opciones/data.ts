/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { NAV_LINKS } from "../../../../src/components/ui/Header";
import type { CategoryLink } from "./propuestas/CategoryNav";
import type { GalleryImage } from "./propuestas/ProductGallery";
// Fotos del catálogo actual (src/assets/images): gorras sobre fondo gris, sin personas.
import mtq2 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import mtq3 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida3.webp";
import mtq5 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida5.webp";
import mtq7 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida7.webp";
import mtq8 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida8.webp";
import mtq10 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida10.webp";
import mtq12 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida12.webp";
import mtq13 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida13.webp";
import mtq18 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida18.webp";
import mtq20 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida20.webp";
import moda9 from "../../../../src/assets/images/moda/moda9.webp";
import moda11 from "../../../../src/assets/images/moda/moda11.webp";
import moda14 from "../../../../src/assets/images/moda/moda14.webp";
import moda15 from "../../../../src/assets/images/moda/moda15.webp";
import moda2 from "../../../../src/assets/images/moda/moda2.webp";
import beisbol from "../../../../src/assets/images/beisbol/beisbol.webp";
import beisbol2 from "../../../../src/assets/images/beisbol/beisbol2.webp";
import beisbol3 from "../../../../src/assets/images/beisbol/beisbol3.webp";
import beisbol4 from "../../../../src/assets/images/beisbol/beisbol4.webp";
import beisbol5 from "../../../../src/assets/images/beisbol/beisbol5.webp";
import basket1 from "../../../../src/assets/images/basket/basket1.webp";
import kid1 from "../../../../src/assets/images/kids/kid1.webp";

export const LOGO: string = logo;

export type Item = { name: string; meta: string; href: string; image: { src: string; alt: string } };

const MTQ = "/products/mi-tierra-querida";
const item = (name: string, meta: string, src: string, slug: string): Item => ({
  name,
  meta,
  href: `${MTQ}/${slug}`,
  image: { src, alt: name },
});

/**
 * Header en el catálogo: se suma "Catálogo" al nav (propuesta, ver Decisiones) y queda marcado.
 * El resto son los NAV_LINKS de hoy.
 */
export const CATALOG_NAV = [{ label: "Catálogo", href: MTQ }, ...NAV_LINKS];
export const CATALOG_CURRENT = MTQ;

// Las 5 categorías activas de hoy, con su conteo real (prod, 2026-10-05). Labels tal como están en la base.
export const CATEGORIES: CategoryLink[] = [
  { label: "Mi Tierra Querida", href: MTQ, count: 26, image: mtq7 },
  { label: "Beisbol", href: "/products/beisbol", count: 23, image: beisbol2 },
  { label: "Moda", href: "/products/moda", count: 23, image: moda2 },
  { label: "Basketball", href: "/products/basketball", count: 10, image: basket1 },
  { label: "Niños", href: "/products/kids", count: 10, image: kid1 },
];

// Estado vacío: una categoría que el admin crea antes de subir productos (p. ej. Camisetas, sin fotos todavía).
export const CAMISETAS_HREF = "/products/camisetas";
export const CATEGORIES_CON_VACIA: CategoryLink[] = [...CATEGORIES, { label: "Camisetas", href: CAMISETAS_HREF, count: 0 }];

/**
 * Nombres y meta propuestos (hoy se llaman "Mi Tierra Querida #1" y no tienen descripción; ver "Datos de hoy").
 * meta = primera línea de products.description; sin descripción, la card no muestra meta.
 */
export const MTQ_ITEMS: Item[] = [
  item("Gorra Cartagena bordada", "Azul noche · bordado", mtq7, "gorra-cartagena-bordada"),
  item("Gorra Qué chimba", "Beige · bordado", mtq2, "gorra-que-chimba"),
  item("Gorra Cartagena tricolor", "Azul rey · bordado", mtq12, "gorra-cartagena-tricolor"),
  item("Gorra placa COL", "Azul · visera estampada", mtq5, "gorra-placa-col"),
  item(
    "Gorra trucker Mi Tierra Querida Cartagena con bordado tricolor y visera estampada",
    "Verde limón · bordado y estampado",
    mtq10,
    "gorra-trucker-cartagena",
  ),
  item("Gorra Colombia roja", "Roja · bordado", mtq18, "gorra-colombia-roja"),
  item("Gorra escudo de Colombia", "Café · bordado", mtq13, "gorra-escudo"),
  item("Gorra Colombia es una chimba", "Blanca · bordado", mtq3, "gorra-es-una-chimba"),
  item("Gorra Colombia negra", "Negra · bordado", mtq8, "gorra-colombia-negra"),
  item("Gorra Colombia amarilla", "Amarilla · bordado", mtq20, "gorra-colombia-amarilla"),
];

// Así se ven hoy los datos de la base: nombre con número y sin descripción.
export const BEISBOL_HOY: Item[] = [beisbol, beisbol2, beisbol3, beisbol4, beisbol5].map((src, i) => ({
  name: `Beisbol #${26 + i}`,
  meta: "",
  href: `/products/beisbol/beisbol-${26 + i}`,
  image: { src, alt: `Beisbol #${26 + i}` },
}));
export const BEISBOL_HREF = "/products/beisbol";

/** Producto con varias fotos: el mismo modelo en cuatro colores. */
export const PARCHE = {
  name: "Gorra con parche de cuero",
  description: "Seis paneles, parche de cuero grabado y cierre ajustable atrás. La tenemos en negro, mostaza, vinotinto y beige.",
  images: [
    { src: moda9, alt: "Gorra negra con parche de cuero, de frente" },
    { src: moda11, alt: "Gorra mostaza con parche de cuero" },
    { src: moda14, alt: "Gorra vinotinto con parche de cuero" },
    { src: moda15, alt: "Gorra beige con parche de cuero" },
  ] as GalleryImage[],
  category: { label: "Moda", href: "/products/moda", count: 23 },
  url: "https://serflowctg.netlify.app/products/moda/gorra-parche-de-cuero",
};

/** Producto con una sola foto (el caso de hoy en casi todo el catálogo). */
export const CARTAGENA = {
  name: "Gorra Cartagena bordada",
  description: "Bordado en relieve al frente y a los lados, visera curva. Talla única ajustable.",
  images: [{ src: mtq7, alt: "Gorra azul noche con Cartagena bordado en amarillo" }] as GalleryImage[],
  category: { label: "Mi Tierra Querida", href: MTQ, count: 26 },
  url: "https://serflowctg.netlify.app/products/mi-tierra-querida/gorra-cartagena-bordada",
};

/** Nombre largo y sin descripción. */
export const TRUCKER = {
  name: "Gorra trucker Mi Tierra Querida Cartagena con bordado tricolor y visera estampada",
  description: undefined as string | undefined,
  images: [{ src: mtq10, alt: "Gorra verde limón con Cartagena bordado y visera estampada" }] as GalleryImage[],
  category: { label: "Mi Tierra Querida", href: MTQ, count: 26 },
  url: "https://serflowctg.netlify.app/products/mi-tierra-querida/gorra-trucker-cartagena",
};

/** Datos de hoy: "Beisbol #26", una foto, y la descripción de relleno que se oculta. */
export const BEISBOL_26 = {
  name: "Beisbol #26",
  description: undefined as string | undefined,
  images: [{ src: beisbol, alt: "Beisbol #26" }] as GalleryImage[],
  category: { label: "Beisbol", href: BEISBOL_HREF, count: 23 },
  url: "https://serflowctg.netlify.app/products/beisbol/beisbol-26",
};

export type Producto = typeof CARTAGENA;

/** Relacionados: los primeros de la misma categoría, sin el producto actual. */
export const RELACIONADOS_MODA: Item[] = [moda2, moda11, moda14, moda15].map((src, i) => ({
  name: ["Gorra deportiva roja", "Gorra parche mostaza", "Gorra parche vinotinto", "Gorra parche beige"][i],
  meta: ["Roja · logo Serflow", "Mostaza · parche", "Vinotinto · parche", "Beige · parche"][i],
  href: `/products/moda/${["gorra-deportiva-roja", "gorra-parche-mostaza", "gorra-parche-vinotinto", "gorra-parche-beige"][i]}`,
  image: { src, alt: ["Gorra deportiva roja", "Gorra parche mostaza", "Gorra parche vinotinto", "Gorra parche beige"][i] },
}));
export const RELACIONADOS_MTQ = MTQ_ITEMS.slice(1, 5);
export const RELACIONADOS_BEISBOL = BEISBOL_HOY.slice(1, 5);

/** Foto que no ha cargado (señal lenta): se ve el fondo con trama del marco. */
export const SIN_CARGAR = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

// Mensajes que abre "Contactar por WhatsApp". El texto pasa por whatsappUrl() (encodeURIComponent).
// "este producto: <nombre>" y no "la <nombre>": tiene que leerse bien con cualquier nombre, también "Beisbol #26".
export const mensaje = (p: Producto) => `Hola! Me interesa este producto: ${p.name}. ¿Qué precio tiene y está disponible?\n${p.url}`;
export const mensajeLogo = (p: Producto) => `Hola! Quiero uno como este, pero con mi logo o mi nombre: ${p.name}\n${p.url}`;
export const mensajeGrupo = (p: Producto) => `Hola! Quiero varios como este para un grupo. ¿Cuánto salen? ${p.name}\n${p.url}`;
