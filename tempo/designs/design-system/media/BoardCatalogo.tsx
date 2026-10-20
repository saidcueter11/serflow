/// <reference types="vite/client" />
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { Masonry, type MasonryTile } from "../../../../src/components/ui/Masonry";
import { PhotoCarousel } from "../../../../src/components/ui/PhotoCarousel";
import { PageFrame, PageTitle, Row } from "../Chrome";
// Fotos de ejemplo del catálogo de hoy (gorras sobre fondo gris, 3:4) y una de Unsplash que ya usa la portada.
import estante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import mtq from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";

const FOTOS = import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" });
const BEISBOL = Object.values(FOTOS).slice(0, 12);

const tiles: MasonryTile[] = BEISBOL.map((src, i) => ({
  href: `#beisbol-${i + 1}`,
  img: { src, alt: `Beisbol, foto N.º ${i + 1}`, ratio: 3 / 4 },
  label: "Beisbol",
  nuevo: i === 0,
  photos: i % 5 === 0 ? 3 : 1,
}));

export function BoardMasonry() {
  return (
    <PageFrame family="fotos y mascota" width={1300}>
      <PageTitle
        title="Masonry"
        description="El muro de fotos del catálogo (PRI-130, dirección Pinterest / Unsplash): columnas de alturas mezcladas, sin texto en la tarjeta. Las fotos 3:4 se recortan con un ritmo fijo (3:4, 1:1, 4:5, 2:3); las de otra proporción mantienen la suya."
      />
      <Row name="Celular (390)" description="2 columnas. La categoría va en el alt; Nuevo y el contador de fotos encima.">
        <div className="w-[390px] rounded-tile bg-primary p-4">
          <Masonry tiles={tiles.slice(0, 8)} />
        </div>
      </Row>
      <Row name="Desktop" description="3 columnas desde @3xl (aquí) y 4 desde @6xl. Con el mouse sale el chip de la categoría y la foto hace zoom.">
        <div className="w-[840px] rounded-tile bg-primary p-6">
          <Masonry tiles={tiles} />
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardPhotoCarousel() {
  const fotos = BEISBOL.slice(0, 3).map((src, i) => ({ src, alt: `Beisbol, foto N.º 26${i ? `, foto ${i + 1} de 3` : ""}` }));
  return (
    <PageFrame family="fotos y mascota" width={1300}>
      <PageTitle
        title="PhotoCarousel"
        description="Las fotos de una prenda en el visor del catálogo: se deslizan con el dedo (scroll-snap, sin JS) y van enteras sobre la trama. 4:5 en el celular, 16:9 desde @3xl con miniaturas."
      />
      <Row name="Celular (390), 3 fotos" description="Debajo, 'Desliza · 3 fotos'.">
        <div className="w-[390px] bg-primary">
          <PhotoCarousel photos={fotos} label="Fotos de Beisbol N.º 26" idPrefix="demo-m" />
        </div>
      </Row>
      <Row name="Desktop, 3 fotos" description="Miniaturas que llevan a cada foto (#id), sin JS.">
        <div className="w-[840px] bg-primary">
          <PhotoCarousel photos={fotos} label="Fotos de Beisbol N.º 26" idPrefix="demo-d" />
        </div>
      </Row>
    </PageFrame>
  );
}

export function BoardCategoryBanner() {
  const slides = [
    { label: "Todo", count: 92, image: { src: estante } },
    { label: "Mi Tierra Querida", count: 26, image: { src: mtq } },
    { label: "Dotación", count: 0 },
  ];
  return (
    <PageFrame family="fotos y mascota" width={1300}>
      <PageTitle
        title="CategoryBanner"
        description="Banner de categorías arriba del catálogo (el carrusel de antes, ahora con tokens): portada de la categoría, nombre y conteo. Al cambiar de categoría se desliza a la nueva."
      />
      <Row name="Celular (390)" description="Lámina actual: Todo.">
        <div className="w-[390px] bg-primary p-4">
          <CategoryBanner slides={slides} current={0} />
        </div>
      </Row>
      <Row name="Desktop" description="Mi Tierra Querida. Sin portada (Dotación) queda la trama.">
        <div className="flex w-[840px] flex-col gap-4 bg-primary p-6">
          <CategoryBanner slides={slides} current={1} />
          <CategoryBanner slides={slides} current={2} />
        </div>
      </Row>
    </PageFrame>
  );
}
