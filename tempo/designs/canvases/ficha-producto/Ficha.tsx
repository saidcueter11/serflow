import { useEffect, useRef } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { Button } from "../../../../src/components/ui/Button";
import { ColoresDisponibles } from "../../../../src/components/ui/ColoresDisponibles";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { Costura } from "../../../../src/components/ui/Costura";
import { Monograma } from "../../../../src/components/ui/Monograma";
import { GaleriaProducto } from "../../../../src/components/ui/GaleriaProducto";
import { Lupa } from "../../../../src/components/ui/Lupa";
import { VisorFotos } from "../../../../src/components/ui/VisorFotos";
import { BarraPedir } from "../../../../src/components/ui/BarraPedir";
import { fotosDe, href, LOGO, otros, pedir, type Producto } from "./datos";
// En el canvas también se puede probar: pasar el mouse, mantener y abrir el visor.
import "../../../../src/scripts/lupa";
import "../../../../src/scripts/visor-fotos";

/*
 * La ficha de producto (PRI-529, prototipo v7 aprobado) armada solo con piezas del design system. Es composición de
 * página: la página real la construye el Feature Builder en /catalogo/<cat>/<slug>/ con este mismo orden.
 * Celular y escritorio son el mismo markup: la galería y las @3xl: miden .pf (desde 48rem = escritorio).
 */

type Estado = "reposo" | "lupa" | "mantener";

const Volver = ({ p, className }: { p: Producto; className: string }) => (
  <a href={`/catalogo/${p.slug.split("/")[0]}`} className={`min-h-11 items-center gap-1.5 text-[14px] text-muted no-underline ${className}`}>
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
    {p.categoria}
  </a>
);

/** Deja la lupa encendida en (fx, fy) de la foto, como si el mouse estuviera ahí (lo dibuja src/scripts/lupa.ts). */
function useEstado(estado: Estado, fx: number, fy: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (estado === "reposo") return;
    const foto = ref.current!.querySelector<HTMLElement>(".gp-foto")!;
    const img = foto.querySelector("img")!;
    if (estado === "mantener") {
      img.style.transformOrigin = `${fx * 100}% ${fy * 100}%`;
      foto.setAttribute("data-cerca", "");
      return;
    }
    const mover = () => {
      const r = img.getBoundingClientRect();
      img.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: r.left + r.width * fx, clientY: r.top + r.height * fy }));
    };
    if (img.complete) mover();
    else img.addEventListener("load", mover, { once: true });
  }, [estado, fx, fy]);
  return ref;
}

/**
 * La página entera. alto = la pantalla del teléfono (la BarraPedir queda pegada abajo y el resto se ve con scroll);
 * sin alto, la página de largo completo.
 */
