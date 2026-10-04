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

      <Row name="Redes sociales" description="Pendiente a propósito.">
        <div className="text-[14px] leading-relaxed text-muted">
          Facebook, Instagram y TikTok hoy aparecen como íconos apagados &quot;próximamente&quot; en index.astro y
          Footer.astro. No se renderizan aquí: cuando existan las cuentas se agregan como filas con su link real.
        </div>
      </Row>
    </PageFrame>
  );
}
