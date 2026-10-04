import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { WorkCard } from "../../../../src/components/ui/WorkCard";
import { BoardIntro } from "./BoardIntro";
import { BoardServiceCard } from "./BoardServiceCard";
import { BoardProductCard } from "./BoardProductCard";
import { BoardWorkCard } from "./BoardWorkCard";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function CardsCanvas() {
  return (
    <Canvas name="Cards" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1000, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ServiceCard"
        name="ServiceCard"
        component={BoardServiceCard}
        layout={{ x: 1050, y: 0, width: 1600, height: 2400, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ProductCard"
        name="ProductCard"
        component={BoardProductCard}
        layout={{ x: 2700, y: 0, width: 1500, height: 1600, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="WorkCard"
        name="WorkCard"
        component={BoardWorkCard}
        layout={{ x: 4250, y: 0, width: 1300, height: 1600, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 5600, y: 0, width: 1400, height: 2600, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

// Fotos de ejemplo (siluetas SVG) como literales locales para que las variantes se resuelvan estáticamente.
const SAMPLE_SHIRT =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%232a271c'/><g transform='translate(128 80) scale(1.2)'><path d='M30 10 L48 4 Q60 14 72 4 L90 10 L106 34 L89 43 L86 37 L86 112 L34 112 L34 37 L31 43 L14 34 Z' fill='%23F4F1E6' stroke='rgba(0,0,0,.35)' stroke-width='1.5'/></g></svg>";
const SAMPLE_CAP =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%232a271c'/><g transform='translate(96 78) scale(1.6)'><path d='M18 66 Q18 22 62 18 Q104 22 106 66 Z' fill='%231f3a5f'/><path d='M62 66 Q104 62 126 74 Q96 84 60 76 Z' fill='%231f3a5f'/></g></svg>";
const SAMPLE_WORK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect width='400' height='500' fill='%232a271c'/><g transform='translate(96 178) scale(1.6)'><path d='M18 66 Q18 22 62 18 Q104 22 106 66 Z' fill='%231f3a5f'/><path d='M62 66 Q104 62 126 74 Q96 84 60 76 Z' fill='%231f3a5f'/><rect x='44' y='34' width='34' height='20' rx='3' fill='none' stroke='%23FFD700' stroke-width='1.5' stroke-dasharray='4 3'/></g></svg>";

defineAsset(ServiceCard, {
  libraries: ["Design System"],
  usageInstructions:
    "Una técnica o servicio del taller (Estampado, DTF, Bordado...) dentro de una lista de N items: grid gap-3 md:grid-cols-3, sin límite de cantidad. visual da la muestra CSS de las tres técnicas de hoy; sin visual sale una muestra neutra de tela (servicios nuevos no necesitan foto). image con una foto real del taller reemplaza la muestra. No es link ni lleva precio: para una prenda que se pide usa ProductCard, para un pedido entregado WorkCard; la acción de WhatsApp va en un Button debajo de la lista.",
  variants: {
    "Bordado": { props: { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", visual: "bordado" } },
    "Estampado": { props: { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", visual: "estampado" } },
    "DTF": { props: { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", visual: "dtf" } },
    "Servicio nuevo (muestra neutra)": { props: { title: "Parches", description: "Bordados aparte para coser o pegar donde quieras." } },
  },
});

defineAsset(ProductCard, {
  libraries: ["Design System"],
  usageInstructions:
    "Una prenda de Disponible ahora o del catálogo: foto 4:3, nombre, meta (color y tallas) y confirmedLabel opcional (texto dorado; omitir si no se sabe, nunca inventarlo). Toda la card es un link. Es fluida: el ancho lo pone la lista (fila con scroll grid grid-flow-col auto-cols-[200px] overflow-x-auto snap-x, o las columnas de un grid). No le agregues tamaño fijo, scale en hover ni skeleton animado. Para una técnica usa ServiceCard; para un trabajo entregado, WorkCard.",
  variants: {
    "Camiseta confirmada": {
      props: {
        name: "Camiseta básica",
        meta: "Blanca · S a XL",
        image: { src: SAMPLE_SHIRT, alt: "Camiseta blanca lisa, vista de frente" },
        href: "/products/camisetas/camiseta-basica-blanca",
        confirmedLabel: "Confirmado hace 2 días",
      },
    },
    "Gorra sin confirmación": {
      props: {
        name: "Gorra trucker",
        meta: "Azul oscuro · talla única",
        image: { src: SAMPLE_CAP, alt: "Gorra azul oscuro de perfil" },
        href: "/products/gorras/gorra-trucker-azul",
      },
    },
  },
});

defineAsset(WorkCard, {
  libraries: ["Design System"],
  usageInstructions:
    "Un trabajo terminado por el taller: foto real 4:5, título del pedido y technique opcional (StatusPill muted). Es un figure, no un link. Va en grid de 2 columnas (móvil) a 4 (desktop); si no hay fotos, la sección Trabajos hechos completa no se renderiza (nada de Próximamente). No nombres clientes reales sin permiso y no uses fotos de stock: si el taller no lo hizo, no va aquí. Para prendas a la venta usa ProductCard.",
  variants: {
    "Gorras bordadas": {
      props: {
        image: { src: SAMPLE_WORK, alt: "Gorra azul con escudo bordado" },
        title: "Gorras bordadas para un equipo de fútbol",
        technique: "Bordado",
      },
    },
    "Sin técnica": {
      props: {
        image: { src: SAMPLE_WORK, alt: "Gorra azul con escudo bordado" },
        title: "Gorras para un equipo de fútbol",
      },
    },
  },
});
