import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { Header } from "../../../../src/components/ui/Header";
import { Section } from "../../../../src/components/ui/Section";
import { Footer } from "../../../../src/components/ui/Footer";
import { BoardIntro } from "./BoardIntro";
import { BoardHeader } from "./BoardHeader";
import { BoardSection } from "./BoardSection";
import { BoardFooter } from "./BoardFooter";
import { BoardPortadaDesktop, BoardPortadaMobile } from "./BoardPortada";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function AppShellCanvas() {
  return (
    <Canvas name="App shell" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1100, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Header"
        component={BoardHeader}
        layout={{ x: 1150, y: 0, width: 1600, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Section"
        component={BoardSection}
        layout={{ x: 2800, y: 0, width: 1760, height: 2000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Footer"
        component={BoardFooter}
        layout={{ x: 4610, y: 0, width: 1700, height: 1100, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="PortadaMobile"
        name="Composite · Portada mobile 390 (HomePage real)"
        component={BoardPortadaMobile}
        layout={{ x: 6360, y: 0, width: 390, height: 3860, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="PortadaDesktop"
        name="Composite · Portada desktop 1280 (HomePage real)"
        component={BoardPortadaDesktop}
        layout={{ x: 6800, y: 0, width: 1280, height: 2950, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 8130, y: 0, width: 1400, height: 4000, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

// Logo de muestra para las variantes: el PNG real llega por import (no es un literal que el
// índice de assets pueda leer). En la app, Astro pasa Logo.src.
const LOGO_SAMPLE =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 230 56'%3E%3Ctext x='0' y='44' font-family='Arial Black,Arial,sans-serif' font-size='44' font-weight='900' fill='%23FFD700'%3ESERFLOW%3C/text%3E%3C/svg%3E";

defineAsset(Header, {
  libraries: ["Design System"],
  usageInstructions:
    "La cabecera de todas las páginas, una vez, en Layout.astro (debajo de PromoBar si hay promos): logo y nav de anclas desde 896px; menú details/summary sin JS debajo. Sin botón de WhatsApp: esa entrada es el WhatsAppFab (PRI-129). logoSrc lo pasa quien llama (Astro: Logo.src). links por defecto = las 3 anclas del home (NAV_LINKS: Qué hacemos, Disponible ahora, Visítanos); current = href con aria-current. No la hagas sticky/fixed ni le pongas backdrop-blur, no agregues un drawer con JS ni botones de acción.",
  variants: {
    Home: { props: { logoSrc: LOGO_SAMPLE } },
    "Con sección actual": { props: { logoSrc: LOGO_SAMPLE, current: "/#que-hacemos" } },
    "Otra página": {
      props: {
        logoSrc: LOGO_SAMPLE,
        links: [
          { label: "Inicio", href: "/" },
          { label: "Disponible ahora", href: "/#disponible" },
        ],
      },
    },
  },
});

defineAsset(Section, {
  libraries: ["Design System"],
  usageInstructions:
    "Envoltorio de cada bloque del home: id (ancla del nav), eyebrow opcional, título h2 en font-display 28/40px con costura dorada que se cose al aparecer (stitch-title), descripción y contenido; padding px-4 py-8 móvil, px-12 py-14 desde 768px. tone panel = superficie con trama, máximo una por página. No para el hero (lleva h1 y layout propio), no le pases datos del negocio como props (van en el contenido: MapCard, ContactList) y no la anides.",
  variants: {
    "Quiénes somos": {
      props: {
        id: "quienes-somos",
        title: "Quiénes somos",
        children:
          "Somos un taller en Cartagena que hace prendas personalizadas. La ropa no solo se usa, se vive: por eso cada pieza lleva algo tuyo.",
      },
    },
    "Con eyebrow": {
      props: {
        eyebrow: "Taller en Cartagena",
        title: "Qué hacemos",
        description: "Camisetas y gorras, con la técnica que mejor le quede a tu diseño.",
        children: "Lista de ServiceCard aquí.",
      },
    },
    Panel: {
      props: {
        title: "Diseña la tuya",
        description: "Sube tu diseño y míralo sobre la prenda.",
        tone: "panel",
        children: "Contenido del panel aquí.",
      },
    },
  },
});

defineAsset(Footer, {
  libraries: ["Design System"],
  usageInstructions:
    "El pie de todas las páginas, una vez, en Layout.astro: logo, qué es Serflow, link Cómo llegar y horario (/#visitanos), correo y redes, de src/lib/business.ts. Sin dirección, horario ni WhatsApp: salen una sola vez (MapCard en Visítanos y el WhatsAppFab). Sin fondo propio, para que se vea el hilo de la portada. logoSrc lo pasa quien llama (Astro: Logo.src). Su pb-28 deja libre el WhatsAppFab. No copies el contacto a mano en otra parte.",
  variants: {
    Default: { props: { logoSrc: LOGO_SAMPLE } },
  },
});
