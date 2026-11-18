import { BarraPedir } from "../../../../src/components/ui/BarraPedir";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardBarraPedir() {
  return (
    <PageFrame family="botones" width={1300}>
      <PageTitle
        title="BarraPedir"
        description="La barra de pedir de la ficha de producto en el celular (PRI-529): fija abajo, solo el botón whatsapp a todo el ancho, sin repetir el nombre ni el precio. Es el único botón de WhatsApp de esa pantalla: en la ficha reemplaza al WhatsApp FAB."
      />
      <Row
        name="Celular (390)"
        description={
          <>
            En la página va <Code>sticky bottom-0</Code> al final del contenido (dentro de <Code>.pf</Code>, como la
            barra de Enviar del personalizador) y respeta la zona segura de abajo. <Code>fija</Code> en false solo para
            verla en flujo.
          </>
        }
      >
        <div className="pf w-[390px] overflow-hidden rounded-tile border border-line bg-primary">
          <div className="flex h-[160px] items-center justify-center text-[14px] text-muted">… la ficha …</div>
          <BarraPedir href={WHATSAPP_URL} fija={false} />
        </div>
      </Row>
      <Row name="Escritorio (1280)" description="Desde 48rem de página se esconde: el botón va en la columna de la información, junto al nombre.">
        <div className="pf w-[800px] overflow-hidden rounded-tile border border-line bg-primary">
          <div className="flex h-[120px] items-center justify-center text-[14px] text-muted">Aquí la barra no se muestra.</div>
          <BarraPedir href={WHATSAPP_URL} fija={false} />
        </div>
      </Row>
    </PageFrame>
  );
}
