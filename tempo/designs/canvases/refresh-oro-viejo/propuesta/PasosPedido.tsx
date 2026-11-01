import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ADDRESS, HOURS } from "../../../../../src/lib/business";

/*
 * PROPUESTA (PRI-286, ronda 5): producto de una sola foto (sin otras vistas). Donde iban las miniaturas, los 3 pasos del
 * pedido con la misma lista de filetes de Quiénes somos (.sf-razones): reparten su alto hasta el borde de abajo de la
 * foto, así el panel cierra igual que con miniaturas. Al construir va en ViewerPage cuando item.photos.length === 1
 * (sin JavaScript). Aquí entra con un portal para no tocar src/. Dirección y horario salen de business.ts.
 */

const PASOS = [
  { n: "01", title: "Escríbenos con esta foto", copy: "Dinos cuántas y si las quieres iguales o con tu logo." },
  { n: "02", title: "Te cotizamos por el chat", copy: "Precio y fecha de entrega en la misma conversación." },
  { n: "03", title: "Recógela en el taller", copy: `${ADDRESS ?? "Cartagena"} · ${HOURS[0].short}, ${HOURS[0].time}` },
];

export function PasosPedido() {
  return (
    <div className="sf-pasos-pedido sf-razones">
      <h2 className="sf-etiqueta">Así la pides</h2>
      <ol className="flex flex-col">
        {PASOS.map((p) => (
          <li key={p.n} className="flex">
            <span className="font-display font-medium leading-none text-accent">{p.n}</span>
            <div>
              <h3>{p.title}</h3>
              <p className="mt-0.5 text-muted">{p.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Envuelve el visor y, si el producto tiene una sola foto, agrega los pasos al final del panel. */
export function ConPasos({ children }: { children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [panel, setPanel] = useState<Element | null>(null);
  useLayoutEffect(() => setPanel(caja.current?.querySelector("main > div:has(> div > ul[aria-label^='Fotos de']) > div:last-child") ?? null), []);
  return (
    <div ref={caja}>
      {children}
      {panel && createPortal(<PasosPedido />, panel)}
    </div>
  );
}
