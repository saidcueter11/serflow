import { Canvas, Storyboard, HtmlStoryboard } from "tempo-sdk/canvas";
import { Cambios, Componentes, Fundamentos, Intro, Movimientos } from "./narracion";
import {
  CatalogoDesktop,
  CatalogoMobile,
  PersonalizadorDesktop,
  PersonalizadorMobile,
  PortadaDesktop,
  PortadaMobile,
  PromosDesktop,
  PromosMobile,
} from "./pantallas";

export default function RefreshOroViejoCanvas() {
  return (
    <Canvas name="refresh-oro-viejo">
      <Storyboard id="Intro" name="Intro · refresh oro viejo" component={Intro} layout={{ x: 0, y: 0 }} />
      <Storyboard id="Movimientos" name="Los 4 movimientos (en vivo)" component={Movimientos} layout={{ x: 1100, y: 0 }} />
      <Storyboard id="Fundamentos" name="Fundamentos: color, letra, tiempos" component={Fundamentos} layout={{ x: 2700, y: 0 }} />
      <Storyboard id="Componentes" name="Componentes antes y después" component={Componentes} layout={{ x: 4100, y: 0 }} />
      <Storyboard id="Cambios" name="Lista de cambios para el PR" component={Cambios} layout={{ x: 5700, y: 0 }} />

      <Storyboard id="PortadaMobile" name="Portada · 390 · antes y después" component={PortadaMobile} layout={{ x: 0, y: 3200 }} />
      <Storyboard id="PortadaDesktop" name="Portada · 1280 · antes y después" component={PortadaDesktop} layout={{ x: 1100, y: 3200 }} />
      <Storyboard id="CatalogoMobile" name="Catálogo · 390 · antes y después" component={CatalogoMobile} layout={{ x: 0, y: 7800 }} />
      <Storyboard id="CatalogoDesktop" name="Catálogo · 1280 · antes y después" component={CatalogoDesktop} layout={{ x: 1100, y: 7800 }} />
      <Storyboard id="PromosMobile" name="Promos · 390 · antes y después" component={PromosMobile} layout={{ x: 0, y: 12200 }} />
      <Storyboard id="PromosDesktop" name="Promos · 1280 · antes y después" component={PromosDesktop} layout={{ x: 1100, y: 12200 }} />
      <Storyboard id="PersonalizadorMobile" name="Personalizador · 390 · antes y después" component={PersonalizadorMobile} layout={{ x: 0, y: 15800 }} />
      <Storyboard id="PersonalizadorDesktop" name="Personalizador · 1280 · antes y después" component={PersonalizadorDesktop} layout={{ x: 1100, y: 15800 }} />
      <HtmlStoryboard id="PersonalizadorAntesMobileVivo" name="Personalizador · 390 · antes (página)" filepath="./personalizador-antes.html" layout={{ x: 3950, y: 15800, width: 390, height: 2428 }} />
      <HtmlStoryboard id="PersonalizadorDespuesMobileVivo" name="Personalizador · 390 · después (página)" filepath="./personalizador-despues.html" layout={{ x: 4390, y: 15800, width: 390, height: 2428 }} />
      <HtmlStoryboard id="PersonalizadorAntesDesktopVivo" name="Personalizador · 1280 · antes (página)" filepath="./personalizador-antes.html" layout={{ x: 4880, y: 15800, width: 1280, height: 1941 }} />
      <HtmlStoryboard id="PersonalizadorDespuesDesktopVivo" name="Personalizador · 1280 · después (página)" filepath="./personalizador-despues.html" layout={{ x: 6210, y: 15800, width: 1280, height: 1941 }} />
    </Canvas>
  );
}
