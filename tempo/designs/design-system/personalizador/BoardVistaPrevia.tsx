import { useEffect, useState, type ReactNode } from "react";
import { VistaPrevia, type ModoVista } from "../../../../src/components/ui/VistaPrevia";
import { PRENDAS, fotoDe, type Prenda, type Tecnica } from "../../../../src/lib/personaliza/datos";
import { LUGAR_GORRA, LUGAR_INICIAL, escalaMax, limitar } from "../../../../src/lib/personaliza/lugar";
import { cargarFoto, prepararDiseno, type FotoLista } from "../../../../src/lib/personaliza/motor";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { COLORES } from "./colores";
import sol from "./sol-heroica.svg";

// Prop wrapper: prepara la foto y el diseño de muestra con el motor real y se los pasa a VistaPrevia.
function Vista({ prenda = "camiseta", color = "negra", ubicacion, tecnica = "estampado", modo, diseno = true, seleccionado, alto = 320 }: {
  prenda?: Prenda; color?: string; ubicacion?: string; tecnica?: Tecnica; modo: ModoVista; diseno?: boolean; seleccionado?: boolean; alto?: number;
}) {
  const c = COLORES[prenda].find((x) => x.id === color)!;
  const ub = ubicacion ?? PRENDAS[prenda].ubicaciones[0].nombre;
  const info = fotoDe(c, prenda, ub)!;
  const [foto, setFoto] = useState<FotoLista | null>(null);
  const [tratado, setTratado] = useState<HTMLCanvasElement | null>(null);
  const maxS = escalaMax(prenda, tecnica, info.print_width_cm);
  const [lugar, setLugar] = useState(() => limitar(prenda === "gorra" ? LUGAR_GORRA : LUGAR_INICIAL, 1, info.print_area, maxS));
  useEffect(() => void cargarFoto(info.image_url, info.print_area, PRENDAS[prenda].curva).then(setFoto), [info.image_url]);
  useEffect(() => {
    if (!diseno) return;
    const img = new Image();
    img.onload = () => {
      const t = document.createElement("canvas");
      t.width = t.height = 1024;
      t.getContext("2d")!.drawImage(img, 0, 0, 1024, 1024);
      setTratado(prepararDiseno(t, tecnica));
    };
    img.src = sol;
  }, [diseno, tecnica]);
  const nombre = `${PRENDAS[prenda].nombre} ${c.name.toLowerCase()}`;
  return (
    <div className="w-[358px]">
      <VistaPrevia
        foto={modo === "sin-senal" ? null : foto}
        etiqueta={`${nombre}${ub === "Espalda" ? ", espalda" : ""}`}
        modo={modo}
        tecnica={tecnica}
        diseno={tratado}
        lugar={lugar}
        onLugar={setLugar}
        maxS={maxS}
        anchoCm={info.print_width_cm}
        archivo={modo === "archivo" ? { nombre: "foto-equipo.jpg" } : undefined}
        cargando={`Cargando la ${nombre.toLowerCase()}…`}
        alto={alto}
        pista
        seleccionado={seleccionado}
      />
    </div>
  );
}

function Caso({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      {children}
    </div>
  );
}

export function BoardVistaPrevia() {
  return (
    <PageFrame family="personalizador" width={1400}>
      <PageTitle
        title="VistaPrevia"
        description={
          <>
            La foto de la prenda con el diseño encima, pintada por el motor canvas 2D (<Code>src/lib/personaliza/motor.ts</Code>): lo que se ve es
            lo que se descarga como mockup. Manijas y botones van en HTML encima y no salen en el mockup. Fija arriba en celular (320 px)
            y a la izquierda en escritorio (500 px).
          </>
        }
      />
      <Row name="Flujo" description="Sin diseño, tocar la prenda abre el selector. Con diseño, tocarlo lo selecciona: arrastrar mueve libre por la foto, pellizcar o las manijas escalan, − + Centrar como alternativa. Sin recuadro ni guías fijas.">
        <div className="flex flex-wrap gap-6">
          <Caso label='modo="vacio"'><Vista modo="vacio" diseno={false} /></Caso>
          <Caso label='modo="listo"'><Vista modo="listo" /></Caso>
          <Caso label="listo · seleccionado"><Vista modo="listo" seleccionado /></Caso>
        </div>
      </Row>
      <Row name="Técnicas y prendas" description="El mismo diseño con cada técnica. Cada color y vista es una foto real distinta, con su propia área.">
        <div className="flex flex-wrap gap-6">
          <Caso label="Estampado · blanca"><Vista modo="listo" color="blanca" /></Caso>
          <Caso label="Bordado · blanca"><Vista modo="listo" color="blanca" tecnica="bordado" /></Caso>
          <Caso label="Espalda · negra"><Vista modo="listo" ubicacion="Espalda" /></Caso>
          <Caso label="Gorra · bordado"><Vista modo="listo" prenda="gorra" tecnica="bordado" /></Caso>
          <Caso label="Gorra blanca · estampado"><Vista modo="listo" prenda="gorra" color="blanca" /></Caso>
        </div>
      </Row>
      <Row name="Estados" description="Preparando hace esperar el envío como mucho 5 s; después, Seguir sin vista previa. Sin señal: Reintentar pide solo la foto.">
        <div className="flex flex-wrap gap-6">
          <Caso label='modo="procesando"'><Vista modo="procesando" /></Caso>
          <Caso label='modo="lento"'><Vista modo="lento" /></Caso>
          <Caso label='modo="archivo"'><Vista modo="archivo" diseno={false} /></Caso>
          <Caso label='modo="cargando"'><Vista modo="cargando" color="blanca" /></Caso>
          <Caso label='modo="sin-senal"'><Vista modo="sin-senal" color="blanca" /></Caso>
        </div>
      </Row>
    </PageFrame>
  );
}
