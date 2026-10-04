import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardWhatsAppFab() {
  return (
    <PageFrame family="botones" width={1000}>
      <PageTitle
        title="WhatsApp FAB"
        description="Círculo dorado de 56 px que deja el chat a un toque desde cualquier punto de la página. Vive en el layout, no en el contenido."
      />

      <Row
        name="El botón"
        description={
          <>
            Dorado, ícono de 28 px, sombra oscura para despegarlo del fondo. <Code>aria-label</Code> "Escríbenos por
            WhatsApp" porque no tiene texto visible.
          </>
        }
      >
        <Demo label="por defecto">
          <WhatsAppFab placement="inline" />
        </Demo>
        <Demo label="con text">
          <WhatsAppFab placement="inline" text="Hola! Quiero cotizar camisetas personalizadas" />
          <span className="text-[13px] text-muted">
            <Code>text</Code> prellena el mensaje; sin él usa el texto por defecto de business.ts.
          </span>
        </Demo>
      </Row>

      <Row
        name="placement fixed"
        description={
          <>
            En producción va <Code>fixed bottom-5 right-4 z-50</Code>: abajo a la derecha, al alcance del pulgar, encima
            del contenido. <Code>inline</Code> solo existe para previsualizarlo en flujo.
          </>
        }
      >
        <div className="relative h-[300px] w-[200px] overflow-hidden rounded-card border border-line bg-primary fabric">
          <div className="flex flex-col gap-2 p-4">
            <div className="h-3 w-24 rounded-full bg-surface-2" />
            <div className="h-6 w-36 rounded-full bg-surface-2" />
            <div className="h-3 w-32 rounded-full bg-surface-2" />
            <div className="mt-3 h-24 rounded-tile bg-surface-2" />
          </div>
          <div className="absolute bottom-5 right-4">
            <WhatsAppFab placement="inline" />
          </div>
        </div>
      </Row>

      <Row
        name="Reglas"
        description="Uno por página. Nunca dentro de cards, secciones o el header."
      >
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>
            <span className="text-ink">Uno por página</span>, montado en el layout. Si la sección ya tiene un botón
            whatsapp grande, el FAB puede convivir: es contacto general, no la acción de la sección.
          </li>
          <li>
            <span className="text-ink">Sin tooltip ni hover</span>: en el celular no existen. El círculo dorado con el ícono
            ya se explica solo.
          </li>
          <li>
            <span className="text-ink">Deja aire abajo</span>: el footer lleva padding inferior (pb-24 en la referencia) para
            que el FAB no tape el último contenido.
          </li>
        </ul>
      </Row>
    </PageFrame>
  );
}
