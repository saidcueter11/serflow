import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { Decisiones, Flecha, Intro, MensajeWhatsApp, NotaD1, NotaD2, Recomendacion, Rotulo, Taller } from "./narracion";
import {
  ADisenoColocado,
  AInicial,
  AEspalda,
  AMoviendo,
  BHojaArchivo,
  BHojaCompartir,
  BHojaConImagen,
  BHojaSinVista,
  BHojaGuardada,
  BHojaSinImagen,
  BHojaSinSenal,
  CVuelta,
  CVueltaSinImagen,
  Colores10,
  Colores4,
  Colores4Gorra,
  D1Fija,
  D1Mini,
  D2Directo,
  D2Editor,
  D2Modo,
  DGorra,
  DHoja,
  DInicial,
  DMoviendo,
  DVuelta,
  EBajaCalidad,
  ECargandoColor,
  ENoMostrable,
  EPesada,
  EProcesando,
  EProcesandoLento,
  ESeguirSinVista,
  ESinDiseno,
  ESinSenal,
  GGorra,
  GGorraArriba,
  PaginaCompleta,
  TecnicasComparadas,
} from "./pantallas";

const RotuloFlujo = () => <Rotulo titulo="Flujo principal · celular 390" texto="Pantalla A (personalizador), hoja B (Revisa y envía) y pantalla C (al volver de WhatsApp). Las pantallas se pueden tocar." />;
const RotuloEstados = () => <Rotulo titulo="Estados" texto="Cada estado de la sección 3 del doc, en la pantalla donde pasa. Solo preparando hace esperar el envío, y como mucho 5 s: después se puede seguir sin vista previa." />;
const RotuloColores = () => <Rotulo titulo="Colores y técnicas" texto="La lista de colores la arma el admin: así se ve con 4 y con 10. Abajo, el mismo diseño con cada técnica, y el detalle ampliado." />;
const RotuloDecisiones = () => <Rotulo titulo="Dos decisiones con dos opciones" texto="Lado a lado, con qué resuelve y qué sacrifica cada una. Recomiendo la primera de cada par." />;
const RotuloEscritorio = () => <Rotulo titulo="Escritorio · 1280" texto="Vista previa fija a la izquierda, pasos a la derecha, envío al final del panel. La hoja es un diálogo centrado." />;
const F1 = () => <Flecha texto="Sube su imagen" />;
const F2 = () => <Flecha texto="Toca su diseño" />;
const F3 = () => <Flecha texto="Toca Enviar" />;
const F4 = () => <Flecha texto="Guarda la vista previa" />;
const F5 = () => <Flecha texto="Abre el chat, envía y vuelve" />;

