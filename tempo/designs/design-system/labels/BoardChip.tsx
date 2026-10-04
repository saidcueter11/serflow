import type { ReactNode } from "react";
import { Chip } from "../../../../src/components/ui/Chip";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-2 text-[13px] font-semibold uppercase tracking-[.08em] text-muted">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function BoardChip() {
  return (
    <PageFrame family="etiquetas" width={1100}>
      <PageTitle
        title="Chip"
        description={
          <>
            Opción seleccionable dentro de un grupo. Es un <Code>{'<input type="radio">'}</Code> visualmente oculto
            dentro de un <Code>{"<label>"}</Code>: sin JS, el navegador ya maneja la selección, las flechas del teclado y
            el anuncio en lector de pantalla. Los chips de un grupo comparten <Code>name</Code>; <Code>selected</Code>{" "}
            marca el valor inicial.
          </>
        }
      />

      <Row
        name="Estados"
        description="Elegido: fondo dorado y texto oscuro (12.9:1). Sin elegir: surface con borde line y texto ink (14.9:1). Foco de teclado: anillo dorado."
      >
        <Demo label="sin elegir">
          <Chip name="estado-a" label="Estampado" />
        </Demo>
        <Demo label="elegido">
          <Chip name="estado-b" label="Estampado" selected />
        </Demo>
      </Row>

      <Row
        name="Grupos reales"
        description="Talla, técnica y prenda. Cada grupo es un fieldset con legend; dentro, un solo chip elegido."
      >
        <Group title="Talla">
          <Chip name="talla" label="S" />
          <Chip name="talla" label="M" />
          <Chip name="talla" label="L" selected />
          <Chip name="talla" label="XL" />
        </Group>
        <Group title="¿Le ponemos algo?">
          <Chip name="tecnica" label="Así está bien" value="ninguna" selected />
          <Chip name="tecnica" label="Estampado" />
          <Chip name="tecnica" label="DTF" />
          <Chip name="tecnica" label="Bordado" />
        </Group>
        <Group title="Prenda">
          <Chip name="prenda" label="Camiseta" selected />
          <Chip name="prenda" label="Gorra" />
        </Group>
      </Row>

      <Row
        name="En una columna de 390px"
        description="El grupo hace wrap; 8px entre chips en ambos ejes. Cada chip mide 44px de alto aunque el texto sea una letra."
      >
        <div className="w-[390px] rounded-tile border border-dashed border-line bg-primary p-4">
          <Group title="Técnica">
            <Chip name="col-tecnica" label="Así está bien" value="ninguna" selected />
            <Chip name="col-tecnica" label="Estampado" />
            <Chip name="col-tecnica" label="DTF" />
            <Chip name="col-tecnica" label="Bordado" />
          </Group>
        </div>
      </Row>

      <Row
        name="No es"
        description="Un chip no informa estados ni nombra secciones, y no es un link de navegación."
      >
        <div className="text-[14px] leading-relaxed text-muted">
          Estado (Abierto ahora, Disponible) → <strong className="text-ink">StatusPill</strong>. Título de sección →{" "}
          <strong className="text-ink">Eyebrow</strong>. Filtros que cambian de URL (categorías del catálogo) siguen
          siendo <Code>{"<a>"}</Code> con <Code>aria-current</Code>; pueden copiar el look, no el componente.
        </div>
      </Row>
    </PageFrame>
  );
}
