import { WhatsAppIcon } from "../../../../src/components/icons/WhatsappIcon";
import { PinIcon } from "../../../../src/components/icons/PinIcon";
import { MenuIcon } from "../../../../src/components/icons/MenuIcon";
import { CloseIcon } from "../../../../src/components/icons/CloseIcon";
import { FacebookIcon } from "../../../../src/components/icons/FacebookIcon";
import { InstagramIcon } from "../../../../src/components/icons/InstagramIcon";
import { TiktokIcon } from "../../../../src/components/icons/TiktokIcon";
import { LeftArrowIcon } from "../../../../src/components/icons/LeftArrowIcon";
import { RightArrowIcon } from "../../../../src/components/icons/RightArrowIcon";
import { Code, Demo, PageFrame, PageTitle, Row } from "../Chrome";

function Cell({ name, uses, children }: { name: string; uses: string; children: React.ReactNode }) {
  return (
    <div className="flex w-[150px] flex-col items-center gap-2 rounded-tile border border-line bg-primary p-4 text-center">
      <div className="flex h-10 items-center justify-center text-ink">{children}</div>
      <div className="font-mono text-[12px] text-ink">{name}</div>
      <div className="text-[12px] leading-snug text-muted">{uses}</div>
    </div>
  );
}

export function BoardIcons() {
  return (
    <PageFrame family="foundations" width={1200}>
      <PageTitle
        title="Iconografía"
        description={
          <>
            Los íconos viven en <Code>src/components/icons/</Code> como componentes React con SVG en línea: cero
            descargas extra. El sistema usa solo dos; el resto es legado del sitio actual.
          </>
        }
      />

      <Row
        name="En uso por el design system"
        description={
          <>
            Aceptan <Code>className</Code> para el tamaño y heredan el color con <Code>currentColor</Code>. Son
            decorativos (<Code>aria-hidden</Code>): el texto del botón o el <Code>aria-label</Code> dice qué hacen.
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Cell name="WhatsAppIcon" uses="Button whatsapp, WhatsAppFab, QuickFacts, ErrorState">
            <WhatsAppIcon className="size-8" />
          </Cell>
          <Cell name="PinIcon" uses="QuickFacts, MapCard, Cómo llegar">
            <PinIcon className="size-8" />
          </Cell>
        </div>
      </Row>

      <Row
        name="Tamaños y color"
        description={
          <>
            Tres tamaños: 16 px dentro de botones chicos, 20 px en botones y filas, 28 px en el FAB. El color siempre sale
            del texto que lo rodea, nunca de una clase fija dentro del ícono.
          </>
        }
      >
        <Demo label="size-4 · 16">
          <WhatsAppIcon className="size-4" />
          <PinIcon className="size-4" />
        </Demo>
        <Demo label="size-5 · 20">
          <WhatsAppIcon className="size-5" />
          <PinIcon className="size-5" />
        </Demo>
        <Demo label="size-7 · 28">
          <WhatsAppIcon className="size-7" />
          <PinIcon className="size-7" />
        </Demo>
        <Demo label="color">
          <span className="text-ink">
            <PinIcon className="size-6" />
          </span>
          <span className="text-muted">
            <PinIcon className="size-6" />
          </span>
          <span className="text-accent">
            <PinIcon className="size-6" />
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
            <WhatsAppIcon className="size-5" />
          </span>
        </Demo>
      </Row>

      <Row
        name="Legado (no usar en componentes nuevos)"
        description={
          <>
            Vienen de los .astro actuales. Varios fijan su propio color o tamaño adentro y no aceptan{" "}
            <Code>className</Code>. Ver la deuda en Design System Debt.
          </>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Cell name="MenuIcon" uses="Header.astro">
            <MenuIcon />
          </Cell>
          <Cell name="CloseIcon" uses="0 usos">
            <CloseIcon />
          </Cell>
          <Cell name="LeftArrowIcon" uses="BackButton.tsx (0 usos)">
            <span className="rounded-full bg-accent">
              <LeftArrowIcon />
            </span>
          </Cell>
          <Cell name="RightArrowIcon" uses="0 usos">
            <span className="rounded-full bg-accent">
              <RightArrowIcon />
            </span>
          </Cell>
          <Cell name="FacebookIcon" uses="Footer, index (próximamente)">
            <FacebookIcon />
          </Cell>
          <Cell name="InstagramIcon" uses="Footer, index (próximamente)">
            <InstagramIcon />
          </Cell>
          <Cell name="TiktokIcon" uses="Footer, index (próximamente)">
            <TiktokIcon />
          </Cell>
        </div>
      </Row>

      <Row
        name="Reglas"
        description="Para cuando haga falta un ícono nuevo."
      >
        <ul className="flex flex-col gap-2 text-[14px] text-muted">
          <li>• SVG en línea en un componente de <Code>src/components/icons/</Code>; nada de librerías de íconos ni sprites remotos.</li>
          <li>• Firma: <Code>{"({ className = 'size-6' })"}</Code>, <Code>fill</Code> o <Code>stroke</Code> en <Code>currentColor</Code>, <Code>aria-hidden</Code>.</li>
          <li>• Nada de clases armadas en tiempo de ejecución (<Code>{"size-${size}"}</Code>): Tailwind no las detecta.</li>
          <li>• Botón con solo ícono: <Code>aria-label</Code> en el botón y área de 44 px.</li>
        </ul>
      </Row>
    </PageFrame>
  );
}
