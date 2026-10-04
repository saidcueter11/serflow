import type { ReactNode } from "react";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { CAP_GREEN, CAP_NAVY, SHIRT_BLACK, SHIRT_RED, SHIRT_WHITE } from "./samples";

const PRODUCTS = [
  { name: "Camiseta básica", meta: "Blanca · S a XL", src: SHIRT_WHITE, alt: "Camiseta blanca lisa, vista de frente", confirmed: "Confirmado hace 2 días" },
  { name: "Gorra trucker", meta: "Azul oscuro · talla única", src: CAP_NAVY, alt: "Gorra azul oscuro de perfil", confirmed: "Confirmado hoy" },
  { name: "Camiseta básica", meta: "Negra · S a XXL", src: SHIRT_BLACK, alt: "Camiseta negra lisa, vista de frente", confirmed: undefined },
  { name: "Gorra clásica", meta: "Verde oliva · talla única", src: CAP_GREEN, alt: "Gorra verde oliva de perfil", confirmed: "Confirmado hace 5 días" },
  { name: "Camiseta oversize", meta: "Vinotinto · M a XL", src: SHIRT_RED, alt: "Camiseta vinotinto lisa, vista de frente", confirmed: undefined },
];

function Cards({ count = PRODUCTS.length }: { count?: number }) {
  return (
    <>
      {PRODUCTS.slice(0, count).map((p, i) => (
        <ProductCard
          key={i}
          name={p.name}
          meta={p.meta}
          image={{ src: p.src, alt: `${p.alt} (foto de ejemplo)` }}
          href="#"
          confirmedLabel={p.confirmed}
        />
      ))}
    </>
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

export function BoardProductCard() {
  return (
    <PageFrame family="cards" width={1500}>
      <PageTitle
        title="ProductCard"
        description={
          <>
            Una prenda de "Disponible ahora". Props: <Code>name</Code>, <Code>meta</Code>, <Code>image</Code>,{" "}
            <Code>href</Code> y <Code>confirmedLabel</Code> opcional. Toda la card es un solo <Code>{"<a>"}</Code>: un
            objetivo de toque grande, un foco de teclado. Las imágenes son siluetas marcadas como foto de ejemplo.
          </>
        }
      />

      <Row
        name="Con y sin confirmación"
        description="confirmedLabel es texto dorado de 12px (no StatusPill: la píldora se parte en dos líneas en el grid de 2 columnas). Si no se sabe cuándo se confirmó el stock, se omite: nunca se inventa."
      >
        <div className="grid grid-cols-4 gap-4">
          <Labeled label="confirmedLabel">
            <ProductCard
              name="Camiseta básica"
              meta="Blanca · S a XL"
              image={{ src: SHIRT_WHITE, alt: "Camiseta blanca lisa, vista de frente (foto de ejemplo)" }}
              href="#"
              confirmedLabel="Confirmado hace 2 días"
            />
          </Labeled>
          <Labeled label="sin confirmedLabel">
            <ProductCard
              name="Camiseta básica"
              meta="Negra · S a XXL"
              image={{ src: SHIRT_BLACK, alt: "Camiseta negra lisa, vista de frente (foto de ejemplo)" }}
              href="#"
            />
          </Labeled>
        </div>
      </Row>

      <Row
        name="Fila con scroll · móvil"
        description="La card es fluida; la fila fija el ancho con auto-cols-[200px] y hace scroll horizontal con snap. Se asoma la siguiente card para invitar a deslizar."
      >
        <div className="w-[375px] overflow-hidden rounded-tile border border-dashed border-line bg-primary py-4">
          <div className="grid snap-x snap-mandatory auto-cols-[200px] grid-flow-col gap-3 overflow-x-auto scroll-px-4 px-4 [&>*]:snap-start">
            <Cards />
          </div>
        </div>
        <Code>{'<div class="grid grid-flow-col auto-cols-[200px] gap-3 overflow-x-auto snap-x scroll-px-4 px-4">'}</Code>
      </Row>

      <Row
        name="Grid"
        description="La misma card en la columna del grid: 2 columnas en móvil, 4 en desktop. Ninguna prop de tamaño."
      >
        <div className="flex items-start gap-6">
          <Labeled label="375px · grid-cols-2">
            <div className="grid w-[375px] grid-cols-2 gap-3 rounded-tile border border-dashed border-line bg-primary p-4">
              <Cards count={4} />
            </div>
          </Labeled>
          <Labeled label="desktop · grid-cols-4">
            <div className="grid w-[560px] grid-cols-4 gap-3 rounded-tile border border-dashed border-line bg-primary p-4">
              <Cards count={4} />
            </div>
          </Labeled>
        </div>
      </Row>

      <Row
        name="Por qué fluida"
        description="Una sola regla de ancho: la decide el contenedor."
      >
        <div className="text-[14px] leading-relaxed text-muted">
          Un ancho fijo de 200px en la card rompe el grid y obliga a una prop <Code>size</Code> o a dos componentes. Con la
          card en <Code>w-full</Code>, la fila usa <Code>auto-cols-[200px]</Code> y el grid usa sus columnas. Hover: el
          borde pasa a <Code>border-muted</Code> (sin scale, que en touch se queda pegado). Foco: outline dorado.
        </div>
      </Row>
    </PageFrame>
  );
}
