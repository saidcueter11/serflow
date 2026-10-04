import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { Button } from "../../../../src/components/ui/Button";
import { WhatsAppFab } from "../../../../src/components/ui/WhatsAppFab";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { BoardIntro } from "./BoardIntro";
import { BoardVariants } from "./BoardVariants";
import { BoardLayoutIcon } from "./BoardLayoutIcon";
import { BoardWhatsAppFab } from "./BoardWhatsAppFab";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function ButtonsCanvas() {
  return (
    <Canvas name="Buttons" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Variants"
        name="Variants"
        component={BoardVariants}
        layout={{ x: 950, y: 0, width: 1000, height: 1100, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="LayoutIcon"
        name={"Layout & icon"}
        component={BoardLayoutIcon}
        layout={{ x: 2000, y: 0, width: 1250, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="WhatsAppFab"
        name="WhatsApp FAB"
        component={BoardWhatsAppFab}
        layout={{ x: 3300, y: 0, width: 1000, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 4350, y: 0, width: 1400, height: 2400, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(Button, {
  libraries: ["Design System"],
  usageInstructions:
    "Acciones de la web. variant whatsapp = la acción principal que abre WhatsApp (dorado con sombra de presión): máximo uno por sección visible, siempre con href de whatsappUrl() y external. secondary = acción de apoyo al lado del whatsapp (Cómo llegar, Personalizar esta). ghost = link de baja énfasis tipo 'Ver todo →'. No usar para listas de navegación del header ni para enlaces dentro de párrafos; no restilizar con className (no lo acepta).",
  variants: {
    "WhatsApp principal": {
      props: {
        variant: "whatsapp",
        children: "Escríbenos por WhatsApp",
        href: WHATSAPP_URL,
        external: true,
      },
    },
    "Pedir por WhatsApp (ancho completo)": {
      props: {
        variant: "whatsapp",
        children: "Pedir por WhatsApp",
        href: WHATSAPP_URL,
        external: true,
        fullWidth: true,
      },
    },
    "Secundario": {
      props: { variant: "secondary", children: "Cómo llegar", href: "/#ubicacion" },
    },
    "Ghost ver todo": {
      props: { variant: "ghost", children: "Ver todo →", href: "/products/mi-tierra-querida" },
    },
  },
});

defineAsset(WhatsAppFab, {
  libraries: ["Design System"],
  usageInstructions:
    "Botón flotante de contacto por WhatsApp. Uno por página, en el layout (placement fixed, abajo a la derecha). No va dentro de cards, secciones ni headers; para una acción de WhatsApp en el contenido usa Button variant whatsapp. placement inline solo para previsualizarlo en flujo.",
  variants: {
    "Flotante": { props: { placement: "fixed" } },
    "En flujo con mensaje": { props: { placement: "inline", text: "Hola! Quiero cotizar camisetas personalizadas" } },
  },
});
