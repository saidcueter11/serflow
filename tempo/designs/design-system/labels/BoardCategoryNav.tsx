import { CategoryNav } from "../../../../src/components/ui/CategoryNav";
import { PageFrame, PageTitle, Row } from "../Chrome";

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
    <PageFrame family="etiquetas" width={1300}>
      <PageTitle
        title="CategoryNav"
        description="Pestañas de categoría del catálogo (PRI-130): links con el conteo de fotos, la actual en oro viejo relleno con aria-current y las demás con borde (PRI-286). 48 px de alto (52 en desktop), texto 16 semibold; se hunden un poco al tocar. Son navegación, no un radio."
      />

      <Row name="Celular (390)" description="Una fila con scroll lateral: la última pestaña queda cortada, eso dice que hay más. La actual entra en pantalla al cargar.">
        <div className="w-[390px] overflow-hidden rounded-tile bg-primary px-4 py-3">
          <CategoryNav categories={CATS} current="/products/beisbol" />
        </div>
      </Row>

      <Row name="Desktop" description="Desde @3xl se parten en varias filas, sin scroll.">
        <div className="w-[820px] rounded-tile bg-primary p-6">
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
