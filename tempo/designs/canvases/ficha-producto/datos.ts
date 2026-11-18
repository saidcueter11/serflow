import type { FotoProducto } from "../../../../src/components/ui/GaleriaProducto";
import type { ProductColor } from "../../../../src/lib/types";
import { whatsappUrl } from "../../../../src/lib/business";
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import visera from "./fotos/visera.webp";
import toro from "./fotos/toro.webp";
import avispon from "./fotos/avispon.webp";
import duende from "./fotos/duende.webp";

// Los 3 productos del prototipo aprobado (v7), con los datos de prod del 18-nov. El 3.º es un ejemplo: hoy ningún
// producto tiene más de 1 foto, así que lleva fotos de otras gorras.
export const LOGO: string = logo;

export type Producto = {
  titulo: string;
  categoria: string;
  slug: string;
  precio: string | null;
  descripcion: string;
  colores: ProductColor[];
  fotos: string[];
};

export const CON_PRECIO: Producto = {
  titulo: "Visera ancha rígida rosa palo",
  categoria: "Dama",
  slug: "dama/visera-ancha-rigida-rosa-palo",
  precio: "$30.000",
  descripcion: "Superficie lisa, ligera y con el nombre Serflow discreto a un lado.",
  colores: [
    { name: "Negra", hex: "#1d1c1a" },
    { name: "Blanca", hex: "#f2f0ea" },
    { name: "Amarillo pollo", hex: "#d0c98b" },
    { name: "Amarilla", hex: "#fdea01" },
  ],
  fotos: [visera],
};

export const SIN_PRECIO: Producto = {
  titulo: "Gorra plana roja y negra con toro",
  categoria: "Basketball",
  slug: "basketball/gorra-plana-roja-negra-toro",
  precio: null,
  descripcion: "Toro y letras bordados en relieve en blanco, rojo y negro.",
  colores: [],
  fotos: [toro],
};

export const VARIAS_FOTOS: Producto = {
  titulo: "Gorra plana turquesa con avispón",
  categoria: "Basketball",
  slug: "basketball/gorra-plana-turquesa-avispon",
  precio: "$35.000",
  descripcion: "Toda de un solo color, con avispón y letras bordados en blanco y morado.",
  colores: [],
  fotos: [avispon, duende, toro],
};

const PRODUCTOS = [CON_PRECIO, SIN_PRECIO, VARIAS_FOTOS];

/** "Más de <categoría>": los otros productos y se repite la lista hasta 4, como en el prototipo. */
export const otros = (p: Producto) => PRODUCTOS.filter((x) => x !== p).concat(PRODUCTOS).slice(0, 4);

export const fotosDe = (p: Producto): FotoProducto[] =>
  p.fotos.map((src, i) => ({ src, alt: p.fotos.length > 1 ? `${p.titulo}, foto ${i + 1} de ${p.fotos.length}` : p.titulo }));

export const href = (p: Producto) => `/catalogo/${p.slug}/`;

export const pedir = (p: Producto) => whatsappUrl(`¡Hola! Me gustó esta. ¿Me hacen una así?\nhttps://serflowctg.com${href(p)}`);
