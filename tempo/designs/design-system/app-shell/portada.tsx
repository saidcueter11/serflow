/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { Button } from "../../../../src/components/ui/Button";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { ErrorState } from "../../../../src/components/ui/ErrorState";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { TITO_SALUDO } from "../../../../src/lib/mascot";
// Fotos de ejemplo mientras llegan las del cliente: gorras reales del catálogo actual.
import capLogo from "../../../../src/assets/images/moda/moda1.webp";
import capBordado from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import capDtf from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida5.webp";
import capNegra from "../../../../src/assets/images/moda/moda5.webp";
import capFlamenco from "../../../../src/assets/images/kids/kid1.webp";
import capBulls from "../../../../src/assets/images/basket/basket1.webp";
import capExpos from "../../../../src/assets/images/beisbol/beisbol2.webp";
import camisetas from "../../../../src/assets/images/stock/camisetas-estampadas.jpg";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import gorraBordada from "../../../../src/assets/images/stock/gorra-bordada.jpg";
import amigosGorras from "../../../../src/assets/images/stock/amigos-gorras.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import type { Slide } from "../../../../src/components/ui/HeroCarousel";
import type { PromoLink } from "../../../../src/components/ui/PromoBar";
import type { HomeImages } from "../../../../src/components/home/HomePage";

/*
 * Contenido compartido por los dos composites de la portada. Todo lo que es UI sale de
 * src/components/ui; aquí solo queda el copy y dos bloques de página (Razones y la
 * entrada al personalizador) que viven en index.astro, no en el design system.
 */

export const LOGO: string = logo;

// Datos de muestra para la portada real (HomePage) en los composites: las mismas fotos stock que index.astro.
export const HOME_SLIDES: Slide[] = [
  { src: camisetas, caption: "Camisetas con tu diseño", alt: "Dos personas con camisetas negras estampadas", position: "50% 35%" },
  { src: estampadoProceso, caption: "Estampado en el taller", alt: "Manos pasando el rasero sobre una plancha de estampado" },
  { src: gorraBordada, caption: "Gorras bordadas", alt: "Gorra blanca con bordado rojo", position: "50% 40%" },
  { src: amigosGorras, caption: "Para tu equipo o tu grupo", alt: "Dos amigos con gorras personalizadas riéndose", position: "50% 30%" },
];
export const HOME_IMAGES: HomeImages = { estampado: estampadoRasero, dtf: camisetaDtf, bordado: gorraBordada2, personalizador: capBordado };
export const PROMOS_SAMPLE: PromoLink[] = [
  { title: "2x1 en gorras bordadas este fin de semana", href: "/promos/2x1-gorras" },
  { title: "10% en camisetas para equipos de fútbol", href: "/promos/equipos" },
];

/**
 * Clip de Tito. tempo/public/mascota enlaza a public/mascota, así que las rutas sirven igual que en el sitio.
 * Sin HEVC: el canvas corre en Chromium, que no lo reproduce (el sitio sí lo manda para Safari).
 */
export const TITO = { ...TITO_SALUDO, hevc: undefined };

export const CATALOG_HREF = "/products/mi-tierra-querida";
// ponytail: la ruta del personalizador todavía no existe en src/pages.
export const PERSONALIZER_HREF = "/personalizador";

export const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: capLogo },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: capDtf },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: capBordado },
];

export const PRODUCTS = [
  { name: "Gorra deportiva", meta: "Negra · ajustable", src: capNegra },
  { name: "Gorra flamenco", meta: "Vinotinto · parche", src: capFlamenco },
  { name: "Gorra Chicago", meta: "Negra y roja · bordado", src: capBulls },
  { name: "Gorra Expos", meta: "Azul · bordado", src: capExpos },
];


const RAZONES = [
  { n: "01", title: "A tu gusto", copy: "Cada prenda sale de tu idea. Nada genérico." },
  { n: "02", title: "Acabados que duran", copy: "Bordado y estampado con materiales de calidad." },
  { n: "03", title: "Atención directa", copy: "Te asesoramos por WhatsApp, sin vueltas." },
];

export function QuienesCopy({ className }: { className: string }) {
  return (
    <p className={`leading-relaxed text-muted ${className}`}>
      Somos un taller en <span className="text-ink">Cartagena</span> que hace prendas personalizadas. La ropa no solo se
      usa, <span className="text-ink">se vive</span>: por eso cada pieza lleva algo tuyo.
    </p>
  );
}

export function Razones() {
  return (
    <ul className="flex flex-col gap-4">
      {RAZONES.map((r) => (
        <li key={r.n} className="flex gap-4">
          <span className="font-display text-[22px] font-medium leading-none text-accent">{r.n}</span>
          <div>
            <h3 className="text-[16px] font-bold">{r.title}</h3>
            <p className="mt-0.5 text-[14px] text-muted">{r.copy}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const PASOS = ["Sube tu diseño o una foto", "Elige prenda, color y técnica", "Mándanoslo por WhatsApp"];

/** Entrada al personalizador: la acción más importante después de WhatsApp, con su propio botón dorado. */
export function PersonalizadorEntry({ desktop = false }: { desktop?: boolean }) {
  return (
    <div
      className={`fabric grid overflow-hidden rounded-card border border-secondary/50 bg-surface ${desktop ? "grid-cols-[1fr_1.1fr] items-center" : ""}`}
    >
      <div className={`relative bg-muted ${desktop ? "h-[380px]" : "h-[220px]"}`}>
        <img src={capBordado} alt="Gorra con un diseño bordado" className="h-full w-full object-cover" />
        <span className="absolute left-1/2 top-[30%] h-[28%] w-[42%] -translate-x-1/2 rounded-tile border-2 border-dashed border-accent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] text-ink">Vista previa</span>
      </div>
      <div className={desktop ? "p-10" : "p-5"}>
        <h3 className={`font-display font-medium leading-tight ${desktop ? "text-[34px]" : "text-[26px]"}`}>Diseña la tuya</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.
        </p>
        <ol className="mt-5 flex flex-col gap-3">
          {PASOS.map((p, i) => (
            <li key={p} className="flex items-center gap-3 text-[15px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent font-display text-[14px] font-medium text-accent">
                {i + 1}
              </span>
              {p}
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <Button variant="whatsapp" href={PERSONALIZER_HREF} icon={null} fullWidth={!desktop}>
            Diseñar mi prenda →
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductItems({ count }: { count: number }) {
  return (
    <>
      {PRODUCTS.slice(0, count).map((p) => (
        <ProductCard
          key={p.name}
          name={p.name}
          meta={p.meta}
          href={CATALOG_HREF}
          image={{ src: p.src, alt: p.name }}
        />
      ))}
    </>
  );
}


/** Estado de la sección "Disponible ahora" (PRI-121): con prendas, sin prendas o error al cargar. */
export type EstadoDisponible = "productos" | "vacio" | "error";

/** Contenido de "Disponible ahora" cuando no hay prendas que mostrar. */
export function DisponibleSinProductos({ estado }: { estado: Exclude<EstadoDisponible, "productos"> }) {
  if (estado === "error") return <ErrorState kind="load" retryHref="/" />;
  return (
    <EmptyState
      title="No hay prendas disponibles en este momento"
      description="Lo que llega al taller se vende rápido. Escríbenos y te contamos qué hay hoy, o mándanos tu idea y la hacemos."
      action={{ label: "Escríbenos por WhatsApp", href: WHATSAPP_URL }}
    />
  );
}

