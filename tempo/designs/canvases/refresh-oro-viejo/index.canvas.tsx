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
import { CambiosR3, IntroR3, Ronda2Separador } from "./narracion-r3";
import {
  R3CatalogoDesktop,
  R3CatalogoMobile,
  R3DetalleDesktop,
  R3DetalleMobile,
  R3NoExisteDesktop,
  R3NoExisteMobile,
  R3PersonalizadorDesktop,
  R3PersonalizadorMobile,
  R3PortadaDesktop,
  R3PortadaMobile,
  R3PromosDesktop,
  R3PromosMobile,
  R3Tarjetas,
  R3VisorDesktop,
  R3VisorMobile,
} from "./pantallas-r3";

export default function RefreshOroViejoCanvas() {
  return (
    <Canvas name="refresh-oro-viejo">
      {/* Ronda 3 (espacios, 2026-11-01) */}
      <Storyboard id="IntroR3" name="R3 · Intro" component={IntroR3} layout={{ x: 0, y: 0 }} />
      <Storyboard id="CambiosR3" name="R3 · Lista de cambios para el PR" component={CambiosR3} layout={{ x: 1100, y: 0 }} />
      <Storyboard id="R3Tarjetas" name="R3 · Tarjetas antes y después" component={R3Tarjetas} layout={{ x: 2400, y: 0 }} />
      <Storyboard id="R3PortadaMobile" name="R3 · Portada · 390" component={R3PortadaMobile} layout={{ x: 0, y: 3000 }} />
      <Storyboard id="R3PortadaDesktop" name="R3 · Portada · 1280" component={R3PortadaDesktop} layout={{ x: 1040, y: 3000 }} />
      <Storyboard id="R3CatalogoMobile" name="R3 · Catálogo categoría · 390" component={R3CatalogoMobile} layout={{ x: 0, y: 8500 }} />
      <Storyboard id="R3CatalogoDesktop" name="R3 · Catálogo categoría · 1280" component={R3CatalogoDesktop} layout={{ x: 1040, y: 8500 }} />
      <Storyboard id="R3VisorMobile" name="R3 · Catálogo visor · 390" component={R3VisorMobile} layout={{ x: 0, y: 11800 }} />
      <Storyboard id="R3VisorDesktop" name="R3 · Catálogo visor · 1280" component={R3VisorDesktop} layout={{ x: 1040, y: 11800 }} />
      <Storyboard id="R3PromosMobile" name="R3 · Promos lista · 390" component={R3PromosMobile} layout={{ x: 0, y: 15000 }} />
      <Storyboard id="R3PromosDesktop" name="R3 · Promos lista · 1280" component={R3PromosDesktop} layout={{ x: 1040, y: 15000 }} />
      <Storyboard id="R3DetalleMobile" name="R3 · Promo detalle · 390" component={R3DetalleMobile} layout={{ x: 0, y: 17900 }} />
      <Storyboard id="R3DetalleDesktop" name="R3 · Promo detalle · 1280" component={R3DetalleDesktop} layout={{ x: 1040, y: 17900 }} />
      <Storyboard id="R3PersonalizadorMobile" name="R3 · Personalizador · 390" component={R3PersonalizadorMobile} layout={{ x: 0, y: 21000 }} />
      <Storyboard id="R3PersonalizadorDesktop" name="R3 · Personalizador · 1280" component={R3PersonalizadorDesktop} layout={{ x: 1040, y: 21000 }} />
      <Storyboard id="R3NoExisteMobile" name="R3 · 404 · 390" component={R3NoExisteMobile} layout={{ x: 0, y: 24200 }} />
      <Storyboard id="R3NoExisteDesktop" name="R3 · 404 · 1280" component={R3NoExisteDesktop} layout={{ x: 1040, y: 24200 }} />

      {/* Ronda 2 (reemplazada), tal como la comentó Said el 2026-11-01 */}
      <Storyboard id="Ronda2" name="Ronda 2 (reemplazada)" component={Ronda2Separador} layout={{ x: 0, y: 26500 }} />
      {/* Ronda 2 ("más fuerte", 2026-10-30) */}
      <Storyboard id="IntroR2" name="R2 · Intro" component={IntroR2} layout={{ x: 0, y: 27000 }} />
      <Storyboard id="MovimientoR2" name="R2 · Movimiento en vivo" component={MovimientoR2} layout={{ x: 1100, y: 27000 }} />
      <Storyboard id="FundamentosR2" name="R2 · Fundamentos" component={FundamentosR2} layout={{ x: 2700, y: 27000 }} />
      <Storyboard id="CambiosR2" name="R2 · Lista de cambios para el PR" component={CambiosR2} layout={{ x: 4300, y: 27000 }} />
      <Storyboard id="R2PortadaMobile" name="R2 · Portada · 390" component={R2PortadaMobile} layout={{ x: 0, y: 30000 }} />
      <Storyboard id="R2PortadaDesktop" name="R2 · Portada · 1280" component={R2PortadaDesktop} layout={{ x: 1040, y: 30000 }} />
      <Storyboard id="R2CatalogoMobile" name="R2 · Catálogo categoría · 390" component={R2CatalogoMobile} layout={{ x: 0, y: 35500 }} />
      <Storyboard id="R2CatalogoDesktop" name="R2 · Catálogo categoría · 1280" component={R2CatalogoDesktop} layout={{ x: 1040, y: 35500 }} />
      <Storyboard id="R2VisorMobile" name="R2 · Catálogo visor · 390" component={R2VisorMobile} layout={{ x: 0, y: 38800 }} />
      <Storyboard id="R2VisorDesktop" name="R2 · Catálogo visor · 1280" component={R2VisorDesktop} layout={{ x: 1040, y: 38800 }} />
      <Storyboard id="R2PromosMobile" name="R2 · Promos lista · 390" component={R2PromosMobile} layout={{ x: 0, y: 42000 }} />
      <Storyboard id="R2PromosDesktop" name="R2 · Promos lista · 1280" component={R2PromosDesktop} layout={{ x: 1040, y: 42000 }} />
      <Storyboard id="R2DetalleMobile" name="R2 · Promo detalle · 390" component={R2DetalleMobile} layout={{ x: 0, y: 44900 }} />
      <Storyboard id="R2DetalleDesktop" name="R2 · Promo detalle · 1280" component={R2DetalleDesktop} layout={{ x: 1040, y: 44900 }} />
      <Storyboard id="R2PersonalizadorMobile" name="R2 · Personalizador · 390" component={R2PersonalizadorMobile} layout={{ x: 0, y: 48000 }} />
      <Storyboard id="R2PersonalizadorDesktop" name="R2 · Personalizador · 1280" component={R2PersonalizadorDesktop} layout={{ x: 1040, y: 48000 }} />

      {/* Ronda 1 (descartada), tal como la vio Said el 2026-10-27 */}
      <Storyboard id="Ronda1" name="Ronda 1 (descartada)" component={Ronda1Separador} layout={{ x: 0, y: 51200 }} />
      <Storyboard id="Intro" name="Intro · refresh oro viejo" component={Intro} layout={{ x: 0, y: 51700 }} />
      <Storyboard id="Movimientos" name="Los 4 movimientos (en vivo)" component={Movimientos} layout={{ x: 1100, y: 51700 }} />
      <Storyboard id="Fundamentos" name="Fundamentos: color, letra, tiempos" component={Fundamentos} layout={{ x: 2700, y: 51700 }} />
      <Storyboard id="Componentes" name="Componentes antes y después" component={Componentes} layout={{ x: 4100, y: 51700 }} />
      <Storyboard id="Cambios" name="Lista de cambios para el PR" component={Cambios} layout={{ x: 5700, y: 51700 }} />

      <Storyboard id="PortadaMobile" name="Portada · 390 · antes y después" component={PortadaMobile} layout={{ x: 0, y: 54900 }} />
      <Storyboard id="PortadaDesktop" name="Portada · 1280 · antes y después" component={PortadaDesktop} layout={{ x: 1100, y: 54900 }} />
      <Storyboard id="CatalogoMobile" name="Catálogo · 390 · antes y después" component={CatalogoMobile} layout={{ x: 0, y: 59500 }} />
      <Storyboard id="CatalogoDesktop" name="Catálogo · 1280 · antes y después" component={CatalogoDesktop} layout={{ x: 1100, y: 59500 }} />
      <Storyboard id="PromosMobile" name="Promos · 390 · antes y después" component={PromosMobile} layout={{ x: 0, y: 63900 }} />
      <Storyboard id="PromosDesktop" name="Promos · 1280 · antes y después" component={PromosDesktop} layout={{ x: 1100, y: 63900 }} />
      <Storyboard id="PersonalizadorMobile" name="Personalizador · 390 · antes y después" component={PersonalizadorMobile} layout={{ x: 0, y: 67500 }} />
      <Storyboard id="PersonalizadorDesktop" name="Personalizador · 1280 · antes y después" component={PersonalizadorDesktop} layout={{ x: 1100, y: 67500 }} />
    </Canvas>
  );
}
