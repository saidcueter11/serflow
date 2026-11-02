import { useId } from "react";
import "./portada.css";
import "./pantallas.css";
import "./visores.css";
import { Button } from "../../../../src/components/ui/Button";
import { Masonry } from "../../../../src/components/ui/Masonry";
import { PhotoCarousel } from "../../../../src/components/ui/PhotoCarousel";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { CITY, WHATSAPP_URL } from "../../../../src/lib/business";
import { LOGO } from "../../design-system/app-shell/portada";
import { Marco } from "../refresh-oro-viejo/comun";
import { Cabecera } from "./Portada";
import { CATEGORIAS } from "./Pantallas";

/*
 * PRI-286 · visor de producto, versión final (Said, 2026-11-02: eligió C, Textura de taller; "Más de" abajo, en su
 * rejilla). Ronda 2 (Said): fuera "Qué hacemos" y la dirección del taller (ya están en la portada); el centro del panel
 * es solo DEL PRODUCTO.
 * Escritorio: foto 4:5 en 6 columnas y el panel en las otras 6, con el mismo borde de arriba y de abajo que la foto; el
 * panel reparte su alto entre nombre y sello, los datos (precio, Disponible, descripción), De cerca, la costura y Pedir,
 * con el mismo aire entre ellos. De cerca toma el alto que sobra: sin descripción ni precio, crece hasta llenarlo.
 * Celular: foto a sangre, nombre y sello, costura y Pedir arriba (el botón a la vista sin bajar, como en C final); los
 * datos (precio y Disponible, descripción) y De cerca debajo.
 * Datos (products de Supabase, 2026-11-02): de los 92 activos, ninguno tiene description, price ni stock > 0, y ninguno
 * tiene más de una foto. El frame principal usa datos de EJEMPLO para mostrar el caso lleno; "sin datos" es el de hoy.
 * Reglas para construir: cada dato solo si existe (description no vacía, price !== null, stock > 0); price en COP con
 * Intl.NumberFormat("es-CO", COP, sin decimales); stock > 0 = StatusPill accent "Disponible" (accent = disponible en labels), nunca el número.
 * De cerca: con image_urls[1], esa foto entera (cover); con una sola foto, la misma ampliada, centrada en el punto
 * 50 % / 43 %, donde queda el logo bordado en las fotos del catálogo; el zoom sale del alto del marco (el logo ocupa
 * ~65 % del alto) con un mínimo de 1,7 veces su ancho: el marco bajo no corta el logo y ninguno muestra el fondo.
 * Todo el resto del texto sale de master: la categoría, el nombre, "Pedir por WhatsApp" y su nota, y la ciudad de
 * business.ts en el sello. El logo es src/assets/LOGO SERFLOW.png (solo su monograma).
 */

type W = 390 | 1280;

type Datos = { description: string | null; price: number | null; stock: number };

/** Ejemplo de un producto con los tres campos llenos (hoy ninguno los tiene en Supabase). */
const EJEMPLO: Datos = {
  description: "Gorra negra de los Mariners con el logo bordado en relieve. Visera curva y correa ajustable atrás, talla única.",
  price: 45000,
  stock: 3,
};
/** Como están hoy los 92 productos activos. */
const VACIO: Datos = { description: null, price: null, stock: 0 };

const p = { nombre: "Beisbol #49", cat: CATEGORIAS.beisbol, count: 23 };

const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/** Detalle del producto en un marco cosido: su segunda foto si la tiene; si no, la primera ampliada sobre el logo. */
function DeCerca({ fotos }: { fotos: string[] }) {
  const segunda = fotos[1];
  return (
    <figure className="vx-cerca" aria-hidden={segunda ? undefined : true}>
      {segunda ? (
        <img src={segunda} alt={`${p.nombre}, otra foto`} className="vx-cerca-otra" />
      ) : (
        <img src={fotos[0]} alt="" className="vx-cerca-zoom" />
      )}
      <svg className="vx-cerca-costura" aria-hidden="true">
        <rect width="100%" height="100%" rx="4" />
      </svg>
      {!segunda && (
        <figcaption className="pf-pie vx-cerca-pie">De cerca</figcaption>
      )}
    </figure>
  );
}

