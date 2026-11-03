/// <reference types="vite/client" />
import { useEffect, useRef } from "react";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { Masonry, type MasonryTile } from "../../../../src/components/ui/Masonry";
import { PhotoModal, type FotoModal } from "../../../../src/components/ui/PhotoModal";
import { fotoTitulo, pedirUrl } from "../../../../src/lib/catalog";
import { PageFrame, PageTitle, Row } from "../Chrome";
// Fotos de ejemplo del catálogo de hoy (gorras sobre fondo gris, 3:4) y una de Unsplash que ya usa la portada.
import estante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import mtq from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";

const FOTOS = import.meta.glob<string>("../../../../src/assets/images/beisbol/*.webp", { eager: true, import: "default" });
const BEISBOL = Object.values(FOTOS).slice(0, 12);

const tiles: MasonryTile[] = BEISBOL.map((src, i) => ({
  href: `#beisbol-${i + 1}`,
  img: { src, alt: `Beisbol, foto N.º ${i + 1}` },
  label: "Beisbol",
  photos: i % 5 === 0 ? 3 : 1,
}));

export function BoardMasonry() {
  return (
    <PageFrame family="fotos y mascota" width={1300}>
      <PageTitle
        title="Masonry"
        description="El muro de fotos del catálogo (PRI-130; rejilla pareja en PRI-286): columnas iguales y todas las fotos 4:5, sin texto en la tarjeta. El chevrón en un círculo dice que la foto se abre (en el modal). La última fila queda con las fotos que haya."
      />
      <Row name="Celular (390)" description="2 columnas. La categoría va en el alt; el contador de fotos arriba a la derecha.">
        <div className="w-[390px] rounded-tile bg-primary p-4">
          <Masonry tiles={tiles.slice(0, 8)} />
        </div>
      </Row>
      <Row name="Desktop" description="3 columnas desde 40rem de muro (aquí) y 4 desde 64rem. Con el mouse sale el chip de la categoría y la foto se acerca.">
        <div className="w-[840px] rounded-tile bg-primary p-6">
          <Masonry tiles={tiles} />
        </div>
      </Row>
    </PageFrame>
  );
}

const FOTO: FotoModal = {
  titulo: fotoTitulo("Beisbol", 46),
  categoria: "Beisbol",
  alt: "Beisbol, foto N.º 46",
  pedir: pedirUrl("Beisbol", 46, "/catalogo/beisbol/beisbol-46"),
  fotos: [{ src: BEISBOL[3] }],
};

/**
 * El modal en un marco del tamaño de la pantalla. En el sitio lo abre y lo llena src/scripts/photo-modal.ts con
 * showModal(); aquí se abre sin el top layer (atributo open) dentro de un marco con transform, que hace de pantalla.
 */
function Pantalla({ width, height }: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = ref.current!.querySelector("dialog")!;
    d.querySelector<HTMLImageElement>(".mx-foto")!.src = FOTO.fotos[0].src;
    d.querySelector<HTMLImageElement>(".mx-foto")!.alt = FOTO.alt;
    d.querySelectorAll<HTMLImageElement>(".mx-vecina img").forEach((img, k) => (img.src = BEISBOL[k === 0 ? 2 : 4]));
    d.querySelector(".mx-contador")!.textContent = `4 / ${BEISBOL.length}`;
    d.querySelector(".mx-cat")!.textContent = FOTO.categoria;
    d.querySelector(".mx-titulo")!.textContent = FOTO.titulo;
    d.querySelector<HTMLAnchorElement>(".mx-pedir a")!.href = FOTO.pedir;
    d.setAttribute("open", "");
  }, []);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-tile bg-primary" style={{ width, height, transform: "translateZ(0)" }}>
      <div className="pf p-12">
        <Masonry tiles={tiles} />
      </div>
      <PhotoModal />
    </div>
  );
}

export function BoardPhotoModal() {
  return (
    <PageFrame family="fotos y mascota" width={1900}>
      <PageTitle
        title="PhotoModal"
        description="La foto abierta (PRI-286): un <dialog> encima del muro del catálogo o de Disponible ahora, en lugar de la página de detalle. La foto entera (contain), la categoría y el nombre, y Pedir por WhatsApp con la URL propia de la foto. Flechas, ← →, deslizar, contador, Esc, la X o tocar afuera para cerrar; el foco vuelve a la foto."
      />
      <Row name="Desktop (1280)" description="La foto centrada y debajo una franja de una fila del mismo ancho: nombre a la izquierda, Pedir a la derecha.">
        <Pantalla width={1280} height={800} />
      </Row>
      <Row name="Celular (390)" description="Pantalla completa: las orillas de la anterior y la siguiente son botones y Pedir va fijo abajo.">
        <Pantalla width={390} height={844} />
      </Row>
    </PageFrame>
  );
}

export function BoardCategoryBanner() {
  const slides = [
    { label: "Todo", image: { src: estante } },
    { label: "Mi Tierra Querida", image: { src: mtq } },
    { label: "Dotación" },
  ];
  return (
    <PageFrame family="fotos y mascota" width={1300}>
      <PageTitle
        title="CategoryBanner"
        description="Banner de categorías arriba del catálogo, a sangre (PRI-286): la portada de la categoría con un velo abajo; el nombre (h1) y la bajada los pone la página encima. Al cambiar de categoría se desliza a la nueva."
      />
      <Row name="Celular (390)" description="Lámina actual: Todo.">
        <div className="w-[390px] bg-primary">
          <CategoryBanner slides={slides} current={0} />
        </div>
      </Row>
      <Row name="Desktop" description="Mi Tierra Querida. Sin portada (Dotación) queda la trama.">
        <div className="pf flex w-[1280px] flex-col gap-4 bg-primary">
          <CategoryBanner slides={slides} current={1} />
          <CategoryBanner slides={slides} current={2} />
        </div>
      </Row>
    </PageFrame>
  );
}
