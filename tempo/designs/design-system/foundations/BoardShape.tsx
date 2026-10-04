import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

const SPACING = [1, 2, 3, 4, 6, 8, 12, 14];

export function BoardShape() {
  return (
    <PageFrame family="foundations" width={1200}>
      <PageTitle
        title="Forma, espaciado y textura"
        description={
          <>
            Tres radios, la escala de 4 px de Tailwind, un mínimo de 44 px para tocar y una trama de tela hecha solo con CSS.
          </>
        }
      />

      <Row
        name="Radios"
        description={
          <>
            <Code>--radius-tile</Code> 12 px para piezas pequeñas (swatch, miniatura, input), <Code>--radius-card</Code> 20
            px para cards y paneles, <Code>rounded-full</Code> para pills y botones.
          </>
        }
      >
        <div className="flex items-end gap-8">
          {[
            { cls: "rounded-tile", label: "rounded-tile · 12px", size: "h-20 w-20" },
            { cls: "rounded-card", label: "rounded-card · 20px", size: "h-28 w-40" },
            { cls: "rounded-full", label: "rounded-full · pill", size: "h-11 w-40" },
          ].map((r) => (
            <div key={r.cls} className="flex flex-col items-start gap-3">
              <div className={`${r.size} ${r.cls} border border-line bg-surface-2`} />
              <Code>{r.label}</Code>
            </div>
          ))}
        </div>
      </Row>

      <Row
        name="Ritmo de espaciado"
        description={
          <>
            Escala de 4 px de Tailwind (1 = 4 px). Secciones: <Code>px-4 py-8</Code> en mobile,{" "}
            <Code>px-12 py-14</Code> en desktop, como en la dirección aprobada.
          </>
        }
      >
        <div className="flex flex-col gap-2">
          {SPACING.map((n) => (
            <div key={n} className="flex items-center gap-4">
              <div className="w-16 font-mono text-[12px] text-muted">{n} · {n * 4}px</div>
              <div className="h-3 rounded-full bg-accent" style={{ width: n * 4 * 2 }} />
            </div>
          ))}
        </div>
        <div className="flex gap-6 pt-2">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] text-muted">Mobile 375 · px-4 py-8</div>
            <div className="w-[188px] rounded-tile border border-dashed border-line px-2 py-4">
              <div className="h-16 rounded-tile bg-surface-2" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[12px] text-muted">Desktop · px-12 py-14</div>
            <div className="w-[420px] rounded-tile border border-dashed border-line px-6 py-7">
              <div className="h-16 rounded-tile bg-surface-2" />
            </div>
          </div>
        </div>
        <div className="text-[12px] text-muted">Diagrama a escala 1:2.</div>
      </Row>

      <Row
        name="Objetivo táctil"
        description={
          <>
            44 px mínimo en alto y ancho para todo lo que se toca: <Code>min-h-11 min-w-11</Code> o{" "}
            <Code>min-h-[44px]</Code>. El sitio ya lo hace en las flechas del slideshow.
          </>
        }
      >
        <Demo label="44px">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink">
            ‹
            <span className="absolute inset-0 rounded-full outline outline-1 outline-dashed outline-accent/60" />
          </span>
          <span className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-6 font-display text-[15px] font-bold text-primary">
            Escríbenos
          </span>
          <span className="inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-[14px] text-ink">
            Camisetas
          </span>
        </Demo>
        <Demo label="evitar">
          <span className="inline-flex h-7 items-center rounded-full border border-danger/60 px-3 text-[13px] text-muted">
            28px: muy pequeño para el pulgar
          </span>
        </Demo>
      </Row>

      <Row
        name="Textura fabric"
        description={
          <>
            Utilidad <Code>fabric</Code> de <Code>tokens.css</Code>: dos <Code>repeating-linear-gradient</Code> a 45° y
            -45°. 0 KB de imagen. Solo sobre <Code>bg-surface</Code> o <Code>bg-primary</Code>, nunca detrás de texto
            pequeño denso.
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex h-40 flex-col justify-end rounded-card border border-line bg-surface p-5">
            <Code>bg-surface</Code>
          </div>
          <div className="fabric flex h-40 flex-col justify-end rounded-card border border-line bg-surface p-5">
            <Code>bg-surface fabric</Code>
          </div>
        </div>
      </Row>

      <Row
        name="Foco"
        description={
          <>
            <Code>global.css</Code> define <Code>:focus-visible</Code> con <Code>outline: 2px solid var(--color-accent)</Code>{" "}
            y <Code>outline-offset: 2px</Code>. No lo quites con <Code>outline-none</Code> sin poner otro igual de visible.
          </>
        }
      >
        <Demo label="focus-visible">
          <span className="inline-flex min-h-[44px] items-center rounded-full bg-surface-2 px-6 text-[15px] text-ink outline outline-2 outline-offset-2 outline-accent">
            Ver catálogo
          </span>
          <span className="inline-flex min-h-[44px] items-center rounded-tile border border-line bg-primary-light px-4 text-[14px] text-muted outline outline-2 outline-offset-2 outline-accent">
            Tu nombre
          </span>
        </Demo>
      </Row>
    </PageFrame>
  );
}
