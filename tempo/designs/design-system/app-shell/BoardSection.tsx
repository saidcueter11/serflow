import type { ReactNode } from "react";
import { Section } from "../../../../src/components/ui/Section";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { QuienesCopy } from "./portada";

function Frame({ width, label, children }: { width: number; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[12px] text-muted">{label}</span>
      <div className="pf overflow-hidden rounded-card border border-line bg-primary" style={{ width }}>
        <div className="pf-v">{children}</div>
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
      <Frame width={1280} label="1280 · desde 48rem">
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
            La sección del sistema medido (PRI-286): margen 16 / 48, aire 64 / 96 arriba, título h2 34 / 48 y bajada 12
            debajo; <Code>scroll-mt-4</Code> para las anclas. Props: <Code>id</Code>, <Code>title</Code>,{" "}
            <Code>description</Code>, <Code>action</Code>, <Code>children</Code>. Va dentro de una página <Code>.pf</Code>.
          </>
        }
      />

      <Row name="Título y bajada" description="El caso por defecto: título, bajada opcional y contenido.">
        <Pair>
          {(w) => (
            <Section id={`plain-${w}`} title="Quiénes somos">
              <QuienesCopy className="text-[16px]" />
            </Section>
          )}
        </Pair>
      </Row>

      <Row name="Con acción" description="La acción secundaria en la fila del título (desktop) o al pie, a lo ancho (celular).">
        <Pair>
          {(w) => (
            <Section
              id={`accion-${w}`}
              title="Disponible ahora"
              description="Lo que hay en el taller esta semana."
              action={{ label: "Ver todo →", href: "/products/mi-tierra-querida" }}
            >
              <div className="h-24 rounded-tile bg-surface-2" />
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
