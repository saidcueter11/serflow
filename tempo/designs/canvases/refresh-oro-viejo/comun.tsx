/// <reference types="vite/client" />
import { useState, type ReactNode } from "react";
import "./refresh.css";
import "./refresh-r2.css";
import "./refresh-r3.css";
import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import type { Slide } from "../../../../src/components/ui/HeroCarousel";
import type { MasonryTile } from "../../../../src/components/ui/Masonry";
import type { CategoryLink } from "../../../../src/components/ui/CategoryNav";
import type { BannerSlide } from "../../../../src/components/ui/CategoryBanner";
import type { PromoView } from "../../../../src/lib/promos";
import { LOGO, PROMOS_SAMPLE } from "../../design-system/app-shell/portada";
// Fotos del taller y de prendas, sin modelos (pedido de Said, 2026-10-23).
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import mtq2 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import mtq5 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida5.webp";
import moda1 from "../../../../src/assets/images/moda/moda1.webp";
import kid1 from "../../../../src/assets/images/kids/kid1.webp";

export const FOTOS = { gorraBordada2, estampadoProceso, estampadoRasero, gorrasEstante, mtq2, mtq5, moda1, kid1 };

/** Hero de la portada nueva: prendas, nadie posando. Primero el estampado en el taller (es el LCP, horizontal). */
export const SLIDES_SIN_MODELOS: Slide[] = [
  { src: estampadoProceso, caption: "Estampado en el taller", alt: "Manos pasando el rasero sobre una plancha de estampado", position: "50% 60%" },
  { src: gorraBordada2, caption: "Gorras bordadas", alt: "Gorra bordada con luz cálida del taller", position: "30% 30%" },
  { src: mtq5, caption: "Tu diseño en DTF", alt: "Gorra con estampado DTF a todo color", position: "50% 45%" },
  { src: gorrasEstante, caption: "Listas para llevar", alt: "Gorras personalizadas en un estante del taller" },
];

const BEISBOL = Object.values(
  import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" }),
);
const MTQ = Object.values(
  import.meta.glob<string>("../../../../src/assets/images/miTierraQuerida/*.webp", { eager: true, import: "default" }),
);

/** Muro del catálogo en "Todo": fotos reales del catálogo de hoy (3:4). */
export const TILES: MasonryTile[] = [...BEISBOL.slice(0, 7), ...MTQ.slice(0, 7)]
  .sort((a, b) => a.localeCompare(b))
  .map((src, i) => {
    const label = src.includes("beisbol") ? "Beisbol" : "Mi Tierra Querida";
    return { href: `#foto-${i + 1}`, img: { src, alt: `${label}, foto N.º ${i + 1}`, ratio: 3 / 4 }, label, nuevo: i < 2, photos: i % 4 === 0 ? 3 : 1 };
  });

export const CHIPS: CategoryLink[] = [
  { label: "Todo", href: "/products", count: 92 },
  { label: "Mi Tierra Querida", href: "/products/mi-tierra-querida", count: 26 },
  { label: "Beisbol", href: "/products/beisbol", count: 24 },
  { label: "Basket", href: "/products/basket", count: 10 },
  { label: "Moda", href: "/products/moda", count: 11 },
  { label: "Niños", href: "/products/kids", count: 10 },
];

export const BANNER: BannerSlide[] = [
  { label: "Todo", count: 92, image: { src: gorrasEstante } },
  { label: "Mi Tierra Querida", count: 26, image: { src: mtq2 } },
];

export const PROMOS: PromoView[] = [
  {
    slug: "2x1-gorras",
    title: "2x1 en gorras bordadas este fin de semana",
    description: "Lleva dos gorras con el mismo bordado y paga una. Tu logo o tu diseño, hasta 8 cm.",
    endsAt: "2026-11-02T23:59:00-05:00",
    cover: { src: gorraBordada2, alt: "Gorra bordada" },
    photos: [{ src: gorraBordada2, alt: "Gorra bordada" }, { src: mtq2, alt: "Gorra Mi Tierra Querida" }, { src: moda1, alt: "Gorra negra" }],
  },
  {
    slug: "equipos",
    title: "10% en camisetas para equipos de fútbol",
    description: "Desde 10 camisetas con número y nombre. Estampado o DTF.",
    endsAt: "2026-11-15T23:59:00-05:00",
    cover: { src: estampadoProceso, alt: "Estampado en el taller" },
    photos: [{ src: estampadoProceso, alt: "Estampado en el taller" }, { src: estampadoRasero, alt: "Rasero sobre la plancha" }],
  },
  {
    slug: "regalo",
    title: "Gorra con tu foto para regalar",
    description: null,
    endsAt: null,
    cover: { src: kid1, alt: "Gorra infantil con parche" },
    photos: [{ src: kid1, alt: "Gorra infantil con parche" }],
  },
];

