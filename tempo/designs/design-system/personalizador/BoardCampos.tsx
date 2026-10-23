import type { ReactNode } from "react";
import { Aviso, BarraEnvio, CampoDiseno, Colores, Grupo, Nota, Paso, Tecnicas } from "../../../../src/components/ui/PersonalizaCampos";
import { Code, PageFrame, PageTitle, Row } from "../Chrome";
import { COLORES } from "./colores";
import sol from "./sol-heroica.svg";

// Cómo se ve la lista cuando el admin suma colores (los extra no tienen foto: solo muestran el círculo).
const DIEZ = [
  ...COLORES.camiseta,
  { id: "azul-oscuro", name: "Azul oscuro", hex: "#1c2a4a" },
  { id: "roja", name: "Roja", hex: "#c62a2f" },
  { id: "vinotinto", name: "Vinotinto", hex: "#6b1f2c" },
  { id: "amarilla", name: "Amarilla", hex: "#f2c230" },
  { id: "verde", name: "Verde", hex: "#2f7a4a" },
  { id: "beige", name: "Beige", hex: "#d9c8a5" },
];

// Cada grupo de radios va en su propio <form> para que los name no se crucen entre ejemplos.
function Celular({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[12px] text-muted">{label}</div>
      <form className="flex w-[358px] flex-col gap-4 bg-primary">{children}</form>
    </div>
  );
}

export function BoardCampos() {
  return (
    <PageFrame family="personalizador" width={1300}>
      <PageTitle
        title="Campos del pedido"
        description={
          <>
            Piezas del formulario de <Code>/personaliza</Code> en <Code>src/components/ui/PersonalizaCampos.tsx</Code>. Controles nativos (radio,
            checkbox, file, textarea): <Code>Colores</Code> y <Code>Tecnicas</Code> son radios sin controlar que la página lee con el onChange de su
            form.
          </>
        }
      />
      <Row name="Paso y Grupo" description="El círculo numerado de la portada y el fieldset con legend; valor muestra lo elegido.">
        <div className="flex flex-wrap gap-8">
          <Celular label="Paso">
            <Paso n={2} titulo="Elige color y técnica">
              <Grupo legend="Color" valor="Negra">
                <Colores colores={COLORES.camiseta} elegido="negra" />
              </Grupo>
            </Paso>
          </Celular>
          <Celular label="Grupo con nota">
            <Grupo legend="Cantidad" nota="Las tallas van en la nota o en el chat.">
              <p className="text-[15px]">Chips de cantidad</p>
            </Grupo>
          </Celular>
        </div>
      </Row>
      <Row name="CampoDiseno" description="Paso 1. Con fondo plano detectado aparece Quitar el fondo (encendido). Los avisos no bloquean.">
        <div className="flex flex-wrap gap-8">
          <Celular label='estado="ninguno"'><CampoDiseno estado="ninguno" /></Celular>
          <Celular label='estado="imagen" · quitar fondo'><CampoDiseno estado="imagen" nombre="logo-heroica.png" detalle="PNG · 1200 × 1200 px" miniatura={sol} quitarFondo /></Celular>
          <Celular label='estado="procesando"'><CampoDiseno estado="procesando" nombre="logo-heroica.png" /></Celular>
          <Celular label='estado="baja"'><CampoDiseno estado="baja" nombre="logo-whatsapp.jpg" detalle="JPG · 48 × 48 px" miniatura={sol} /></Celular>
          <Celular label='estado="pesada"'><CampoDiseno estado="pesada" nombre="foto-equipo.jpg" detalle="JPG · 24 MB" /></Celular>
          <Celular label='estado="archivo"'><CampoDiseno estado="archivo" nombre="logo-final.pdf" detalle="PDF · 2,4 MB" /></Celular>
          <Celular label='estado="ayuda"'><CampoDiseno estado="ayuda" /></Celular>
          <Celular label="escritorio"><CampoDiseno estado="ninguno" escritorio /></Celular>
        </div>
      </Row>
      <Row name="Colores" description="La lista la arma el admin y crece sola: 4 en una fila, 10 en dos. Mientras carga la foto del elegido, girador.">
        <div className="flex flex-wrap gap-8">
          <Celular label="4 · camiseta"><Colores colores={COLORES.camiseta} elegido="negra" /></Celular>
          <Celular label="cargando"><Colores colores={COLORES.gorra} elegido="blanca" cargando="blanca" /></Celular>
          <Celular label="10"><Colores colores={DIEZ} elegido="roja" /></Celular>
        </div>
      </Row>
      <Row name="Tecnicas" description="Tarjetas con pista y muestra. Con una sola técnica (gorra) no hay selector.">
        <div className="flex flex-wrap gap-8">
          <Celular label="camiseta"><Tecnicas opciones={["estampado", "dtf", "bordado"]} elegida="estampado" /></Celular>
          <Celular label="gorra"><Tecnicas opciones={["bordado"]} elegida="bordado" /></Celular>
        </div>
      </Row>
      <Row name="Nota y Aviso" description="Nota opcional de 300 caracteres. Aviso neutro: no es un error.">
        <div className="flex flex-wrap gap-8">
          <Celular label="Nota"><Nota valor="El logo en dorado, tallas M y L" /></Celular>
          <Celular label="Aviso">
            <Aviso titulo="Tu imagen es pequeña">Puede verse pixelada en la prenda. Si tienes una más grande, súbela; si no, igual la revisamos en el taller.</Aviso>
          </Celular>
        </div>
      </Row>
      <Row name="BarraEnvio" description="Celular: barra fija abajo, reemplaza al WhatsAppFab. Escritorio: tarjeta al final del panel. Abre la hoja, no WhatsApp directo.">
        <div className="flex flex-wrap gap-8">
          <Celular label="fija"><BarraEnvio resumen="Camiseta negra · Estampado · Pecho · 1 unidad" /></Celular>
          <Celular label="esperando"><BarraEnvio resumen="Camiseta negra · Estampado · Pecho · 1 unidad" esperando /></Celular>
          <Celular label="escritorio · sin vista"><BarraEnvio resumen="Gorra negra · Bordado · Frente · 1 unidad" fija={false} conVista={false} /></Celular>
        </div>
      </Row>
    </PageFrame>
  );
}
