import type { ReactNode } from "react";
import { Section } from "../../../../src/components/ui/Section";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { Button } from "../../../../src/components/ui/Button";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { QuienesCopy } from "./portada";

function Frame({ width, label, children }: { width: number; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[12px] text-muted">{label}</span>
      <div className="overflow-hidden rounded-card border border-line bg-primary" style={{ width }}>
        {children}
      </div>
    </div>
  );
}

function Pair({ children }: { children: (w: "m" | "d") => ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      <Frame width={390} label="390 · móvil">
        {children("m")}
      </Frame>
      <Frame width={800} label="800 · desde @3xl (768)">
        {children("d")}
      </Frame>
    </div>
  );
}

export function BoardSection() {
  return (
    <PageFrame family="shell" width={1760}>
      <PageTitle
        title="Section"
        description={
          <>
            El envoltorio de cada bloque del home. Padding px-4 py-8 en móvil y px-12 py-14 desde 768px; título h2 en{" "}
            <Code>font-display</Code> 28 / 40px; <Code>scroll-mt-4</Code> para las anclas. Props: <Code>id</Code>,{" "}
            <Code>eyebrow</Code>, <Code>title</Code>, <Code>description</Code>, <Code>children</Code>, <Code>tone</Code>.
          </>
        }
      />

      <Row
        name="Plain · con eyebrow"
        description="Eyebrow solo cuando suma contexto (una campaña, el taller). La mayoría de secciones del home no lo llevan."
      >
        <Pair>
          {(w) => (
            <Section id={`plain-eyebrow-${w}`} eyebrow="Taller en Cartagena" title="Quiénes somos">
              <QuienesCopy className="text-[16px]" />
            </Section>
          )}
        </Pair>
      </Row>

      <Row name="Plain · sin eyebrow" description="El caso por defecto: título, descripción opcional y contenido.">
        <Pair>
          {(w) => (
            <Section
              id={`plain-${w}`}
              title="Disponible ahora"
              description="Lo que hay en el taller esta semana."
            >
              <Button variant="ghost" href="/products/mi-tierra-querida">
                Ver todo →
              </Button>
            </Section>
          )}
        </Pair>
      </Row>

      <Row
        name="Panel"
        description="Superficie rounded-card con trama fabric. Una por página: el cierre Hablemos. No la uses para destacar secciones al azar."
      >
        <Pair>
          {(w) => (
            <Section
              id={`panel-${w}`}
              title="Hablemos"
              description="Mándanos tu idea, una foto o el logo de tu negocio."
              tone="panel"
            >
              <ContactList />
              <div className="mt-4">
                <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth>
                  Escríbenos por WhatsApp
                </Button>
              </div>
            </Section>
          )}
        </Pair>
      </Row>

      <Row
        name="No es"
        description="No es el hero (el hero lleva h1 y su propio layout) ni una card. Sin max-w ni centrado: la página decide el ancho."
      >
        <div className="text-[14px] leading-relaxed text-muted">
          Sin props de horario ni <Code>flexRow</Code>: el horario es contenido (MapCard), no del envoltorio.
        </div>
      </Row>
    </PageFrame>
  );
}
