import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { HeroCarousel } from "../../../../src/components/ui/HeroCarousel";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Thread } from "../../../../src/components/ui/Thread";
import { BoardHeroCarousel, BoardIntro, BoardThread, BoardTickerPromo } from "./boards";

export default function MotionCanvas() {
  return (
    <Canvas name="Movimiento" backgroundColor="#232323">
      <Storyboard id="Intro" component={BoardIntro} layout={{ x: 0, y: 0, width: 1000, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="HeroCarousel" component={BoardHeroCarousel} layout={{ x: 1050, y: 0, width: 1300, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="TickerPromoBar" name="Ticker y PromoBar" component={BoardTickerPromo} layout={{ x: 2400, y: 0, width: 1300, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Thread" component={BoardThread} layout={{ x: 3750, y: 0, width: 1000, height: 1300, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}

const PHOTO =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%232a271c'/%3E%3C/svg%3E";

defineAsset(HeroCarousel, {
  libraries: ["Design System"],
  usageInstructions:
    "Carrusel del hero de la portada: fotos que muestran el resultado (gente usando las prendas, el taller trabajando), una etiqueta por foto, fundido cada 6 s, zoom lento y pausa con el mouse. children va encima (bienvenida + Button whatsapp). La primera foto es el LCP: pásala optimizada con getImage y precárgala. Una promo activa entra primero con promo: true. Solo en el hero, uno por página; no lo uses como galería de productos (usa ProductCard) ni con fotos decorativas sin contexto.",
  variants: {
    Default: {
      props: {
        slides: [
          { src: PHOTO, alt: "Camisetas estampadas", caption: "Camisetas con tu diseño" },
          { src: PHOTO, alt: "Gorra bordada", caption: "Gorras bordadas" },
        ],
        className: "h-[420px]",
      },
    },
  },
});

defineAsset(Ticker, {
  libraries: ["Design System"],
  usageInstructions:
    "Cinta dorada que corre bajo el hero con frases cortas de para qué sirve Serflow (uniformes para tu equipo, gorras con el logo de tu negocio). Una por página. No la uses para promos (usa PromoBar: lo que corre no se lee) ni con palabras sueltas o nombres de técnicas.",
  variants: {
    Default: { props: { items: ["Uniformes para tu equipo", "Gorras con el logo de tu negocio", "Camisetas para tu evento"] } },
  },
});

defineAsset(PromoBar, {
  libraries: ["Design System"],
  usageInstructions:
    "Barra dorada de promos arriba de todo (slot top de Layout.astro), con las promos activas del admin (getActivePromos) enlazando a /promos/<slug>. Con una se queda quieta; con varias rotan cada 5 s. Sin promos no se pinta. No la pongas dentro del contenido ni la uses para avisos que no sean promos.",
  variants: {
    "Una promo": { props: { promos: [{ title: "2x1 en gorras bordadas este fin de semana", href: "/promos/2x1-gorras" }] } },
    "Dos promos": {
      props: {
        promos: [
          { title: "2x1 en gorras bordadas este fin de semana", href: "/promos/2x1-gorras" },
          { title: "10% en camisetas para equipos de fútbol", href: "/promos/equipos" },
        ],
      },
    },
  },
});

defineAsset(Thread, {
  libraries: ["Design System"],
  usageInstructions:
    "Hilo de bordado que se cose por la página con el scroll, detrás del contenido. En el sitio va sin props como primer hijo de un contenedor relative (el contenido en relative z-10) y lo dibuja src/scripts/thread.ts; con width/height/viewport se dibuja fijo (canvas). Uno por página, solo en la portada. No lo pongas encima del contenido ni le agregues objetos que se muevan solos.",
  variants: {
    "Trazado fijo": { props: { width: 640, height: 900, viewport: 300 } },
  },
});
