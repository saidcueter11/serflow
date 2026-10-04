import { Button } from "../../../../src/components/ui/Button";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { whatsappUrl } from "../../../../src/lib/business";
import { Code, PageFrame, Stat } from "../Chrome";
import { PinIcon } from "./BoardLayoutIcon";

export function BoardIntro() {
  return (
    <PageFrame family="botones" width={900}>
      <div className="flex max-w-[680px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[40px] font-bold leading-[44px] tracking-tight">Botones</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          En Serflow casi todo termina en WhatsApp: no hay carrito, el cliente llega por el celular y escribe al taller. Por
          eso el botón principal es <strong className="text-ink">whatsapp</strong>, dorado de marca con una sombra de
          presión que se hunde al tocarlo. Lo acompañan <strong className="text-ink">secondary</strong> (borde, para la
          acción de apoyo) y <strong className="text-ink">ghost</strong> (link dorado de baja énfasis). El flotante{" "}
          <strong className="text-ink">WhatsAppFab</strong> deja el chat a un toque en cualquier página.
        </p>
        <p className="text-[15px] leading-relaxed text-muted">
          Viven en <Code>src/components/ui/Button.tsx</Code> y <Code>WhatsAppFab.tsx</Code>: markup estático que Astro
          renderiza sin JavaScript. El número sale de <Code>src/lib/business.ts</Code> con <Code>whatsappUrl()</Code>.
          Intención de diseño: <strong className="text-ink">un solo dorado de WhatsApp por vista</strong>; si todo es
          dorado, nada lo es.
        </p>

        <div className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-surface p-6 fabric">
          <Button variant="whatsapp" href={whatsappUrl()} external>
            Escríbenos por WhatsApp
          </Button>
          <Button variant="secondary" href="/#ubicacion" icon={<PinIcon />}>
            Cómo llegar
          </Button>
          <Button variant="ghost" href="/products/mi-tierra-querida">
            Ver todo →
          </Button>
          <div className="ml-auto">
            <WhatsAppFab placement="inline" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Stat label="Variantes" value="3" detail="whatsapp · secondary · ghost" />
          <Stat label="Altura mínima" value="48 px" detail="ghost 44 px: sigue siendo área táctil" />
          <Stat label="Dorado por sección" value="1" detail="máximo un whatsapp visible a la vez" />
          <Stat label="Flotante" value="1 por página" detail="56 px, abajo a la derecha" />
        </div>
      </div>
    </PageFrame>
  );
}
