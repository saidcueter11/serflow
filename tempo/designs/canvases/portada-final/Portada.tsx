/// <reference types="vite/client" />
import "./portada.css";
import { Button } from "../../../../src/components/ui/Button";
import { HeroCarousel, type Slide } from "../../../../src/components/ui/HeroCarousel";
import { MapCard } from "../../../../src/components/ui/MapCard";
import { ProductCard } from "../../../../src/components/ui/ProductCard";
import { ServiceCard } from "../../../../src/components/ui/ServiceCard";
import { PinIcon } from "../../../../src/components/icons/PinIcon";
import { WHATSAPP_URL } from "../../../../src/lib/business";
import { Marco } from "../refresh-oro-viejo/comun";
import estampadoProceso from "../../../../src/assets/images/stock/estampado-proceso.jpg";
import gorrasEstante from "../../../../src/assets/images/stock/gorras-estante.jpg";
import estampadoRasero from "../../../../src/assets/images/stock/estampado-rasero.jpg";
import camisetaDtf from "../../../../src/assets/images/stock/camiseta-dtf.jpg";
import gorraBordada2 from "../../../../src/assets/images/stock/gorra-bordada-2.jpg";
import mtq2 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida2.webp";
import mtq3 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida3.webp";
import mtq4 from "../../../../src/assets/images/miTierraQuerida/miTierraQuerida4.webp";
import gorraDama from "./fotos/gorra-dama.jpg";

/*
 * PROPUESTA de la portada (PRI-286). Todo el texto sale de master (src/pages/index.astro, HomePage.tsx, business.ts)
 * o del catálogo real; al construir, va en src/components/home/HomePage.tsx con las clases de portada.css.
 * Sin barra de promos: hoy no hay promos activas (PromoBar no se pinta con 0). Sin Ticker, sin hilo, sin "Nuevo".
 */

/** Hero sin modelos: una sola foto, la del taller (con una, HeroCarousel no pinta etiqueta que rote ni barras). */
const SLIDES: Slide[] = [
  { src: estampadoProceso, caption: "Estampado en el taller", alt: "Manos pasando el rasero sobre una plancha de estampado", position: "50% 60%" },
];

const SERVICES = [
  { title: "Estampado", description: "Mate, toma la textura de la tela. Ideal para camisetas.", src: estampadoRasero },
  { title: "DTF", description: "Colores vivos y con brillo. Fotos y degradados.", src: camisetaDtf },
  { title: "Bordado", description: "Hilo con relieve. El clásico de las gorras.", src: gorraBordada2 },
];

/** Las 4 primeras prendas activas del catálogo hoy (orden sort_order), sin el producto de prueba "Pruéba". */
const PRODUCTS = [
  { name: "Mi Tierra Querida #1", meta: "Mi Tierra Querida", href: "/products/mi-tierra-querida", src: mtq2 },
  { name: "Gorra dama", meta: "Moda", href: "/products/moda", src: gorraDama },
  { name: "Mi Tierra Querida #2", meta: "Mi Tierra Querida", href: "/products/mi-tierra-querida", src: mtq3 },
  { name: "Mi Tierra Querida #3", meta: "Mi Tierra Querida", href: "/products/mi-tierra-querida", src: mtq4 },
];
const CATALOG_HREF = "/products/mi-tierra-querida";

const PASOS = ["Sube tu diseño o una foto", "Elige prenda, color y técnica", "Mándanoslo por WhatsApp"];

const RAZONES = [
  { title: "A tu gusto", copy: "Cada prenda sale de tu idea. Nada genérico." },
  { title: "Acabados que duran", copy: "Bordado y estampado con materiales de calidad." },
  { title: "Atención directa", copy: "Te asesoramos por WhatsApp, sin vueltas." },
];

