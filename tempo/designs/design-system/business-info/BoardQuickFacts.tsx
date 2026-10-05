import { QuickFacts } from "../../../../src/components/ui/QuickFacts";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardQuickFacts() {
  return (
    <PageFrame family="info del negocio" width={1100}>
      <PageTitle
        title="QuickFacts"
        description={
          <>
            Lo primero después del titular: dónde, cuándo y cómo escribir. Tres filas de 56px. Ubicación lleva a{" "}
            <Code>#ubicacion</Code> (la MapCard); WhatsApp abre <Code>whatsappUrl()</Code> en otra pestaña. El horario
            no es link.
          </>
        }
      />

      <Row
        name="Por defecto"
        description="Sin props. Muestra la dirección de business.ts (si falta, 'Dirección por confirmar'). No hay estado abierto/cerrado porque el sitio estático no lo sabe."
      >
        <Demo label="375px">
          <div className="w-[375px]">
            <QuickFacts />
          </div>
        </Demo>
      </Row>

      <Row
        name="openNow"
        description={
          <>
            Solo si quien la usa calcula el estado en el cliente (hora de Bogotá contra <Code>HOURS</Code>) y pasa{" "}
            <Code>openNow</Code>. <Code>true</Code> muestra StatusPill ok; <Code>undefined</Code> o <Code>false</Code>{" "}
            no muestran nada.
          </>
        }
      >
        <Demo label="openNow">
          <div className="w-[375px]">
            <QuickFacts openNow />
          </div>
        </Demo>
      </Row>

      <Row name="No es" description="Ni sección de ubicación ni lista de contacto.">
        <div className="text-[14px] leading-relaxed text-muted">
          Una por página, bajo el hero. Para horarios completos y el mapa usa <strong className="text-ink">MapCard</strong>;
          para contacto con correo, <strong className="text-ink">ContactList</strong>. No escribas &quot;Abierto
          ahora&quot; fijo en el markup.
        </div>
      </Row>
    </PageFrame>
  );
}
