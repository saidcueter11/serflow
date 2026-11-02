import { Canvas, Storyboard } from "tempo-sdk/canvas";
import { PortadaDesktop, PortadaMobile } from "./Portada";
import { Sistema } from "./Sistema";
import {
  Catalogo10Desktop,
  Catalogo10Mobile,
  CatalogoDesktop,
  CatalogoMobile,
  PromosMobile,
  PromosDesktop,
  PromoDetalleMobile,
  PromoDetalleDesktop,
  NoExisteMobile,
  NoExisteDesktop,
  PersonalizadorMobile,
  PersonalizadorDesktop,
} from "./Pantallas";
import { VisorFinalDesktop, VisorFinalMobile } from "./Visores";

/* PRI-286 · portada final, en 390 y 1280, con el sistema medido en heirest.com; a la derecha, el resto de las pantallas. */
export default function PortadaFinalCanvas() {
  return (
    <Canvas name="Portada final" backgroundColor="#232323">
      <Storyboard id="PortadaMobile" name="Portada · 390" component={PortadaMobile} layout={{ x: 0, y: 0 }} />
      <Storyboard id="PortadaDesktop" name="Portada · 1280" component={PortadaDesktop} layout={{ x: 490, y: 0 }} />
      <Storyboard id="Sistema" name="Sistema (de Heirest)" component={Sistema} layout={{ x: 1870, y: 0 }} />
      <Storyboard id="CatalogoMobile" name="Catálogo · Beisbol (23) · 390" component={CatalogoMobile} layout={{ x: 3210, y: 0 }} />
      <Storyboard id="CatalogoDesktop" name="Catálogo · Beisbol (23) · 1280" component={CatalogoDesktop} layout={{ x: 3700, y: 0 }} />
      <Storyboard id="Catalogo10Mobile" name="Catálogo · Basketball (10) · 390" component={Catalogo10Mobile} layout={{ x: 3210, y: 5000 }} />
      <Storyboard id="Catalogo10Desktop" name="Catálogo · Basketball (10) · 1280" component={Catalogo10Desktop} layout={{ x: 3700, y: 5000 }} />
      {/* PRI-286 · visor final (Said, 2026-11-02): C, Textura de taller, con Qué hacemos llenando el panel. */}
      <Storyboard id="VisorFinalMobile" name="Visor · C final · 390" component={VisorFinalMobile} layout={{ x: 5080, y: 0 }} />
      <Storyboard id="VisorFinalDesktop" name="Visor · C final · 1280" component={VisorFinalDesktop} layout={{ x: 5570, y: 0 }} />
      <Storyboard id="PromosMobile" name="Promos · lista · 390" component={PromosMobile} layout={{ x: 6950, y: 0 }} />
      <Storyboard id="PromosDesktop" name="Promos · lista · 1280" component={PromosDesktop} layout={{ x: 7440, y: 0 }} />
      <Storyboard id="PromoDetalleMobile" name="Promos · detalle · 390" component={PromoDetalleMobile} layout={{ x: 6950, y: 5000 }} />
      <Storyboard id="PromoDetalleDesktop" name="Promos · detalle · 1280" component={PromoDetalleDesktop} layout={{ x: 7440, y: 5000 }} />
      <Storyboard id="PersonalizadorMobile" name="Personalizador (PR #36) · 390" component={PersonalizadorMobile} layout={{ x: 8820, y: 0 }} />
      <Storyboard id="PersonalizadorDesktop" name="Personalizador (PR #36) · 1280" component={PersonalizadorDesktop} layout={{ x: 9310, y: 0 }} />
      <Storyboard id="NoExisteMobile" name="404 · 390" component={NoExisteMobile} layout={{ x: 10690, y: 0 }} />
      <Storyboard id="NoExisteDesktop" name="404 · 1280" component={NoExisteDesktop} layout={{ x: 11180, y: 0 }} />
    </Canvas>
  );
}
