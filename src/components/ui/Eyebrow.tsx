import type { ReactNode } from "react";

/**
 * Etiqueta en píldora sobre el título de una sección: punto dorado + texto corto.
 *
 * The canvas for this component is at tempo/designs/design-system/labels/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-body text-[12px] font-medium text-muted">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
      {children}
    </span>
  );
}
