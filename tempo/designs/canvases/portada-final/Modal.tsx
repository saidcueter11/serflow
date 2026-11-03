import "./portada.css";
import "./pantallas.css";
import "./modal.css";
import { Button } from "../../../../src/components/ui/Button";
import { fotoTitulo, pedirUrl } from "../../../../src/lib/catalog";
import { PageFrame, PageTitle } from "../../design-system/Chrome";
import { NUEVO } from "../refresh-oro-viejo/comun";
import { Catalogo, CATEGORIAS } from "./Pantallas";

/*
 * PRI-286 · el visor pasa a ser un modal encima del muro (Said, 2026-11-02). Serflow no es una tienda: el catálogo es un
 * portafolio del taller y se pide por WhatsApp. Patrón: el modal de foto de Unsplash y el pin de Pinterest, sin nada de
 * tienda (ni precio, ni carrito, ni "Más de" al lado).
 * Escritorio: la foto entera (contain) centrada y, debajo, una franja de una sola fila del mismo ancho: categoría y nombre a
 * la izquierda, Pedir por WhatsApp con su nota a la derecha. La foto se achica lo justo para que las dos quepan en el alto
 * con el mismo aire arriba y abajo; flechas a los lados, contador arriba a la izquierda y la X arriba a la derecha.
 * La nota en escritorio es corta para caber en una línea debajo del botón; en el celular va completa.
 * Celular: pantalla completa; arriba el contador y la X, la foto en el medio con las orillas de la anterior y la
 * siguiente (la pista de que se desliza) y la franja con el botón fija abajo.
 * Todo el texto es real: categoría, fotoTitulo, "Pedir por WhatsApp" con pedirUrl y su nota de master. description: hoy
 * ningún producto la tiene; si existe, una línea debajo del nombre.
 * En el PR: un componente de src/components/ui (sin lógica) y las clases mx-* con él.
 */

type W = 390 | 1280;

const cat = CATEGORIAS.beisbol;
const i = 3; // la 4.ª foto de Beisbol: "4 / 23"
const foto = cat.tiles[i];
const n = 49 - i; // los N.º de Pantallas.tsx: el más nuevo arriba
const titulo = fotoTitulo(cat.label, n);

const Chevron = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

function Franja({ desktop }: { desktop: boolean }) {
  return (
    <div className="mx-franja">
      <div className="mx-nombre">
        <p className="mx-cat">{cat.label}</p>
        <h2 id="mx-titulo" className="mx-titulo">
          {titulo}
        </h2>
      </div>
      <div className="mx-pedir">
        <Button variant="whatsapp" href={pedirUrl(cat.label, n, foto.href)} external fullWidth={!desktop}>
          Pedir por WhatsApp
        </Button>
        <p className="mx-nota">{desktop ? "Te la hacemos igual o con tu logo." : "Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo."}</p>
      </div>
    </div>
  );
}

