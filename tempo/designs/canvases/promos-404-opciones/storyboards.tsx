import { PROMO_EQUIPOS, PROMO_GORRAS, PROMO_NINOS, PROMOS_1, PROMOS_3, promoMensaje, withPhotoCount } from "./data";
import { NotFound, PromoDetalle, PromosLista, Shell, type DetalleOpcion, type ListaOpcion, type NotFoundOpcion, type Width } from "./pantallas";

/* Una función sin props por storyboard: el canvas solo acepta componentes sin props. */

function Rotulo({ n, titulo, sub }: { n: string; titulo: string; sub: string }) {
  return (
    <div className="flex w-[1200px] items-end gap-6 border-b-2 border-accent/60 pb-4 font-body text-ink antialiased">
      <span className="font-display text-[64px] font-bold leading-none text-accent">{n}</span>
      <div className="flex flex-col gap-1 pb-1">
        <span className="font-display text-[34px] font-bold leading-none">{titulo}</span>
        <span className="text-[15px] text-muted">{sub}</span>
      </div>
    </div>
  );
}

export const RotuloLista = () => <Rotulo n="2" titulo="/promos" sub="Página nueva: las promos vigentes, en el orden del admin. Una fila por opción." />;
export const RotuloDetalle = () => <Rotulo n="3" titulo="/promos/[slug]" sub="El detalle de una promo. Debajo de la recomendada, sus estados." />;
export const Rotulo404 = () => <Rotulo n="4" titulo="404" sub="La red de seguridad: links mal escritos y promos que ya terminaron." />;
export const RotuloBarra = () => <Rotulo n="1" titulo="Barra de promos y componentes nuevos" sub="La entrada desde la portada y las piezas que se reusan en todo el canvas." />;

const lista = (w: Width, promos = PROMOS_3, opcion: ListaOpcion = "tarjetas") => () => (
  <Shell width={w}>
    <PromosLista promos={promos} opcion={opcion} />
  </Shell>
);

export const ListaAMobile = lista(390);
export const ListaADesktop = lista(1280);
export const ListaA1Mobile = lista(390, PROMOS_1);
export const ListaA0Mobile = lista(390, []);
export const ListaA0Desktop = lista(1280, []);
export const ListaBMobile = lista(390, PROMOS_3, "destacada");
export const ListaBDesktop = lista(1280, PROMOS_3, "destacada");
export const ListaCMobile = lista(390, PROMOS_3, "afiches");
export const ListaCDesktop = lista(1280, PROMOS_3, "afiches");

const detalle = (w: Width, promo = PROMO_GORRAS, otras = [PROMO_EQUIPOS, PROMO_NINOS], opcion: DetalleOpcion = "ficha") => () => (
  <Shell width={w} fabText={promoMensaje(promo)}>
    <PromoDetalle promo={promo} otras={otras} opcion={opcion} />
  </Shell>
);

export const DetalleAMobile = detalle(390, withPhotoCount(PROMO_GORRAS, 5));
export const DetalleADesktop = detalle(1280, withPhotoCount(PROMO_GORRAS, 5));
export const DetalleA1Mobile = detalle(390, withPhotoCount(PROMO_GORRAS, 1));
export const DetalleA2Mobile = detalle(390, PROMO_NINOS, []);
export const DetalleA3Mobile = detalle(390, PROMO_EQUIPOS, [PROMO_GORRAS, PROMO_NINOS]);
export const DetalleA1Desktop = detalle(1280, withPhotoCount(PROMO_GORRAS, 1));
export const DetalleBMobile = detalle(390, PROMO_GORRAS, [PROMO_EQUIPOS, PROMO_NINOS], "afiche");
export const DetalleBDesktop = detalle(1280, PROMO_GORRAS, [PROMO_EQUIPOS, PROMO_NINOS], "afiche");

const nf = (w: Width, opcion: NotFoundOpcion, promos: typeof PROMOS_3 = []) => () => (
  <Shell width={w}>
    <NotFound opcion={opcion} promos={promos} />
  </Shell>
);

export const NF_AMobile = nf(390, "directa");
export const NF_ADesktop = nf(1280, "directa");
export const NF_BMobile = nf(390, "hilo");
export const NF_BDesktop = nf(1280, "hilo");
export const NF_BMobilePromos = nf(390, "hilo", PROMOS_3);
export const NF_BDesktopPromos = nf(1280, "hilo", PROMOS_3);
export const NF_CMobile = nf(390, "salidas");
export const NF_CDesktop = nf(1280, "salidas", PROMOS_3);
