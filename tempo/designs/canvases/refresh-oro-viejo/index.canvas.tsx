import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { Cambios, Fundamentos, Intro, Movimientos } from "./narracion";
import {
  CatalogoCierre,
  CatalogoDesktop,
  CatalogoMobile,
  CierreResponsivo,
  DetalleDesktop,
  DetalleMobile,
  NoExisteDesktop,
  NoExisteMobile,
  PersonalizadorDesktop,
  PersonalizadorMobile,
  PortadaDesktop,
  PortadaMobile,
  PromosDesktop,
  PromosMobile,
  VisorDesktop,
  VisorMobile,
} from "./pantallas";

/* Los id R3* se quedan: los hilos de Said de la ronda 3 están pegados a esos frames. */
export default function RefreshOroViejoCanvas() {
  return (
    <Canvas name="refresh-oro-viejo">
      <Storyboard id="Intro" name="Intro · refresh oro viejo · ronda 4" component={Intro} layout={{ x: 0, y: 0 }} />
      <Storyboard id="Movimientos" name="Los 4 movimientos (en vivo)" component={Movimientos} layout={{ x: 1100, y: 0 }} />
      <Storyboard id="Fundamentos" name="Fundamentos: color, letra, botones, aire, tiempos" component={Fundamentos} layout={{ x: 2700, y: 0 }} />
      <Storyboard id="Cambios" name="Lista de cambios para el PR" component={Cambios} layout={{ x: 4300, y: 0 }} />
      <Storyboard id="R3PortadaMobile" name="R5 · Portada · 390" component={PortadaMobile} layout={{ x: 0, y: 3600 }} />
      <Storyboard id="R3PortadaDesktop" name="R5 · Portada · 1280" component={PortadaDesktop} layout={{ x: 1040, y: 3600 }} />
      <Storyboard id="R3CatalogoMobile" name="R4 · Catálogo categoría · 390" component={CatalogoMobile} layout={{ x: 0, y: 9100 }} />
      <Storyboard id="R3CatalogoDesktop" name="R4 · Catálogo categoría · 1280" component={CatalogoDesktop} layout={{ x: 1040, y: 9100 }} />
      <Storyboard id="R3CatalogoCierre" name="R4 · Catálogo · categoría de 10 fotos · 1280" component={CatalogoCierre} layout={{ x: 3900, y: 9100 }} />
      <Storyboard id="CierreResponsivo" name="R4 · Tarjeta de cierre · 390 / 768 / 1280" component={CierreResponsivo} layout={{ x: 6800, y: 9100 }} />
      <Storyboard id="R3VisorMobile" name="R4 · Catálogo visor · 390" component={VisorMobile} layout={{ x: 0, y: 12400 }} />
      <Storyboard id="R3VisorDesktop" name="R4 · Catálogo visor · 1280" component={VisorDesktop} layout={{ x: 1040, y: 12400 }} />
      <Storyboard id="R3PromosMobile" name="R5 · Promos lista · 390" component={PromosMobile} layout={{ x: 0, y: 15600 }} />
      <Storyboard id="R3PromosDesktop" name="R5 · Promos lista · 1280" component={PromosDesktop} layout={{ x: 1040, y: 15600 }} />
      <Storyboard id="R3DetalleMobile" name="R4 · Promo detalle · 390" component={DetalleMobile} layout={{ x: 0, y: 18500 }} />
      <Storyboard id="R3DetalleDesktop" name="R4 · Promo detalle · 1280" component={DetalleDesktop} layout={{ x: 1040, y: 18500 }} />
      <Storyboard id="R3PersonalizadorMobile" name="R5 · Personalizador · 390" component={PersonalizadorMobile} layout={{ x: 0, y: 21600 }} />
      <Storyboard id="R3PersonalizadorDesktop" name="R5 · Personalizador · 1280" component={PersonalizadorDesktop} layout={{ x: 1040, y: 21600 }} />
      <Storyboard id="R3NoExisteMobile" name="R5 · 404 · 390" component={NoExisteMobile} layout={{ x: 0, y: 24800 }} />
      <Storyboard id="R3NoExisteDesktop" name="R5 · 404 · 1280" component={NoExisteDesktop} layout={{ x: 1040, y: 24800 }} />
    </Canvas>
  );
}
