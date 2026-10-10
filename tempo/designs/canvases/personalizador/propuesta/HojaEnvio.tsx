import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Button } from "../../../../../src/components/ui/Button";
import { whatsappUrl } from "../../../../../src/lib/business";
import type { Diseno } from "../data";
import { Aviso } from "./Campos";
import { IconArchivo, IconCerrar, IconCheck, IconClip, IconCompartir, IconGuardar, IconSinSenal } from "./iconos";

/*
 * PROPUESTA (PRI-122) · Hoja "Revisa y envía" (pantalla B) y su estado al volver de WhatsApp (pantalla C).
 * Va a src/components/ui/HojaEnvio.tsx. Celular: hoja que sube desde abajo. Escritorio: diálogo centrado.
 * Es un <dialog> con foco atrapado; Esc y "Editar mi pedido" cierran sin perder nada.
 */

export type TipoEnvio = "imagen" | "sin-imagen" | "archivo";

interface Props {
  tipo: TipoEnvio;
  mensaje: string;
  /** Miniatura de la vista previa (mockup JPG que arma la página). */
  vistaPrevia?: ReactNode;
  diseno?: Diseno;
  archivo?: { nombre: string; detalle: string };
  guardada?: boolean;
  /** navigator.canShare({ files }) es true: aparece "Compartir las imágenes". */
  compartir?: boolean;
  sinSenal?: boolean;
  escritorio?: boolean;
  /** Pantalla C: el cliente volvió de WhatsApp. */
  vuelta?: boolean;
  alFinal?: boolean;
}

