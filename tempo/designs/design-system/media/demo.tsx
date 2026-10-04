/// <reference types="vite/client" />
import type { ReactNode } from "react";
import store1 from "../../../../src/assets/store1.jpg";
import store2 from "../../../../src/assets/store2.jpg";
import hat1 from "../../../../src/assets/hat1.jpg";

/*
 * Fotos de ejemplo para los storyboards. Son fotos de stock que ya están en
 * src/assets; NO son del cliente y no se deben usar en el sitio.
 */
export const DEMO = { local: store1, estanterias: store1, equipo: store2, trabajo: hat1 };

/** Envuelve una demo con la etiqueta obligatoria. */
export function DemoPhoto({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2" style={{ width }}>
      <span className="self-start rounded-full border border-dashed border-line px-2 py-0.5 text-[10px] uppercase tracking-[.08em] text-muted">
        foto de ejemplo, no es del cliente
      </span>
      {children}
    </div>
  );
}

/** Contorno punteado que dibuja el storyboard (no el componente) donde PhotoSlot no renderiza nada. */
export function EmptyOutline({ width, ratio, label }: { width: number; ratio: string; label: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-card border-2 border-dashed border-line p-4 text-center text-[12px] leading-snug text-muted"
      style={{ width, aspectRatio: ratio }}
    >
      {label}
    </div>
  );
}
