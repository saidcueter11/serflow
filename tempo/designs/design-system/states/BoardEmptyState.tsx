import type { ReactNode } from "react";
import { EmptyState } from "../../../../src/components/ui/EmptyState";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";

/** Columna de 375px que dibuja el storyboard (no el componente). */
function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      <div className="flex w-[375px] flex-col gap-4 rounded-tile border border-dashed border-line bg-primary px-4 py-6">
        {children}
      </div>
    </div>
  );
}

const SIN_PRENDAS = {
  title: "No hay prendas disponibles en este momento",
  description: "Escríbenos y te contamos qué hay en el taller.",
  action: { label: "Pregunta por WhatsApp", href: WHATSAPP_URL },
};

export function BoardEmptyState() {
  return (
    <PageFrame family="estados" width={1300}>
      <PageTitle
        title="EmptyState"
        description={
          <>
            Todavía no hay nada aquí. Props: <Code>title</Code>, <Code>description</Code>, <Code>action</Code> opcional
            ({"{ label, href }"}) y <Code>mascot</Code> opcional. Si el href es de WhatsApp (empieza por{" "}
            <Code>https://wa.me/</Code>), el botón es whatsapp y abre en otra pestaña; si no, secondary. Así no hay una
            prop de variante que se pueda contradecir con el link.
          </>
        }
      />

      <Row
        name="Disponible ahora sin prendas · 375px"
        description="El catálogo esconde prendas no confirmadas en N días, así que quedarse en cero es normal. La sección sigue porque el cliente vino a eso; el estado le da la salida por WhatsApp."
      >
        <div className="flex items-start gap-8">
          <Phone label="sección Disponible ahora">
            <div className="flex flex-col items-start gap-2">
              <Eyebrow>Disponible ahora</Eyebrow>
              <h2 className="font-display text-[24px] font-bold leading-tight text-ink">Lo que hay en el taller</h2>
            </div>
            <EmptyState {...SIN_PRENDAS} />
          </Phone>
          <div className="max-w-[300px] pt-8 text-[14px] leading-relaxed text-muted">
            Copy cercano y sin culpas: no dice "error" ni "lo sentimos". El título cuenta qué pasa; la descripción, qué
            puede hacer. Una sola acción, la de WhatsApp, que es la principal de la sección.
          </div>
        </div>
      </Row>

      <Row
        name="Categoría vacía"
        description="Una categoría activa sin productos activos (hoy ProductCardList pinta una caja sin salida). La acción puede llevar a otra categoría: href normal, botón secondary."
      >
        <div className="flex items-start gap-8">
          <Phone label="/products/gorras">
            <h1 className="font-display text-[30px] font-bold leading-tight text-ink">Gorras</h1>
            <EmptyState
              title="Todavía no hay gorras aquí"
              description="Mientras llegan, mira otras prendas del taller."
              action={{ label: "Ver otras prendas", href: "/products/mi-tierra-querida" }}
            />
          </Phone>
          <Phone label="misma categoría, salida por WhatsApp">
            <h1 className="font-display text-[30px] font-bold leading-tight text-ink">Gorras</h1>
            <EmptyState
              title="Todavía no hay gorras aquí"
              description="Escríbenos: las hacemos por encargo y te contamos tiempos."
              action={{ label: "Pregunta por WhatsApp", href: WHATSAPP_URL }}
            />
          </Phone>
        </div>
      </Row>

      <Row
        name="Con y sin mascota"
        description="mascot={true} cambia el ícono por la tití (MascotSlot md). Solo si no hay otra mascota en la página: la regla de una por página es de composición y el componente no la puede ver, por eso es opt-in y por defecto false."
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[12px] text-muted">mascot (default false)</div>
            <EmptyState {...SIN_PRENDAS} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[12px] text-muted">mascot</div>
            <EmptyState {...SIN_PRENDAS} mascot />
          </div>
        </div>
      </Row>

      <Row name="No es" description="Tres usos que parecen pero no son.">
        <ul className="flex flex-col gap-2 text-[14px] leading-relaxed text-muted">
          <li>
            Un fallo de red o de carga: usa <strong className="text-ink">ErrorState</strong>.
          </li>
          <li>
            Una sección opcional sin contenido (Trabajos hechos sin fotos, promo sin campaña activa): no se renderiza.
          </li>
          <li>Sin action: no lo dejes sin salida. Si no hay a dónde llevar, WhatsApp.</li>
        </ul>
      </Row>
    </PageFrame>
  );
}
