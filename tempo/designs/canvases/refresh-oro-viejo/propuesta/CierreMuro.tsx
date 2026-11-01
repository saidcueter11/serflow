import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../../../../../src/components/ui/Button";
import { whatsappUrl } from "../../../../../src/lib/business";
import { FOTOS } from "../comun";

/*
 * PROPUESTA (PRI-286, ronda 4): la tarjeta que cierra la última fila del muro. Al construir va como último <li> de la
 * lista de CatalogPage (sin JavaScript); cuántas celdas ocupa y si lleva foto lo decide el CSS (refresh-r3.css, "Última
 * fila del muro"). Aquí se agrega con un portal para no tocar src/.
 */

export function CierreMuro() {
  return (
    <li className="sf-cierre">
      <div className="sf-cierre-texto">
        <div>
          <h2>¿No ves la que buscas?</h2>
          <p>Te la hacemos con tu logo o tu diseño.</p>
        </div>
        <Button variant="whatsapp" href={whatsappUrl("¡Hola! No vi en el catálogo la prenda que busco. Quiero una con...")} external>
          Escríbenos
        </Button>
      </div>
      <div className="sf-cierre-foto" aria-hidden="true">
        <img src={FOTOS.estampadoProceso} alt="" loading="lazy" decoding="async" />
        <span>En el taller</span>
      </div>
    </li>
  );
}

/** Envuelve una página de catálogo y le agrega la tarjeta al final de su muro. */
export function ConCierre({ children }: { children: ReactNode }) {
  const caja = useRef<HTMLDivElement>(null);
  const [muro, setMuro] = useState<Element | null>(null);
  useLayoutEffect(() => setMuro(caja.current?.querySelector("ul.columns-2") ?? null), []);
  return (
    <div ref={caja}>
      {children}
      {muro && createPortal(<CierreMuro />, muro)}
    </div>
  );
}