function Cabecera({ id, title, description, action }: { id: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="pf-head">
      <div>
        <h2 id={`${id}-titulo`} className="pf-h2 sf-entra-scroll">
          {title}
        </h2>
        {description && <p className="pf-lead">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Portada({ width }: { width: 390 | 1280 }) {
  const desktop = width === 1280;
  const verTodo = (
    <Button variant="secondary" href={CATALOG_HREF} fullWidth={!desktop}>
      Ver todo →
    </Button>
  );
  return (
    <Marco width={width} nuevo>
      <div className="pf font-body text-ink">
        <main className="pf-v">
          <HeroCarousel slides={SLIDES} className="pf-hero">
            <div className="pf-hero-texto anim-enter">
              <span className="pf-pie flex items-center gap-1.5">
                <PinIcon className="size-3.5" /> Mercado Bazurto · Cartagena
              </span>
              <h1 className="pf-display sf-lineas">
                <span>
                  <span>Bienvenido</span>
                </span>
                <span>
                  <span>a Serflow</span>
                </span>
              </h1>
              <p className="pf-lead">Camisetas y gorras con tu logo, tu equipo o tu idea. Estampado, DTF y bordado hechos en nuestro taller.</p>
              <div>
                <Button variant="whatsapp" href={WHATSAPP_URL} external fullWidth={!desktop}>
                  Escríbenos por WhatsApp
                </Button>
              </div>
            </div>
          </HeroCarousel>

          <section aria-labelledby="personaliza-titulo" className="pf-sec pf-c">
            <div className="pf-grid">
              <div className="pf-pz-texto">
                <h2 id="personaliza-titulo" className="pf-h2 sf-entra-scroll">
                  Diseña la tuya
                </h2>
                <p className="pf-lead">Sube tu diseño, míralo sobre la camiseta o la gorra y mándanoslo listo para hacerlo.</p>
                {!desktop && <Foto />}
                <ol className="pf-pasos">
                  {PASOS.map((p, i) => (
                    <li key={p}>
                      <span>{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ol>
                <div>
                  <Button variant="whatsapp" href="/personaliza" icon={null} fullWidth={!desktop}>
                    Diseñar mi prenda
                  </Button>
                </div>
              </div>
              {desktop && <Foto />}
            </div>
          </section>

          <section id="que-hacemos" aria-labelledby="que-hacemos-titulo" className="pf-sec pf-c">
            <Cabecera id="que-hacemos" title="Qué hacemos" description="Camisetas y gorras, con la técnica que mejor le quede a tu diseño." />
            <div className="pf-servicios">
              {SERVICES.map((s) => (
                <ServiceCard key={s.title} title={s.title} description={s.description} image={{ src: s.src, alt: s.title }} />
              ))}
            </div>
          </section>

          <section id="disponible" aria-labelledby="disponible-titulo" className="pf-sec pf-c">
            <Cabecera id="disponible" title="Disponible ahora" description="Lo que hay en el taller esta semana." action={desktop ? verTodo : undefined} />
            <div className="pf-prendas">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.name} name={p.name} meta={p.meta} href={p.href} image={{ src: p.src, alt: p.name }} />
              ))}
            </div>
            {!desktop && <div>{verTodo}</div>}
          </section>

          <section id="quienes-somos" aria-labelledby="quienes-somos-titulo" className="pf-sec pf-c">
            <div className="pf-grid">
              <div className="pf-quienes">
                <h2 id="quienes-somos-titulo" className="pf-h2 sf-entra-scroll">
                  Quiénes somos
                </h2>
                <p className="pf-lead">
                  Somos un taller en <span className="text-ink">Cartagena</span> que hace prendas personalizadas. La ropa no solo se usa,{" "}
                  <span className="text-ink">se vive</span>: por eso cada pieza lleva algo tuyo.
                </p>
                <ul className="pf-razones">
                  {RAZONES.map((r) => (
                    <li key={r.title}>
                      <h3>{r.title}</h3>
                      <p>{r.copy}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {/* #visitanos sigue siendo el ancla del menú y del footer. Mapa plegado: el de Google solo al tocar. */}
              <div id="visitanos" className="pf-visita scroll-mt-4">
                {!desktop && <h2 className="pf-h2 sf-entra-scroll">Visítanos</h2>}
                <MapCard title={desktop ? "Visítanos" : undefined} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </Marco>
  );
}

/**
 * Foto del personalizador: gorras personalizadas en el estante del taller (horizontal, cabe entera en la columna).
 * Master usaba la de Mi Tierra Querida #1, que se repetía en Disponible ahora. Sin el recuadro punteado ni "Vista previa".
 */
function Foto() {
  return (
    <div className="pf-pz-foto sf-foto">
      <img src={gorrasEstante} alt="Gorras personalizadas en un estante del taller" width={1200} height={900} loading="lazy" decoding="async" />
    </div>
  );
}

export const PortadaMobile = () => <Portada width={390} />;
export const PortadaDesktop = () => <Portada width={1280} />;
