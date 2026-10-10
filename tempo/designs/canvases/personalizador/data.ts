/// <reference types="vite/client" />
/*
 * Datos de muestra del personalizador (PRI-122). En el sitio salen de serflow-admin (PRI-127):
 * colores por prenda, una foto por color y el área de impresión calibrada sobre cada foto.
 *
 * FOTOS DE MUESTRA, NO DEL TALLER:
 * - Camisetas: un solo recorte de src/assets/images/stock/amigos-gorras.jpg (camiseta gris, sin cara),
 *   teñido a cada color. La "espalda" es una zona de solo tela de la misma foto. El taller entrega una foto real
 *   por color y vista (frente y espalda).
 * - Gorras: gorras Serflow del catálogo (src/assets/images/moda/moda5 y moda8) con el parche borrado; la blanca y
 *   la gris son la azul teñida. El taller entrega gorras lisas, una foto por color.
 */
import camisetaBlanca from "./fotos/camiseta-blanca.jpg";
import camisetaNegra from "./fotos/camiseta-negra.jpg";
import camisetaGris from "./fotos/camiseta-gris.jpg";
import camisetaAzul from "./fotos/camiseta-azul.jpg";
import espaldaBlanca from "./fotos/camiseta-blanca-espalda.jpg";
import espaldaNegra from "./fotos/camiseta-negra-espalda.jpg";
import espaldaGris from "./fotos/camiseta-gris-espalda.jpg";
import espaldaAzul from "./fotos/camiseta-azul-espalda.jpg";
import gorraBlanca from "./fotos/gorra-blanca.jpg";
import gorraNegra from "./fotos/gorra-negra.jpg";
import gorraGris from "./fotos/gorra-gris.jpg";
import gorraAzul from "./fotos/gorra-azul.jpg";
import disenoSol from "./disenos/sol-heroica.svg";
import disenoPequeno from "./disenos/sol-heroica-pequena.png";

export type Prenda = "camiseta" | "gorra";
export type Tecnica = "estampado" | "dtf" | "bordado";
export type Cantidad = "1" | "2 a 5" | "6 a 20" | "Más de 20";

