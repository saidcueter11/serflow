/// <reference types="vite/client" />
import type { ReactNode } from "react";
import "./movimiento.css";
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import sol from "./fotos/sol-heroica.svg";
import camisetas from "../../../../src/assets/images/stock/camisetas-estampadas.jpg";
import dtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import amigos from "../../../../src/assets/images/stock/amigos-gorras.jpg";
import estante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import rasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import proceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import cartagena from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida7.webp";
import chimba from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida3.webp";
import col057 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida5.webp";
import cuero from "../../../../src/assets/images/moda/moda15.webp";
import kids from "../../../../src/assets/images/kids/kid6.webp";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { whatsappUrl } from "../../../../src/lib/business";

/*
 * Datos de muestra del canvas PRI-286 (portada nueva). Fotos: stock de src/assets/images/stock y fotos del catálogo
 * que ya están en el repo; ninguna sale de Supabase, así que no hay datos personales. El diseño del sol es el del
 * canvas del personalizador (PRI-122), de un cliente ficticio. La prenda es una silueta SVG mientras llegan las fotos
 * oficiales (PRI-125): las de hoy son primeros planos de tela y en la portada no se leen como camiseta.
 */

export const LOGO = logo;
export const PRENDA = { sol };

export const PERSONALIZA = "/personaliza";
export const CATALOGO = "/products";
export const WA_IDEA = whatsappUrl("Hola! Tengo una idea para una prenda y quiero cotizarla");

// Dos promos activas: la barra rota entre las dos. Sin promos activas la barra no se pinta.
export const PROMOS = [
  { title: "2x1 en gorras bordadas hasta el domingo", href: "/promos/2x1-gorras" },
  { title: "Camisetas para tu equipo: 10% desde 12 unidades", href: "/promos/equipos" },
];

export const TRABAJOS = [
  { src: camisetas, alt: "Dos personas con camisetas negras estampadas", tecnica: "Estampado", pos: "50% 30%" },
  { src: col057, alt: "Gorra azul con parche bordado COL-057", tecnica: "Bordado", pos: "50% 45%" },
  { src: dtf, alt: "Camiseta negra con un estampado DTF de colores", tecnica: "DTF", pos: "50% 35%" },
  { src: amigos, alt: "Dos amigos con gorras personalizadas", tecnica: "Para tu grupo", pos: "50% 25%" },
  { src: gorraBordada, alt: "Gorra blanca con bordado rojo vista de atrás", tecnica: "Bordado", pos: "50% 40%" },
  { src: cartagena, alt: "Gorra azul oscuro con Cartagena bordado", tecnica: "Bordado", pos: "50% 50%" },
];

export const TALLER = { rasero, proceso, estante, gorraBordada2 };

export const PRODUCTOS = [
  { name: "Gorra Cartagena", meta: "Gorras · Bordada", href: "/products/gorras/cartagena", image: { src: cartagena, alt: "Gorra Cartagena bordada" } },
  { name: "Gorra Colombia es una chimba", meta: "Gorras · Bordada", href: "/products/gorras/chimba", image: { src: chimba, alt: "Gorra blanca con Colombia es una chimba bordado" } },
  { name: "Gorra con parche de cuero", meta: "Gorras · Parche", href: "/products/gorras/parche-cuero", image: { src: cuero, alt: "Gorra beige con parche de cuero" } },
  { name: "Gorra infantil con parches", meta: "Niños · Bordada", href: "/products/ninos/parches", image: { src: kids, alt: "Gorra infantil negra con parches de colores" } },
];

export const PASOS = ["Sube tu logo o una foto", "Elige prenda, color y lado", "Lo mandas y lo hacemos aquí"];

const TEE = "M138 22 C156 46 244 46 262 22 L338 50 Q356 57 366 72 L396 128 L338 162 L320 140 L320 418 Q320 426 312 426 L88 426 Q80 426 80 418 L80 140 L62 162 L4 128 L34 72 Q44 57 62 50 Z";

/** Camiseta plana en SVG (colores de prenda en --tela-negra / --tela-blanca). */
export function Camiseta({ tono, className = "" }: { tono: "negra" | "blanca"; className?: string }) {
  const id = `brillo-${tono}`;
  return (
    <svg viewBox="0 0 400 440" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={tono === "negra" ? 0.07 : 0.5} />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={tono === "negra" ? 0.25 : 0.12} />
        </linearGradient>
      </defs>
      <path d={TEE} fill={`var(--tela-${tono})`} stroke="var(--color-line)" strokeWidth="2" />
      <path d={TEE} fill={`url(#${id})`} />
      <path d="M138 22 C156 62 244 62 262 22" fill="none" stroke="var(--color-line)" strokeWidth="5" opacity=".7" />
      <path d="M80 140 L94 70 M320 140 L306 70" stroke="#000" strokeOpacity=".18" strokeWidth="2" />
    </svg>
  );
}

/** Prenda de la vista previa: camiseta negra (y blanca encima si se pasa blancaClass) con el diseño en el pecho. */
export function Prenda({ className = "", blancaClass, children }: { className?: string; blancaClass?: string; children: ReactNode }) {
  return (
    <div className={`relative aspect-[400/440] ${className}`}>
      <Camiseta tono="negra" className="absolute inset-0 h-full w-full" />
      {blancaClass && <Camiseta tono="blanca" className={`absolute inset-0 h-full w-full ${blancaClass}`} />}
      <div className="absolute left-1/2 top-[23%] aspect-square w-[34%] -translate-x-1/2">{children}</div>
    </div>
  );
}

/* ---------- Andamiaje del canvas (no es producto) ---------- */

/** Línea del pliegue: dónde termina la primera pantalla (844 en Pixel 7 / iPhone, 800 en escritorio). */
export function Pliegue({ top }: { top: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-[60] border-t-2 border-dashed border-ok/70" style={{ top }}>
      <span className="absolute right-2 top-1 rounded-full bg-ok px-2 py-0.5 font-body text-[11px] font-bold text-primary">
        fin de la primera pantalla · {top}px
      </span>
    </div>
  );
}

/** El WhatsAppFab de producción, puesto donde se ve al cargar (abajo a la derecha de la primera pantalla). */
export function FabEnPantalla({ top }: { top: number }) {
  return (
    <div className="absolute right-4 z-50" style={{ top: top - 76 }}>
      <WhatsAppFab placement="inline" />
    </div>
  );
}

/** Página completa a un ancho fijo, con el pliegue marcado. */
export function Hoja({ width, fold, className = "", children, fab = true }: { width: number; fold: number; className?: string; children: ReactNode; fab?: boolean }) {
  return (
    <div className={`@container relative overflow-hidden font-body antialiased ${className}`} style={{ width }}>
      {children}
      {fab && <FabEnPantalla top={fold} />}
      <Pliegue top={fold} />
    </div>
  );
}
