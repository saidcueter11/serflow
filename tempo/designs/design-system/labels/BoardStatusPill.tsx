import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

/* Contraste WCAG del texto sobre su fondo tintado, ya compuesto sobre cada superficie. */
const RATIOS = [
  { tone: "ok", text: "Abierto ahora", bg: "bg-ok/10", surface: "7.9:1", primary: "8.6:1" },
  { tone: "accent", text: "Confirmado hace 2 días", bg: "bg-accent/12", surface: "9.0:1", primary: "9.8:1" },
  { tone: "muted", text: "Cerrado", bg: "bg-surface-2", surface: "7.3:1", primary: "7.3:1" },
] as const;

export function BoardStatusPill() {
  return (
    <PageFrame family="etiquetas" width={1100}>
      <PageTitle
        title="StatusPill"
        description={
          <>
            Estado corto y compacto: tono + punto opcional + texto. Tres tonos, ninguno nuevo: <Code>ok</Code> para
            abierto, <Code>accent</Code> para disponible o confirmado, <Code>muted</Code> para cerrado o inactivo. El
            punto es decorativo (<Code>aria-hidden</Code>); el texto siempre dice el estado.
          </>
        }
      />

      <Row name="Tonos" description="Copy real del sitio. El tono acompaña al texto, nunca lo sustituye.">
        <Demo label="ok">
          <StatusPill tone="ok">Abierto ahora</StatusPill>
        </Demo>
        <Demo label="accent">
          <StatusPill tone="accent">Disponible · confirmado hace 2 días</StatusPill>
          <StatusPill tone="accent">Confirmado hace 2 días</StatusPill>
        </Demo>
        <Demo label="muted">
          <StatusPill tone="muted">Cerrado</StatusPill>
        </Demo>
      </Row>

      <Row
        name="Con y sin punto"
        description="dot es true por defecto. Quítalo cuando la píldora va pegada a otra señal (un ícono, un título que ya dice el estado)."
      >
        <Demo label="dot">
          <StatusPill tone="ok">Abierto ahora</StatusPill>
          <StatusPill tone="accent">Confirmado hace 2 días</StatusPill>
          <StatusPill tone="muted">Cerrado</StatusPill>
        </Demo>
        <Demo label="dot={false}">
          <StatusPill tone="ok" dot={false}>
            Abierto ahora
          </StatusPill>
          <StatusPill tone="accent" dot={false}>
            Confirmado hace 2 días
          </StatusPill>
          <StatusPill tone="muted" dot={false}>
            Cerrado
          </StatusPill>
        </Demo>
      </Row>

      <Row
        name="Sobre surface y primary"
        description="El fondo tintado es translúcido, así que el contraste se mide compuesto sobre cada superficie. Todos pasan AA (4.5:1) con holgura."
      >
        <div className="grid grid-cols-2 gap-4">
          {(["surface", "primary"] as const).map((s) => (
            <div
              key={s}
              className={`flex flex-col gap-3 rounded-tile border border-line p-4 ${s === "surface" ? "bg-surface" : "bg-primary"}`}
            >
              <div className="font-mono text-[12px] text-muted">bg-{s}</div>
              {RATIOS.map((r) => (
                <div key={r.tone} className="flex items-center justify-between gap-3">
                  <StatusPill tone={r.tone}>{r.text}</StatusPill>
                  <span className="font-mono text-[12px] text-ink">{s === "surface" ? r.surface : r.primary}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="font-mono text-[12px] text-muted">
          ok #4ADE80 sobre ok/10 · accent #FFD700 sobre accent/12 · muted #B8B6AA sobre surface-2
        </div>
      </Row>

      <Row name="No es" description="No se toca: no lleva href ni onClick.">
        <div className="text-[14px] leading-relaxed text-muted">
          Para una opción elegible usa <strong className="text-ink">Chip</strong>; para nombrar una sección,{" "}
          <strong className="text-ink">Eyebrow</strong>. Nada de emojis como estado (🕐): el horario va en texto y el
          estado en StatusPill.
        </div>
      </Row>
    </PageFrame>
  );
}
