import { ContactList } from "../../../../src/components/ui/ContactList";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

export function BoardContactList() {
  return (
    <PageFrame family="info del negocio" width={1100}>
      <PageTitle
        title="ContactList"
        description={
          <>
            Dos filas tocables de 56px: WhatsApp (<Code>whatsappUrl()</Code>, otra pestaña) y Correo (
            <Code>mailto:EMAIL</Code>). Etiqueta a la izquierda, valor a la derecha.
          </>
        }
      />

      <Row
        name="Móvil"
        description="A 375px el correo (36 caracteres) no cabe entero: se corta con puntos suspensivos, sin desbordar la tarjeta. El link sigue completo."
      >
        <Demo label="375px">
          <div className="w-[375px]">
            <ContactList />
          </div>
        </Demo>
      </Row>

      <Row name="Escritorio" description="Con ancho de sobra el correo se ve entero.">
        <Demo label="520px">
          <div className="w-[520px]">
            <ContactList />
          </div>
        </Demo>
      </Row>

      <Row name="Redes sociales" description="Filas de texto, sin íconos.">
        <div className="text-[14px] leading-relaxed text-muted">
          Instagram, TikTok y Facebook salen de <code>SOCIAL</code> en business.ts y se muestran como filas con el
          usuario de cada red. Sin íconos para no cargar los SVG legado; el Footer las lista también.
        </div>
      </Row>
    </PageFrame>
  );
}