/** El monograma S del logo real, como silueta del color que diga el CSS (mask del PNG, recortado a la S). */
function Monograma({ className }: { className: string }) {
  return <span aria-hidden="true" className={`vx-mono ${className}`} style={{ maskImage: `url("${LOGO}")`, WebkitMaskImage: `url("${LOGO}")` }} />;
}

/** Costura dorada horizontal que se cose una vez al cargar (la del "enlace que se cose"). */
const Costura = () => <span aria-hidden="true" className="vx-costura" />;

/* ---------- Sello circular: aro, puntada y el monograma; alrededor, el nombre y la ciudad de business.ts ---------- */

function Sello() {
  const id = useId();
  return (
    <span className="vx-sello" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <path id={`${id}-aro`} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" fill="none" />
        <circle cx="60" cy="60" r="58" className="vx-sello-aro" />
        <circle cx="60" cy="60" r="34" className="vx-sello-puntada" />
        <text className="vx-sello-texto">
          <textPath href={`#${id}-aro`} startOffset="0" textLength="285" lengthAdjust="spacing">
            SERFLOW · {CITY.toUpperCase()} ·
          </textPath>
        </text>
      </svg>
      <Monograma className="vx-sello-mono" />
    </span>
  );
}

export function VisorFinal({ width, datos = EJEMPLO }: { width: W; datos?: Datos }) {
  const desktop = width === 1280;
  const { description, price, stock } = datos;
  const precio = price !== null || stock > 0;
  const [foto, ...resto] = p.cat.tiles;
  const href = `/products/${p.cat.slug}`;
  return (
    <Marco width={width} nuevo current="/products" fab={false}>
      <div className="pf font-body text-ink">
        <main className="pf-v">
          <div className="pf-c">
            <a href={`/products#f-${p.cat.slug}`} className="pf-visor-volver">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Todas las fotos
            </a>
          </div>
          <div className="vx">
            <div className="vx-foto">
              <PhotoCarousel photos={[{ src: foto.img.src, alt: foto.img.alt }]} label={`Fotos de ${p.nombre}`} />
            </div>
            <div className="vx-panel">
              <div className="vx-arriba">
                <div className="pf-visor-nombre">
                  <a href={href} className="pf-pie pf-visor-cat">
                    {p.cat.label}
                  </a>
                  <h1 className="pf-display">{p.nombre}</h1>
                </div>
                <Sello />
              </div>
              {(precio || description) && (
                <div className="vx-datos">
                  {precio && (
                    <p className="vx-precio">
                      {price !== null && <span className="vx-valor">{cop.format(price)}</span>}
                      {stock > 0 && <StatusPill tone="accent">Disponible</StatusPill>}
                    </p>
                  )}
                  {description && <p className="vx-desc">{description}</p>}
                </div>
              )}
              <DeCerca fotos={[foto.img.src]} />
              <Costura />
              <div className="vx-pedir">
                <div className="vx-boton">
                  <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth={!desktop}>
                    Pedir por WhatsApp
                  </Button>
                </div>
                <p className="pf-visor-nota vx-nota">Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo.</p>
              </div>
            </div>
          </div>
          <section id="mas-de" aria-labelledby="mas-de-titulo" className="pf-sec pf-c vx-mas">
            <Cabecera id="mas-de" title={`Más de ${p.cat.label}`} />
            <Masonry tiles={resto.slice(0, desktop ? 12 : 6)} />
            <div className="pf-mas-accion">
              <Button variant="secondary" href={href} fullWidth={!desktop}>
                Ver las {p.count} de {p.cat.label} →
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Marco>
  );
}

export const VisorFinalMobile = () => <VisorFinal width={390} />;
export const VisorFinalDesktop = () => <VisorFinal width={1280} />;
export const VisorFinalSinDatosMobile = () => <VisorFinal width={390} datos={VACIO} />;
export const VisorFinalSinDatosDesktop = () => <VisorFinal width={1280} datos={VACIO} />;
