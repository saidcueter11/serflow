import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

// Escala tomada de la dirección aprobada (tempo/designs/canvases/noche-caribe-direcciones/NocheCaribe.tsx).
const DISPLAY = [
  { px: 68, role: "Hero desktop", copy: "Camisetas y gorras con tu sello." },
  { px: 40, role: "Título de sección desktop", copy: "Qué hacemos" },
  { px: 28, role: "Título de sección mobile", copy: "Dónde estamos" },
  { px: 22, role: "Subtítulo, numeral", copy: "Disponible ahora" },
];

const BODY = [
  { px: 19, role: "Lead desktop", copy: "Estampamos, imprimimos en DTF y bordamos en Cartagena." },
  { px: 16, role: "Párrafo, título de card", copy: "Ven al taller o escríbenos y lo armamos contigo." },
  { px: 15, role: "Botón, texto de apoyo", copy: "Camisetas y gorras, con la técnica que mejor le quede a tu diseño." },
  { px: 14, role: "Lista, metadato", copy: "Lunes a sábado · 8 a.m. a 6 p.m." },
  { px: 13, role: "Nota, pie", copy: "Camisetas y gorras personalizadas · Cartagena, Colombia" },
  { px: 12, role: "Eyebrow, etiqueta", copy: "Taller en Cartagena" },
];

export function BoardTypography() {
  return (
    <PageFrame family="foundations" width={1200}>
      <PageTitle
        title="Tipografía"
        description={
          <>
            Dos familias. <Code>font-display</Code> (Space Grotesk 500/700) para titulares y cifras;{" "}
            <Code>font-body</Code> (la fuente del sistema) para todo lo demás: cero descarga, se lee bien con mala señal.
          </>
        }
      />

      <Row
        name="Familias"
        description="Display solo en titulares, numerales y el botón principal. Si dudas, es body."
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 rounded-tile border border-line bg-primary p-5">
            <Code>font-display</Code>
            <div className="font-display text-[40px] font-medium leading-[1.05]">Aa Gg 1234</div>
            <div className="text-[13px] text-muted">
              --font-display: 'Space Grotesk', system-ui, sans-serif. Pesos 500 (medium) y 700 (bold).
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-tile border border-line bg-primary p-5">
            <Code>font-body</Code>
            <div className="font-body text-[40px] leading-[1.05]">Aa Gg 1234</div>
            <div className="text-[13px] text-muted">
              --font-body: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif. Regular y semibold.
            </div>
          </div>
        </div>
      </Row>

      <Row
        name="Escala display"
        description={
          <>
            <Code>font-display</Code>, <Code>leading-[1.05]</Code>, <Code>tracking-[-0.01em]</Code>. Mobile baja un
            escalón: el hero mobile va en 38 px.
          </>
        }
      >
        {DISPLAY.map((t) => (
          <Demo key={t.px} label={`${t.px}px`}>
            <div className="flex flex-col gap-1">
              <div
                className="font-display font-medium leading-[1.05] tracking-[-0.01em]"
                style={{ fontSize: t.px }}
              >
                {t.copy}
              </div>
              <div className="text-[12px] text-muted">
                {t.role} · <Code>{`text-[${t.px}px]`}</Code>
              </div>
            </div>
          </Demo>
        ))}
      </Row>

      <Row
        name="Escala body"
        description={
          <>
            <Code>font-body</Code>. Párrafos en 16 px con <Code>leading-relaxed</Code> y <Code>text-muted</Code>; nada por
            debajo de 12 px.
          </>
        }
      >
        {BODY.map((t) => (
          <Demo key={t.px} label={`${t.px}px`}>
            <div className="flex flex-col gap-1">
              <div className="leading-relaxed text-ink" style={{ fontSize: t.px }}>
                {t.copy}
              </div>
              <div className="text-[12px] text-muted">
                {t.role} · <Code>{`text-[${t.px}px]`}</Code>
              </div>
            </div>
          </Demo>
        ))}
      </Row>

      <Row name="En contexto" description="Bloque hero mobile de la dirección aprobada, con los tokens.">
        <div className="max-w-[400px] rounded-card bg-primary p-6">
          <div className="text-[12px] font-medium text-muted">Taller en Cartagena</div>
          <div className="mt-3 font-display text-[38px] font-medium leading-[1.05] tracking-[-0.01em]">
            Camisetas y gorras con tu sello.
          </div>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">
            Estampamos, imprimimos en DTF y bordamos en Cartagena. Ven al taller o escríbenos.
          </p>
        </div>
      </Row>
    </PageFrame>
  );
}
