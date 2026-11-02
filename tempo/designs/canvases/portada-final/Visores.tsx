import { useId, type ReactNode } from "react";
import "./portada.css";
import "./pantallas.css";
import "./visores.css";
import { Button } from "../../../../src/components/ui/Button";
import { Masonry } from "../../../../src/components/ui/Masonry";
import { PhotoCarousel } from "../../../../src/components/ui/PhotoCarousel";
import { ADDRESS, CITY, WHATSAPP_URL } from "../../../../src/lib/business";
import { LOGO } from "../../design-system/app-shell/portada";
import { Marco } from "../refresh-oro-viejo/comun";
import { Cabecera } from "./Portada";
import { CATEGORIAS } from "./Pantallas";

/*
 * PRI-286 · visor de producto, 3 variantes (Said, 2026-11-02: "Más de" vuelve abajo, en su rejilla; el panel se llena
 * con decoración gráfica, nunca con texto o datos inventados).
 * Base común: foto 4:5 en 6 columnas y el panel en las otras 6, con el mismo borde de arriba y de abajo que la foto.
 * Una sola foto (hoy 0 de 92 productos tienen más): el visor es este mismo frame, sin miniaturas.
 * Todo el texto sale de master: la categoría, el nombre, "Pedir por WhatsApp" y su nota, las técnicas de "Qué hacemos"
 * (HomePage.tsx) y la dirección y ciudad de business.ts. El logo es src/assets/LOGO SERFLOW.png (solo su monograma).
 */

type W = 390 | 1280;
type V = "A" | "B" | "C";

const p = { nombre: "Beisbol #49", cat: CATEGORIAS.beisbol, count: 23 };

/** El monograma S del logo real, como silueta del color que diga el CSS (mask del PNG, recortado a la S). */
function Monograma({ className }: { className: string }) {
  return <span aria-hidden="true" className={`vx-mono ${className}`} style={{ maskImage: `url("${LOGO}")`, WebkitMaskImage: `url("${LOGO}")` }} />;
}

/** Costura dorada horizontal que se cose una vez al cargar (la del "enlace que se cose"). */
const Costura = () => <span aria-hidden="true" className="vx-costura" />;

/* ---------- B · íconos lineales de las técnicas (24, trazo 1.5, oro viejo) ---------- */

const ICONOS: Record<string, ReactNode> = {
  // Rasero sobre la malla y la tinta que deja.
  Estampado: (
    <>
      <rect x="5" y="3.5" width="14" height="4.5" rx="1.5" />
      <path d="M9.5 8 8.5 13h7l-1-5" />
      <path d="M3 17h18" />
      <path d="M6.5 20.5h11" />
    </>
  ),
  // La lámina de transferencia con su diseño, despegándose por la esquina.
  DTF: (
    <>
      <path d="M12 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V12" />
      <path d="M20 12l-5.5 2.5L12 20z" />
      <circle cx="9.5" cy="9.5" r="2.5" />
    </>
  ),
  // Aguja con su ojo y el hilo, y una puntada en cruz.
  Bordado: (
    <>
      <path d="M4 20 16.4 7.2a2 2 0 0 1 2.8 2.8z" />
      <path d="M17.3 8.3l.5-.5" />
      <path d="M18.6 7.2c2.2-2 3.8 1.2 1.4 2.8-2.6 1.7-6 .3-8.4 3" />
      <path d="M15 16.5l3.5 3.5M18.5 16.5 15 20" />
    </>
  ),
};

/** Las tres técnicas con su texto tal cual en "Qué hacemos" (src/components/home/HomePage.tsx). */
const TECNICAS = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas." },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados." },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras." },
];

function Tecnicas() {
  return (
    <div className="vx-tec">
      <p className="pf-pie vx-tec-titulo">Qué hacemos</p>
      <ul className="vx-tec-lista">
        {TECNICAS.map((t) => (
          <li key={t.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONOS[t.title]}
            </svg>
            <div>
              <p className="vx-tec-nombre">{t.title}</p>
              <p>{t.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="vx-taller">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
        <span>
          {ADDRESS}
          <br />
          <span className="text-muted">{CITY}</span>
        </span>
      </p>
    </div>
  );
}

/* ---------- A · marco de costura que se cose una vez al cargar (solo escritorio, donde el panel es una caja) ---------- */

function MarcoCostura() {
  const id = useId();
  return (
    <svg aria-hidden="true" className="vx-marco">
      <mask id={`${id}-cose`}>
        <rect className="vx-marco-r vx-marco-trazo" pathLength={1} fill="none" stroke="white" />
      </mask>
      <rect className="vx-marco-r" fill="none" mask={`url(#${id}-cose)`} />
    </svg>
  );
}

/* ---------- C · sello circular: aro, puntada y el monograma; alrededor, el nombre y la ciudad de business.ts ---------- */

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

export function VisorVariante({ width, v }: { width: W; v: V }) {
  const desktop = width === 1280;
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
          <div className={`vx vx-${v}`}>
            <div className="vx-foto">
              <PhotoCarousel photos={[{ src: foto.img.src, alt: foto.img.alt }]} label={`Fotos de ${p.nombre}`} />
            </div>
            <div className="vx-panel">
              {v === "A" && (desktop ? <MarcoCostura /> : null)}
              {v === "A" && <Monograma className="vx-agua" />}
              <div className="vx-arriba">
                <div className="pf-visor-nombre">
                  <a href={href} className="pf-pie pf-visor-cat">
                    {p.cat.label}
                  </a>
                  <h1 className="pf-display">{p.nombre}</h1>
                </div>
                {v === "C" && !desktop && <Sello />}
              </div>
              {v === "B" && <Tecnicas />}
              <div className="vx-pedir">
                {v === "C" && desktop && <Sello />}
                {(v === "C" || (v === "A" && !desktop)) && <Costura />}
                <div className="vx-pedir-fila">
                  <div className="vx-boton">
                    <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth={!desktop}>
                      Pedir por WhatsApp
                    </Button>
                  </div>
                  <p className="pf-visor-nota vx-nota">Se abre WhatsApp con el link de esta foto. Te la hacemos igual o con tu logo.</p>
                </div>
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

export const VisorAMobile = () => <VisorVariante width={390} v="A" />;
export const VisorADesktop = () => <VisorVariante width={1280} v="A" />;
export const VisorBMobile = () => <VisorVariante width={390} v="B" />;
export const VisorBDesktop = () => <VisorVariante width={1280} v="B" />;
export const VisorCMobile = () => <VisorVariante width={390} v="C" />;
export const VisorCDesktop = () => <VisorVariante width={1280} v="C" />;
