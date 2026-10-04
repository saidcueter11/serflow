import type { ReactNode } from "react";
import { Header } from "../../../../src/components/ui/Header";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { LOGO } from "./portada";

/** Marco de teléfono para que el Header resuelva su container query a 390px. */
function Phone({ children, height }: { children: ReactNode; height?: number }) {
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-primary" style={{ width: 390, height }}>
      {children}
    </div>
  );
}

/** Solo para el storyboard: abre el <details> del menú sin agregar una prop de demo al componente. */
function MenuOpen({ children }: { children: ReactNode }) {
  return <div ref={(el) => el?.querySelector("details")?.setAttribute("open", "")}>{children}</div>;
}

export function BoardHeader() {
  return (
    <PageFrame family="shell" width={1600}>
      <PageTitle
        title="Header"
        description={
          <>
            Logo + nav + WhatsApp desde 896px de ancho; debajo, logo + menú <Code>{"<details>"}</Code> sin JS. No es
            sticky. Props: <Code>logoSrc</Code>, <Code>links</Code> (por defecto las 4 anclas del home) y{" "}
            <Code>current</Code> (el href que lleva aria-current).
          </>
        }
      />

      <Row
        name="Desktop"
        description="Desde @4xl (896px). Nav de 15px en muted, el actual en ink. Un solo Button whatsapp: el del header cuenta como la acción de la primera pantalla."
      >
        <div className="overflow-hidden rounded-card border border-line">
          <Header logoSrc={LOGO} current="#quienes-somos" />
        </div>
      </Row>

      <Row
        name="Móvil cerrado"
        description="56px de alto en total. El summary es un botón de 44px con aria-label Abrir menú; el estado abierto/cerrado lo anuncia el details nativo."
      >
        <Phone>
          <Header logoSrc={LOGO} />
        </Phone>
      </Row>

      <Row
        name="Móvil abierto"
        description="El panel se abre encima del contenido (absolute, sin mover la página): filas de 48px y un Button whatsapp a todo el ancho. Se cierra tocando la X; un link de ancla navega y el menú queda abierto arriba, fuera de vista."
      >
        <Phone height={470}>
          <MenuOpen>
            <Header logoSrc={LOGO} current="#que-hacemos" />
          </MenuOpen>
          <div className="px-4 pt-6">
            <div className="font-display text-[38px] font-medium leading-[1.05] text-ink">Camisetas y gorras con tu sello.</div>
          </div>
        </Phone>
      </Row>

      <Row
        name="No es"
        description="No es sticky ni fixed, no lleva backdrop-blur y no tiene drawer con focus trap. Para otra página, pasa links propios; no lo dupliques."
      >
        <div className="text-[14px] leading-relaxed text-muted">
          Las anclas de <Code>NAV_LINKS</Code> asumen los ids <Code>quienes-somos</Code>, <Code>que-hacemos</Code>,{" "}
          <Code>disponible</Code> y <Code>ubicacion</Code> en el home. Desde otra página usa <Code>/#ubicacion</Code>.
        </div>
      </Row>
    </PageFrame>
  );
}
