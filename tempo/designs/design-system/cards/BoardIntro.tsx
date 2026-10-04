import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { WorkCard } from "../../../../src/components/ui/WorkCard";
import { Code, PageFrame, Stat } from "../Chrome";
import { SHIRT_WHITE, WORK_CAPS } from "./samples";

export function BoardIntro() {
  return (
    <PageFrame family="cards" width={1000}>
      <div className="flex max-w-[760px] flex-col gap-6">
        <div className="text-[12px] uppercase tracking-[.14em] text-muted">Componentes</div>
        <h1 className="font-display text-[36px] font-bold leading-[42px] tracking-tight">Cards</h1>
        <p className="text-[15px] leading-relaxed text-muted">
          Tres cards para que el home venda el negocio primero: qué hace el taller, qué hay listo para llevar y qué ya
          entregó. Viven en <Code>src/components/ui</Code>, son markup estático (Astro las renderiza sin JS) y reemplazan
          a <Code>ProductCard.astro</Code>, <Code>Card.astro</Code> y la card inline de <Code>CategoryShowcase.astro</Code>.
        </p>
        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
          <li>
            <strong className="text-ink">ServiceCard</strong> · una técnica o servicio (Estampado, DTF, Bordado). Muestra
            solo con CSS, o foto real si el cliente la tiene. La lista acepta N servicios.
          </li>
          <li>
            <strong className="text-ink">ProductCard</strong> · una prenda de "Disponible ahora". Toda la card es un link.
          </li>
          <li>
            <strong className="text-ink">WorkCard</strong> · un trabajo terminado, foto primero (4:5). Sin fotos, la
            sección no existe.
          </li>
        </ul>
        <p className="text-[15px] leading-relaxed text-muted">
          Las tres son fluidas: el ancho lo pone la lista (fila con scroll o grid), nunca la card. Las imágenes de los
          ejemplos son siluetas SVG marcadas como <strong className="text-ink">foto de ejemplo</strong>; en el sitio van
          fotos reales del cliente.
        </p>

        <div className="grid grid-cols-3 items-start gap-4 rounded-card border border-line bg-surface-2 p-6">
          <ServiceCard
            title="Bordado"
            description="Hilo con relieve. El clásico de las gorras."
            visual="bordado"
          />
          <ProductCard
            name="Camiseta básica"
            meta="Blanca · S a XL"
            image={{ src: SHIRT_WHITE, alt: "Camiseta blanca lisa, vista de frente (foto de ejemplo)" }}
            href="#"
            confirmedLabel="Confirmado hace 2 días"
          />
          <WorkCard
            image={{ src: WORK_CAPS, alt: "Dos gorras azules con escudo bordado (foto de ejemplo)" }}
            title="Gorras bordadas para un equipo de fútbol"
            technique="Bordado"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <Stat label="Cards" value="3" detail="servicio · producto · trabajo" />
          <Stat label="Muestras CSS" value="4" detail="estampado · dtf · bordado · neutra" />
          <Stat label="Imágenes" value="lazy" detail="width/height fijos, sin salto de layout" />
          <Stat label="Proporciones" value="4:3 · 4:5" detail="producto · trabajo" />
          <Stat label="Radio" value="20px" detail="rounded-card; muestras rounded-tile" />
          <Stat label="JS" value="0 KB" detail="sin skeleton animado ni script" />
        </div>
      </div>
    </PageFrame>
  );
}
