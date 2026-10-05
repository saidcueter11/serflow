import { Footer } from "../../../../src/components/ui/Footer";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { LOGO } from "./portada";

export function BoardFooter() {
  return (
    <PageFrame family="shell" width={1700}>
      <PageTitle
        title="Footer"
        description={
          <>
            Logo, qué es Serflow, horario y contacto, todo de <Code>src/lib/business.ts</Code>. Una prop:{" "}
            <Code>logoSrc</Code>. Redes como links de texto (Instagram, TikTok, Facebook). El padding de abajo (pb-28) deja libre el
            WhatsAppFab fijo.
          </>
        }
      />

      <Row
        name="Móvil"
        description="Una columna. Los links de WhatsApp y correo miden 44px de alto. El FAB (dibujado aquí donde queda en pantalla) no tapa ningún link."
      >
        <div className="relative overflow-hidden rounded-card border border-line" style={{ width: 390 }}>
          <Footer logoSrc={LOGO} />
          <div className="absolute bottom-5 right-4">
            <WhatsAppFab placement="inline" />
          </div>
        </div>
      </Row>

      <Row name="Desktop" description="Desde @3xl (768px): tres columnas en una fila.">
        <div className="relative overflow-hidden rounded-card border border-line" style={{ width: 1280 }}>
          <Footer logoSrc={LOGO} />
          <div className="absolute bottom-5 right-6">
            <WhatsAppFab placement="inline" />
          </div>
        </div>
      </Row>
    </PageFrame>
  );
}
