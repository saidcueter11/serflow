import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { HeroCarousel } from "../../../../src/components/ui/HeroCarousel";
import { Ticker } from "../../../../src/components/ui/Ticker";
import { PromoBar } from "../../../../src/components/ui/PromoBar";
import { Thread } from "../../../../src/components/ui/Thread";
import { Palabras } from "../../../../src/components/ui/Palabras";
import { BoardHeroCarousel, BoardIntro, BoardPalabras, BoardThread, BoardTickerPromo } from "./boards";
import { Costura } from "../../../../src/components/ui/Costura";
import { Monograma } from "../../../../src/components/ui/Monograma";
import { BoardCostura, BoardMonograma } from "./BoardFicha";

export default function MotionCanvas() {
  return (
    <Canvas name="Movimiento" backgroundColor="#232323">
      <Storyboard id="Intro" component={BoardIntro} layout={{ x: 0, y: 0, width: 1000, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="HeroCarousel" component={BoardHeroCarousel} layout={{ x: 1050, y: 0, width: 1300, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="TickerPromoBar" name="Ticker y PromoBar" component={BoardTickerPromo} layout={{ x: 2400, y: 0, width: 1300, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Thread" component={BoardThread} layout={{ x: 3750, y: 0, width: 1000, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="Palabras" name="Palabras" component={BoardPalabras} layout={{ x: 4800, y: 0, width: 1000, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="Costura" name="Costura" component={BoardCostura} layout={{ x: 0, y: 1400, width: 1500, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="Monograma" name="Monograma" component={BoardMonograma} layout={{ x: 1550, y: 1400, width: 1500, height: 1300, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}

const PHOTO =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%232a271c'/%3E%3C/svg%3E";

defineAsset(HeroCarousel, {
  libraries: ["Design System"],
  usageInstructions:
    "Carrusel del hero a sangre (PRI-286): fotos que muestran el resultado (gente usando las prendas, el taller trabajando), fundido cada 6 s, zoom lento, una barra de avance por foto en el margen de la rejilla y pausa con el mouse; con reducir movimiento queda la primera foto y solo su barra llena. children va encima (.pf-hero-texto: bienvenida + Button whatsapp); className pf-hero da el alto 600 / 720. La primera foto es el LCP: pásala optimizada con getImage y precárgala. Una promo activa entra primero. También es el hero del detalle de una promo (una foto, sin barras). Solo en el hero, uno por página; no lo uses como galería de productos (usa ProductCard) ni con fotos decorativas sin contexto.",
  variants: {
    Default: {
      props: {
        slides: [
          { src: PHOTO, alt: "Camisetas estampadas" },
          { src: PHOTO, alt: "Gorra bordada" },
        ],
        className: "h-[420px]",
      },
    },
  },
});

defineAsset(Palabras, {
  libraries: ["Design System"],
  usageInstructions:
    "Titular palabra por palabra (PRI-287, efecto 3): cada palabra sube desde atrás de una línea, con un giro leve. Va dentro del h1 de la página; en su bajada, dentro de un p con pf-lead y sf-bajada, llega después y sin máscara. Solo el h1 y la bajada del primer pantallazo, una vez por página; no en títulos de sección (Section, pf-h2), que aparecen con el scroll. Solo texto plano: sin links ni negritas adentro. Sin JS, con reducir movimiento o con mala señal no anima.",
  variants: {
    Titular: { props: { text: "Bienvenido a Serflow" } },
    Bajada: { props: { text: "Camisetas y gorras con tu logo, tu equipo o tu idea." } },
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
    "Barra dorada de promos arriba de todo (slot top de Layout.astro), con las promos vigentes del admin (getActivePromos). Con una se queda quieta y enlaza a /promos/<slug>; con varias, toda la barra es un link a /promos y los títulos rotan cada 5 s. Cada título lleva debajo sus días (dias, de diasPromo) si la promo aplica solo algunos (PRI-538). Sin promos no se pinta. No la pongas dentro del contenido ni la uses para avisos que no sean promos.",
  variants: {
    "Una promo": { props: { promos: [{ title: "2x1 en gorras bordadas este fin de semana", href: "/promos/2x1-gorras" }] } },
    "Una promo con días": { props: { promos: [{ title: "10% en camisetas para equipos de fútbol", href: "/promos/equipos", dias: "Disponible martes, miércoles y jueves" }] } },
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

defineAsset(Costura, {
  libraries: ["Design System"],
  usageInstructions:
    "Costura de la ficha de producto (PRI-529): línea dorada punteada con una puntada en cada punta, decorativa. vertical va entre la foto y la información en escritorio (hijo de un flex o grid: se estira al alto de la fila, que es el de la foto); horizontal va entre la foto y el texto en el celular, a todo el ancho. El aire a los lados lo pone la página. Una por ficha. No es un separador de secciones (las secciones usan pf-sec) ni el subrayado de un enlace (Button ghost, sf-costura).",
  variants: {
    Horizontal: { props: { orientacion: "horizontal" } },
    "Vertical en una fila": {
      render: () => (
        <div className="flex h-[240px] w-[40px] justify-center">
          <Costura orientacion="vertical" />
        </div>
      ),
    },
  },
});

defineAsset(Monograma, {
  libraries: ["Design System"],
  usageInstructions:
    "La S de Serflow (SVG trazado del ícono, src/assets/monograma-s.svg) como máscara con un brillo dorado lento (--motion-monograma), decorativa (aria-hidden). Va absolute dentro de la columna de la información de la ficha de producto (PRI-529), detrás del nombre, el precio y los colores (el texto en relative z-10); className pone el puesto y el tamaño (escritorio: centrada, h-[80%]; celular: w-[72%] max-w-[300px]). Con reducir movimiento queda quieta. Una por página y solo en la ficha; no es el logo de la marca (Header usa el logo) ni un fondo de sección.",
  variants: {
    Default: { props: { className: "w-[240px]" } },
  },
});