// PRI-122: personalizador, versión completa (vista realista). Narración arriba, flujo, estados, colores y técnicas, decisiones, escritorio.
export default function PersonalizadorCanvas() {
  return (
    <Canvas name="Personalizador" backgroundColor="#232323">
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 0, width: 620, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 680, y: 0, width: 560, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño" component={Decisiones} layout={{ x: 1300, y: 0, width: 760, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Taller" name="Lo que entrega el taller" component={Taller} layout={{ x: 2120, y: 0, width: 900, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="MensajeWhatsApp" name="Mensaje a WhatsApp" component={MensajeWhatsApp} layout={{ x: 3080, y: 0, width: 980, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="RotuloFlujo" name="Rótulo · flujo" component={RotuloFlujo} layout={{ x: 0, y: 1210, width: 900, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="AInicial" name="A · inicial sin diseño" component={AInicial} layout={{ x: 0, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="F1" name="Flecha" component={F1} layout={{ x: 410, y: 1680, width: 100, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="ADisenoColocado" name="A · diseño subido y colocado" component={ADisenoColocado} layout={{ x: 530, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="F2" name="Flecha" component={F2} layout={{ x: 940, y: 1680, width: 100, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="AMoviendo" name="A · moviendo y escalando" component={AMoviendo} layout={{ x: 1060, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="F3" name="Flecha" component={F3} layout={{ x: 1470, y: 1680, width: 100, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaConImagen" name="B · Revisa y envía (con imagen)" component={BHojaConImagen} layout={{ x: 1590, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="F4" name="Flecha" component={F4} layout={{ x: 2000, y: 1680, width: 100, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaGuardada" name="B · vista previa guardada" component={BHojaGuardada} layout={{ x: 2120, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="F5" name="Flecha" component={F5} layout={{ x: 2530, y: 1680, width: 100, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="CVuelta" name="C · al volver de WhatsApp" component={CVuelta} layout={{ x: 2650, y: 1300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="PaginaCompleta" name="A · página completa (sin scroll)" component={PaginaCompleta} layout={{ x: 4500, y: 1300, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="RotuloEstados" name="Rótulo · estados" component={RotuloEstados} layout={{ x: 0, y: 2210, width: 900, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="EProcesando" name="Estado · preparando tu diseño" component={EProcesando} layout={{ x: 0, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ESinDiseno" name="Estado · no tengo diseño" component={ESinDiseno} layout={{ x: 440, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="EPesada" name="Estado · imagen pesada (más de 20 MB)" component={EPesada} layout={{ x: 880, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="EBajaCalidad" name="Estado · imagen de baja calidad" component={EBajaCalidad} layout={{ x: 1320, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ENoMostrable" name="Estado · formato no mostrable (PDF, AI, PSD)" component={ENoMostrable} layout={{ x: 1760, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ECargandoColor" name="Estado · cargando la foto de un color" component={ECargandoColor} layout={{ x: 2200, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ESinSenal" name="Estado · sin señal (la foto no cargó)" component={ESinSenal} layout={{ x: 2640, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaCompartir" name="B · final de la hoja: Compartir (si el celular lo permite)" component={BHojaCompartir} layout={{ x: 3080, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="EProcesandoLento" name="Estado · tarda más de 5 s" component={EProcesandoLento} layout={{ x: 3080, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ESeguirSinVista" name="Estado · después de Seguir sin vista previa" component={ESeguirSinVista} layout={{ x: 3520, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaSinVista" name="B · hoja sin vista previa" component={BHojaSinVista} layout={{ x: 3960, y: 2300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaSinImagen" name="B · hoja sin imagen" component={BHojaSinImagen} layout={{ x: 0, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaArchivo" name="B · hoja con archivo PDF" component={BHojaArchivo} layout={{ x: 440, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="BHojaSinSenal" name="B · hoja sin señal" component={BHojaSinSenal} layout={{ x: 880, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="CVueltaSinImagen" name="C · al volver, sin imagen" component={CVueltaSinImagen} layout={{ x: 1320, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="AEspalda" name="A · ubicación espalda (otra foto y área)" component={AEspalda} layout={{ x: 2640, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GGorraArriba" name="Gorra · solo bordado" component={GGorraArriba} layout={{ x: 1760, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="GGorra" name="Gorra · paso 2 sin selector de técnica" component={GGorra} layout={{ x: 2200, y: 3300, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="RotuloColores" name="Rótulo · colores y técnicas" component={RotuloColores} layout={{ x: 0, y: 4310, width: 900, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="Colores4" name="Colores · 4 (camiseta)" component={Colores4} layout={{ x: 0, y: 4400, width: 390, height: 160, intrinsicSizing: "root-element" }} />
      <Storyboard id="Colores10" name="Colores · 10 (lista que crece)" component={Colores10} layout={{ x: 0, y: 4620, width: 390, height: 240, intrinsicSizing: "root-element" }} />
      <Storyboard id="Colores4Gorra" name="Colores · 4 (gorra)" component={Colores4Gorra} layout={{ x: 0, y: 4920, width: 390, height: 160, intrinsicSizing: "root-element" }} />
      <Storyboard id="TecnicasComparadas" name="Técnicas · mismo diseño, cada look" component={TecnicasComparadas} layout={{ x: 460, y: 4400, width: 1440, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="RotuloDecisiones" name="Rótulo · decisiones" component={RotuloDecisiones} layout={{ x: 0, y: 5810, width: 900, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaD1" name="Decisión 1 · nota" component={NotaD1} layout={{ x: 0, y: 5900, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="D1Fija" name="Decisión 1 · opción 1: fija arriba (recomendada)" component={D1Fija} layout={{ x: 480, y: 5900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="D1Mini" name="Decisión 1 · opción 2: miniatura flotante" component={D1Mini} layout={{ x: 920, y: 5900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaD2" name="Decisión 2 · nota" component={NotaD2} layout={{ x: 1460, y: 5900, width: 420, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="D2Directo" name="Decisión 2 · opción A: directo (recomendada)" component={D2Directo} layout={{ x: 1940, y: 5900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="D2Modo" name="Decisión 2 · opción B: botón Mover" component={D2Modo} layout={{ x: 2380, y: 5900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="D2Editor" name="Decisión 2 · opción B: modo ajustar" component={D2Editor} layout={{ x: 2820, y: 5900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="RotuloEscritorio" name="Rótulo · escritorio" component={RotuloEscritorio} layout={{ x: 0, y: 7210, width: 900, height: 60, intrinsicSizing: "root-element" }} />
      <Storyboard id="DInicial" name="Escritorio · inicial" component={DInicial} layout={{ x: 0, y: 7300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DMoviendo" name="Escritorio · moviendo (DTF)" component={DMoviendo} layout={{ x: 1330, y: 7300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DHoja" name="Escritorio · Revisa y envía" component={DHoja} layout={{ x: 2660, y: 7300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DVuelta" name="Escritorio · al volver de WhatsApp" component={DVuelta} layout={{ x: 3990, y: 7300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DGorra" name="Escritorio · gorra" component={DGorra} layout={{ x: 5320, y: 7300, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
