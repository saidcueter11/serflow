import { Canvas, Storyboard } from "tempo-sdk/canvas";
import {
  ADesktop,
  AMobile,
  AMobileCargando,
  BDesktop,
  BMobile,
  CDesktop,
  CMobile,
  CMobileVacio,
  Intro,
  NotaA,
  NotaB,
  NotaC,
  Politica,
  Recomendacion,
} from "./boards";

// PRI-129: opciones de primera pantalla para la portada. Una fila por opción: nota, mobile 390, desktop 1280, estados.
export default function PortadaOpcionesCanvas() {
  return (
    <Canvas name="Portada opciones" backgroundColor="#232323">
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 0, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Politica" name="Política de WhatsApp y datos del negocio" component={Politica} layout={{ x: 680, y: 0, width: 1100, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 1840, y: 0, width: 560, height: 700, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaA" name="A · Vitrina · nota" component={NotaA} layout={{ x: 0, y: 1100, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="AMobile" name="A · Vitrina · mobile 390" component={AMobile} layout={{ x: 460, y: 1100, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ADesktop" name="A · Vitrina · desktop 1280" component={ADesktop} layout={{ x: 900, y: 1100, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="AMobileCargando" name="A · Vitrina · foto cargando, señal lenta (igual en B)" component={AMobileCargando} layout={{ x: 2230, y: 1100, width: 390, height: 844, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaB" name="B · Taller · nota" component={NotaB} layout={{ x: 0, y: 2250, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="BMobile" name="B · Taller · mobile 390" component={BMobile} layout={{ x: 460, y: 2250, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BDesktop" name="B · Taller · desktop 1280" component={BDesktop} layout={{ x: 900, y: 2250, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaC" name="C · Tienda · nota" component={NotaC} layout={{ x: 0, y: 3400, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="CMobile" name="C · Tienda · mobile 390" component={CMobile} layout={{ x: 460, y: 3400, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="CDesktop" name="C · Tienda · desktop 1280" component={CDesktop} layout={{ x: 900, y: 3400, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="CMobileVacio" name="C · Tienda · sin prendas activas" component={CMobileVacio} layout={{ x: 2230, y: 3400, width: 390, height: 844, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
