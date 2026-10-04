import { Code, PageFrame, PageTitle, Row } from "../Chrome";

type Swatch = { token: string; hex: string; role: string; cls: string; swatch: string };

// Valores literales de src/styles/tokens.css. La clase del swatch es la utilidad real del token.
const GROUPS: { name: string; description: string; items: Swatch[] }[] = [
  {
    name: "Fondo",
    description: "primary es el FONDO de página, no el acento. El nombre es herencia; no lo uses para botones.",
    items: [
      { token: "primary", hex: "#17160f", role: "Fondo de página", cls: "bg-primary", swatch: "bg-primary" },
      { token: "primary-light", hex: "#242218", role: "Campos de formulario", cls: "bg-primary-light", swatch: "bg-primary-light" },
      { token: "primary-lighter", hex: "#312e22", role: "Bordes de campos (legado)", cls: "border-primary-lighter", swatch: "bg-primary-lighter" },
    ],
  },
  {
    name: "Superficies y bordes",
    description: "Dos niveles de superficie y un solo color de línea. La elevación se lee por superficie, no por sombra.",
    items: [
      { token: "surface", hex: "#1f1d15", role: "Cards, paneles", cls: "bg-surface", swatch: "bg-surface" },
      { token: "surface-2", hex: "#2a271c", role: "Elemento dentro de card", cls: "bg-surface-2", swatch: "bg-surface-2" },
      { token: "line", hex: "#3a3627", role: "Bordes y divisores", cls: "border-line", swatch: "bg-line" },
    ],
  },
  {
    name: "Texto",
    description: "Dos tonos. ink para todo lo que se lee primero, muted para soporte. No uses text-white.",
    items: [
      { token: "ink", hex: "#F4F1E6", role: "Texto principal", cls: "text-ink", swatch: "bg-ink" },
      { token: "muted", hex: "#B8B6AA", role: "Texto secundario", cls: "text-muted", swatch: "bg-muted" },
    ],
  },
  {
    name: "Marca",
    description: "El dorado del logo es el único acento. accent-soft para fondos sutiles, accent-deep y secondary como apoyo.",
    items: [
      { token: "accent", hex: "#FFD700", role: "CTA, foco, énfasis", cls: "bg-accent / text-accent", swatch: "bg-accent" },
      { token: "accent-soft", hex: "#FFD70020", role: "Fondo tenue de acento", cls: "bg-accent-soft", swatch: "bg-accent-soft" },
      { token: "accent-deep", hex: "#a8890a", role: "Dorado oscuro, hover/borde", cls: "bg-accent-deep", swatch: "bg-accent-deep" },
      { token: "secondary", hex: "#D2BD3C", role: "Dorado apagado de apoyo", cls: "text-secondary", swatch: "bg-secondary" },
    ],
  },
  {
    name: "Estados",
    description: "Solo dos. Siempre acompañados de texto o icono, nunca el color solo.",
    items: [
      { token: "ok", hex: "#4ADE80", role: "Éxito, disponible", cls: "text-ok", swatch: "bg-ok" },
      { token: "danger", hex: "#FF6B6B", role: "Error, agotado", cls: "text-danger", swatch: "bg-danger" },
    ],
  },
];

// Ratios WCAG 2.x calculados con la fórmula de luminancia relativa (sRGB), no estimados.
const BGS = [
  { name: "primary", cls: "bg-primary" },
  { name: "surface", cls: "bg-surface" },
  { name: "surface-2", cls: "bg-surface-2" },
];
const CONTRAST: { token: string; cls: string; ratios: number[] }[] = [
  { token: "ink", cls: "text-ink", ratios: [16.04, 14.92, 13.21] },
  { token: "muted", cls: "text-muted", ratios: [8.9, 8.28, 7.34] },
  { token: "accent", cls: "text-accent", ratios: [12.93, 12.03, 10.65] },
  { token: "secondary", cls: "text-secondary", ratios: [9.57, 8.9, 7.89] },
  { token: "ok", cls: "text-ok", ratios: [10.41, 9.68, 8.57] },
  { token: "danger", cls: "text-danger", ratios: [6.53, 6.08, 5.38] },
  { token: "accent-deep", cls: "text-accent-deep", ratios: [5.39, 5.02, 4.45] },
];

function grade(r: number) {
  if (r >= 7) return { label: "AAA", cls: "text-ok" };
  if (r >= 4.5) return { label: "AA", cls: "text-ok" };
  if (r >= 3) return { label: "AA grande", cls: "text-secondary" };
  return { label: "falla", cls: "text-danger" };
}

export function BoardColor() {
  return (
    <PageFrame family="foundations" width={1300}>
      <PageTitle
        title="Color"
        description={
          <>
            14 tokens <Code>--color-*</Code> en <Code>tokens.css</Code>. Cada uno genera utilidades de Tailwind
            (<Code>bg-</Code>, <Code>text-</Code>, <Code>border-</Code>). Nunca escribas el hex: usa la clase.
          </>
        }
      />

      {GROUPS.map((g) => (
        <Row key={g.name} name={g.name} description={g.description}>
          <div className="grid grid-cols-4 gap-4">
            {g.items.map((s) => (
              <div key={s.token} className="flex flex-col overflow-hidden rounded-tile border border-line bg-primary">
                <div className={`h-20 ${s.swatch}`} />
                <div className="flex flex-col gap-1 p-3">
                  <div className="text-[14px] font-semibold">{s.token}</div>
                  <div className="font-mono text-[12px] text-muted">{s.hex}</div>
                  <div className="text-[13px] text-muted">{s.role}</div>
                  <div className="pt-1">
                    <Code>{s.cls}</Code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Row>
      ))}

      <Row
        name="Contraste"
        description={
          <>
            Texto de cada token sobre los tres fondos. AA pide 4.5:1 para texto normal y 3:1 para texto grande (24 px, o
            19 px en negrita). <Code>line</Code> (1.50:1 sobre primary) es decorativo: no sirve como único borde de un
            control.
          </>
        }
      >
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="text-[12px] uppercase tracking-[.1em] text-muted">
              <th className="pb-3 font-medium">Token</th>
              {BGS.map((b) => (
                <th key={b.name} className="pb-3 font-medium">
                  sobre {b.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTRAST.map((c) => (
              <tr key={c.token} className="border-t border-line">
                <td className="py-2 pr-4">
                  <Code>{c.cls}</Code>
                </td>
                {c.ratios.map((r, i) => {
                  const g = grade(r);
                  return (
                    <td key={i} className="py-2 pr-4">
                      <div className={`flex items-center gap-3 rounded-tile px-3 py-2 ${BGS[i].cls}`}>
                        <span className={`font-display text-[15px] font-bold ${c.cls}`}>Aa</span>
                        <span className="font-mono text-[13px] text-ink">{r.toFixed(2)}:1</span>
                        <span className={`text-[12px] font-semibold ${g.cls}`}>{g.label}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[13px] text-muted">
          <Code>text-primary</Code> sobre <Code>bg-accent</Code> (botón principal): 12.93:1. <Code>accent-deep</Code> sobre
          surface-2 queda en 4.45:1: solo para texto grande o bordes.
        </p>
      </Row>
    </PageFrame>
  );
}
