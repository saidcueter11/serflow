import { PROMO_EQUIPOS, PROMO_GORRAS, PROMO_NINOS, PROMOS_1, PROMOS_3, promoMensaje, withPhotoCount } from "./data";
import { NotFound, PromoDetalle, PromosLista, Shell, type DetalleOpcion, type ListaOpcion, type NotFoundOpcion, type Width } from "./pantallas";

/* Una función sin props por storyboard: el canvas solo acepta componentes sin props. */

function Rotulo({ n, titulo, sub }: { n?: string; titulo: string; sub: string }) {
  return (
    <div className="flex w-[1200px] items-end gap-6 border-b-2 border-accent/60 pb-4 font-body text-ink antialiased">
      {n && <span className="font-display text-[64px] font-bold leading-none text-accent">{n}</span>}
      <div className="flex flex-col gap-1 pb-1">
        <span className="font-display text-[34px] font-bold leading-none">{titulo}</span>
        <span className="text-[15px] text-muted">{sub}</span>
      </div>
    </div>
  );
}

export const RotuloFinal = () => <Rotulo titulo="Final aprobada" sub="Lo que eligió Said, ya ajustado: /promos C, detalle B y 404 C, en 390 y 1280 con sus estados." />;
export const RotuloDescartadas = () => <Rotulo titulo="Descartadas" sub="Las opciones que no se eligieron, tal como se presentaron. Quedan como referencia; no se construyen." />;

const lista = (w: Width, promos = PROMOS_3, opcion: ListaOpcion = "tarjetas") => () => (
  <Shell width={w}>
    <PromosLista promos={promos} opcion={opcion} />
  </Shell>
);

export const ListaAMobile = lista(390);
export const ListaADesktop = lista(1280);
export const ListaBMobile = lista(390, PROMOS_3, "destacada");
export const ListaBDesktop = lista(1280, PROMOS_3, "destacada");

const detalle = (w: Width, promo = PROMO_GORRAS, otras = [PROMO_EQUIPOS, PROMO_NINOS], opcion: DetalleOpcion = "ficha") => () => (
  <Shell width={w} fabText={promoMensaje(promo)}>
    <PromoDetalle promo={promo} otras={otras} opcion={opcion} />
  </Shell>
);

export const DetalleAMobile = detalle(390, withPhotoCount(PROMO_GORRAS, 5));
export const DetalleADesktop = detalle(1280, withPhotoCount(PROMO_GORRAS, 5));

const nf = (w: Width, opcion: NotFoundOpcion, promos: typeof PROMOS_3 = []) => () => (
  <Shell width={w}>
    <NotFound opcion={opcion} promos={promos} />
  </Shell>
);

export const NF_AMobile = nf(390, "directa");
export const NF_ADesktop = nf(1280, "directa");
export const NF_BMobile = nf(390, "hilo");
export const NF_BDesktop = nf(1280, "hilo");

/* ---------------- Final aprobada: lista C, detalle B, 404 C ---------------- */

export const FinalLista3Mobile = lista(390, PROMOS_3, "afiches");
export const FinalLista3Desktop = lista(1280, PROMOS_3, "afiches");
export const FinalLista1Mobile = lista(390, PROMOS_1, "afiches");
export const FinalLista1Desktop = lista(1280, PROMOS_1, "afiches");
export const FinalLista0Mobile = lista(390, [], "afiches");
export const FinalLista0Desktop = lista(1280, [], "afiches");

export const FinalDetalle5Mobile = detalle(390, withPhotoCount(PROMO_GORRAS, 5), [PROMO_EQUIPOS, PROMO_NINOS], "afiche");
export const FinalDetalle5Desktop = detalle(1280, withPhotoCount(PROMO_GORRAS, 5), [PROMO_EQUIPOS, PROMO_NINOS], "afiche");
export const FinalDetalle3Mobile = detalle(390, PROMO_EQUIPOS, [PROMO_GORRAS], "afiche");
export const FinalDetalle3Desktop = detalle(1280, PROMO_EQUIPOS, [PROMO_GORRAS], "afiche");
export const FinalDetalle1Mobile = detalle(390, withPhotoCount(PROMO_GORRAS, 1), [], "afiche");
export const FinalDetalle1Desktop = detalle(1280, withPhotoCount(PROMO_GORRAS, 1), [], "afiche");

export const Final404Mobile = nf(390, "salidas");
export const Final404Desktop = nf(1280, "salidas");
export const Final404PromosMobile = nf(390, "salidas", PROMOS_3);
export const Final404PromosDesktop = nf(1280, "salidas", PROMOS_3);
