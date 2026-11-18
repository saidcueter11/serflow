/// <reference types="vite/client" />
import { useEffect, useRef, type ReactNode } from "react";
import { GaleriaProducto, type FotoProducto } from "../../../../src/components/ui/GaleriaProducto";
import { Lupa } from "../../../../src/components/ui/Lupa";
import { VisorFotos } from "../../../../src/components/ui/VisorFotos";
import { Costura } from "../../../../src/components/ui/Costura";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
// En el canvas también se puede probar: pasar el mouse, mantener y abrir el visor.
import "../../../../src/scripts/lupa";
import "../../../../src/scripts/visor-fotos";

// Ficha de producto (PRI-529). Fotos de ejemplo del catálogo de hoy (gorras de beisbol, 3:4); sin versión zoom (PRI-546).
const FOTOS = import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" });
const SRC = Object.values(FOTOS);
const TITULO = "Gorra de beisbol bordada";
const VARIAS: FotoProducto[] = SRC.slice(0, 3).map((src, i) => ({ src, alt: `${TITULO}, foto ${i + 1} de 3` }));
const UNA: FotoProducto[] = [{ src: SRC[3], alt: TITULO }];

/** Una página de la ficha de ese ancho: .pf es el contenedor que mide la galería (@container pf). */
const Pagina = ({ width, children }: { width: number; children: ReactNode }) => (
  <div className="pf overflow-hidden rounded-tile bg-primary py-6" style={{ width }}>
    {children}
  </div>
);

export function BoardGaleriaProducto() {
  return (
    <PageFrame family="fotos y mascota" width={1800}>
      <PageTitle
        title="GaleriaProducto"
        description="Las fotos de la ficha de producto (PRI-529). Celular: carrusel con la siguiente asomada, contador 1 / N y puntos; cada foto dice Mantén para acercar. Escritorio: miniaturas a la izquierda y una foto 3:4 de 640 de alto que dice Pasa el mouse. Tocar la foto abre VisorFotos. La foto entra creciendo."
      />
      <Row name="Celular (390), varias fotos" description="La siguiente se asoma 56 px. Desliza: el contador y los puntos la siguen.">
        <Pagina width={390}>
          <GaleriaProducto fotos={VARIAS} />
        </Pagina>
      </Row>
      <Row name="Celular (390), una foto" description="Sin contador ni puntos; la foto a todo el ancho de la rejilla.">
        <Pagina width={390}>
          <GaleriaProducto fotos={UNA} />
        </Pagina>
      </Row>
      <Row name="Escritorio (1280)" description="Las miniaturas cambian la foto; la actual con borde de oro. Con una foto no hay miniaturas.">
        <Pagina width={1280}>
          <div className="flex justify-center gap-16">
            <GaleriaProducto fotos={VARIAS} />
            <GaleriaProducto fotos={UNA} />
          </div>
        </Pagina>
      </Row>
      <VisorFotos titulo={TITULO} />
    </PageFrame>
  );
}

/** Deja la lupa encendida en el punto (fx, fy) de la foto, como si el mouse estuviera ahí. */
function useLupaEn(fx: number, fy: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const img = ref.current!.querySelector<HTMLImageElement>(".gp-foto img")!;
    const mover = () => {
      const r = img.getBoundingClientRect();
      img.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: r.left + r.width * fx, clientY: r.top + r.height * fy }));
    };
    if (img.complete) mover();
    else img.addEventListener("load", mover, { once: true });
  }, [fx, fy]);
  return ref;
}

/** Deja la primera foto acercada en el punto (fx, fy), como si el dedo la estuviera manteniendo. */
function useCercaEn(fx: number, fy: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const foto = ref.current!.querySelector<HTMLElement>(".gp-foto")!;
    foto.querySelector("img")!.style.transformOrigin = `${fx * 100}% ${fy * 100}%`;
    foto.setAttribute("data-cerca", "");
  }, [fx, fy]);
  return ref;
}

