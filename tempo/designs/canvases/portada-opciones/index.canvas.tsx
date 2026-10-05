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
import { B2Desktop, B2Mobile, B2Slides, NotaB2, PROMOS_DEMO } from "./b2";
import { MascotaBoard } from "./mascota";
import { MascotaEstilosBoard } from "./mascota-estilos";

const B2MobileLargo = () => <B2Mobile height={1500} />;
const B2MobilePromo = () => <B2Mobile promos={PROMOS_DEMO} />;
const B2DesktopPromo = () => <B2Desktop promos={PROMOS_DEMO} />;

// PRI-129: opciones de primera pantalla para la portada. Una fila por opción: nota, mobile 390, desktop 1280, estados.
export default function PortadaOpcionesCanvas() {
  return (
    <Canvas name="Portada opciones" backgroundColor="#232323">
      <Storyboard id="NotaB2" name="B ajustada · nota" component={NotaB2} layout={{ x: 0, y: -2300, width: 400, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2Mobile" name="B ajustada · mobile 390" component={B2Mobile} layout={{ x: 460, y: -2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2Desktop" name="B ajustada · desktop 1280" component={B2Desktop} layout={{ x: 900, y: -2300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2MobileLargo" name="B ajustada · mobile, primer scroll" component={B2MobileLargo} layout={{ x: 2230, y: -2300, width: 390, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2MobilePromo" name="B ajustada · con 2 promos activas · mobile" component={B2MobilePromo} layout={{ x: 1580, y: -1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2DesktopPromo" name="B ajustada · con 2 promos activas · desktop" component={B2DesktopPromo} layout={{ x: 2030, y: -1300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="MascotaEstilos" name="Mascota · estilos posibles" component={MascotaEstilosBoard} layout={{ x: 1420, y: -3500, width: 1040, height: 620, intrinsicSizing: "root-element" }} />
      <Storyboard id="Mascota" name="Mascota SVG · borrador" component={MascotaBoard} layout={{ x: 460, y: -3500, width: 900, height: 420, intrinsicSizing: "root-element" }} />
      <Storyboard id="B2Slides" name="B ajustada · las 4 fotos del carrusel" component={B2Slides} layout={{ x: 460, y: -1300, width: 1060, height: 400, intrinsicSizing: "root-element" }} />

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
