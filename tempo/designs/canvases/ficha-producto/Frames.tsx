import { FichaPagina, VisorAbierto } from "./Ficha";
import { CON_PRECIO, SIN_PRECIO, VARIAS_FOTOS } from "./datos";

// Un frame por estado. Celular: la pantalla del teléfono (844) con scroll; escritorio: la página de largo completo.

export const Escritorio1280ConPrecio = () => <FichaPagina p={CON_PRECIO} ancho={1280} />;
export const Escritorio1280SinPrecio = () => <FichaPagina p={SIN_PRECIO} ancho={1280} />;
export const Escritorio1280VariasFotos = () => <FichaPagina p={VARIAS_FOTOS} ancho={1280} />;
export const Escritorio1280Lupa = () => <FichaPagina p={CON_PRECIO} ancho={1280} estado="lupa" />;

export const Celular390ConPrecio = () => <FichaPagina p={CON_PRECIO} ancho={390} alto={844} />;
export const Celular390ConPrecioCompleta = () => <FichaPagina p={CON_PRECIO} ancho={390} />;
export const Celular390SinPrecio = () => <FichaPagina p={SIN_PRECIO} ancho={390} alto={844} />;
export const Celular390VariasFotos = () => <FichaPagina p={VARIAS_FOTOS} ancho={390} alto={844} />;
export const Celular390Mantener = () => <FichaPagina p={CON_PRECIO} ancho={390} alto={844} estado="mantener" />;

export const Visor1280 = () => <VisorAbierto p={VARIAS_FOTOS} ancho={1280} alto={800} />;
export const Visor390 = () => <VisorAbierto p={VARIAS_FOTOS} ancho={390} alto={844} />;
export const Celular320ConPrecio = () => <FichaPagina p={CON_PRECIO} ancho={320} alto={844} />;
