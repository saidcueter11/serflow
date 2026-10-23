/// <reference types="vite/client" />
import { BoardPortada } from "../../design-system/app-shell/BoardPortada";
import { CategoryBanner } from "../../../../src/components/ui/CategoryBanner";
import { CatalogPage } from "../../../../src/components/catalog/CatalogPage";
import { PromosPage } from "../../../../src/components/promos/PromosPage";
import { AntesDespues, BANNER, CHIPS, Marco, PROMOS, TILES } from "./comun";
import { PortadaRefresh } from "./propuesta/Portada";
import pzAntes390 from "./capturas/personalizador-antes-390.jpg";
import pzDespues390 from "./capturas/personalizador-despues-390.jpg";
import pzAntes1280 from "./capturas/personalizador-antes-1280.jpg";
import pzDespues1280 from "./capturas/personalizador-despues-1280.jpg";

/* Antes = el componente de producción tal como está en master. Después = el mismo componente con .sf-refresh
   (tokens, fuente y movimientos nuevos); en la portada, además, el orden nuevo (propuesta/Portada.tsx). */

function Catalogo({ width, refresh }: { width: number; refresh?: boolean }) {
  return (
    <Marco width={width} refresh={refresh} current="/products">
      <main className="@container">
        <div className="px-4 pt-4 @3xl:px-12 @3xl:pt-6">
          <CategoryBanner slides={BANNER} current={0} />
        </div>
        <CatalogPage chips={CHIPS} current="/products" label="Todo" tiles={TILES} next={{ href: "/products/2", count: 78 }} />
      </main>
    </Marco>
  );
}

function Promos({ width, refresh }: { width: number; refresh?: boolean }) {
  return (
    <Marco width={width} refresh={refresh}>
      <PromosPage promos={PROMOS} />
    </Marco>
  );
}

const NOTA_PORTADA = (
  <>
    Mismo esqueleto de master con dos cambios: el personalizador sube justo después del hero (la prenda con tu diseño encima, una frase y{" "}
    <b className="text-ink">Diseñar mi prenda</b>) y el mapa baja al final, plegado junto a Quiénes somos. El hero pasa a fotos
    de prendas y del taller, sin modelos. Pasa el mouse por los botones, las fotos y los links del menú; Repetir vuelve a
    mostrar la entrada del titular.
  </>
);

export function PortadaMobile() {
  return <AntesDespues titulo="Portada · 390" nota={NOTA_PORTADA} width={390} antes={<BoardPortada width={390} />} despues={<PortadaRefresh width={390} />} />;
}

export function PortadaDesktop() {
  return <AntesDespues titulo="Portada · 1280" nota={NOTA_PORTADA} width={1280} antes={<BoardPortada width={1280} />} despues={<PortadaRefresh width={1280} />} />;
}

const NOTA_CATALOGO = (
  <>
    Rama de PRI-130 (ya en master con el PR #35). La estructura no cambia: banner, pestañas y muro. Cambia el acabado: las
    fotos del muro están un poco apagadas con el mouse lejos y se acercan a todo color al pasar (en el celular siempre están
    a todo color), las pestañas se hunden al tocarlas y el nombre de la categoría entra al cargar.
  </>
);

export function CatalogoMobile() {
  return <AntesDespues titulo="Catálogo · 390" nota={NOTA_CATALOGO} width={390} antes={<Catalogo width={390} />} despues={<Catalogo width={390} refresh />} />;
}

export function CatalogoDesktop() {
  return <AntesDespues titulo="Catálogo · 1280" nota={NOTA_CATALOGO} width={1280} antes={<Catalogo width={1280} />} despues={<Catalogo width={1280} refresh />} />;
}

const NOTA_PROMOS = (
  <>
    /promos de PRI-131 (en master). Los afiches no cambian de forma: el titular Promos de hoy entra al cargar, la foto de cada
    afiche se acerca al pasar, Pedir por WhatsApp brilla y Ver las fotos se cose.
  </>
);

export function PromosMobile() {
  return <AntesDespues titulo="Promos · 390" nota={NOTA_PROMOS} width={390} antes={<Promos width={390} />} despues={<Promos width={390} refresh />} />;
}

export function PromosDesktop() {
  return <AntesDespues titulo="Promos · 1280" nota={NOTA_PROMOS} width={1280} antes={<Promos width={1280} />} despues={<Promos width={1280} refresh />} />;
}

const NOTA_PERSONALIZADOR = (
  <>
    /personaliza de PRI-122 (PR #36, sin mergear), capturada del deploy preview con la página funcionando. El después es la
    misma página con refresh.css encima: hereda todo por tokens; solo su h1 y los títulos de los pasos pasan a 600, y el h1 entra al cargar. Para pasar el
    mouse, los cuatro frames HTML de la derecha tienen la página (sin JavaScript, así que la vista previa queda cargando).
  </>
);

function Captura({ src, width }: { src: string; width: number }) {
  return <img src={src} alt="" width={width} className="block h-auto" style={{ width }} />;
}

export function PersonalizadorMobile() {
  return (
    <AntesDespues
      titulo="Personalizador · 390"
      nota={NOTA_PERSONALIZADOR}
      width={390}
      detalleAntes="PR #36"
      antes={<Captura src={pzAntes390} width={390} />}
      despues={<Captura src={pzDespues390} width={390} />}
    />
  );
}

export function PersonalizadorDesktop() {
  return (
    <AntesDespues
      titulo="Personalizador · 1280"
      nota={NOTA_PERSONALIZADOR}
      width={1280}
      detalleAntes="PR #36"
      antes={<Captura src={pzAntes1280} width={1280} />}
      despues={<Captura src={pzDespues1280} width={1280} />}
    />
  );
}
