import { Canvas, Storyboard } from "tempo-sdk/canvas";
import {
  BarraBoard,
  ComponentesBoard,
  Decisiones,
  Flujo,
  Intro,
  Nota404A,
  Nota404B,
  NotaDetalleA,
  NotaFinal404,
  NotaFinalDetalle,
  NotaFinalLista,
  NotaListaA,
  NotaListaB,
  Recomendacion,
} from "./narracion";
import * as S from "./storyboards";

// PRI-131: arriba la final aprobada (/promos C, detalle B, 404 C) con sus estados; al final, las opciones descartadas.
export default function PromosOpcionesCanvas() {
  return (
    <Canvas name="Promos y 404 · opciones" backgroundColor="#232323">
      <Storyboard id="RotuloFinal" name="Final aprobada" component={S.RotuloFinal} layout={{ x: 0, y: 0, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Intro" name="Intro" component={Intro} layout={{ x: 0, y: 150, width: 620, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Flujo" name="El camino del cliente" component={Flujo} layout={{ x: 680, y: 150, width: 1180, height: 440, intrinsicSizing: "root-element" }} />
      <Storyboard id="Decisiones" name="Decisiones de diseño" component={Decisiones} layout={{ x: 1920, y: 150, width: 720, height: 1400, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaFinalLista" name="Final · /promos C · nota" component={NotaFinalLista} layout={{ x: 0, y: 1750, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista3Mobile" name="Final · /promos · 3 promos · mobile 390" component={S.FinalLista3Mobile} layout={{ x: 460, y: 1750, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista3Desktop" name="Final · /promos · 3 promos · desktop 1280" component={S.FinalLista3Desktop} layout={{ x: 900, y: 1750, width: 1280, height: 1250, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista1Mobile" name="Final · /promos · 1 promo · mobile 390" component={S.FinalLista1Mobile} layout={{ x: 2230, y: 1750, width: 390, height: 1290, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista1Desktop" name="Final · /promos · 1 promo · desktop 1280" component={S.FinalLista1Desktop} layout={{ x: 2670, y: 1750, width: 1280, height: 1141, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista0Mobile" name="Final · /promos · sin promos · mobile 390" component={S.FinalLista0Mobile} layout={{ x: 4000, y: 1750, width: 390, height: 910, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalLista0Desktop" name="Final · /promos · sin promos · desktop 1280" component={S.FinalLista0Desktop} layout={{ x: 4440, y: 1750, width: 1280, height: 860, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaFinalDetalle" name="Final · detalle B · nota" component={NotaFinalDetalle} layout={{ x: 0, y: 4300, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle5Mobile" name="Final · detalle · 5 fotos · mobile 390" component={S.FinalDetalle5Mobile} layout={{ x: 460, y: 4300, width: 390, height: 2700, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle5Desktop" name="Final · detalle · 5 fotos · desktop 1280" component={S.FinalDetalle5Desktop} layout={{ x: 900, y: 4300, width: 1280, height: 1510, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle3Mobile" name="Final · detalle · 3 fotos · mobile 390" component={S.FinalDetalle3Mobile} layout={{ x: 2230, y: 4300, width: 390, height: 2100, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle3Desktop" name="Final · detalle · 3 fotos · desktop 1280" component={S.FinalDetalle3Desktop} layout={{ x: 2670, y: 4300, width: 1280, height: 2100, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle1Mobile" name="Final · detalle · 1 foto, sin otras promos · mobile 390" component={S.FinalDetalle1Mobile} layout={{ x: 4000, y: 4300, width: 390, height: 1210, intrinsicSizing: "root-element" }} />
      <Storyboard id="FinalDetalle1Desktop" name="Final · detalle · 1 foto, sin otras promos · desktop 1280" component={S.FinalDetalle1Desktop} layout={{ x: 4440, y: 4300, width: 1280, height: 1100, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaFinal404" name="Final · 404 C · nota" component={NotaFinal404} layout={{ x: 0, y: 7400, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="Final404Mobile" name="Final · 404 · sin promos · mobile 390" component={S.Final404Mobile} layout={{ x: 460, y: 7400, width: 390, height: 1200, intrinsicSizing: "root-element" }} />
      <Storyboard id="Final404Desktop" name="Final · 404 · sin promos · desktop 1280" component={S.Final404Desktop} layout={{ x: 900, y: 7400, width: 1280, height: 1071, intrinsicSizing: "root-element" }} />
      <Storyboard id="Final404PromosMobile" name="Final · 404 · con 3 promos · mobile 390" component={S.Final404PromosMobile} layout={{ x: 2230, y: 7400, width: 390, height: 2400, intrinsicSizing: "root-element" }} />
      <Storyboard id="Final404PromosDesktop" name="Final · 404 · con 3 promos · desktop 1280" component={S.Final404PromosDesktop} layout={{ x: 2670, y: 7400, width: 1280, height: 1500, intrinsicSizing: "root-element" }} />

      <Storyboard id="Barra" name="Barra de promos · Propuesta" component={BarraBoard} layout={{ x: 0, y: 10000, width: 1380, height: 800, intrinsicSizing: "root-element" }} />
      <Storyboard id="Componentes" name="PromoCard, PromoGrid y PromoAfiche · Propuesta" component={ComponentesBoard} layout={{ x: 1440, y: 10000, width: 1380, height: 2400, intrinsicSizing: "root-element" }} />

      <Storyboard id="RotuloDescartadas" name="Descartadas" component={S.RotuloDescartadas} layout={{ x: 0, y: 12900, width: 1200, height: 100, intrinsicSizing: "root-element" }} />
      <Storyboard id="Recomendacion" name="Recomendación original" component={Recomendacion} layout={{ x: 1260, y: 12900, width: 560, height: 900, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaListaA" name="/promos A · Tarjetas · nota" component={NotaListaA} layout={{ x: 0, y: 14000, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaAMobile" name="/promos A · 3 promos · mobile 390" component={S.ListaAMobile} layout={{ x: 460, y: 14000, width: 390, height: 2000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaADesktop" name="/promos A · 3 promos · desktop 1280" component={S.ListaADesktop} layout={{ x: 900, y: 14000, width: 1280, height: 1300, intrinsicSizing: "root-element" }} />
      <Storyboard id="NotaListaB" name="/promos B · Destacada + filas · nota" component={NotaListaB} layout={{ x: 2240, y: 14000, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBMobile" name="/promos B · 3 promos · mobile 390" component={S.ListaBMobile} layout={{ x: 2700, y: 14000, width: 390, height: 1600, intrinsicSizing: "root-element" }} />
      <Storyboard id="ListaBDesktop" name="/promos B · 3 promos · desktop 1280" component={S.ListaBDesktop} layout={{ x: 3140, y: 14000, width: 1280, height: 1300, intrinsicSizing: "root-element" }} />

      <Storyboard id="NotaDetalleA" name="Detalle A · Ficha · nota" component={NotaDetalleA} layout={{ x: 0, y: 16300, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleAMobile" name="Detalle A · 5 fotos · mobile 390" component={S.DetalleAMobile} layout={{ x: 460, y: 16300, width: 390, height: 3300, intrinsicSizing: "root-element" }} />
      <Storyboard id="DetalleADesktop" name="Detalle A · 5 fotos · desktop 1280" component={S.DetalleADesktop} layout={{ x: 900, y: 16300, width: 1280, height: 2000, intrinsicSizing: "root-element" }} />

      <Storyboard id="Nota404A" name="404 A · Directa · nota" component={Nota404A} layout={{ x: 0, y: 19900, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_AMobile" name="404 A · mobile 390" component={S.NF_AMobile} layout={{ x: 460, y: 19900, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_ADesktop" name="404 A · desktop 1280" component={S.NF_ADesktop} layout={{ x: 900, y: 19900, width: 1280, height: 900, intrinsicSizing: "root-element" }} />
      <Storyboard id="Nota404B" name="404 B · Hilo suelto · nota" component={Nota404B} layout={{ x: 2240, y: 19900, width: 400, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BMobile" name="404 B · mobile 390" component={S.NF_BMobile} layout={{ x: 2700, y: 19900, width: 390, height: 1000, intrinsicSizing: "root-element" }} />
      <Storyboard id="NF_BDesktop" name="404 B · desktop 1280" component={S.NF_BDesktop} layout={{ x: 3140, y: 19900, width: 1280, height: 900, intrinsicSizing: "root-element" }} />
    </Canvas>
  );
}
