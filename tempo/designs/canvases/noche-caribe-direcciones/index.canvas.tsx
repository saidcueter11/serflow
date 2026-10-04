import { Canvas, Storyboard } from "tempo-sdk/canvas";
import Slabportadamobile from "./SlabPortadaMobile";
import Slabfichamobile from "./SlabFichaMobile";
import Slabportadadesktop from "./SlabPortadaDesktop";
import Groteskportadamobile from "./GroteskPortadaMobile";
import Groteskfichamobile from "./GroteskFichaMobile";
import Groteskportadadesktop from "./GroteskPortadaDesktop";

export default function NocheCaribeDireccionesCanvas() {
  return (
    <Canvas name="Noche caribe direcciones" backgroundColor="#232323">
      <Storyboard
        id="SlabPortadaMobile"
        name="A Dorado + slab / Portada mobile"
        component={Slabportadamobile}
        layout={{ x: 0, y: 0, width: 390, height: 2300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SlabFichaMobile"
        name="A Dorado + slab / Ficha mobile"
        component={Slabfichamobile}
        layout={{ x: 440, y: 0, width: 390, height: 1250, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="SlabPortadaDesktop"
        name="A Dorado + slab / Portada desktop"
        component={Slabportadadesktop}
        layout={{ x: 880, y: 0, width: 1280, height: 1500, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="GroteskPortadaMobile"
        name="B Dorado + Space Grotesk / Portada mobile"
        component={Groteskportadamobile}
        layout={{ x: 0, y: 3200, width: 390, height: 2300, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="GroteskFichaMobile"
        name="B Dorado + Space Grotesk / Ficha mobile"
        component={Groteskfichamobile}
        layout={{ x: 440, y: 3200, width: 390, height: 1250, intrinsicSizing: "root-element" }}
      />
      <Storyboard
        id="GroteskPortadaDesktop"
        name="B Dorado + Space Grotesk / Portada desktop"
        component={Groteskportadadesktop}
        layout={{ x: 880, y: 3200, width: 1280, height: 1500, intrinsicSizing: "root-element" }}
      />
    </Canvas>
  );
}
