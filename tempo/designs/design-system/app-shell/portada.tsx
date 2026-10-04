/// <reference types="vite/client" />
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { Button } from "../../../../src/components/ui/Button";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { ErrorState } from "../../../../src/components/ui/ErrorState";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { WorkCard } from "../../../../src/components/ui/WorkCard";
// Fotos de ejemplo mientras llegan las del cliente: gorras reales del catálogo actual.
import capLogo from "../../../../src/assets/images/moda/moda1.webp";
import capBordado from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import capDtf from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida5.webp";
import capNegra from "../../../../src/assets/images/moda/moda5.webp";
import capFlamenco from "../../../../src/assets/images/kids/kid1.webp";
import capBulls from "../../../../src/assets/images/basket/basket1.webp";
import capExpos from "../../../../src/assets/images/beisbol/beisbol2.webp";
import work1 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida3.webp";
import work2 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida4.webp";
import work3 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida6.webp";
import work4 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida7.webp";

/*
 * Contenido compartido por los dos composites de la portada. Todo lo que es UI sale de
 * src/components/ui; aquí solo queda el copy y dos bloques de página (Razones y la
 * entrada al personalizador) que viven en index.astro, no en el design system.
 */

export const LOGO: string = logo;

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

export const WORKS = [
  { title: "Gorras bordadas con frase", technique: "Bordado", src: work1 },
  { title: "Gorras con placa Colombia", technique: "DTF", src: work2 },
  { title: "Gorras para un equipo", technique: "Bordado", src: work3 },
  { title: "Gorras con diseño propio", technique: "Estampado", src: work4 },
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

export function PersonalizadorEntry({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`fabric rounded-card border border-dashed border-secondary/60 bg-surface ${desktop ? "p-8" : "p-4"}`}>
      <h3 className={`font-bold ${desktop ? "text-[22px]" : "text-[17px]"}`}>¿Ya tienes tu diseño?</h3>
      <p className="mt-1 text-[14px] text-muted">Pruébalo sobre la camiseta o la gorra.</p>
      <Button variant="ghost" href={PERSONALIZER_HREF}>
        Probar el personalizador →
      </Button>
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

/** Trabajos hechos: fotos de ejemplo hasta que lleguen las del cliente (decisión de Said, PRI-121). */
export function WorkItems() {
  return (
    <>
      {WORKS.map((w) => (
        <WorkCard key={w.title} title={w.title} technique={w.technique} image={{ src: w.src, alt: w.title }} />
      ))}
    </>
  );
}
