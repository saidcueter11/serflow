/// <reference types="vite/client" />
import type { ReactNode } from "react";
import logo from "../../../../src/assets/LOGO SERFLOW.png";
import { Button } from "../../../../src/components/ui/Button";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { CAP_GREEN, CAP_NAVY, SHIRT_BLACK, SHIRT_WHITE } from "../cards/samples";

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
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", visual: "estampado" },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", visual: "dtf" },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", visual: "bordado" },
] as const;

export const PRODUCTS = [
  { name: "Camiseta oversize", meta: "Blanca · S a XL", src: SHIRT_WHITE, confirmedLabel: "Confirmado hace 2 días" },
  { name: "Gorra trucker", meta: "Azul · bordado", src: CAP_NAVY },
  { name: "Camiseta básica", meta: "Negra · S a XXL", src: SHIRT_BLACK },
  { name: "Gorra snapback", meta: "Verde · bordado", src: CAP_GREEN },
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
          confirmedLabel={p.confirmedLabel}
          href={CATALOG_HREF}
          image={{ src: p.src, alt: `${p.name}, foto de ejemplo` }}
        />
      ))}
    </>
  );
}

/** Nota del canvas (no es UI del sitio): marca algo que la página real no muestra. */
export function CanvasNote({ children }: { children: ReactNode }) {
  return (
    <div className="mx-4 rounded-tile border border-dashed border-amber-400/60 px-3 py-2 text-[12px] leading-snug text-amber-300">
      <span className="font-semibold uppercase tracking-[.08em]">Nota del canvas · </span>
      {children}
    </div>
  );
}
