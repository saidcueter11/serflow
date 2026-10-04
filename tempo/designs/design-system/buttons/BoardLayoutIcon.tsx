import { Button } from "../../../../src/components/ui/Button";
import { whatsappUrl } from "../../../../src/lib/business";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

/** Pin de ubicación, el mismo de la exploración Noche caribe. Solo para el canvas. */
export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export function BoardLayoutIcon() {
  return (
    <PageFrame family="botones" width={1250}>
      <PageTitle
        title="Ancho e ícono"
        description="En el celular las acciones principales ocupan todo el ancho y se apilan; en desktop van en línea con su ancho natural. El ícono es un slot: whatsapp trae el suyo, el resto lo recibe por prop."
      />

      <Row
        name="fullWidth en móvil"
        description={
          <>
            Columna de 390 px (iPhone). <Code>fullWidth</Code> apila whatsapp + secondary con 12 px entre ellos, como en
            la portada y en la barra de la ficha.
          </>
        }
      >
        <div className="flex gap-8">
          <div className="flex w-[358px] flex-col gap-3 rounded-card border border-line bg-primary p-4">
            <div className="text-[12px] uppercase tracking-[.14em] text-muted">Portada · 390</div>
            <Button variant="whatsapp" href={whatsappUrl()} external fullWidth>
              Escríbenos por WhatsApp
            </Button>
            <Button variant="secondary" href="/#ubicacion" icon={<PinIcon />} fullWidth>
              Cómo llegar
            </Button>
          </div>
          <div className="flex w-[358px] flex-col gap-2 self-end rounded-card border border-line bg-primary p-4">
            <div className="text-[12px] uppercase tracking-[.14em] text-muted">Ficha · barra inferior</div>
            <Button variant="whatsapp" href={whatsappUrl("Hola! Quiero pedir esta prenda")} external fullWidth>
              Pedir por WhatsApp
            </Button>
            <Button variant="secondary" fullWidth>
              Personalizar esta
            </Button>
          </div>
        </div>
      </Row>

      <Row name="En línea en desktop" description="Sin fullWidth: ancho del contenido, 12 px de separación, whatsapp primero.">
        <Demo label="hero">
          <Button variant="whatsapp" href={whatsappUrl()} external>
            Escríbenos por WhatsApp
          </Button>
          <Button variant="secondary" href="/#ubicacion" icon={<PinIcon />}>
            Cómo llegar
          </Button>
        </Demo>
      </Row>

      <Row
        name="Slot de ícono"
        description={
          <>
            <Code>icon</Code> va antes del texto. En whatsapp, omitirlo muestra el ícono de WhatsApp;{" "}
            <Code>icon={"{null}"}</Code> lo quita. En secondary y ghost no hay ícono salvo que se pase.
          </>
        }
      >
        <Demo label="por defecto">
          <Button variant="whatsapp" href={whatsappUrl()} external>
            Escríbenos por WhatsApp
          </Button>
        </Demo>
        <Demo label="icon={pin}">
          <Button variant="secondary" href="/#ubicacion" icon={<PinIcon />}>
            Cómo llegar
          </Button>
        </Demo>
        <Demo label="icon={null}">
          <Button variant="whatsapp" href={whatsappUrl()} external icon={null}>
            Escríbenos
          </Button>
        </Demo>
      </Row>
    </PageFrame>
  );
}
