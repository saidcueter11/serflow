import { QuickFacts } from "../../../../src/components/ui/QuickFacts";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { Code, PageFrame, Stat } from "../Chrome";

export function BoardIntro() {
  return (
    <PageFrame family="info del negocio" width={1000}>
      <div className="flex max-w-[760px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">Info del negocio</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          El home vende el negocio primero: quiénes somos, dónde estamos, cuándo abrimos y cómo escribirnos. Tres piezas
          en <Code>src/components/ui</Code>, sin props de datos y sin JS:
        </p>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">QuickFacts</strong> · 3 filas bajo el hero: ubicación, horario, WhatsApp.
          </li>
          <li>
            <strong className="text-ink">MapCard</strong> · la sección de ubicación: mapa ilustrativo, dirección,
            horarios y Cómo llegar. El mapa de Google solo carga al tocar.
          </li>
          <li>
            <strong className="text-ink">ContactList</strong> · WhatsApp y correo como filas tocables.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-muted">
          <strong className="text-ink">Una sola fuente de verdad:</strong> número, correo, ciudad, dirección, horario y
          embed del mapa salen de <Code>src/lib/business.ts</Code>. Ningún componente los repite. La dirección
          (Mercado Bazurto, C.C. Bazurtico, local 31) ya está confirmada; si <Code>ADDRESS</Code> vuelve a{" "}
          <Code>null</Code>, la UI dice &quot;Dirección por confirmar&quot;. El sitio es
          estático: nunca dice &quot;Abierto ahora&quot; a menos que quien lo use pase <Code>openNow</Code>.
        </p>

        <div className="grid grid-cols-2 items-start gap-4 rounded-card border border-line bg-primary p-6">
          <QuickFacts />
          <ContactList />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Stat label="Fuente" value="1" detail="archivo · src/lib/business.ts" />
          <Stat label="Componentes" value="3" detail="QuickFacts · MapCard · ContactList" />
          <Stat label="Filas" value="56px" detail="alto mínimo de cada fila tocable" />
          <Stat label="Mapa" value="0" detail="requests a Google hasta tocar" />
          <Stat label="Dirección" value="Bazurtico 31" detail="Mercado Bazurto, Cartagena" />
          <Stat label="JS" value="0 KB" detail="details nativo, links y markup" />
        </div>
      </div>
    </PageFrame>
  );
}
