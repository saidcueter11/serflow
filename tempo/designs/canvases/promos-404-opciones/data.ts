/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { whatsappUrl } from "../../../../src/lib/business";
// Fotos de ejemplo: gorras del catálogo actual y stock de src/assets/images/stock (las mismas de la portada), sin caras reconocibles.
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import miTierra2 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import moda5 from "../../../../src/assets/images/moda/moda5.webp";
import beisbol2 from "../../../../src/assets/images/beisbol/beisbol2.webp";
import kid1 from "../../../../src/assets/images/kids/kid1.webp";
import kid3 from "../../../../src/assets/images/kids/kid3.webp";

export const LOGO: string = logo;
export const SITE = "https://serflowctg.netlify.app";

/**
 * Una promo como la va a leer el sitio después del SQL de PRI-131: columnas de hoy (title, slug, banner_url,
 * image_urls) + description, ends_at y sort_order. Las fotos son imports locales para el canvas.
 */
export type Photo = { src: string; alt: string };
export type PromoDemo = {
  slug: string;
  title: string;
  /** description (text, nullable). Sin descripción se omite el párrafo. */
  description: string | null;
  /** ends_at (timestamptz). null = promo sin fecha de cierre. */
  endsAt: string | null;
  cover: Photo;
  photos: Photo[];
};

const p = (src: string, alt: string): Photo => ({ src, alt });

export const PROMO_GORRAS: PromoDemo = {
  slug: "2x1-gorras-bordadas",
  title: "2x1 en gorras bordadas",
  description:
    "Llevas dos gorras con el mismo bordado y pagas una. Aplica para las gorras de la vitrina y bordados de hasta 10 cm. Trae tu logo o te ayudamos a armarlo.",
  endsAt: "2026-10-11T23:59:00-05:00",
  cover: p(gorrasEstante, "Estante con gorras de colores en el taller"),
  photos: [
    p(gorraBordada, "Gorra blanca con bordado rojo"),
    p(gorraBordada2, "Gorra con un logo bordado en relieve"),
    p(miTierra2, "Gorra negra bordada con la palabra Cartagena"),
    p(moda5, "Gorra negra de perfil"),
    p(beisbol2, "Gorra azul con escudo bordado"),
  ],
};

export const PROMO_EQUIPOS: PromoDemo = {
  slug: "camisetas-equipos",
  title: "10% en camisetas para equipos de fútbol",
  description: "Desde 10 camisetas con nombre y número. Estampado o DTF, en el color de tu equipo.",
  endsAt: "2026-10-31T23:59:00-05:00",
  // Fotos sin caras: solo prendas y manos en el taller.
  cover: p(camisetaDtf, "Camiseta negra con un diseño a todo color en DTF"),
  photos: [p(estampadoRasero, "Estampado de una camiseta en el taller"), p(estampadoProceso, "Tinta de colores en el marco de serigrafía")],
};

export const PROMO_NINOS: PromoDemo = {
  slug: "gorras-ninos-nombre",
  title: "Gorras para niños con su nombre bordado",
  description: "El nombre va gratis en cualquier gorra infantil de la vitrina. Listas en 2 días.",
  endsAt: null,
  cover: p(kid1, "Gorra infantil vinotinto con un flamenco"),
  photos: [p(kid3, "Gorra infantil de colores")],
};

/** Orden por sort_order. */
export const PROMOS_3 = [PROMO_GORRAS, PROMO_EQUIPOS, PROMO_NINOS];
export const PROMOS_1 = [PROMO_GORRAS];

/** La misma promo con 1, 2, 3 y 5 fotos en total (portada + galería), para probar que la rejilla no deja huecos. */
export function withPhotoCount(promo: PromoDemo, total: 1 | 2 | 3 | 5): PromoDemo {
  return { ...promo, photos: promo.photos.slice(0, total - 1) };
}

// Hoy en el canvas: lunes 5 de octubre de 2026. El sitio es estático: la fecha se escribe en el build, nunca "termina hoy".
const FECHA = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" });
const FECHA_CORTA = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "America/Bogota" });

/** "Válida hasta el domingo 11 de octubre". Sin ends_at: null (no se muestra nada). */
export function validaHasta(endsAt: string | null): string | null {
  return endsAt ? `Válida hasta el ${FECHA.format(new Date(endsAt)).replace(",", "")}` : null;
}

/** "Hasta el 11 oct." para PromoCard y las filas. */
export function hastaCorto(endsAt: string | null): string | null {
  return endsAt ? `Hasta el ${FECHA_CORTA.format(new Date(endsAt))}` : null;
}

/** Mensaje contextual: Serflow sabe qué promo vio el cliente sin preguntarle. */
export function promoMensaje(promo: PromoDemo): string {
  return `¡Hola! Me interesa la promo "${promo.title}". ${SITE}/promos/${promo.slug}`;
}

export function promoWhatsapp(promo: PromoDemo): string {
  return whatsappUrl(promoMensaje(promo));
}
