import { BoardPortadaDesktop } from "../../design-system/app-shell/BoardPortada";

// Portada (PRI-129): con 2 promos activas en el admin, la barra dorada rota entre ellas.
export default function DesktopConPromos() {
  return <BoardPortadaDesktop estado="promos" />;
}