export function BoardLupa() {
  const escritorio = useLupaEn(0.5, 0.42);
  const celular = useCercaEn(0.5, 0.4);
  return (
    <PageFrame family="fotos y mascota" width={1800}>
      <PageTitle
        title="Lupa"
        description="Para ver el bordado de cerca (PRI-529). Escritorio: al pasar el mouse por la foto, un recuadro dorado marca la zona y el panel Lupa la muestra 2,5 veces más grande donde va la información; al salir vuelve todo. Celular: con el dedo quieto 220 ms la foto se acerca 2,5 veces donde está el dedo, lo sigue y al soltar vuelve; ese toque no abre el visor y la etiqueta se va después del primer uso."
      />
      <Row
        name="Escritorio (1280)"
        description={
          <>
            Lupa va dentro de la columna de la información (<Code>relative</Code>) y la tapa; aquí corrida 32 px con{" "}
            <Code>[--lupa-inset:0_0_0_32px]</Code>. Pide la versión zoom de la foto solo al pasar el mouse. En el canvas
            se puede mover el mouse por la foto.
          </>
        }
      >
        <Pagina width={1280}>
          <div ref={escritorio} className="flex justify-center px-12">
            <GaleriaProducto fotos={VARIAS} />
            <Costura className="ml-16" />
            <div className="relative flex w-[440px] flex-col justify-center gap-5 pl-16">
              <Lupa className="[--lupa-inset:0_0_0_32px]" />
              <h3 className="font-display text-[44px] font-semibold leading-[1.15] tracking-tight">{TITULO}</h3>
              <p className="text-[17px] leading-relaxed text-muted">La información queda debajo del panel mientras el mouse está en la foto.</p>
            </div>
          </div>
        </Pagina>
      </Row>
      <Row name="Celular (390)" description="Mantén para acercar: la foto acercada con su borde de oro. Al soltar vuelve y la etiqueta se va (data-usado).">
        <Pagina width={390}>
          <div ref={celular}>
            <GaleriaProducto fotos={VARIAS} />
          </div>
        </Pagina>
      </Row>
    </PageFrame>
  );
}

/**
 * El visor en un marco del tamaño de la pantalla. En el sitio lo abre y lo llena src/scripts/visor-fotos.ts con
 * showModal(); aquí se abre sin el top layer (atributo open) dentro de un marco con transform, que hace de pantalla.
 */
function Pantalla({ width, height, fotos }: { width: number; height: number; fotos: FotoProducto[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
  }, [fotos]);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-tile bg-primary" style={{ width, height, transform: "translateZ(0)" }}>
      <VisorFotos titulo={TITULO} />
    </div>
  );
}

export function BoardVisorFotos() {
  return (
    <PageFrame family="fotos y mascota" width={1800}>
      <PageTitle
        title="VisorFotos"
        description="La foto a pantalla completa con zoom (PRI-529). Escritorio: la rueda acerca hacia el puntero, + − y Ajustar, arrastrar, flechas y miniaturas, que se esconden mientras está acercada. Celular: pellizco, doble toque, arrastrar con un dedo, deslizar de lado para cambiar de foto y hacia abajo para cerrar. Esc, el foco atrapado adentro y de vuelta en la foto al cerrar. Baja la versión zoom (PRI-546) solo al abrir. No reemplaza a PhotoModal, que sigue en el muro."
      />
      <Row name="Escritorio (1280)" description="Varias fotos: flechas a los lados, el control de zoom y las miniaturas abajo.">
        <Pantalla width={1280} height={800} fotos={VARIAS} />
      </Row>
      <Row name="Celular (390)" description="Una foto: la ayuda abajo. Con varias van las miniaturas y se pasa deslizando; acercada, el pie se esconde.">
        <div className="flex gap-6">
          <Pantalla width={390} height={844} fotos={UNA} />
          <Pantalla width={390} height={844} fotos={VARIAS} />
        </div>
      </Row>
    </PageFrame>
  );
}
