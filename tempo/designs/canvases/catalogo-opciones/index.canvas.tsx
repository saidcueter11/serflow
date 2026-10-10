import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { CapaBDesktop, CapaBMobile, Decisiones, EstadosA, EstantesCDesktop, EstantesCMobile, GaleriaADesktop, GaleriaADesktopCompleta, GaleriaAMobile, GaleriaAMobileBloque2, GaleriaAMobileCargandoMas, GaleriaAMobileCientos, GaleriaAMobileCompleta, GaleriaAMobileFotoQuitada, GaleriaAMobileLenta, GaleriaAMobileSinSenal, GaleriaAMobileUnaFoto, GaleriaAMobileVacia, GaleriaBDesktop, GaleriaBMobile, Intro, Mensajes, NotaA, NotaB, NotaC, Recomendacion, SeccionEstados, SeccionOpciones, VisorADesktop, VisorADesktopCompleta, VisorAMobile, VisorAMobileCargando, VisorAMobileCompleta, VisorAMobileDescripcion, VisorAMobilePrimera, VisorAMobileUnaFoto } from "./descartadas";
import { Intro3, Decisiones3, SeccionRonda3, SeccionDescartadas, Comparacion, Nota1, Nota2, Nota3, Nota4, MuroMobile, MuroDesktop, MuroVisorMobile, MuroVisorDesktop, MuroVacia, MuroBeisbol, MasonryMobile, MasonryDesktop, MasonryVisorMobile, MasonryVisorDesktop, MasonryVacia, UsoMobile, UsoDesktop, UsoVisorMobile, UsoVisorDesktop, UsoVacia, PerfilMobile, PerfilDesktop, PerfilVisorMobile, PerfilVisorDesktop, PerfilVacia } from "./boards3";

