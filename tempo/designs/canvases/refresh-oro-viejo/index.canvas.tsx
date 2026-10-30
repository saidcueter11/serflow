import { Canvas, Storyboard } from "tempo-sdk/canvas";
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
import { CambiosR2, FundamentosR2, IntroR2, MovimientoR2, Ronda1Separador } from "./narracion-r2";
import {
  R2CatalogoDesktop,
  R2CatalogoMobile,
  R2DetalleDesktop,
  R2DetalleMobile,
  R2PersonalizadorDesktop,
  R2PersonalizadorMobile,
  R2PortadaDesktop,
  R2PortadaMobile,
  R2PromosDesktop,
  R2PromosMobile,
  R2VisorDesktop,
  R2VisorMobile,
} from "./pantallas-r2";

export default function RefreshOroViejoCanvas() {
  return (
    <Canvas name="refresh-oro-viejo">
      {/* Ronda 2 ("más fuerte", 2026-10-30) */}
      <Storyboard id="IntroR2" name="R2 · Intro" component={IntroR2} layout={{ x: 0, y: 0 }} />
      <Storyboard id="MovimientoR2" name="R2 · Movimiento en vivo" component={MovimientoR2} layout={{ x: 1100, y: 0 }} />
      <Storyboard id="FundamentosR2" name="R2 · Fundamentos" component={FundamentosR2} layout={{ x: 2700, y: 0 }} />
      <Storyboard id="CambiosR2" name="R2 · Lista de cambios para el PR" component={CambiosR2} layout={{ x: 4300, y: 0 }} />
      <Storyboard id="R2PortadaMobile" name="R2 · Portada · 390" component={R2PortadaMobile} layout={{ x: 0, y: 3000 }} />
      <Storyboard id="R2PortadaDesktop" name="R2 · Portada · 1280" component={R2PortadaDesktop} layout={{ x: 1040, y: 3000 }} />
      <Storyboard id="R2CatalogoMobile" name="R2 · Catálogo categoría · 390" component={R2CatalogoMobile} layout={{ x: 0, y: 8500 }} />
      <Storyboard id="R2CatalogoDesktop" name="R2 · Catálogo categoría · 1280" component={R2CatalogoDesktop} layout={{ x: 1040, y: 8500 }} />
      <Storyboard id="R2VisorMobile" name="R2 · Catálogo visor · 390" component={R2VisorMobile} layout={{ x: 0, y: 11800 }} />
      <Storyboard id="R2VisorDesktop" name="R2 · Catálogo visor · 1280" component={R2VisorDesktop} layout={{ x: 1040, y: 11800 }} />
      <Storyboard id="R2PromosMobile" name="R2 · Promos lista · 390" component={R2PromosMobile} layout={{ x: 0, y: 15000 }} />
      <Storyboard id="R2PromosDesktop" name="R2 · Promos lista · 1280" component={R2PromosDesktop} layout={{ x: 1040, y: 15000 }} />
      <Storyboard id="R2DetalleMobile" name="R2 · Promo detalle · 390" component={R2DetalleMobile} layout={{ x: 0, y: 17900 }} />
      <Storyboard id="R2DetalleDesktop" name="R2 · Promo detalle · 1280" component={R2DetalleDesktop} layout={{ x: 1040, y: 17900 }} />
      <Storyboard id="R2PersonalizadorMobile" name="R2 · Personalizador · 390" component={R2PersonalizadorMobile} layout={{ x: 0, y: 21000 }} />
      <Storyboard id="R2PersonalizadorDesktop" name="R2 · Personalizador · 1280" component={R2PersonalizadorDesktop} layout={{ x: 1040, y: 21000 }} />

      {/* Ronda 1 (descartada), tal como la vio Said el 2026-10-27 */}
      <Storyboard id="Ronda1" name="Ronda 1 (descartada)" component={Ronda1Separador} layout={{ x: 0, y: 24200 }} />
      <Storyboard id="Intro" name="Intro · refresh oro viejo" component={Intro} layout={{ x: 0, y: 24700 }} />
      <Storyboard id="Movimientos" name="Los 4 movimientos (en vivo)" component={Movimientos} layout={{ x: 1100, y: 24700 }} />
      <Storyboard id="Fundamentos" name="Fundamentos: color, letra, tiempos" component={Fundamentos} layout={{ x: 2700, y: 24700 }} />
      <Storyboard id="Componentes" name="Componentes antes y después" component={Componentes} layout={{ x: 4100, y: 24700 }} />
      <Storyboard id="Cambios" name="Lista de cambios para el PR" component={Cambios} layout={{ x: 5700, y: 24700 }} />

      <Storyboard id="PortadaMobile" name="Portada · 390 · antes y después" component={PortadaMobile} layout={{ x: 0, y: 27900 }} />
      <Storyboard id="PortadaDesktop" name="Portada · 1280 · antes y después" component={PortadaDesktop} layout={{ x: 1100, y: 27900 }} />
      <Storyboard id="CatalogoMobile" name="Catálogo · 390 · antes y después" component={CatalogoMobile} layout={{ x: 0, y: 32500 }} />
      <Storyboard id="CatalogoDesktop" name="Catálogo · 1280 · antes y después" component={CatalogoDesktop} layout={{ x: 1100, y: 32500 }} />
      <Storyboard id="PromosMobile" name="Promos · 390 · antes y después" component={PromosMobile} layout={{ x: 0, y: 36900 }} />
      <Storyboard id="PromosDesktop" name="Promos · 1280 · antes y después" component={PromosDesktop} layout={{ x: 1100, y: 36900 }} />
      <Storyboard id="PersonalizadorMobile" name="Personalizador · 390 · antes y después" component={PersonalizadorMobile} layout={{ x: 0, y: 40500 }} />
      <Storyboard id="PersonalizadorDesktop" name="Personalizador · 1280 · antes y después" component={PersonalizadorDesktop} layout={{ x: 1100, y: 40500 }} />
    </Canvas>
  );
}
