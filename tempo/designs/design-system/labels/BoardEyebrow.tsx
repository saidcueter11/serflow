import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardEyebrow() {
  return (
    <PageFrame family="etiquetas" width={1100}>
      <PageTitle
        title="Eyebrow"
        description="Etiqueta corta sobre el título de una sección: punto dorado + texto muted en una píldora surface. Ubica al lector antes del título; nunca lo reemplaza. Muted sobre surface: 8.3:1."
      />

      <Row name="Forma" description="Una sola forma, sin props de estilo. Dos a cuatro palabras.">
        <Demo label="default">
          <Eyebrow>Taller en Cartagena</Eyebrow>
          <Eyebrow>Hecho a pedido</Eyebrow>
          <Eyebrow>Promociones</Eyebrow>
        </Demo>
      </Row>

      <Row
        name="En contexto"
        description="Arriba del título en font-display, 12px de separación. Reemplaza la barra dorada de Title.astro."
      >
        <div className="flex w-[390px] flex-col gap-3 rounded-tile bg-primary p-5">
          <div>
            <Eyebrow>Taller en Cartagena</Eyebrow>
          </div>
          <h2 className="font-display text-[32px] font-bold leading-[1.05] tracking-[-0.01em] text-ink">
            Tu camiseta, como la imaginas
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Escoge la prenda, dinos qué le ponemos y el taller te confirma por WhatsApp.
          </p>
        </div>
        <div className="flex w-[560px] flex-col gap-3 rounded-tile bg-primary p-6">
          <div>
            <Eyebrow>Encuéntranos</Eyebrow>
          </div>
          <h2 className="font-display text-[28px] font-bold leading-[1.05] tracking-[-0.01em] text-ink">
            Pasa por el taller
          </h2>
        </div>
      </Row>

      <Row name="No es" description="No se toca y no informa estado.">
        <div className="text-[14px] leading-relaxed text-muted">
          Para un estado con color (abierto, disponible) usa <strong className="text-ink">StatusPill</strong>. Para una
          opción elegible usa <strong className="text-ink">Chip</strong>. No lo pongas dentro de cards: una por sección.
        </div>
      </Row>
    </PageFrame>
  );
}
