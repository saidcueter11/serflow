import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { DatosDeHoy, Decisiones, EstadosFicha, EstadosLista, FichaADesktop, FichaAMobile, FichaBDesktop, FichaBDesktopCompleta, FichaBDesktopUnaFoto, FichaBMobile, FichaBMobileCargando, FichaBMobileCompleta, FichaBMobileHoy, FichaBMobileNombreLargo, FichaBMobileUnaFoto, FichaBMobileZoom, FichaCDesktop, FichaCMobile, Intro, ListaADesktop, ListaADesktopCompleta, ListaADesktopVacia, ListaAMobile, ListaAMobileCompleta, ListaAMobileHoy, ListaAMobileVacia, ListaBDesktop, ListaBMobile, ListaBMobileSinFoto, ListaCDesktop, ListaCMobile, Mensajes, NotaFichaA, NotaFichaB, NotaFichaC, NotaListaA, NotaListaB, NotaListaC, Recomendacion, SeccionFicha, SeccionLista } from "./boards";

// PRI-130: lista de categoría y ficha de producto. Una fila por opción (nota, mobile 390 y desktop 1280 cortados en el
// pliegue) y, al final de cada página, los estados de la opción recomendada a página completa.
export default function CatalogoOpcionesCanvas() {
  return (
    <Canvas name="Catálogo opciones" backgroundColor="#232323">
      <Storyboard id="Intro" component={Intro} layout={{ x: 0, y: 0, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño (todas las opciones)" component={Decisiones} layout={{ x: 680, y: 0, width: 980, height: 1100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 1720, y: 0, width: 560, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="DatosDeHoy" name="Datos de hoy" component={DatosDeHoy} layout={{ x: 2340, y: 0, width: 520, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="Mensajes" name="Lo que llega a WhatsApp" component={Mensajes} layout={{ x: 2920, y: 0, width: 520, height: 900, intrinsicSizing: "root-element" }} />

      <Storyboard id="SeccionLista" name="1 · Lista de categoría" component={SeccionLista} layout={{ x: 0, y: 1300, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaListaA" name="Lista A · Directo · nota" component={NotaListaA} layout={{ x: 0, y: 1450, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobile" name="Lista A · mobile 390" component={ListaAMobile} layout={{ x: 460, y: 1450, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaADesktop" name="Lista A · desktop 1280" component={ListaADesktop} layout={{ x: 900, y: 1450, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaListaB" name="Lista B · Con portada · nota" component={NotaListaB} layout={{ x: 0, y: 2600, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBMobile" name="Lista B · mobile 390" component={ListaBMobile} layout={{ x: 460, y: 2600, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBDesktop" name="Lista B · desktop 1280" component={ListaBDesktop} layout={{ x: 900, y: 2600, width: 1280, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBMobileSinFoto" name="Lista B · categoría sin foto" component={ListaBMobileSinFoto} layout={{ x: 2230, y: 2600, width: 390, height: 844, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaListaC" name="Lista C · Categorías con foto · nota" component={NotaListaC} layout={{ x: 0, y: 3750, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaCMobile" name="Lista C · mobile 390" component={ListaCMobile} layout={{ x: 460, y: 3750, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaCDesktop" name="Lista C · desktop 1280" component={ListaCDesktop} layout={{ x: 900, y: 3750, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="EstadosLista" name="Lista A · estados" component={EstadosLista} layout={{ x: 0, y: 4900, width: 400, height: 700, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobileCompleta" name="Lista A · mobile completa" component={ListaAMobileCompleta} layout={{ x: 460, y: 4900, width: 390, height: 1800, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaADesktopCompleta" name="Lista A · desktop completa" component={ListaADesktopCompleta} layout={{ x: 900, y: 4900, width: 1280, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobileVacia" name="Lista A · categoría vacía · mobile" component={ListaAMobileVacia} layout={{ x: 2230, y: 4900, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobileHoy" name="Lista A · datos de hoy · mobile" component={ListaAMobileHoy} layout={{ x: 2670, y: 4900, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaADesktopVacia" name="Lista A · categoría vacía · desktop" component={ListaADesktopVacia} layout={{ x: 3110, y: 4900, width: 1280, height: 900, intrinsicSizing: "root-element" }} />

      <Storyboard id="SeccionFicha" name="2 · Ficha de producto" component={SeccionFicha} layout={{ x: 0, y: 6900, width: 2200, height: 90, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaFichaA" name="Ficha A · Vitrina · nota" component={NotaFichaA} layout={{ x: 0, y: 7050, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaAMobile" name="Ficha A · mobile 390" component={FichaAMobile} layout={{ x: 460, y: 7050, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaADesktop" name="Ficha A · desktop 1280" component={FichaADesktop} layout={{ x: 900, y: 7050, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaFichaB" name="Ficha B · Barra fija · nota" component={NotaFichaB} layout={{ x: 0, y: 8200, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobile" name="Ficha B · mobile 390" component={FichaBMobile} layout={{ x: 460, y: 8200, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBDesktop" name="Ficha B · desktop 1280" component={FichaBDesktop} layout={{ x: 900, y: 8200, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaFichaC" name="Ficha C · A tu gusto · nota" component={NotaFichaC} layout={{ x: 0, y: 9350, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaCMobile" name="Ficha C · mobile 390" component={FichaCMobile} layout={{ x: 460, y: 9350, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaCDesktop" name="Ficha C · desktop 1280" component={FichaCDesktop} layout={{ x: 900, y: 9350, width: 1280, height: 800, intrinsicSizing: "root-element" }} />

      <Storyboard id="EstadosFicha" name="Ficha B · estados" component={EstadosFicha} layout={{ x: 0, y: 10500, width: 400, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileCompleta" name="Ficha B · 4 fotos · mobile completa" component={FichaBMobileCompleta} layout={{ x: 460, y: 10500, width: 390, height: 1580, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBDesktopCompleta" name="Ficha B · 4 fotos · desktop completa" component={FichaBDesktopCompleta} layout={{ x: 900, y: 10500, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileUnaFoto" name="Ficha B · 1 foto · mobile completa" component={FichaBMobileUnaFoto} layout={{ x: 2230, y: 10500, width: 390, height: 1800, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileNombreLargo" name="Ficha B · nombre largo, sin descripción" component={FichaBMobileNombreLargo} layout={{ x: 2670, y: 10500, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileZoom" name="Ficha B · ver en grande" component={FichaBMobileZoom} layout={{ x: 3110, y: 10500, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileCargando" name="Ficha B · fotos cargando, señal lenta" component={FichaBMobileCargando} layout={{ x: 3550, y: 10500, width: 390, height: 844, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBMobileHoy" name="Ficha B · datos de hoy" component={FichaBMobileHoy} layout={{ x: 3990, y: 10500, width: 390, height: 1800, intrinsicSizing: "root-element" }} />
      <Storyboard id="FichaBDesktopUnaFoto" name="Ficha B · 1 foto, sin relacionados · desktop" component={FichaBDesktopUnaFoto} layout={{ x: 900, y: 12200, width: 1280, height: 1100, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
