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
            Promos vigentes (PRI-131, sistema medido de PRI-286). Reciben <Code>PromoView</Code> de{" "}
            <Code>src/lib/promos.ts</Code>: título, descripción, <Code>endsAt</Code>, portada y fotos. Sin <Code>endsAt</Code>{" "}
            no hay vigencia; sin descripción no hay párrafo. Las imágenes son siluetas marcadas como foto de ejemplo.
          </>
        }
      />

      <Row
        name="PromoCard en PromoGrid"
        description='Tarjeta horizontal con caja, toda un link al detalle. Va en "Otras promos" del detalle y en la 404 cuando hay promos (h3 dentro de una Section). Una fila llena en desktop.'
      >
        <div className="flex flex-col gap-6">
          <Labeled label="3 en fila (1280): foto de 112, sin descripción">
            <div className="pf w-[1184px]">
              <div className="pf-v">
                <PromoGrid>{[GORRAS, EQUIPOS, NINOS].map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
              </div>
            </div>
          </Labeled>
          <Labeled label="2 en fila (1280): foto de 200 y descripción">
            <div className="pf w-[1184px]">
              <div className="pf-v">
                <PromoGrid>{[EQUIPOS, NINOS].map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
              </div>
            </div>
          </Labeled>
          <Labeled label="celular (390)">
            <div className="pf w-[358px]">
              <PromoGrid>{[GORRAS, NINOS].map((p) => <PromoCard key={p.slug} promo={p} headingLevel={3} />)}</PromoGrid>
            </div>
          </Labeled>
        </div>
      </Row>

      <Row
        name="PromoAfiche"
        description='Una promo de /promos: su propia sección, texto en 5 columnas y foto 16:9 en 6. Botón de WhatsApp con el mensaje de esa promo y "Ver las N fotos" al detalle.'
      >
        <div className="flex flex-col gap-6">
          <div className="pf w-[1280px] bg-primary">
            <main className="pf-v pf-c">
              <PromoAfiche promo={GORRAS} />
              <PromoAfiche promo={{ ...NINOS, description: null }} />
            </main>
          </div>
          <div className="pf w-[390px] bg-primary">
            <main className="pf-v pf-c">
              <PromoAfiche promo={EQUIPOS} />
            </main>
          </div>
        </div>
      </Row>
    </PageFrame>
  );
}
