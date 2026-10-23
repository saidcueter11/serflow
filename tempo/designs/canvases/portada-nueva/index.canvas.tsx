import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { Comparacion, DemoA, DemoB, DemoC, Inspiracion, Intro, NotaA, NotaB, NotaC, RotuloCelular, RotuloEscritorio } from "./narracion";
import { ADesktop, AMobile } from "./ideaA";
import { BDesktop, BMobile } from "./ideaB";
import { CDesktop, CMobile } from "./ideaC";

// PRI-286: portada desde cero, tres ideas. Arriba: intro, inspiración y comparación con la recomendación.
// Al medio: una columna por idea (nota, celular 390 y demo de movimiento). Abajo: las tres en escritorio (1280).
export default function PortadaNuevaCanvas() {
  return (
    <Canvas name="Portada nueva">
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 0 }} />
      <Storyboard id="Inspiracion" name="Inspiración" component={Inspiracion} layout={{ x: 700, y: 0 }} />
      <Storyboard id="Comparacion" name="Comparación en celular y recomendación" component={Comparacion} layout={{ x: 2060, y: 0 }} />

      <Storyboard id="RotuloCelular" name="Rótulo · celular" component={RotuloCelular} layout={{ x: 0, y: 1560 }} />
      <Storyboard id="NotaA" name="Nota · A Taller en vivo (recomendada)" component={NotaA} layout={{ x: 0, y: 1640 }} />
      <Storyboard id="NotaB" name="Nota · B Orden de trabajo" component={NotaB} layout={{ x: 1000, y: 1640 }} />
      <Storyboard id="NotaC" name="Nota · C Vitrina" component={NotaC} layout={{ x: 2000, y: 1640 }} />
      <Storyboard id="AMobile" name="A · Taller en vivo · celular" component={AMobile} layout={{ x: 0, y: 2400 }} />
      <Storyboard id="DemoA" name="A · movimiento" component={DemoA} layout={{ x: 420, y: 2400 }} />
      <Storyboard id="BMobile" name="B · Orden de trabajo · celular" component={BMobile} layout={{ x: 1000, y: 2400 }} />
      <Storyboard id="DemoB" name="B · movimiento" component={DemoB} layout={{ x: 1420, y: 2400 }} />
      <Storyboard id="CMobile" name="C · Vitrina · celular" component={CMobile} layout={{ x: 2000, y: 2400 }} />
      <Storyboard id="DemoC" name="C · movimiento" component={DemoC} layout={{ x: 2420, y: 2400 }} />

      <Storyboard id="RotuloEscritorio" name="Rótulo · escritorio" component={RotuloEscritorio} layout={{ x: 0, y: 7500 }} />
      <Storyboard id="ADesktop" name="A · Taller en vivo · escritorio" component={ADesktop} layout={{ x: 0, y: 7580 }} />
      <Storyboard id="BDesktop" name="B · Orden de trabajo · escritorio" component={BDesktop} layout={{ x: 1400, y: 7580 }} />
      <Storyboard id="CDesktop" name="C · Vitrina · escritorio" component={CDesktop} layout={{ x: 2800, y: 7580 }} />
    </Canvas>
  );
}
