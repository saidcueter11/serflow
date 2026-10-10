import type { ReactNode } from "react";
import { PromoAfiche } from "../../../../src/components/ui/PromoAfiche";
import { PromoCard } from "../../../../src/components/ui/PromoCard";
import { PromoGrid } from "../../../../src/components/ui/PromoGrid";
import type { PromoView } from "../../../../src/lib/promos";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { CAP_GREEN, CAP_NAVY, SHIRT_BLACK, SHIRT_WHITE } from "./samples";

const GORRAS: PromoView = {
  slug: "2x1-gorras-bordadas",
  title: "2x1 en gorras bordadas",
  description: "Llevas dos gorras con el mismo bordado y pagas una. Aplica para bordados de hasta 10 cm.",
  endsAt: "2026-10-11T23:59:00-05:00",
  cover: { src: CAP_NAVY, alt: "Gorra azul oscuro bordada (foto de ejemplo)" },
  photos: [
    { src: CAP_GREEN, alt: "Gorra verde bordada (foto de ejemplo)" },
    { src: CAP_NAVY, alt: "Gorra azul de perfil (foto de ejemplo)" },
  ],
};
const EQUIPOS: PromoView = {
  slug: "camisetas-equipos",
  title: "10% en camisetas para equipos de fútbol",
  description: "Desde 10 camisetas con nombre y número. Estampado o DTF, en el color de tu equipo.",
  endsAt: "2026-10-31T23:59:00-05:00",
  cover: { src: SHIRT_WHITE, alt: "Camiseta blanca estampada (foto de ejemplo)" },
  photos: [{ src: SHIRT_BLACK, alt: "Camiseta negra estampada (foto de ejemplo)" }],
};
const NINOS: PromoView = {
  slug: "gorras-ninos-nombre",
  title: "Gorras para niños con su nombre bordado",
  description: "El nombre va gratis en cualquier gorra infantil de la vitrina.",
  endsAt: null,
  cover: { src: CAP_GREEN, alt: "Gorra infantil verde (foto de ejemplo)" },
  photos: [],
};

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      {children}
    </div>
  );
}

export function BoardPromoCard() {
  return (
    <PageFrame family="cards" width={1380}>
      <PageTitle
        title="PromoCard, PromoAfiche y PromoGrid"
        description={
          <>
            Promos vigentes (PRI-131). Las tres reciben <Code>PromoView</Code> de <Code>src/lib/promos.ts</Code> (o una
            lista de ellas): título, descripción, <Code>endsAt</Code>, portada y fotos. Sin <Code>endsAt</Code> no hay píldora
            de vigencia; sin descripción no hay párrafo. Las imágenes son siluetas marcadas como foto de ejemplo.
          </>
        }
      />

      <Row
        name="PromoCard"
        description='Toda la card es un link al detalle. Va en "Otras promos" del detalle y en la 404 cuando hay promos (h3 dentro de una Section).'
      >
        <div className="grid grid-cols-3 gap-6">
          <Labeled label="con fecha">
            <PromoCard promo={GORRAS} />
          </Labeled>
          <Labeled label="sin endsAt (sin píldora)">
            <PromoCard promo={NINOS} />
          </Labeled>
          <Labeled label="sin descripción">
            <PromoCard promo={{ ...EQUIPOS, description: null }} />
          </Labeled>
        </div>
      </Row>

      <Row
        name="PromoGrid"
        description="Hasta 3 por fila; la última fila se reparte el ancho. 4 promos = 3 + 1 a lo ancho, y la card sola se pone horizontal. Nunca una columna vacía."
      >
        <div className="@container">
          <PromoGrid>
            {[GORRAS, EQUIPOS, NINOS, { ...EQUIPOS, slug: "estampado-dtf", title: "Estampado DTF desde 1 unidad" }].map((p) => (
              <PromoCard key={p.slug} promo={p} />
            ))}
          </PromoGrid>
        </div>
      </Row>

      <Row
        name="PromoAfiche"
        description='La card de /promos: botón de WhatsApp con el mensaje de esa promo y "Ver las N fotos" al detalle. Cada afiche es su propia sección, por eso lleva su propio WhatsApp. Desde 672 px se pone horizontal.'
      >
        <div className="grid grid-cols-3 items-stretch gap-5">
          <div className="flex">
            <PromoAfiche promo={NINOS} />
          </div>
          <div className="flex">
            <PromoAfiche promo={{ ...GORRAS, description: null }} />
          </div>
          <div className="flex">
            <PromoAfiche promo={EQUIPOS} />
          </div>
        </div>
        <div className="@container mt-6">
          <PromoGrid>{[GORRAS].map((p) => <PromoAfiche key={p.slug} promo={p} />)}</PromoGrid>
        </div>
      </Row>
    </PageFrame>
  );
}
