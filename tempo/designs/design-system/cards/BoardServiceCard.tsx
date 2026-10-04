/// <reference types="vite/client" />
import type { ReactNode } from "react";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import hat1 from "../../../../src/assets/hat1.jpg";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";

type Service = { title: string; description: string; visual?: "estampado" | "dtf" | "bordado" };

// Los tres de hoy son reales (copy de la referencia Noche caribe). Del 4 en adelante son
// servicios de ejemplo para probar la lista: no son promesas del taller.
const SERVICES: Service[] = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", visual: "estampado" },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", visual: "dtf" },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", visual: "bordado" },
  { title: "Sublimación", description: "Diseño a todo color en telas claras de poliéster." },
  { title: "Parches", description: "Bordados aparte para coser o pegar donde quieras." },
  { title: "Vinilo textil", description: "Nombres y números para uniformes." },
  { title: "Diseño del logo", description: "Te ayudamos a dejar tu idea lista para la prenda." },
];

function MobileList({ count }: { count: number }) {
  return (
    <div className="flex w-[375px] shrink-0 flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">
        {count} servicios · 375px · 1 columna
      </div>
      <div className="flex flex-col gap-3 rounded-tile border border-dashed border-line bg-primary p-4">
        {SERVICES.slice(0, count).map((s) => (
          <ServiceCard key={s.title} title={s.title} description={s.description} visual={s.visual} />
        ))}
      </div>
    </div>
  );
}

function DesktopGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-tile border border-dashed border-line bg-primary p-4">
      {SERVICES.slice(0, count).map((s) => (
        <ServiceCard key={s.title} title={s.title} description={s.description} visual={s.visual} />
      ))}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      {children}
    </div>
  );
}

export function BoardServiceCard() {
  return (
    <PageFrame family="cards" width={1600}>
      <PageTitle
        title="ServiceCard"
        description={
          <>
            Una técnica o servicio del taller dentro de una lista que va a crecer. Props: <Code>title</Code>,{" "}
            <Code>description</Code>, <Code>visual</Code> opcional (<Code>estampado</Code> · <Code>dtf</Code> ·{" "}
            <Code>bordado</Code>) e <Code>image</Code> opcional. La lista es{" "}
            <Code>grid gap-3 md:grid-cols-3</Code>: acepta cualquier cantidad sin tocar el componente.
          </>
        }
      />

      <Row
        name="Muestras"
        description="Solo CSS, 0 KB de imagen. Las tres técnicas de hoy tienen muestra propia; cualquier servicio nuevo sin visual sale con la muestra neutra de tela, sin pedir foto."
      >
        <div className="grid grid-cols-4 gap-4">
          <Labeled label='visual="estampado"'>
            <ServiceCard title={SERVICES[0].title} description={SERVICES[0].description} visual="estampado" />
          </Labeled>
          <Labeled label='visual="dtf"'>
            <ServiceCard title={SERVICES[1].title} description={SERVICES[1].description} visual="dtf" />
          </Labeled>
          <Labeled label='visual="bordado"'>
            <ServiceCard title={SERVICES[2].title} description={SERVICES[2].description} visual="bordado" />
          </Labeled>
          <Labeled label="sin visual (neutra)">
            <ServiceCard title={SERVICES[3].title} description={SERVICES[3].description} />
          </Labeled>
        </div>
      </Row>

      <Row
        name="Foto real"
        description="Cuando el cliente sube una foto de la técnica, image reemplaza la muestra en la misma caja de 96px de alto (object-cover, width/height fijos, lazy)."
      >
        <div className="grid grid-cols-4 gap-4">
          <Labeled label="muestra CSS">
            <ServiceCard title="Bordado" description="Hilo con relieve. El clásico de las gorras." visual="bordado" />
          </Labeled>
          <Labeled label="image (gana a visual)">
            <ServiceCard
              title="Bordado"
              description="Hilo con relieve. El clásico de las gorras."
              visual="bordado"
              image={{ src: hat1, alt: "Gorra de mezclilla con una palmera bordada atrás" }}
            />
          </Labeled>
        </div>
        <div className="text-[13px] leading-relaxed text-muted">
          Foto de ejemplo: <Code>src/assets/hat1.jpg</Code> es foto de stock, no un trabajo de Serflow. Sirve para ver la
          caja; en el sitio va una foto del taller.
        </div>
      </Row>

      <Row
        name="Móvil · 3, 5 y 7"
        description="Una columna, 12px entre cards. Agregar un servicio solo alarga la lista."
      >
        <div className="flex items-start gap-4">
          <MobileList count={3} />
          <MobileList count={5} />
          <MobileList count={7} />
        </div>
      </Row>

      <Row
        name="Desktop · 3, 5 y 7"
        description="Tres columnas. Con 5 o 7 la última fila queda incompleta y alineada a la izquierda: es correcto, no se rellena ni se estira."
      >
        <Labeled label="3 servicios">
          <DesktopGrid count={3} />
        </Labeled>
        <Labeled label="5 servicios">
          <DesktopGrid count={5} />
        </Labeled>
        <Labeled label="7 servicios">
          <DesktopGrid count={7} />
        </Labeled>
      </Row>

      <Row name="No es" description="No es link ni botón, y no lleva precio.">
        <div className="text-[14px] leading-relaxed text-muted">
          Para una prenda que se puede pedir usa <strong className="text-ink">ProductCard</strong>; para mostrar un pedido
          entregado, <strong className="text-ink">WorkCard</strong>. La acción de la sección (pedir por WhatsApp) va en un{" "}
          <strong className="text-ink">Button</strong> debajo de la lista, no dentro de cada card.
        </div>
      </Row>
    </PageFrame>
  );
}