export function Modal({ width }: { width: W }) {
  const desktop = width === 1280;
  const contador = (
    <p className="mx-contador" aria-live="polite">
      {i + 1} / {cat.tiles.length}
    </p>
  );
  return (
    <div className="mx-vista" style={{ width, height: desktop ? 800 : 844 }}>
      {/* El catálogo abierto debajo, a la altura del muro (como queda al tocar una foto). */}
      <div className="mx-fondo" aria-hidden="true" style={{ top: desktop ? -560 : -400 }}>
        <Catalogo width={width} cat="beisbol" />
      </div>
      <div className={`${NUEVO} pf mx font-body text-ink`}>
        {/* El velo cierra al tocarlo (es un botón para el mouse; con teclado, Esc). */}
        <div className="mx-velo" aria-hidden="true" />
        <div role="dialog" aria-modal="true" aria-labelledby="mx-titulo" className="mx-caja">
          <button type="button" className="mx-x" aria-label="Cerrar">
            <Chevron d="M6 6l12 12M18 6L6 18" />
          </button>
          {desktop ? (
            <>
              <div className="mx-barra">{contador}</div>
              <button type="button" className="mx-flecha mx-ant" aria-label="Foto anterior">
                <Chevron d="M15 18l-6-6 6-6" />
              </button>
              <div className="mx-centro">
                <div className="mx-pieza">
                  <img src={foto.img.src} alt={foto.img.alt} className="mx-foto" />
                  <div className="mx-lado">
                    <Franja desktop />
                  </div>
                </div>
              </div>
              <button type="button" className="mx-flecha mx-sig" aria-label="Foto siguiente">
                <Chevron d="M9 6l6 6-6 6" />
              </button>
            </>
          ) : (
            <>
              <div className="mx-barra">{contador}</div>
              <div className="mx-pista">
                <button type="button" className="mx-vecina mx-vecina-ant" aria-label="Foto anterior">
                  <img src={cat.tiles[i - 1].img.src} alt="" />
                </button>
                <img src={foto.img.src} alt={foto.img.alt} className="mx-foto" />
                <button type="button" className="mx-vecina mx-vecina-sig" aria-label="Foto siguiente">
                  <img src={cat.tiles[i + 1].img.src} alt="" />
                </button>
              </div>
              <Franja desktop={false} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const ModalDesktop = () => <Modal width={1280} />;
export const ModalMobile = () => <Modal width={390} />;

/* ---------- Narración ---------- */

const NOTAS = [
  ["URL propia", "Cada foto tiene URL propia, /catalogo/<categoria>/<slug>, que abre el catálogo con el modal abierto: el link del mensaje de WhatsApp sigue funcionando. Ruta y no ?foto=: el sitio es estático y así cada foto tiene su og:image (la vista previa de WhatsApp muestra la gorra)."],
  ["Redirección", "Las URLs viejas /products/<categoria>/<id> redirigen con 301 a esa URL."],
  ["Foco", "Foco atrapado dentro del modal, aria-modal=\"true\" y, al cerrar, el foco vuelve a la foto que lo abrió. <dialog> con showModal() ya trae las tres y Esc; el JS (flechas, deslizar, URL) va en un <script> de la página, no en src/components/ui."],
  ["Visor", "Se elimina el visor de página completa (ViewerPage y su ruta): la foto se ve solo en el modal."],
];

const COMPORTAMIENTO = [
  ["Cerrar", "La X, tocar afuera de la foto y la franja, o Esc."],
  ["Recorrer", "Las fotos de la misma categoría, sin dar la vuelta: flechas y ← → en escritorio; deslizar en el celular, y las orillas de la anterior y la siguiente son botones (Foto anterior / siguiente) para quien no desliza. En la primera o la última, la flecha de ese lado no se pinta. Desde Disponible ahora, el modal abre encima de la portada y recorre esas fotos."],
  ["Entrada", "El velo en fundido (--motion-med) y la foto con la franja suben 16 px (sf-sube de refresh-r2.css y --ease-premium de refresh.css, que pasan a tokens.css; --motion-slow). Con reducir movimiento, todo aparece sin moverse."],
  ["Datos", "Categoría, fotoTitulo y Pedir por WhatsApp con pedirUrl, como hoy. Si el producto tiene description, una línea debajo del nombre (truncada). Si tiene más de una foto, las flechas pasan primero por las suyas y el contador sigue contando trabajos. Hoy ninguno tiene ni lo uno ni lo otro."],
];

function Lista({ titulo, filas }: { titulo: string; filas: string[][] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[13px] font-semibold uppercase tracking-[.14em] text-muted">{titulo}</h2>
      <ol className="flex flex-col border-t border-line">
        {filas.map(([k, v], j) => (
          <li key={k} className="grid grid-cols-[32px_160px_1fr] gap-4 border-b border-line py-4 text-[15px] leading-relaxed">
            <span className="text-muted">{j + 1}</span>
            <span className="font-semibold text-ink">{k}</span>
            <span className="text-muted">{v}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ModalNotas() {
  return (
    <div className={NUEVO}>
      <PageFrame family="portada final · PRI-286" width={900}>
        <PageTitle
          title="Modal · notas para construir"
          description="Tocar una foto del muro del catálogo o de Disponible ahora abre este modal encima; no hay página de detalle."
        />
        <div className="flex flex-col gap-10">
          <Lista titulo="Para construir" filas={NOTAS} />
          <Lista titulo="Comportamiento" filas={COMPORTAMIENTO} />
        </div>
      </PageFrame>
    </div>
  );
}
