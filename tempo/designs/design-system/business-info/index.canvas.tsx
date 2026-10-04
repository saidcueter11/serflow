import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { QuickFacts } from "../../../../src/components/ui/QuickFacts";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { ContactList } from "../../../../src/components/ui/ContactList";
import { BoardIntro } from "./BoardIntro";
import { BoardQuickFacts } from "./BoardQuickFacts";
import { BoardMapCard } from "./BoardMapCard";
import { BoardContactList } from "./BoardContactList";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function BusinessInfoCanvas() {
  return (
    <Canvas name="Business info" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1000, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="QuickFacts"
        name="QuickFacts"
        component={BoardQuickFacts}
        layout={{ x: 1050, y: 0, width: 1100, height: 1100, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="MapCard"
        name="MapCard"
        component={BoardMapCard}
        layout={{ x: 2200, y: 0, width: 1100, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ContactList"
        name="ContactList"
        component={BoardContactList}
        layout={{ x: 3350, y: 0, width: 1100, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 4500, y: 0, width: 1400, height: 3000, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(QuickFacts, {
  libraries: ["Design System"],
  usageInstructions:
    "Tarjeta de 3 filas bajo el hero del home: ubicación (link a #ubicacion), horario entre semana y WhatsApp (link externo). Todo sale de src/lib/business.ts. openNow solo si quien la usa calcula el estado en el cliente; el sitio es estático y no puede saberlo, así que por defecto no se muestra. Una por página. No para la sección de ubicación completa (usa MapCard) ni para la lista de contacto (usa ContactList); no copies los datos a mano.",
  variants: {
    Default: { props: {} },
    "Abierto ahora": { props: { openNow: true } },
  },
});

defineAsset(MapCard, {
  libraries: ["Design System"],
  usageInstructions:
    "Sección de ubicación: mapa ilustrativo en CSS + dirección, ambos horarios y Cómo llegar. El mapa real de Google solo se pide al tocar (details + iframe lazy, cero JS). tall para el hero de escritorio. No metas un iframe de Google Maps suelto en la página ni una imagen de mapa; no la uses para contacto (usa ContactList).",
  variants: {
    Default: { props: {} },
    "Alto (escritorio)": { props: { tall: true } },
  },
});

defineAsset(ContactList, {
  libraries: ["Design System"],
  usageInstructions:
    "Lista de contacto con filas tocables de 56px: WhatsApp (link externo) y correo (mailto). Datos de src/lib/business.ts. Para la sección Contáctanos y el footer. No agregues redes sociales hasta que existan las cuentas; no la uses como CTA principal (usa Button variant whatsapp).",
  variants: {
    Default: { props: {} },
  },
});
