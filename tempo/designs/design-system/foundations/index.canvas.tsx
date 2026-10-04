import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { defineAsset } from "tempo-sdk/assets";
import { BoardIntro } from "./BoardIntro";
import { BoardColor } from "./BoardColor";
import { BoardTypography } from "./BoardTypography";
import { BoardShape } from "./BoardShape";
import { BoardMotion } from "./BoardMotion";
import { BoardIcons } from "./BoardIcons";
import { BoardDesignSystemDebt } from "./BoardDesignSystemDebt";

export default function FoundationsCanvas() {
  return (
    <Canvas name="Foundations" backgroundColor="#232323">
      <Storyboard
        id="Intro"
        name="Intro"
        component={BoardIntro}
        layout={{ x: 0, y: 0, width: 1100, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Color"
        name="Color"
        component={BoardColor}
        layout={{ x: 1150, y: 0, width: 1300, height: 1800, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Typography"
        name="Typography"
        component={BoardTypography}
        layout={{ x: 2500, y: 0, width: 1200, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="ShapeSpacingTexture"
        name={"Shape, spacing & texture"}
        component={BoardShape}
        layout={{ x: 3750, y: 0, width: 1200, height: 1400, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Motion"
        name="Motion"
        component={BoardMotion}
        layout={{ x: 5000, y: 0, width: 1100, height: 1000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="Icons"
        name="Iconografía"
        component={BoardIcons}
        layout={{ x: 6150, y: 0, width: 1200, height: 1400, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesignSystemDebt"
        name="Design System Debt"
        component={BoardDesignSystemDebt}
        layout={{ x: 7400, y: 0, width: 1400, height: 3000, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}

defineAsset(FoundationsCanvas, {
  libraries: ["Design System"],
  usageInstructions:
    "Serflow color, typography, radius, motion, texture tokens and icon set (Noche caribe). Check here before picking any color, size or duration. Use the Tailwind token classes (bg-surface, text-muted, text-accent, rounded-card, rounded-tile, font-display, fabric...), never raw hex or ad-hoc durations.",
});
