import { Header } from "../../../../src/components/ui/Header";
import { Footer } from "../../../../src/components/ui/Footer";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { HomePage } from "../../../../src/components/home/HomePage";
import { CATALOG_HREF, HOME_IMAGES, HOME_SLIDES, LOGO, PRODUCTS, PROMOS_SAMPLE } from "./portada";

export type EstadoPortada = "productos" | "vacio" | "promos";

const PRODUCT_ITEMS = PRODUCTS.map((p) => ({ name: p.name, meta: p.meta, href: CATALOG_HREF, image: { src: p.src, alt: p.name } }));

/**
 * La portada real (src/components/home/HomePage) con el mismo marco que pone Layout.astro: PromoBar, Header,
 * Footer y WhatsAppFab. No es una copia: si cambia HomePage, cambia aquí. El hilo (Thread) solo se dibuja
 * en el sitio, porque necesita el scroll de la página.
 */
export function BoardPortada({ width, estado = "productos" }: { width: 390 | 1280; estado?: EstadoPortada }) {
  return (
    <div className="relative bg-primary font-body text-ink antialiased" style={{ width }}>
      {estado === "promos" && <PromoBar promos={PROMOS_SAMPLE} />}
      <Header logoSrc={LOGO} />
      <HomePage slides={HOME_SLIDES} products={estado === "vacio" ? [] : PRODUCT_ITEMS} images={HOME_IMAGES} catalogHref={CATALOG_HREF} />
      <Footer logoSrc={LOGO} />
      <div className="absolute bottom-5 right-4">
        <WhatsAppFab placement="inline" />
      </div>
    </div>
  );
}

export function BoardPortadaMobile({ estado }: { estado?: EstadoPortada }) {
  return <BoardPortada width={390} estado={estado} />;
}

export function BoardPortadaDesktop({ estado }: { estado?: EstadoPortada }) {
  return <BoardPortada width={1280} estado={estado} />;
}
