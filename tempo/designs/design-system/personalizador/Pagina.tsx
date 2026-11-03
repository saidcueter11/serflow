import { PersonalizaPage } from "../../../../src/components/personaliza/PersonalizaPage";
import { COLORES } from "./colores";

// La isla de /personaliza tal cual, con las fotos de muestra. Se puede tocar: subir un archivo, elegir y enviar.
export function PaginaCelular() {
  return (
    <div className="w-[390px]">
      <PersonalizaPage colores={COLORES} />
    </div>
  );
}

export function PaginaEscritorio() {
  return (
    <div className="w-[1280px]">
      <PersonalizaPage colores={COLORES} />
    </div>
  );
}
