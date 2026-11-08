// Los colores de muestra del sitio (src/lib/personaliza/muestra.ts) para el canvas. En Astro cada foto es un
// ImageMetadata que getImage optimiza; en el host de Vite la misma importación ya es la URL.
import { MUESTRA } from "../../../../src/lib/personaliza/muestra";
import type { ColorPrenda, Prenda } from "../../../../src/lib/personaliza/datos";

const url = (img: unknown) => (typeof img === "string" ? img : (img as { src: string }).src);

const pasar = (lista: (typeof MUESTRA)[Prenda]): ColorPrenda[] =>
  lista.map(({ photos, ...c }) => ({ ...c, photos: photos.map(({ image, ...f }) => ({ ...f, image_url: url(image), image_url_movil: url(image) })) }));

export const COLORES: Record<Prenda, ColorPrenda[]> = { camiseta: pasar(MUESTRA.camiseta), gorra: pasar(MUESTRA.gorra), "gorra-malla": pasar(MUESTRA["gorra-malla"]) };
