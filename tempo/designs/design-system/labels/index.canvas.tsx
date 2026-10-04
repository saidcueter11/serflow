import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { Chip } from "../../../../src/components/ui/Chip";
import { Eyebrow } from "../../../../src/components/ui/Eyebrow";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { BoardIntro } from "./BoardIntro";
import { BoardChip } from "./BoardChip";
import { BoardEyebrow } from "./BoardEyebrow";
import { BoardStatusPill } from "./BoardStatusPill";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function LabelsCanvas() {
  return (
    <Canvas name="Labels" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1000, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Chip"
        name="Chip"
        component={BoardChip}
        layout={{ x: 1050, y: 0, width: 1100, height: 1300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Eyebrow"
        name="Eyebrow"
        component={BoardEyebrow}
        layout={{ x: 2200, y: 0, width: 1100, height: 900, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="StatusPill"
        name="StatusPill"
        component={BoardStatusPill}
        layout={{ x: 3350, y: 0, width: 1100, height: 1300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 4500, y: 0, width: 1400, height: 2600, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(Chip, {
  libraries: ["Design System"],
  usageInstructions:
    "Opción seleccionable dentro de un grupo de radios (talla, técnica, prenda): label + input radio nativo, funciona sin JS. Todos los chips de un grupo comparten name y van dentro de un fieldset con legend; selected marca el valor inicial. No para estados (usa StatusPill), ni para nombrar secciones (usa Eyebrow), ni para links de navegación o filtros que cambian la URL (usa un <a>).",
  variants: {
    "Talla elegida": { props: { name: "talla", label: "L", selected: true } },
    "Talla": { props: { name: "talla", label: "M" } },
    "Técnica": { props: { name: "tecnica", label: "Estampado" } },
    "Así está bien": { props: { name: "tecnica", label: "Así está bien", value: "ninguna", selected: true } },
  },
});

defineAsset(Eyebrow, {
  libraries: ["Design System"],
  usageInstructions:
    "Etiqueta corta (2 a 4 palabras) con punto dorado sobre el título de una sección, una por sección. Reemplaza la barra dorada de Title.astro y las micro-etiquetas de 10px. No para estados con color (usa StatusPill) ni para opciones elegibles (usa Chip); no va dentro de cards.",
  variants: {
    "Taller en Cartagena": { props: { children: "Taller en Cartagena" } },
    "Campaña": { props: { children: "Campaña" } },
  },
});

defineAsset(StatusPill, {
  libraries: ["Design System"],
  usageInstructions:
    "Estado corto no interactivo: ok = abierto, accent = disponible o confirmado, muted = cerrado o atributo neutro. El texto siempre dice el estado; el punto es decorativo (dot={false} si ya hay otra señal). No para opciones elegibles (usa Chip) ni para nombrar secciones (usa Eyebrow); no le pongas href ni onClick, y no muestres un estado que el sitio no puede saber.",
  variants: {
    "Abierto ahora": { props: { tone: "ok", children: "Abierto ahora" } },
    "Disponible confirmado": { props: { tone: "accent", children: "Disponible · confirmado hace 2 días" } },
    "Confirmado sin punto": { props: { tone: "accent", dot: false, children: "Confirmado hace 2 días" } },
    "Cerrado": { props: { tone: "muted", children: "Cerrado" } },
  },
});