// PRI-130. Ronda 3 arriba: cuatro direcciones con más calor (una fila cada una) y la comparación con la
// recomendación. Abajo, atenuada, la ronda 2 que Said descartó ("se ve frío y simplón").
export default function CatalogoOpcionesCanvas() {
  return (
    <Canvas name="Catálogo opciones" backgroundColor="#232323">
      <Storyboard id="Intro3" name="Ronda 3 · intro" component={Intro3} layout={{ x: 0, y: 0, width: 620, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones3" name="Ronda 3 · decisiones (valen para las cuatro)" component={Decisiones3} layout={{ x: 680, y: 0, width: 980, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="SeccionRonda3" name="R3 · Direcciones" component={SeccionRonda3} layout={{ x: 0, y: 1250, width: 4450, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota1" name="1 · Muro del taller · nota" component={Nota1} layout={{ x: 0, y: 1400, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroMobile" name="1 · Todo · mobile 390" component={MuroMobile} layout={{ x: 480, y: 1400, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroDesktop" name="1 · Todo · desktop 1280" component={MuroDesktop} layout={{ x: 930, y: 1400, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroVisorMobile" name="1 · visor · mobile 390" component={MuroVisorMobile} layout={{ x: 2270, y: 1400, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroVisorDesktop" name="1 · visor · desktop 1280" component={MuroVisorDesktop} layout={{ x: 2720, y: 1400, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroVacia" name="1 · categoría vacía · mobile 390" component={MuroVacia} layout={{ x: 4060, y: 1400, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="MuroBeisbol" name="1 · categoría elegida (Béisbol) · mobile 390" component={MuroBeisbol} layout={{ x: 4500, y: 1400, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota2" name="2 · Pinterest / Unsplash · nota" component={Nota2} layout={{ x: 0, y: 4000, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="MasonryMobile" name="2 · Todo · mobile 390" component={MasonryMobile} layout={{ x: 480, y: 4000, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="MasonryDesktop" name="2 · Todo · desktop 1280" component={MasonryDesktop} layout={{ x: 930, y: 4000, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="MasonryVisorMobile" name="2 · visor · mobile 390" component={MasonryVisorMobile} layout={{ x: 2270, y: 4000, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="MasonryVisorDesktop" name="2 · visor · desktop 1280" component={MasonryVisorDesktop} layout={{ x: 2720, y: 4000, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="MasonryVacia" name="2 · categoría vacía · mobile 390" component={MasonryVacia} layout={{ x: 4060, y: 4000, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota3" name="3 · Fotos por uso · nota" component={Nota3} layout={{ x: 0, y: 6600, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="UsoMobile" name="3 · Todo · mobile 390" component={UsoMobile} layout={{ x: 480, y: 6600, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="UsoDesktop" name="3 · Todo · desktop 1280" component={UsoDesktop} layout={{ x: 930, y: 6600, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="UsoVisorMobile" name="3 · visor · mobile 390" component={UsoVisorMobile} layout={{ x: 2270, y: 6600, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="UsoVisorDesktop" name="3 · visor · desktop 1280" component={UsoVisorDesktop} layout={{ x: 2720, y: 6600, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="UsoVacia" name="3 · categoría vacía · mobile 390" component={UsoVacia} layout={{ x: 4060, y: 6600, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota4" name="4 · Perfil de Instagram · nota" component={Nota4} layout={{ x: 0, y: 9200, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="PerfilMobile" name="4 · Todo · mobile 390" component={PerfilMobile} layout={{ x: 480, y: 9200, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="PerfilDesktop" name="4 · Todo · desktop 1280" component={PerfilDesktop} layout={{ x: 930, y: 9200, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="PerfilVisorMobile" name="4 · visor · mobile 390" component={PerfilVisorMobile} layout={{ x: 2270, y: 9200, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="PerfilVisorDesktop" name="4 · visor · desktop 1280" component={PerfilVisorDesktop} layout={{ x: 2720, y: 9200, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="PerfilVacia" name="4 · categoría vacía · mobile 390" component={PerfilVacia} layout={{ x: 4060, y: 9200, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="Comparacion3" name="Comparación · las cuatro en mobile + recomendación" component={Comparacion} layout={{ x: 0, y: 11800, width: 2400, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="SeccionDescartadas" name="R2 · Descartadas" component={SeccionDescartadas} layout={{ x: 0, y: 13400, width: 4450, height: 90, intrinsicSizing: "root-element" }} />

      <Storyboard id="Intro" component={Intro} layout={{ x: 0, y: 13600, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño (todas las opciones)" component={Decisiones} layout={{ x: 680, y: 13600, width: 980, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 1720, y: 13600, width: 560, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Mensajes" name="Lo que llega a WhatsApp" component={Mensajes} layout={{ x: 2340, y: 13600, width: 520, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="SeccionOpciones" name="1 · Opciones" component={SeccionOpciones} layout={{ x: 0, y: 14900, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaA" name="A · Muro + visor en página · nota" component={NotaA} layout={{ x: 0, y: 15050, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobile" name="A · galería · mobile 390" component={GaleriaAMobile} layout={{ x: 460, y: 15050, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobile" name="A · visor · mobile 390" component={VisorAMobile} layout={{ x: 900, y: 15050, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaADesktop" name="A · galería · desktop 1280" component={GaleriaADesktop} layout={{ x: 1340, y: 15050, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorADesktop" name="A · visor · desktop 1280" component={VisorADesktop} layout={{ x: 2680, y: 15050, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaB" name="B · Fotos grandes + visor encima · nota" component={NotaB} layout={{ x: 0, y: 16200, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaBMobile" name="B · galería · mobile 390" component={GaleriaBMobile} layout={{ x: 460, y: 16200, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="CapaBMobile" name="B · capa del visor · mobile 390" component={CapaBMobile} layout={{ x: 900, y: 16200, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaBDesktop" name="B · galería · desktop 1280" component={GaleriaBDesktop} layout={{ x: 1340, y: 16200, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="CapaBDesktop" name="B · capa del visor · desktop 1280" component={CapaBDesktop} layout={{ x: 2680, y: 16200, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaC" name="C · Estantes por categoría · nota" component={NotaC} layout={{ x: 0, y: 17350, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstantesCMobile" name="C · estantes · mobile 390 (el visor es el de A)" component={EstantesCMobile} layout={{ x: 460, y: 17350, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstantesCDesktop" name="C · estantes · desktop 1280" component={EstantesCDesktop} layout={{ x: 900, y: 17350, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="SeccionEstados" name="2 · Estados de A" component={SeccionEstados} layout={{ x: 0, y: 18500, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="EstadosA" name="A · estados · nota" component={EstadosA} layout={{ x: 0, y: 18650, width: 400, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCompleta" name="A · galería completa · mobile" component={GaleriaAMobileCompleta} layout={{ x: 460, y: 18650, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaADesktopCompleta" name="A · galería completa · desktop" component={GaleriaADesktopCompleta} layout={{ x: 900, y: 18650, width: 1280, height: 1600, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileLenta" name="A · señal lenta · mobile" component={GaleriaAMobileLenta} layout={{ x: 2230, y: 18650, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileVacia" name="A · categoría vacía · mobile" component={GaleriaAMobileVacia} layout={{ x: 2670, y: 18650, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCientos" name="A · 340 fotos: fin del primer bloque" component={GaleriaAMobileCientos} layout={{ x: 3110, y: 18650, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileCargandoMas" name="A · 340 fotos: cargando 60 más" component={GaleriaAMobileCargandoMas} layout={{ x: 3550, y: 18650, width: 390, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileSinSenal" name="A · 340 fotos: Ver más sin señal" component={GaleriaAMobileSinSenal} layout={{ x: 3990, y: 18650, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileCompleta" name="A · visor completo · mobile" component={VisorAMobileCompleta} layout={{ x: 460, y: 20850, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobilePrimera" name="A · visor · primera foto" component={VisorAMobilePrimera} layout={{ x: 900, y: 20850, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileDescripcion" name="A · visor · con descripción" component={VisorAMobileDescripcion} layout={{ x: 1340, y: 20850, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileCargando" name="A · visor · foto grande llegando" component={VisorAMobileCargando} layout={{ x: 1780, y: 20850, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileFotoQuitada" name="A · link a una foto borrada" component={GaleriaAMobileFotoQuitada} layout={{ x: 4430, y: 18650, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileBloque2" name="A · 340 fotos: página del segundo bloque" component={GaleriaAMobileBloque2} layout={{ x: 4870, y: 18650, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GaleriaAMobileUnaFoto" name="A · categoría con una sola foto" component={GaleriaAMobileUnaFoto} layout={{ x: 5310, y: 18650, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorAMobileUnaFoto" name="A · visor · categoría con una sola foto" component={VisorAMobileUnaFoto} layout={{ x: 3560, y: 20850, width: 390, height: 1180, intrinsicSizing: "root-element" }} />
      <Storyboard id="VisorADesktopCompleta" name="A · visor completo con descripción · desktop" component={VisorADesktopCompleta} layout={{ x: 2230, y: 20850, width: 1280, height: 1470, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
