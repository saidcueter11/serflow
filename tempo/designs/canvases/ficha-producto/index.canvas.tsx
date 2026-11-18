import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { Intro, FaltaEnElDS } from "./Notas";
import {
  Escritorio1280ConPrecio,
  Escritorio1280SinPrecio,
  Escritorio1280VariasFotos,
  Escritorio1280Lupa,
  Celular390ConPrecio,
  Celular390ConPrecioCompleta,
  Celular390SinPrecio,
  Celular390VariasFotos,
  Celular390Mantener,
  Visor1280,
  Visor390,
  Celular320ConPrecio,
} from "./Frames";

export default function FichaProductoCanvas() {
  return (
    <Canvas name="Ficha producto">
      <Storyboard id="Intro" name="Ficha de producto (PRI-529)" component={Intro} layout={{ x: 0, y: 0 }} />
      <Storyboard id="Escritorio1280ConPrecio" name="Escritorio 1280 · con precio y colores" component={Escritorio1280ConPrecio} layout={{ x: 800, y: 0 }} />
      <Storyboard id="Escritorio1280SinPrecio" name="Escritorio 1280 · sin precio" component={Escritorio1280SinPrecio} layout={{ x: 2160, y: 0 }} />
      <Storyboard id="Escritorio1280VariasFotos" name="Escritorio 1280 · varias fotos" component={Escritorio1280VariasFotos} layout={{ x: 3520, y: 0 }} />
      <Storyboard id="Escritorio1280Lupa" name="Escritorio 1280 · lupa encendida" component={Escritorio1280Lupa} layout={{ x: 4880, y: 0 }} />
      <Storyboard id="FaltaEnElDS" name="Falta en el DS" component={FaltaEnElDS} layout={{ x: 6240, y: 0 }} />
      <Storyboard id="Celular390ConPrecio" name="Celular 390 · con precio y colores" component={Celular390ConPrecio} layout={{ x: 800, y: 2200 }} />
      <Storyboard id="Celular390ConPrecioCompleta" name="Celular 390 · con precio, página entera" component={Celular390ConPrecioCompleta} layout={{ x: 1240, y: 2200 }} />
      <Storyboard id="Celular390SinPrecio" name="Celular 390 · sin precio" component={Celular390SinPrecio} layout={{ x: 1680, y: 2200 }} />
      <Storyboard id="Celular390VariasFotos" name="Celular 390 · varias fotos" component={Celular390VariasFotos} layout={{ x: 2120, y: 2200 }} />
      <Storyboard id="Celular390Mantener" name="Celular 390 · mantén para acercar" component={Celular390Mantener} layout={{ x: 2560, y: 2200 }} />
      <Storyboard id="Visor1280" name="Visor abierto · 1280" component={Visor1280} layout={{ x: 3100, y: 2200 }} />
      <Storyboard id="Visor390" name="Visor abierto · 390" component={Visor390} layout={{ x: 4430, y: 2200 }} />
      <Storyboard id="Celular320ConPrecio" name="Celular 320 · con precio y colores" component={Celular320ConPrecio} layout={{ x: 4870, y: 2200 }} />
    </Canvas>
  );
}