/** Rectángulo en % de la escena 4:5 de la foto. */
export interface Area {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Una foto por color, calibrada en el admin: área de impresión y cuánto aclarar la sombra de la tela. */
export interface FotoColor {
  src: string;
  area: Area;
  /** brightness del multiplicado de sombras: más alto en telas oscuras (ver nota "calibrar cada foto"). */
  luz: number;
  oscura: boolean;
  /** centro vertical (en % de la escena) que se ve cuando la vista previa está recortada */
  foco: number;
}

export interface ColorPrenda {
  id: string;
  /** En femenino: "Camiseta negra", "Gorra blanca". */
  nombre: string;
  hex: string;
  foto?: FotoColor;
  /** Solo camiseta: foto de espalda del mismo color. */
  espalda?: FotoColor;
}

const PECHO: Area = { x: 24, y: 10, w: 56, h: 48 };
const ESPALDA: Area = { x: 20, y: 12, w: 60, h: 56 };
const FRENTE: Area = { x: 30, y: 28, w: 40, h: 28 };

export const COLORES_CAMISETA: ColorPrenda[] = [
  { id: "negra", nombre: "Negra", hex: "#1d1c1a", foto: { src: camisetaNegra, area: PECHO, luz: 5.2, oscura: true, foco: 36 }, espalda: { src: espaldaNegra, area: ESPALDA, luz: 5.2, oscura: true, foco: 40 } },
  { id: "blanca", nombre: "Blanca", hex: "#f2f0ea", foto: { src: camisetaBlanca, area: PECHO, luz: 1.15, oscura: false, foco: 36 }, espalda: { src: espaldaBlanca, area: ESPALDA, luz: 1.15, oscura: false, foco: 40 } },
  { id: "gris", nombre: "Gris", hex: "#8a8781", foto: { src: camisetaGris, area: PECHO, luz: 1.9, oscura: false, foco: 36 }, espalda: { src: espaldaGris, area: ESPALDA, luz: 1.9, oscura: false, foco: 40 } },
  { id: "azul", nombre: "Azul", hex: "#2f56a3", foto: { src: camisetaAzul, area: PECHO, luz: 2.4, oscura: false, foco: 36 }, espalda: { src: espaldaAzul, area: ESPALDA, luz: 2.4, oscura: false, foco: 40 } },
];

export const COLORES_GORRA: ColorPrenda[] = [
  { id: "negra", nombre: "Negra", hex: "#1d1c1a", foto: { src: gorraNegra, area: FRENTE, luz: 4.5, oscura: true, foco: 42 } },
  { id: "blanca", nombre: "Blanca", hex: "#f2f0ea", foto: { src: gorraBlanca, area: FRENTE, luz: 1.1, oscura: false, foco: 42 } },
  { id: "gris", nombre: "Gris", hex: "#8a8781", foto: { src: gorraGris, area: FRENTE, luz: 1.5, oscura: false, foco: 42 } },
  { id: "azul", nombre: "Azul", hex: "#2340c8", foto: { src: gorraAzul, area: FRENTE, luz: 2.2, oscura: false, foco: 42 } },
];

/** Cómo se ve la lista cuando el admin suma colores: 10 en camiseta. */
export const COLORES_CAMISETA_10: ColorPrenda[] = [
  ...COLORES_CAMISETA,
  { id: "azul-oscuro", nombre: "Azul oscuro", hex: "#1c2a4a" },
  { id: "roja", nombre: "Roja", hex: "#c62a2f" },
  { id: "vinotinto", nombre: "Vinotinto", hex: "#6b1f2c" },
  { id: "amarilla", nombre: "Amarilla", hex: "#f2c230" },
  { id: "verde", nombre: "Verde", hex: "#2f7a4a" },
  { id: "beige", nombre: "Beige", hex: "#d9c8a5" },
];

export const TECNICAS: Record<Tecnica, { nombre: string; pista: string }> = {
  estampado: { nombre: "Estampado", pista: "Mate, toma la textura de la tela" },
  dtf: { nombre: "DTF", pista: "Colores vivos, con brillo" },
  bordado: { nombre: "Bordado", pista: "Hilo con relieve" },
};

export const PRENDAS: Record<
  Prenda,
  { nombre: string; tecnicas: Tecnica[]; ubicaciones: string[]; colores: ColorPrenda[]; anchoCm: Record<string, number> }
> = {
  // anchoCm = ancho real del área de impresión por ubicación (lo mide el taller); con eso el sitio dice "unos 19 cm".
  camiseta: { nombre: "Camiseta", tecnicas: ["estampado", "dtf", "bordado"], ubicaciones: ["Pecho", "Espalda"], colores: COLORES_CAMISETA, anchoCm: { Pecho: 30, Espalda: 35 } },
  gorra: { nombre: "Gorra", tecnicas: ["bordado"], ubicaciones: ["Frente"], colores: COLORES_GORRA, anchoCm: { Frente: 12 } },
};

export const CANTIDADES: Cantidad[] = ["1", "2 a 5", "6 a 20", "Más de 20"];

export interface Diseno {
  src: string;
  /** ancho / alto */
  ratio: number;
  nombre: string;
  detalle: string;
  pixelada?: boolean;
}

export const DISENO: Diseno = { src: disenoSol, ratio: 1, nombre: "logo-heroica.png", detalle: "PNG · 1200 × 1200 px" };
export const DISENO_PEQUENO: Diseno = {
  src: disenoPequeno,
  ratio: 1,
  nombre: "logo-whatsapp.jpg",
  detalle: "JPG · 48 × 48 px",
  pixelada: true,
};
export const ARCHIVO_PDF = { nombre: "logo-final.pdf", detalle: "PDF · 2,4 MB" };
export const ARCHIVO_PESADO = { nombre: "foto-equipo.jpg", detalle: "JPG · 24 MB" };

/** Posición del diseño dentro del área: centro (0 a 1) y ancho como fracción del área. */
export interface Lugar {
  cx: number;
  cy: number;
  s: number;
}
export const LUGAR_INICIAL: Lugar = { cx: 0.5, cy: 0.42, s: 0.62 };

export type EstadoDiseno = "ninguno" | "ayuda" | "imagen" | "baja" | "archivo" | "pesada" | "procesando";

export interface Pedido {
  prenda: Prenda;
  color: string;
  tecnica: Tecnica;
  ubicacion: string;
  cantidad: Cantidad;
  diseno: EstadoDiseno;
  tamanoCm?: number;
  nota?: string;
  /** false cuando no hubo vista previa (la foto no cargó o el cliente siguió sin ella). */
  vistaPrevia?: boolean;
}

export const tamanoCm = (prenda: Prenda, ubicacion: string, s: number) => Math.round(PRENDAS[prenda].anchoCm[ubicacion] * s);

/** El mensaje exacto que llega a WhatsApp (doc de Producto, sección "Qué llega a WhatsApp", más la línea de tamaño). */
export function mensaje(p: Pedido): string {
  const muestra = p.diseno === "imagen" || p.diseno === "baja";
  const diseno = muestra
    ? p.vistaPrevia === false
      ? "te lo mando en el siguiente mensaje"
      : "te lo mando en el siguiente mensaje, con la vista previa"
    : p.diseno === "archivo" || p.diseno === "pesada"
      ? "te mando el archivo en el siguiente mensaje"
      : "todavía no tengo, quiero que me ayuden";
  const lineas = [
    "¡Hola, Serflow! Quiero cotizar esta prenda personalizada:",
    "",
    `*Prenda:* ${PRENDAS[p.prenda].nombre} ${p.color.toLowerCase()}`,
    `*Técnica:* ${TECNICAS[p.tecnica].nombre}`,
    `*Ubicación:* ${p.ubicacion}`,
    ...(muestra && p.tamanoCm && p.vistaPrevia !== false ? [`*Tamaño:* unos ${p.tamanoCm} cm de ancho`] : []),
    `*Cantidad:* ${p.cantidad}`,
    `*Diseño:* ${diseno}`,
    ...(p.nota ? [`*Nota:* ${p.nota}`] : []),
    "",
    "Armado en la web de Serflow",
  ];
  return lineas.join("\n");
}
