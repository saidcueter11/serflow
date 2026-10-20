import { useState, type ReactNode } from "react";

/* ---------------- Marco de demo en vivo (narración del canvas, no es producto) ---------------- */

export type Nivel = "muy bajo" | "bajo" | "medio";

export interface Costo {
  /** Qué propiedad anima: "transform, opacity" corre en la GPU; clip-path y box-shadow repintan. */
  mueve: string;
  js: string;
  nivel: Nivel;
  /** "Ya existe" o "Nuevo". */
  estado: "Ya existe" | "Nuevo" | "Cambia";
}

const NIVEL: Record<Nivel, string> = {
  "muy bajo": "border-ok/50 text-ok",
  bajo: "border-secondary/60 text-secondary",
  medio: "border-danger/60 text-danger",
};

function Pastilla({ children, className = "border-line text-muted" }: { children: ReactNode; className?: string }) {
  return <span className={`rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${className}`}>{children}</span>;
}

/**
 * Una animación en vivo: Repetir la vuelve a montar desde cero; "Reducir movimiento" la muestra como la ve quien
 * tiene esa opción activa (la misma regla de global.css). Las hover y tap se prueban con el mouse.
 */
export function Demo({
  titulo,
  texto,
  costo,
  ancho = 590,
  children,
}: {
  titulo: string;
  texto: ReactNode;
  costo: Costo;
  ancho?: number;
  children: ReactNode | ((rm: boolean) => ReactNode);
}) {
  const [k, setK] = useState(0);
  const [rm, setRm] = useState(false);
  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5" style={{ width: ancho }}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-bold">{titulo}</h3>
          <Pastilla className={costo.estado === "Ya existe" ? "border-line text-muted" : "border-accent text-accent"}>{costo.estado}</Pastilla>
        </div>
        <p className="text-[14px] leading-snug text-muted">{texto}</p>
      </div>
      <div key={k} className={`demo-stage relative overflow-hidden rounded-tile border border-line bg-primary ${rm ? "sim-rm" : ""}`}>
        {typeof children === "function" ? children(rm) : children}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Pastilla>Mueve: {costo.mueve}</Pastilla>
          <Pastilla>JS: {costo.js}</Pastilla>
          <Pastilla className={NIVEL[costo.nivel]}>Costo {costo.nivel}</Pastilla>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex min-h-9 cursor-pointer items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={rm} onChange={(e) => setRm(e.target.checked)} className="size-4 accent-[var(--color-accent)]" />
            Reducir movimiento
          </label>
          <button
            type="button"
            onClick={() => setK((n) => n + 1)}
            className="min-h-9 rounded-full border border-line px-4 text-[13px] font-semibold text-ink hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            ↻ Repetir
          </button>
        </div>
      </div>
    </div>
  );
}

export function Tablero({ titulo, texto, ancho = 1300, children }: { titulo: string; texto: ReactNode; ancho?: number; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 bg-primary p-10 font-body text-ink antialiased" style={{ width: ancho }}>
      <div className="flex max-w-[760px] flex-col gap-2">
        <div className="text-[12px] uppercase tracking-[.14em] text-accent">PRI-287 · Movimiento</div>
        <h2 className="font-display text-[28px] font-bold leading-tight tracking-tight">{titulo}</h2>
        <p className="text-[15px] leading-relaxed text-muted">{texto}</p>
      </div>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </div>
  );
}
