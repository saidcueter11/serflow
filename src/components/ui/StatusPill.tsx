import type { ReactNode } from "react";

/**
 * Etiqueta compacta de estado: "Abierto ahora" (ok), "Disponible · confirmado
 * hace 2 días" (accent), "Cerrado" (muted). Texto y fondo tintado pasan AA
 * sobre surface y primary (ok 7.9:1, accent 9.0:1, muted 7.3:1).
 *
 * The canvas for this component is at tempo/designs/design-system/labels/index.canvas.tsx.
 * If you adjust this component in any way, ensure the canvas and its asset
 * declaration stay consistent.
 */
const TONE = {
  ok: { pill: "bg-ok/10 text-ok", dot: "bg-ok" },
  accent: { pill: "bg-accent/12 text-accent", dot: "bg-accent" },
  muted: { pill: "bg-surface-2 text-muted", dot: "bg-muted" },
} as const;

export function StatusPill({
  tone,
  children,
  dot = true,
}: {
  tone: "ok" | "accent" | "muted";
  children: ReactNode;
  dot?: boolean;
}) {
  const t = TONE[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[12px] font-semibold ${t.pill}`}>
      {dot && <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${t.dot}`} />}
      {children}
    </span>
  );
}
