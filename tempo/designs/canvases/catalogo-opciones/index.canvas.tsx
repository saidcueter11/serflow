import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { CapaBDesktop, CapaBMobile, Decisiones, EstadosA, EstantesCDesktop, EstantesCMobile, GaleriaADesktop, GaleriaADesktopCompleta, GaleriaAMobile, GaleriaAMobileCargandoMas, GaleriaAMobileCientos, GaleriaAMobileCompleta, GaleriaAMobileLenta, GaleriaAMobileSinSenal, GaleriaAMobileVacia, GaleriaBDesktop, GaleriaBMobile, Intro, Mensajes, NotaA, NotaB, NotaC, Recomendacion, SeccionEstados, SeccionOpciones, VisorADesktop, VisorADesktopCompleta, VisorAMobile, VisorAMobileCargando, VisorAMobileCompleta, VisorAMobileDescripcion, VisorAMobilePrimera } from "./boards";

// PRI-130, segunda ronda: el catálogo como galería de fotos. Una fila por opción (nota, galería y visor en mobile 390
// y desktop 1280 cortados en el pliegue) y, al final, los estados de la opción recomendada (A).
export default function CatalogoOpcionesCanvas() {
  return (
    <Canvas name="Catálogo opciones" backgroundColor="#232323">
      <Storyboard id="Intro" component={Intro} layout={{ x: 0, y: 0, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño (todas las opciones)" component={Decisiones} layout={{ x: 680, y: 0, width: 980, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 1720, y: 0, width: 560, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Mensajes" name="Lo que llega a WhatsApp" component={Mensajes} layout={{ x: 2340, y: 0, width: 520, height: 700, intrinsicSizing: "root-element" }} />

      <Storyboard id="SeccionOpciones" name="1 · Opciones" component={SeccionOpciones} layout={{ x: 0, y: 1300, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaA" name="A · Muro + visor en página · nota" component={NotaA} layout={{ x: 0, y: 1450, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobile" name="A · galería · mobile 390" component={GaleriaAMobile} layout={{ x: 460, y: 1450, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobile" name="A · visor · mobile 390" component={VisorAMobile} layout={{ x: 900, y: 1450, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaADesktop" name="A · galería · desktop 1280" component={GaleriaADesktop} layout={{ x: 1340, y: 1450, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorADesktop" name="A · visor · desktop 1280" component={VisorADesktop} layout={{ x: 2680, y: 1450, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaB" name="B · Fotos grandes + visor encima · nota" component={NotaB} layout={{ x: 0, y: 2600, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaBMobile" name="B · galería · mobile 390" component={GaleriaBMobile} layout={{ x: 460, y: 2600, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="CapaBMobile" name="B · capa del visor · mobile 390" component={CapaBMobile} layout={{ x: 900, y: 2600, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaBDesktop" name="B · galería · desktop 1280" component={GaleriaBDesktop} layout={{ x: 1340, y: 2600, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="CapaBDesktop" name="B · capa del visor · desktop 1280" component={CapaBDesktop} layout={{ x: 2680, y: 2600, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaC" name="C · Estantes por categoría · nota" component={NotaC} layout={{ x: 0, y: 3750, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstantesCMobile" name="C · estantes · mobile 390 (el visor es el de A)" component={EstantesCMobile} layout={{ x: 460, y: 3750, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstantesCDesktop" name="C · estantes · desktop 1280" component={EstantesCDesktop} layout={{ x: 900, y: 3750, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="SeccionEstados" name="2 · Estados de A" component={SeccionEstados} layout={{ x: 0, y: 4900, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstadosA" name="A · estados · nota" component={EstadosA} layout={{ x: 0, y: 5050, width: 400, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCompleta" name="A · galería completa · mobile" component={GaleriaAMobileCompleta} layout={{ x: 460, y: 5050, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaADesktopCompleta" name="A · galería completa · desktop" component={GaleriaADesktopCompleta} layout={{ x: 900, y: 5050, width: 1280, height: 1600, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileLenta" name="A · señal lenta · mobile" component={GaleriaAMobileLenta} layout={{ x: 2230, y: 5050, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileVacia" name="A · categoría vacía · mobile" component={GaleriaAMobileVacia} layout={{ x: 2670, y: 5050, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCientos" name="A · 340 fotos: fin del primer bloque" component={GaleriaAMobileCientos} layout={{ x: 3110, y: 5050, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCargandoMas" name="A · 340 fotos: cargando 60 más" component={GaleriaAMobileCargandoMas} layout={{ x: 3550, y: 5050, width: 390, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileSinSenal" name="A · 340 fotos: Ver más sin señal" component={GaleriaAMobileSinSenal} layout={{ x: 3990, y: 5050, width: 390, height: 1000, intrinsicSizing: "root-element" }} />

      <Storyboard id="VisorAMobileCompleta" name="A · visor completo · mobile" component={VisorAMobileCompleta} layout={{ x: 460, y: 7250, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobilePrimera" name="A · visor · primera foto" component={VisorAMobilePrimera} layout={{ x: 900, y: 7250, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileDescripcion" name="A · visor · con descripción" component={VisorAMobileDescripcion} layout={{ x: 1340, y: 7250, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileCargando" name="A · visor · foto grande llegando" component={VisorAMobileCargando} layout={{ x: 1780, y: 7250, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorADesktopCompleta" name="A · visor completo con descripción · desktop" component={VisorADesktopCompleta} layout={{ x: 2230, y: 7250, width: 1280, height: 1600, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
