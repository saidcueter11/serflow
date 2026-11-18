import { useEffect, useRef } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { VisorFotos } from "../../../../src/components/ui/VisorFotos";
import { FichaProducto } from "../../../../src/components/catalog/FichaProducto";
import { fotosDe, href, LOGO, otros, pedir, type Producto } from "./datos";
// En el canvas también se puede probar: pasar el mouse, mantener y abrir el visor.
import "../../../../src/scripts/lupa";
import "../../../../src/scripts/visor-fotos";

/*
 * La ficha de producto (PRI-529, prototipo v7 aprobado). La página es la de producción (FichaProducto, la misma de
 * /catalogo/<cat>/<slug>/) con la cabecera y el pie reales; aquí solo van los datos de ejemplo y los estados.
 */

type Estado = "reposo" | "lupa" | "mantener";

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
  const categoria = { label: p.categoria, href: `/catalogo/${p.slug.split("/")[0]}` };
  return (
    <div ref={ref} className="relative overflow-y-auto bg-primary [scrollbar-width:none] font-body text-ink" style={{ width: ancho, height: alto }}>
      <Header logoSrc={LOGO} current="/catalogo" />
      <FichaProducto
        titulo={p.titulo}
        categoria={categoria}
        precio={p.precio}
        colores={p.colores}
        descripcion={p.descripcion}
        fotos={fotosDe(p)}
        pedir={pedir(p)}
        otros={otros(p).map((o) => ({ titulo: o.titulo, href: href(o), img: o.fotos[0] }))}
      />
      <Footer logoSrc={LOGO} />
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
