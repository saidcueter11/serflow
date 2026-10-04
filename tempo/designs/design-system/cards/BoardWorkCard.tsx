import type { ReactNode } from "react";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { WorkCard } from "../../../../src/components/ui/WorkCard";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { WORK_CAPS, WORK_DTF, WORK_POLO, WORK_SHIRTS } from "./samples";

const WORKS = [
  { src: WORK_CAPS, alt: "Dos gorras azules con escudo bordado", title: "Gorras bordadas para un equipo de fútbol", technique: "Bordado" },
  { src: WORK_SHIRTS, alt: "Dos camisetas blancas con logo estampado", title: "Camisetas estampadas para una carrera de barrio", technique: "Estampado" },
  { src: WORK_DTF, alt: "Camiseta negra con diseño a todo color", title: "Camiseta con foto en DTF para un cumpleaños", technique: "DTF" },
  { src: WORK_POLO, alt: "Camiseta verde con logo bordado en el pecho", title: "Uniformes para un restaurante" },
];

function Section({ count, width }: { count: number; width: number }) {
  const works = WORKS.slice(0, count);
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">
        {count} fotos · {width}px
      </div>
      <div
        className="rounded-tile border border-dashed border-line bg-primary p-4"
        style={{ width }}
      >
        {works.length > 0 ? (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
              <Eyebrow>Trabajos hechos</Eyebrow>
              <h2 className="font-display text-[22px] font-bold leading-tight text-ink">Lo que ya entregamos</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {works.map((w) => (
                <WorkCard
                  key={w.title}
                  image={{ src: w.src, alt: `${w.alt} (foto de ejemplo)` }}
                  title={w.title}
                  technique={w.technique}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="flex h-[120px] items-center justify-center text-center font-mono text-[12px] text-muted">
            0 fotos: la sección no se renderiza.
            <br />
            El home pasa directo a la siguiente.
          </div>
        )}
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      {children}
    </div>
  );
}

export function BoardWorkCard() {
  return (
    <PageFrame family="cards" width={1300}>
      <PageTitle
        title="WorkCard"
        description={
          <>
            Un trabajo terminado, foto primero. Props: <Code>image</Code>, <Code>title</Code> y <Code>technique</Code>{" "}
            opcional. Es un <Code>{"<figure>"}</Code>, no un link. El título describe el pedido sin nombrar clientes reales
            (salvo permiso). Las imágenes son siluetas marcadas como foto de ejemplo.
          </>
        }
      />

      <Row
        name="Anatomía"
        description="Foto 4:5 (width/height fijos, lazy) y debajo la técnica en StatusPill muted más el título. El texto va fuera de la foto: sobre fotos reales no se puede garantizar contraste."
      >
        <div className="grid grid-cols-4 gap-4">
          <Labeled label="con technique">
            <WorkCard
              image={{ src: WORK_CAPS, alt: "Dos gorras azules con escudo bordado (foto de ejemplo)" }}
              title="Gorras bordadas para un equipo de fútbol"
              technique="Bordado"
            />
          </Labeled>
          <Labeled label="sin technique">
            <WorkCard
              image={{ src: WORK_POLO, alt: "Camiseta verde con logo bordado en el pecho (foto de ejemplo)" }}
              title="Uniformes para un restaurante"
            />
          </Labeled>
        </div>
      </Row>

      <Row
        name="Grid"
        description="2 columnas en móvil, 4 en desktop. Cuantas fotos haya: 1, 3 o 20."
      >
        <Labeled label="desktop · grid-cols-4">
          <div className="grid grid-cols-4 gap-4 rounded-tile border border-dashed border-line bg-primary p-4">
            {WORKS.map((w) => (
              <WorkCard
                key={w.title}
                image={{ src: w.src, alt: `${w.alt} (foto de ejemplo)` }}
                title={w.title}
                technique={w.technique}
              />
            ))}
          </div>
        </Labeled>
      </Row>

      <Row
        name="Regla: sin fotos no hay sección"
        description="Con cero fotos, la sección Trabajos hechos completa (eyebrow, título y grid) no se renderiza. Nada de 'Próximamente' ni placeholders."
      >
        <div className="flex items-start gap-6">
          <Section count={0} width={375} />
          <Section count={2} width={375} />
        </div>
        <Code>{"{works.length > 0 && <section>…<WorkCard … /></section>}"}</Code>
      </Row>

      <Row name="No es" description="No es link, ni catálogo, ni testimonio.">
        <div className="text-[14px] leading-relaxed text-muted">
          Una prenda que se puede pedir es <strong className="text-ink">ProductCard</strong>. Una técnica es{" "}
          <strong className="text-ink">ServiceCard</strong>. No uses fotos de stock como trabajos hechos: si el taller no lo
          hizo, no va aquí.
        </div>
      </Row>
    </PageFrame>
  );
}