export function FichaPagina({ p, ancho, alto, estado = "reposo" }: { p: Producto; ancho: number; alto?: number; estado?: Estado }) {
  const ref = useEstado(estado, 0.56, 0.44);
  return (
    <div ref={ref} className="relative overflow-y-auto bg-primary [scrollbar-width:none] font-body text-ink" style={{ width: ancho, height: alto }}>
      <Header logoSrc={LOGO} current="/catalogo" />
      <div className="pf">
        <main className="pf-v">
          <Volver p={p} className="mx-4 mt-1 inline-flex @3xl:hidden" />
          {/* Mientras la lupa está encendida se esconden la costura y la S: el panel tapa la información (composición de página). */}
          <div className="flex flex-col gap-5 pt-1 pb-6 @3xl:flex-row @3xl:justify-center @3xl:gap-0 @3xl:px-12 @3xl:pt-10 @3xl:pb-14 [&:has(.lupa[data-on])_.costura]:invisible [&:has(.lupa[data-on])_.monograma]:invisible">
            <GaleriaProducto fotos={fotosDe(p)} />
            <div className="mx-4 mt-1 @3xl:hidden">
              <Costura orientacion="horizontal" />
            </div>
            <div className="ml-16 hidden @3xl:flex">
              <Costura />
            </div>
            <div className="anim-enter relative mx-4 -mt-5 flex min-w-0 flex-col gap-5 pt-7 pb-2 @3xl:mx-0 @3xl:mt-0 @3xl:w-[495px] @3xl:shrink @3xl:justify-center @3xl:gap-[22px] @3xl:py-6 @3xl:pl-16 [&>:not(.monograma):not(.lupa)]:relative">
              <Monograma className="absolute left-1/2 top-[52%] w-[72%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 @3xl:left-[calc(50%+32px)] @3xl:top-1/2 @3xl:h-[80%] @3xl:w-auto @3xl:max-w-none" />
              <Lupa className="[--lupa-inset:0_0_0_32px]" />
              <Volver p={p} className="-mb-2 -ml-1.5 hidden @3xl:inline-flex" />
              <h1 className="font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-balance @3xl:text-[44px]">{p.titulo}</h1>
              {p.precio && <p className="text-[22px] font-semibold tabular-nums text-secondary @3xl:text-[26px]">{p.precio}</p>}
              {p.colores.length > 0 && (
                <div>
                  <h2 className="mb-2.5 text-[13px] font-semibold text-muted">Viene en {p.colores.length} colores</h2>
                  <ColoresDisponibles colores={p.colores} />
                </div>
              )}
              <p className="max-w-[60ch] text-[15px] leading-[1.55] text-muted @3xl:text-[17px]">{p.descripcion}</p>
              <div className="hidden max-w-[420px] @3xl:block">
                <Button variant="whatsapp" href={pedir(p)} external fullWidth>
                  Pedir por WhatsApp
                </Button>
              </div>
            </div>
          </div>
          <section className="border-t border-line px-4 pt-2 pb-6 @3xl:px-12 @3xl:pb-14">
            <div className="flex items-center justify-between pt-7 pb-4">
              <h2 className="text-[22px] font-semibold">Más de {p.categoria}</h2>
              <Button variant="ghost" href={`/catalogo/${p.slug.split("/")[0]}`}>
                Ver todo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 @3xl:grid-cols-4 @3xl:gap-3">
              {otros(p).map((o, i) => (
                <ProductCard key={i} name={o.titulo} meta="" image={{ src: o.fotos[0], alt: "" }} href={href(o)} />
              ))}
            </div>
          </section>
          <BarraPedir href={pedir(p)} />
        </main>
      </div>
      <Footer logoSrc={LOGO} />
      <VisorFotos titulo={p.titulo} />
    </div>
  );
}

/**
 * El visor abierto en un marco del tamaño de la pantalla. En el sitio lo abre y lo llena src/scripts/visor-fotos.ts
 * con showModal(); aquí se abre sin el top layer (atributo open) dentro de un marco con transform, que hace de pantalla.
 */
export function VisorAbierto({ p, ancho, alto }: { p: Producto; ancho: number; alto: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fotos = fotosDe(p);
    const d = ref.current!.querySelector("dialog")!;
    const img = d.querySelector<HTMLImageElement>(".vf-foto")!;
    img.src = fotos[0].src;
    img.alt = fotos[0].alt;
    d.dataset.n = String(fotos.length);
    d.querySelector("[data-vf-contador]")!.textContent = fotos.length > 1 ? `1 / ${fotos.length}` : "";
    d.querySelector("[data-vf-minis]")!.replaceChildren(
      ...(fotos.length > 1 ? fotos : []).map((f, k) => {
        const b = Object.assign(document.createElement("button"), { type: "button" });
        b.setAttribute("aria-current", String(k === 0));
        b.append(Object.assign(document.createElement("img"), { src: f.src, alt: "" }));
        return b;
      }),
    );
    d.setAttribute("open", "");
  }, [p]);
  return (
    <div ref={ref} className="relative overflow-hidden bg-primary" style={{ width: ancho, height: alto, transform: "translateZ(0)" }}>
      <VisorFotos titulo={p.titulo} />
    </div>
  );
}