/**
 * Marco de página igual al de Layout.astro: PromoBar (si hay), Header, contenido, Footer y el WhatsAppFab.
 * nuevo = el mismo marco con el refresh encima (refresh.css + refresh-r2.css + refresh-r3.css); sin nuevo = producción hoy.
 */
export function Marco({
  width,
  nuevo,
  current,
  promos = false,
  fab = true,
  children,
}: {
  width: number;
  nuevo?: boolean;
  current?: string;
  promos?: boolean;
  fab?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`relative bg-primary font-body text-ink antialiased ${nuevo ? NUEVO : ""}`} style={{ width }}>
      {promos && <PromoBar promos={PROMOS_SAMPLE} />}
      <Header logoSrc={LOGO} current={current} />
      {children}
      <Footer logoSrc={LOGO} />
      {fab && (
        <div className="absolute bottom-5 right-4">
          <WhatsAppFab placement="inline" />
        </div>
      )}
    </div>
  );
}

/** Las tres capas del refresh. En el PR se vuelven tokens y clases de producción (tablero "Lista de cambios"). */
export const NUEVO = "sf-refresh sf-r2 sf-r3";

/** Rótulo de columna del antes / después. */
function Rotulo({ lado, detalle }: { lado: "antes" | "despues"; detalle: string }) {
  return (
    <div className="flex items-baseline gap-3 pb-4">
      <span
        className={`rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-[.12em] ${lado === "antes" ? "border border-line text-muted" : "sf-refresh bg-accent text-primary"}`}
      >
        {lado === "antes" ? "Antes" : "Después"}
      </span>
      <span className="text-[14px] text-muted">{detalle}</span>
    </div>
  );
}

/**
 * Antes (producción hoy) y después (refresh) lado a lado, con un "Repetir" que vuelve a montar las dos páginas para ver
 * otra vez lo que se mueve al cargar. Lo de pasar el mouse se prueba directo en el frame.
 */
export function AntesDespues({
  titulo,
  nota,
  width,
  antes,
  despues,
  detalleAntes = "producción hoy",
}: {
  titulo: string;
  nota: ReactNode;
  width: number;
  antes: ReactNode;
  despues: ReactNode;
  detalleAntes?: string;
}) {
  const [vuelta, setVuelta] = useState(0);
  return (
    <div className="bg-primary-light p-10 font-body text-ink" style={{ width: width * 2 + 160 }}>
      <div className="flex items-start justify-between gap-8 pb-8">
        <div className="max-w-[760px]">
          <h2 className="text-[28px] font-bold leading-tight">{titulo}</h2>
          <div className="mt-2 text-[15px] leading-relaxed text-muted">{nota}</div>
        </div>
        <button
          type="button"
          onClick={() => setVuelta((v) => v + 1)}
          className="min-h-11 shrink-0 rounded-full border border-line px-5 text-[14px] font-semibold text-ink hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ↻ Repetir
        </button>
      </div>
      <div className="flex items-start gap-20">
        <div>
          <Rotulo lado="antes" detalle={detalleAntes} />
          <div key={`a${vuelta}`} className="overflow-hidden rounded-tile ring-1 ring-line">
            {antes}
          </div>
        </div>
        <div>
          <Rotulo lado="despues" detalle="refresh oro viejo · ronda 4" />
          <div key={`d${vuelta}`} data-captura="despues" className={`${NUEVO} overflow-hidden rounded-tile ring-1 ring-accent/60`}>
            {despues}
          </div>
        </div>
      </div>
    </div>
  );
}
