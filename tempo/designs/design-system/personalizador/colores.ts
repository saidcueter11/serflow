// Los colores de muestra del sitio (src/lib/personaliza/muestra.ts) para el canvas. En Astro cada foto es un
// ImageMetadata que getImage optimiza; en el host de Vite la misma importación ya es la URL.
import { MUESTRA } from "../../../../src/lib/personaliza/muestra";
import type { ColorPrenda, Prenda } from "../../../../src/lib/personaliza/datos";

const url = (img: unknown) => (typeof img === "string" ? img : (img as { src: string }).src);

export const COLORES: Record<Prenda, ColorPrenda[]> = {
  camiseta: MUESTRA.camiseta.map(({ photos, ...c }) => ({ ...c, photos: photos.map(({ image, ...f }) => ({ ...f, image_url: url(image) })) })),
  gorra: MUESTRA.gorra.map(({ photos, ...c }) => ({ ...c, photos: photos.map(({ image, ...f }) => ({ ...f, image_url: url(image) })) })),
};
