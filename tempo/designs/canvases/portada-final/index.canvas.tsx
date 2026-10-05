import { Canvas, Storyboard } from "tempo-sdk/canvas";
import Mobilecompleta from "./MobileCompleta";
import Mobilesinproductos from "./MobileSinProductos";
import Desktopcompleta from "./DesktopCompleta";
import Desktopsinproductos from "./DesktopSinProductos";
import DesktopConPromos from "./DesktopConPromos";

export default function PortadaFinalCanvas() {
  return (
    <Canvas name="Portada final" backgroundColor="#232323">
      <Storyboard
        id="MobileCompleta"
        name="Mobile 390 · completa"
        component={Mobilecompleta}
        layout={{ x: 0, y: 0, width: 390, height: 4200, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="MobileSinProductos"
        name="Mobile 390 · sin prendas disponibles"
        component={Mobilesinproductos}
        layout={{ x: 440, y: 0, width: 390, height: 4200, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesktopCompleta"
        name="Desktop 1280 · completa"
        component={Desktopcompleta}
        layout={{ x: 880, y: 0, width: 1280, height: 3000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesktopSinProductos"
        name="Desktop 1280 · sin prendas disponibles"
        component={Desktopsinproductos}
        layout={{ x: 2210, y: 0, width: 1280, height: 3000, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="DesktopConPromos"
        name="Desktop 1280 · con 2 promos activas"
        component={DesktopConPromos}
        layout={{ x: 3540, y: 0, width: 1280, height: 3000, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}
