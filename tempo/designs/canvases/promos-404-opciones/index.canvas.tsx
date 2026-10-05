import { Canvas, Storyboard } from "tempo-sdk/canvas";
import {
  BarraBoard,
  ComponentesBoard,
  Decisiones,
  Flujo,
  Intro,
  Nota404A,
  Nota404B,
  Nota404C,
  NotaDetalleA,
  NotaDetalleB,
  NotaListaA,
  NotaListaB,
  NotaListaC,
  Recomendacion,
} from "./narracion";
import * as S from "./storyboards";

// PRI-131: /promos, /promos/[slug], 404 y la barra de promos. Una fila por opción: nota, mobile 390, desktop 1280, estados.
export default function PromosOpcionesCanvas() {
  return (
    <Canvas name="Promos y 404 · opciones" backgroundColor="#232323">
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 0, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Flujo" name="El camino del cliente" component={Flujo} layout={{ x: 680, y: 0, width: 1180, height: 420, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación" component={Recomendacion} layout={{ x: 1920, y: 0, width: 560, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño" component={Decisiones} layout={{ x: 2540, y: 0, width: 720, height: 1300, intrinsicSizing: "root-element" }} />

      <Storyboard id="RotuloBarra" name="1 · Barra y componentes" component={S.RotuloBarra} layout={{ x: 0, y: 1500, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Barra" name="Barra de promos · Propuesta" component={BarraBoard} layout={{ x: 0, y: 1650, width: 1380, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="Componentes" name="PromoCard y PromoGallery · Propuesta" component={ComponentesBoard} layout={{ x: 1440, y: 1650, width: 1380, height: 1200, intrinsicSizing: "root-element" }} />

      <Storyboard id="RotuloLista" name="2 · /promos" component={S.RotuloLista} layout={{ x: 0, y: 3100, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaListaA" name="/promos A · Tarjetas · nota" component={NotaListaA} layout={{ x: 0, y: 3250, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobile" name="/promos A · 3 promos · mobile 390" component={S.ListaAMobile} layout={{ x: 460, y: 3250, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaADesktop" name="/promos A · 3 promos · desktop 1280" component={S.ListaADesktop} layout={{ x: 900, y: 3250, width: 1280, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaA1Mobile" name="/promos A · 1 promo · mobile" component={S.ListaA1Mobile} layout={{ x: 2230, y: 3250, width: 390, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaA0Mobile" name="/promos · hoy no hay promos · mobile" component={S.ListaA0Mobile} layout={{ x: 2670, y: 3250, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaA0Desktop" name="/promos · hoy no hay promos · desktop" component={S.ListaA0Desktop} layout={{ x: 3110, y: 3250, width: 1280, height: 900, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaListaB" name="/promos B · Destacada + filas · nota" component={NotaListaB} layout={{ x: 0, y: 5600, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBMobile" name="/promos B · 3 promos · mobile 390" component={S.ListaBMobile} layout={{ x: 460, y: 5600, width: 390, height: 1600, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBDesktop" name="/promos B · 3 promos · desktop 1280" component={S.ListaBDesktop} layout={{ x: 900, y: 5600, width: 1280, height: 1300, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaListaC" name="/promos C · Afiches con WhatsApp · nota" component={NotaListaC} layout={{ x: 0, y: 7700, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaCMobile" name="/promos C · 3 promos · mobile 390" component={S.ListaCMobile} layout={{ x: 460, y: 7700, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaCDesktop" name="/promos C · 3 promos · desktop 1280" component={S.ListaCDesktop} layout={{ x: 900, y: 7700, width: 1280, height: 1400, intrinsicSizing: "root-element" }} />

      <Storyboard id="RotuloDetalle" name="3 · /promos/[slug]" component={S.RotuloDetalle} layout={{ x: 0, y: 10400, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaDetalleA" name="Detalle A · Ficha · nota" component={NotaDetalleA} layout={{ x: 0, y: 10550, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleAMobile" name="Detalle A · 5 fotos, 3 promos · mobile 390" component={S.DetalleAMobile} layout={{ x: 460, y: 10550, width: 390, height: 3300, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleADesktop" name="Detalle A · 5 fotos, 3 promos · desktop 1280" component={S.DetalleADesktop} layout={{ x: 900, y: 10550, width: 1280, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleA1Mobile" name="Detalle A · 1 foto · mobile" component={S.DetalleA1Mobile} layout={{ x: 2230, y: 10550, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleA2Mobile" name="Detalle A · 2 fotos, sin fecha, única promo · mobile" component={S.DetalleA2Mobile} layout={{ x: 2670, y: 10550, width: 390, height: 1600, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleA3Mobile" name="Detalle A · 3 fotos · mobile" component={S.DetalleA3Mobile} layout={{ x: 3110, y: 10550, width: 390, height: 2800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleA1Desktop" name="Detalle A · 1 foto · desktop" component={S.DetalleA1Desktop} layout={{ x: 3550, y: 10550, width: 1280, height: 1700, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaDetalleB" name="Detalle B · Afiche · nota" component={NotaDetalleB} layout={{ x: 0, y: 14200, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleBMobile" name="Detalle B · mobile 390" component={S.DetalleBMobile} layout={{ x: 460, y: 14200, width: 390, height: 2800, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleBDesktop" name="Detalle B · desktop 1280" component={S.DetalleBDesktop} layout={{ x: 900, y: 14200, width: 1280, height: 2200, intrinsicSizing: "root-element" }} />

      <Storyboard id="Rotulo404" name="4 · 404" component={S.Rotulo404} layout={{ x: 0, y: 17400, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota404A" name="404 A · Directa · nota" component={Nota404A} layout={{ x: 0, y: 17550, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_AMobile" name="404 A · mobile 390" component={S.NF_AMobile} layout={{ x: 460, y: 17550, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_ADesktop" name="404 A · desktop 1280" component={S.NF_ADesktop} layout={{ x: 900, y: 17550, width: 1280, height: 900, intrinsicSizing: "root-element" }} />

      <Storyboard id="Nota404B" name="404 B · Hilo suelto · nota" component={Nota404B} layout={{ x: 0, y: 19000, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BMobile" name="404 B · sin promos · mobile 390" component={S.NF_BMobile} layout={{ x: 460, y: 19000, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BDesktop" name="404 B · sin promos · desktop 1280" component={S.NF_BDesktop} layout={{ x: 900, y: 19000, width: 1280, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BMobilePromos" name="404 B · con 3 promos · mobile" component={S.NF_BMobilePromos} layout={{ x: 2230, y: 19000, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BDesktopPromos" name="404 B · con 3 promos · desktop" component={S.NF_BDesktopPromos} layout={{ x: 2670, y: 19000, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />

      <Storyboard id="Nota404C" name="404 C · Con salidas · nota" component={Nota404C} layout={{ x: 0, y: 21600, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_CMobile" name="404 C · sin promos · mobile 390" component={S.NF_CMobile} layout={{ x: 460, y: 21600, width: 390, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_CDesktop" name="404 C · con 3 promos · desktop 1280" component={S.NF_CDesktop} layout={{ x: 900, y: 21600, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
