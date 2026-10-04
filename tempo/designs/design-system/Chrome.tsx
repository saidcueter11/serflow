import type { ReactNode } from "react";

/**
 * Chrome compartido de los canvases del design system de Serflow.
 * Cada storyboard se renderiza dentro de <PageFrame> para que la serie se lea
 * como un solo documento. Es andamiaje de presentación, no código de producto.
 */

export function PageFrame({ family, width, children }: { family: string; width: number; children: ReactNode }) {
  return (
    <div className="min-h-full bg-primary font-body text-ink antialiased" style={{ width }}>
      <div className="flex h-[52px] items-center gap-3 border-b border-line px-12 text-[12px] uppercase tracking-[.14em]">
        <span className="text-muted">design system</span>
        <span className="text-line">·</span>
        <span className="text-accent">{family}</span>
      </div>
      <div className="px-12 py-12">{children}</div>
    </div>
  );
}

export function PageTitle({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="flex max-w-[560px] flex-col gap-3 pb-10">
      <h1 className="font-display text-[26px] font-bold leading-[32px] tracking-tight">{title}</h1>
      <p className="text-[15px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}

/** Fila de guía: nombre + descripción a la izquierda, demo en vivo a la derecha. */
export function Row({ name, description, children }: { name: string; description: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-12 border-t border-line py-10 first:border-t-0">
      <div className="flex flex-col gap-2 pt-2">
        <div className="text-[15px] font-semibold">{name}</div>
        <div className="text-[14px] leading-snug text-muted">{description}</div>
      </div>
      <div className="flex min-h-[110px] min-w-0 flex-col justify-center gap-5 rounded-card border border-line bg-surface p-6">
        {children}
      </div>
    </div>
  );
}

/** Una línea de demo dentro de un Row. */
export function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-24 shrink-0 font-mono text-[12px] text-muted">{label}</div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-tile border border-line bg-surface p-4">
      <div className="pb-2 text-[11px] uppercase tracking-[.14em] text-muted">{label}</div>
      <div className="font-display text-[24px] font-bold">{value}</div>
      <div className="pt-1 text-[13px] text-muted">{detail}</div>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[12px] text-ink">{children}</code>;
}

/* ---------------- Tablero de deuda ---------------- */

type TileTone = "neutral" | "target" | "remove" | "warn";

const TILE: Record<TileTone, { border: string; label: string }> = {
  neutral: { border: "#3a3627", label: "#B8B6AA" },
  target: { border: "#34d399", label: "#4ade80" },
  remove: { border: "#7f1d1d", label: "#f87171" },
  warn: { border: "#78560f", label: "#fbbf24" },
};

export function Tile({
  tone = "neutral",
  label,
  reimplemented,
  children,
}: {
  tone?: TileTone;
  label: string;
  /** El contenido se recrea porque el original vive en un .astro y no se puede renderizar aislado. */
  reimplemented?: boolean;
  children: ReactNode;
}) {
  const c = TILE[tone];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex min-h-[64px] min-w-[64px] items-center justify-center rounded-tile px-4 py-3 ${reimplemented ? "pt-7" : ""}`}
        style={{ border: `1px solid ${c.border}` }}
      >
        {children}
        {reimplemented && (
          <span className="absolute left-2 top-1.5 text-[9px] font-semibold uppercase tracking-wider text-amber-400">
            reimplemented for display
          </span>
        )}
      </div>
      <span className="font-mono text-[12px]" style={{ color: c.label }}>
        {label}
      </span>
    </div>
  );
}

export function Arrow() {
  return <div className="mt-[22px] text-muted">→</div>;
}

export interface DebtRow {
  title: string;
  body: ReactNode;
  bullets: ReactNode[];
  fix: ReactNode;
  visual: ReactNode;
}

export function DebtBoard({ family, rows }: { family: string; rows: DebtRow[] }) {
  return (
    <PageFrame family={family} width={1400}>
      <PageTitle
        title="Design System Debt"
        description="Los otros storyboards de este canvas muestran el estado final. Este lista los cambios de código que llevan ahí, con evidencia y un fix propuesto por fila. Producción NO se toca en esta pasada: cada fila es una propuesta. Las tiles marcadas 'reimplemented for display' recrean código que vive dentro de un .astro y no se puede renderizar aislado; esas recreaciones existen solo en este storyboard."
      />
      <div className="flex flex-col">
        {rows.map((row) => (
          <div key={row.title} className="grid grid-cols-[280px_1fr] gap-12 border-b border-line py-8">
            <div className="text-[15px] font-semibold leading-snug">{row.title}</div>
            <div className="flex flex-col gap-4">
              <div className="text-[14px] leading-relaxed text-muted">{row.body}</div>
              <ul className="flex flex-col gap-2">
                {row.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed">
                    <span className="select-none text-line">•</span>
                    <span className="text-muted">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[14px] leading-relaxed">
                <span className="font-semibold text-ok">Fix</span>
                <span className="text-muted"> · </span>
                {row.fix}
              </div>
              {row.visual}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 max-w-[720px] rounded-tile border border-line bg-surface px-5 py-4 text-[14px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Declara al migrar.</span> Cada migración de un .astro al componente nuevo
        termina con el componente usado desde <Code>src/components/ui</Code> y el .astro borrado, para que no queden dos
        fuentes de verdad.
      </div>
    </PageFrame>
  );
}
