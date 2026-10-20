import { CategoryNav } from "../../../../src/components/ui/CategoryNav";
import { NewBadge } from "../../../../src/components/ui/NewBadge";
import { Demo, PageFrame, PageTitle, Row } from "../Chrome";

const CATS = [
  { label: "Todo", href: "/products", count: 92 },
  { label: "Mi Tierra Querida", href: "/products/mi-tierra-querida", count: 26 },
  { label: "Beisbol", href: "/products/beisbol", count: 23 },
  { label: "Basketball", href: "/products/basketball", count: 10 },
  { label: "Moda", href: "/products/moda", count: 23 },
  { label: "Niños", href: "/products/kids", count: 10 },
  { label: "Dotación", href: "/products/dotacion", count: 0 },
];

export function BoardCategoryNav() {
  return (
    <PageFrame family="etiquetas" width={1100}>
      <PageTitle
        title="CategoryNav"
        description="Pestañas de categoría del catálogo (PRI-130): links con el conteo de fotos, la actual en dorado con aria-current. Medidas del Chip (44 px, 14 px semibold), pero son navegación, no un radio."
      />

      <Row name="Celular (390)" description="Una fila con scroll lateral: la última pestaña queda cortada, eso dice que hay más. La actual entra en pantalla al cargar.">
        <div className="w-[390px] overflow-hidden rounded-tile bg-primary px-4 py-3">
          <CategoryNav categories={CATS} current="/products/beisbol" />
        </div>
      </Row>

      <Row name="Desktop" description="Desde @3xl se parten en varias filas, sin scroll.">
        <div className="w-[900px] rounded-tile bg-primary p-6">
          <CategoryNav categories={CATS} current="/products" />
        </div>
      </Row>

      <Row name="No es" description="No filtra en el cliente ni elige una opción.">
        <div className="text-[14px] leading-relaxed text-muted">
          Para elegir talla o técnica usa <strong className="text-ink">Chip</strong> (radio). Una categoría vacía sigue
          saliendo, con 0: así se nota antes de tocarla.
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardNewBadge() {
  return (
    <PageFrame family="etiquetas" width={900}>
      <PageTitle
        title="NewBadge"
        description="&quot;Nuevo&quot;: la foto se subió hace menos de 21 días (created_at). Dorado con texto, nunca solo color. Se calcula en el build."
      />
      <Row name="Forma" description="Sola, y encima de una foto del muro (arriba a la izquierda; el contador de fotos va a la derecha).">
        <Demo label="default">
          <NewBadge />
        </Demo>
        <div className="fabric relative h-[220px] w-[165px] rounded-tile bg-surface-2">
          <NewBadge className="absolute left-2.5 top-2.5" />
        </div>
      </Row>
    </PageFrame>
  );
}
