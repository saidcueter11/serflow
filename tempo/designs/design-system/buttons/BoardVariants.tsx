import { Button } from "../../../../src/components/ui/Button";
import { whatsappUrl } from "../../../../src/lib/business";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardVariants() {
  return (
    <PageFrame family="botones" width={1000}>
      <PageTitle
        title="Variantes"
        description="Tres pesos visuales. whatsapp es la acción que vende: abre el chat con el taller. secondary acompaña con la acción de apoyo. ghost es un link dorado para lo que no compite con la acción principal."
      />

      <Row
        name="whatsapp"
        description={
          <>
            Dorado de marca, texto oscuro, ícono de WhatsApp por defecto y sombra de presión en <Code>accent-deep</Code> que
            se comprime al tocarlo. Siempre con <Code>whatsappUrl()</Code> y <Code>external</Code>.
          </>
        }
      >
        <Demo label="portada">
          <Button variant="whatsapp" href={whatsappUrl()} external>
            Escríbenos por WhatsApp
          </Button>
        </Demo>
        <Demo label="ficha">
          <Button variant="whatsapp" href={whatsappUrl("Hola! Quiero pedir esta prenda")} external>
            Pedir por WhatsApp
          </Button>
        </Demo>
      </Row>

      <Row
        name="secondary"
        description="Borde de línea y texto ink. Va al lado de un whatsapp, nunca solo como acción principal."
      >
        <Demo label="ubicación">
          <Button variant="secondary" href="/#ubicacion">
            Cómo llegar
          </Button>
        </Demo>
        <Demo label="ficha">
          <Button variant="secondary">Personalizar esta</Button>
        </Demo>
      </Row>

      <Row
        name="ghost"
        description="Link dorado sin caja, 44 px de alto para que siga siendo fácil de tocar. Para 'ver más' y entradas secundarias."
      >
        <Demo label="listado">
          <Button variant="ghost" href="/products/mi-tierra-querida">
            Ver todo →
          </Button>
        </Demo>
        <Demo label="teaser">
          <Button variant="ghost">Probar el personalizador →</Button>
        </Demo>
      </Row>

      <Row
        name="Regla: un dorado por sección"
        description="Máximo un botón whatsapp por sección visible. Si hay dos acciones, la segunda baja a secondary o ghost."
      >
        <Demo label="así sí">
          <Button variant="whatsapp" href={whatsappUrl("Hola! Quiero pedir esta prenda")} external>
            Pedir por WhatsApp
          </Button>
          <Button variant="secondary">Personalizar esta</Button>
        </Demo>
        <Demo label="así no">
          <div className="flex items-center gap-3 rounded-tile border border-dashed border-danger/60 p-3 opacity-80">
            <Button variant="whatsapp" href={whatsappUrl()} external>
              Escríbenos
            </Button>
            <Button variant="whatsapp" href={whatsappUrl("Hola! Quiero pedir esta prenda")} external>
              Pedir por WhatsApp
            </Button>
          </div>
        </Demo>
      </Row>
    </PageFrame>
  );
}
