import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Footer } from "../../../../src/components/ui/Footer";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { Code, PageFrame, Stat } from "../Chrome";
import { LOGO } from "./portada";

export function BoardIntro() {
  return (
    <PageFrame family="shell" width={1100}>
      <div className="grid grid-cols-[1fr_390px] gap-12">
        <div className="flex flex-col gap-6">
          <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
          <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">App shell</h1>
          <p className="text-[15px] leading-relaxed text-muted">
            El marco de cada página: <strong className="text-ink">Header</strong> arriba,{" "}
            <strong className="text-ink">Section</strong> para cada bloque del home y{" "}
            <strong className="text-ink">Footer</strong> abajo. Reemplazan a <Code>Header.astro</Code>,{" "}
            <Code>Footer.astro</Code>, <Code>SectionContainer.astro</Code> y <Code>Title.astro</Code>.
          </p>
          <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
            <li>
              <strong className="text-ink">Cero JS.</strong> El menú móvil es un <Code>{"<details>"}</Code> nativo: abre,
              cierra y se usa con teclado sin una línea de script. El de hoy son 116 líneas.
            </li>
            <li>
              <strong className="text-ink">No sticky.</strong> En un teléfono de 390px el header fijo se come 64px de
              pantalla en cada scroll y obliga a un spacer y a <Code>scroll-mt-24</Code>. La acción principal ya está
              siempre a mano en el WhatsAppFab.
            </li>
            <li>
              <strong className="text-ink">Container queries.</strong> Los tres usan <Code>@container</Code> en vez de{" "}
              <Code>md:</Code>: a ancho completo se comportan igual que un breakpoint, y en el canvas se ven en su modo
              real a cualquier ancho.
            </li>
            <li>
              <strong className="text-ink">Datos de business.ts.</strong> WhatsApp, correo, ciudad y horario. El logo lo
              pasa quien llama (<Code>logoSrc</Code>): Astro pasa <Code>Logo.src</Code>.
            </li>
          </ul>
          <p className="text-[15px] leading-relaxed text-muted">
            Los dos composites arman la portada completa con los componentes reales, en el orden aprobado: vender el
            negocio primero. El hero y la lista de razones son markup de página (van en <Code>index.astro</Code>), no
            componentes del sistema.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Stat label="Componentes" value="3" detail="Header · Section · Footer" />
            <Stat label="JS" value="0 KB" detail="details nativo, links y markup" />
            <Stat label="Toques" value="44px+" detail="menú 44, filas 48, botones 48" />
          </div>
        </div>
        <div className="overflow-hidden rounded-card border border-line">
          <Header logoSrc={LOGO} />
          <Section id="intro-hablemos" title="Hablemos" tone="panel">
            <ContactList />
          </Section>
          <Footer logoSrc={LOGO} />
        </div>
      </div>
    </PageFrame>
  );
}
