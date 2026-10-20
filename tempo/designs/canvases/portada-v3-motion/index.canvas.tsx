import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { Intro, Recomendacion } from "./narracion";
import {
  ADesktop,
  AMobile,
  BDesktop,
  BMobile,
  CDesktop,
  CMobile,
  HoyDesktop,
  HoyMobile,
  NotaA,
  NotaB,
  NotaC,
  NotaHoy,
  RotuloEscritorio,
  RotuloMotion,
  RotuloPortada,
} from "./pantallas";
import { MotionCargas, MotionCostos, MotionEntradas, MotionPaginas, MotionSistema, MotionTocar } from "./motion/boards";

// PRI-286 (portada v3: personalizador arriba, mapa abajo) y PRI-287 (movimiento de toda la app).
// Izquierda: intro, recomendación y la portada (celular arriba, escritorio abajo). Derecha: el sistema de movimiento.
export default function PortadaV3MotionCanvas() {
  return (
    <Canvas name="Portada v3 y movimiento" backgroundColor="#232323">
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 0 }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 680, y: 0 }} />

      <Storyboard id="RotuloPortada" name="Rótulo · portada celular" component={RotuloPortada} layout={{ x: 0, y: 1650 }} />
      <Storyboard id="NotaHoy" name="Nota · hoy" component={NotaHoy} layout={{ x: 0, y: 1730 }} />
      <Storyboard id="NotaA" name="Nota · A" component={NotaA} layout={{ x: 500, y: 1730 }} />
      <Storyboard id="NotaB" name="Nota · B (recomendada)" component={NotaB} layout={{ x: 1000, y: 1730 }} />
      <Storyboard id="NotaC" name="Nota · C" component={NotaC} layout={{ x: 1500, y: 1730 }} />
      <Storyboard id="HoyMobile" name="Hoy · celular" component={HoyMobile} layout={{ x: 0, y: 2500 }} />
      <Storyboard id="AMobile" name="A · después del hero · celular" component={AMobile} layout={{ x: 500, y: 2500 }} />
      <Storyboard id="BMobile" name="B · en el hero · celular (recomendada)" component={BMobile} layout={{ x: 1000, y: 2500 }} />
      <Storyboard id="CMobile" name="C · el personalizador es el hero · celular" component={CMobile} layout={{ x: 1500, y: 2500 }} />

      <Storyboard id="RotuloEscritorio" name="Rótulo · portada escritorio" component={RotuloEscritorio} layout={{ x: 0, y: 7300 }} />
      <Storyboard id="HoyDesktop" name="Hoy · escritorio" component={HoyDesktop} layout={{ x: 0, y: 7380 }} />
      <Storyboard id="ADesktop" name="A · después del hero · escritorio" component={ADesktop} layout={{ x: 1380, y: 7380 }} />
      <Storyboard id="BDesktop" name="B · en el hero · escritorio (recomendada)" component={BDesktop} layout={{ x: 2760, y: 7380 }} />
      <Storyboard id="CDesktop" name="C · el personalizador es el hero · escritorio" component={CDesktop} layout={{ x: 4140, y: 7380 }} />

      <Storyboard id="RotuloMotion" name="Rótulo · movimiento" component={RotuloMotion} layout={{ x: 5800, y: 0 }} />
      <Storyboard id="MotionSistema" name="Movimiento · sistema" component={MotionSistema} layout={{ x: 5800, y: 80 }} />
      <Storyboard id="MotionCostos" name="Movimiento · qué cuesta" component={MotionCostos} layout={{ x: 7200, y: 80 }} />
      <Storyboard id="MotionEntradas" name="Movimiento · entradas" component={MotionEntradas} layout={{ x: 5800, y: 1500 }} />
      <Storyboard id="MotionPaginas" name="Movimiento · entre páginas" component={MotionPaginas} layout={{ x: 7200, y: 1500 }} />
      <Storyboard id="MotionTocar" name="Movimiento · tocar" component={MotionTocar} layout={{ x: 5800, y: 3700 }} />
      <Storyboard id="MotionCargas" name="Movimiento · esperar y confirmar" component={MotionCargas} layout={{ x: 7200, y: 3700 }} />
    </Canvas>
  );
}