/** El texto tal como lo ve el taller: las *negritas* de WhatsApp se pintan en negrita. */
export function Mensaje({ texto }: { texto: string }) {
  return (
    <div className="rounded-tile border border-line bg-primary p-3.5 text-[14px] leading-[1.5]">
      {texto.split("\n").map((linea, i) => {
        const m = linea.match(/^\*(.+?)\*(.*)$/);
        return (
          <p key={i} className={linea ? "" : "h-2"}>
            {m ? (
              <>
                <strong className="font-semibold text-ink">{m[1]}</strong>
                <span className="text-ink/85">{m[2]}</span>
              </>
            ) : (
              <span className="text-ink/85">{linea}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

function PasoHoja({ n, titulo, children }: { n: number; titulo: ReactNode; children?: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent font-display text-[13px] text-accent">{n}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-0.5">
        <p className="text-[15px] leading-snug">{titulo}</p>
        {children}
      </div>
    </li>
  );
}

function Miniatura({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <figure className="flex w-[88px] flex-col gap-1">
      <div className="h-[110px] overflow-hidden rounded-tile border border-line bg-surface-2">{children}</div>
      <figcaption className="text-[12px] text-muted">{etiqueta}</figcaption>
    </figure>
  );
}

function ThumbDiseno({ diseno }: { diseno: Diseno }) {
  return <img src={diseno.src} alt="Tu diseño" className="h-full w-full object-contain p-2" style={{ imageRendering: diseno.pixelada ? "pixelated" : undefined }} />;
}

function ThumbArchivo({ nombre }: { nombre: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
      <IconArchivo className="size-7 text-muted" />
      <span className="w-full truncate text-[12px] text-muted">{nombre}</span>
    </div>
  );
}

function Marco({ escritorio, titulo, children, cerrar, ancho = 600, alFinal = false }: { escritorio: boolean; titulo: string; children: ReactNode; cerrar: string; ancho?: number; alFinal?: boolean }) {
  const caja = useRef<HTMLDivElement>(null);
  // Solo para el canvas: dibujar la hoja ya desplazada hasta abajo.
  useLayoutEffect(() => {
    if (alFinal && caja.current) caja.current.scrollTop = caja.current.scrollHeight;
  }, [alFinal]);
  return (
    <div className={`absolute inset-0 z-40 flex bg-primary/75 font-body text-ink ${escritorio ? "items-center justify-center p-8" : "items-end"}`}>
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hoja-titulo"
        className={`pz-sheet flex max-h-[92%] w-full flex-col overflow-y-auto border border-line bg-surface shadow-[0_8px_24px_rgba(0,0,0,.5)] ${escritorio ? "rounded-card" : "rounded-t-card border-b-0"}`}
        style={escritorio ? { maxWidth: ancho } : undefined}
      >
        {!escritorio && <span aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-line" />}
        <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-4">
          <h2 id="hoja-titulo" className="font-display text-[24px] font-medium leading-tight">
            {titulo}
          </h2>
          <button
            type="button"
            aria-label={cerrar}
            className="-mr-2 -mt-1 flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <IconCerrar />
          </button>
        </div>
        <div className="flex flex-col gap-5 px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}

export function HojaEnvio({ tipo, mensaje, vistaPrevia, diseno, archivo, guardada = false, compartir = true, sinSenal = false, escritorio = false, vuelta = false, alFinal = false }: Props) {
  const chat = whatsappUrl(mensaje);

  if (vuelta) {
    return (
      <Marco escritorio={escritorio} titulo="¿Ya nos llegó tu pedido?" cerrar="Cerrar">
        <p className="text-[15px] leading-relaxed text-muted">
          {tipo === "sin-imagen"
            ? "Si el mensaje no salió, vuelve al chat y mándalo. Te respondemos por ahí para armar tu diseño."
            : "Si te faltó adjuntar algo, vuelve al chat y mándalo con el clip o el +."}
        </p>
        {tipo !== "sin-imagen" && (
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Va en el chat</p>
            <div className="flex gap-3">
              {tipo === "imagen" && diseno && <Miniatura etiqueta="Tu diseño"><ThumbDiseno diseno={diseno} /></Miniatura>}
              {tipo === "imagen" && vistaPrevia && <Miniatura etiqueta="Vista previa">{vistaPrevia}</Miniatura>}
              {tipo === "archivo" && archivo && <Miniatura etiqueta="Como documento"><ThumbArchivo nombre={archivo.nombre} /></Miniatura>}
            </div>
            {tipo === "imagen" && vistaPrevia && (
              <div>
                <Button variant="ghost" icon={<IconGuardar />}>
                  {escritorio ? "Descargar las imágenes otra vez" : "Guardar las imágenes otra vez"}
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {/* Vuelve al chat sin texto: el pedido ya está escrito allá y no se duplica. */}
          <Button variant="whatsapp" href={whatsappUrl("")} external fullWidth>
            Volver al chat
          </Button>
          <Button variant="secondary" fullWidth>
            Diseñar otra prenda
          </Button>
        </div>
        <p className="text-[13px] leading-snug text-muted">
          Tus elecciones siguen aquí. Si recargas la página, la imagen hay que subirla otra vez: no la guardamos en ningún lado.
        </p>
      </Marco>
    );
  }

  const columna = escritorio && tipo === "imagen" && vistaPrevia;
  // Sin vista previa (no cargó la foto o el cliente siguió sin ella) el paso 1 solo guarda el diseño.
  const conMockup = tipo === "imagen" && !!vistaPrevia;
  const cuerpo = (
    <>
      {sinSenal && <Aviso titulo="Estás sin señal" icono={<IconSinSenal className="mt-0.5 size-5 shrink-0 text-danger" />}>Abre el chat igual: WhatsApp manda el mensaje apenas vuelva.</Aviso>}

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Así le llega a Serflow</p>
        <Mensaje texto={mensaje} />
      </div>

      <ol className="flex flex-col gap-5">
        {tipo === "imagen" && (
          <PasoHoja
            n={1}
            titulo={
              escritorio
                ? conMockup
                  ? "Descarga tu diseño y la vista previa."
                  : "Descarga tu diseño."
                : conMockup
                  ? "Guarda tu diseño y la vista previa en tu celular."
                  : "Guarda tu diseño en tu celular."
            }
          >
            <div className="flex items-center gap-3">
              {vistaPrevia && !escritorio && <div className="h-[72px] w-[58px] shrink-0 overflow-hidden rounded-tile border border-line">{vistaPrevia}</div>}
              {guardada ? (
                <span role="status" className="flex min-h-12 items-center gap-2 text-[15px] font-semibold text-ok">
                  <IconCheck /> {escritorio ? (conMockup ? "Descargadas" : "Descargado") : conMockup ? "Guardadas" : "Guardado"}
                </span>
              ) : (
                <Button variant="secondary" icon={<IconGuardar />}>
                  {escritorio ? (conMockup ? "Descargar imágenes" : "Descargar diseño") : conMockup ? "Guardar imágenes" : "Guardar diseño"}
                </Button>
              )}
            </div>
            {/* Celular: iPhone abre el menú de compartir con las dos imágenes (Guardar imágenes las deja en Fotos);
                Android las descarga directo (quedan en Descargas, que la galería de WhatsApp muestra).
                Guardadas solo cuando esa acción terminó. */}
            {!escritorio && !guardada && <p className="text-[13px] leading-snug text-muted">{conMockup ? "En iPhone se abre un menú: elige Guardar imágenes. En Android se descargan." : "En iPhone se abre un menú: elige Guardar imagen. En Android se descarga."}</p>}
          </PasoHoja>
        )}

        <PasoHoja n={tipo === "imagen" ? 2 : 1} titulo={escritorio ? "Abre el chat con Serflow (WhatsApp Web o la app). El mensaje ya va escrito." : "Abre el chat con Serflow. El mensaje ya va escrito: solo toca enviar."}>
          <Button variant="whatsapp" href={chat} external fullWidth>
            Abrir chat con Serflow
          </Button>
        </PasoHoja>

        {tipo === "imagen" && diseno && (
          <PasoHoja
            n={3}
            titulo={
              <>
                {escritorio ? "En el chat, haz clic en el + (o el clip " : "En el chat, toca el clip "}
                <IconClip className="inline size-4 align-[-2px] text-accent" />
                {escritorio ? ") y adjunta" : " o el + y adjunta"} tu diseño{conMockup ? " y la vista previa" : ""}
                {escritorio ? " desde Descargas." : conMockup ? ": están en Fotos o en Descargas, donde los guardaste." : ": está en Fotos o en Descargas, donde lo guardaste."}
              </>
            }
          >
            <div className="flex gap-3">
              <Miniatura etiqueta="Tu diseño"><ThumbDiseno diseno={diseno} /></Miniatura>
              {vistaPrevia && !escritorio && <Miniatura etiqueta="Vista previa">{vistaPrevia}</Miniatura>}
            </div>
          </PasoHoja>
        )}

        {tipo === "archivo" && archivo && (
          <PasoHoja
            n={2}
            titulo={
              <>
                {escritorio ? "En el chat, haz clic en el + (o el clip " : "En el chat, toca el clip "}
                <IconClip className="inline size-4 align-[-2px] text-accent" />
                {escritorio ? ")" : " o el +"}, elige <strong>Documento</strong> y manda tu archivo.
              </>
            }
          >
            <div className="flex items-center gap-3 rounded-tile border border-line bg-surface-2 p-2.5">
              <IconArchivo className="size-6 shrink-0 text-muted" />
              <span className="min-w-0 truncate text-[14px] font-semibold">{archivo.nombre}</span>
              <span className="ml-auto shrink-0 text-[13px] text-muted">{archivo.detalle}</span>
            </div>
          </PasoHoja>
        )}

        {tipo === "sin-imagen" && (
          <li className="text-[14px] leading-snug text-muted">En el chat te ayudamos a armar el diseño. Si tienes una foto o un dibujo de tu idea, mándalo ahí.</li>
        )}
      </ol>

      {compartir && tipo !== "sin-imagen" && (
        <div className="flex flex-col gap-2.5 border-t border-line pt-4">
          <p className="text-[14px] leading-snug text-muted">
            En vez de los pasos 2 y 3: si ya tienes el chat de Serflow, manda {tipo === "archivo" ? "el archivo" : "las imágenes"} directo desde el menú de tu celular.
          </p>
          <Button variant="secondary" icon={<IconCompartir />}>
            {tipo === "archivo" ? "Compartir archivo" : "Compartir imágenes"}
          </Button>
        </div>
      )}

      <div className="flex justify-center">
        <Button variant="ghost">Editar mi pedido</Button>
      </div>
    </>
  );

  return (
    <Marco escritorio={escritorio} titulo="Revisa y envía" cerrar="Volver a editar" ancho={columna ? 920 : 600} alFinal={alFinal}>
      {columna ? (
        <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-7">
          <figure className="flex flex-col gap-2">
            <div className="aspect-[4/5] overflow-hidden rounded-tile border border-line">{vistaPrevia}</div>
            <figcaption className="text-[13px] text-muted">Esta es la vista previa que descargas y mandas con tu diseño.</figcaption>
          </figure>
          <div className="flex flex-col gap-5">{cuerpo}</div>
        </div>
      ) : (
        cuerpo
      )}
    </Marco>
  );
}
