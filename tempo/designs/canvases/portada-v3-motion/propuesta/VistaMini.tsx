/// <reference types="vite/client" />
import negra from "../fotos/camiseta-negra.jpg";
import blanca from "../fotos/camiseta-blanca.jpg";
import sol from "../fotos/sol-heroica.svg";

/*
 * PROPUESTA (PRI-286) · Vista previa de muestra para la portada: la misma foto de prenda y el mismo diseño de ejemplo
 * del personalizador (canvas personalizador, PRI-122), quietos. No es el motor del personalizador: es una imagen
 * que avisa qué hay al otro lado. Al construir, foto y diseño salen de los assets del personalizador y llevan
 * view-transition-name="vista-previa" para que crezcan hasta la vista previa de /personaliza (ver Entre páginas).
 *
 * aterriza: el diseño "se posa" sobre la tela. "carga" al cargar la página (arriba del pliegue), "scroll" al entrar
 * en pantalla (más abajo). alterna: la camiseta pasa de negra a blanca y vuelve (solo opción C; pide una foto más).
 */
export function VistaMini({
  className = "",
  aterriza = "carga",
  alterna = false,
  etiqueta = "Vista previa",
  morph = false,
}: {
  className?: string;
  aterriza?: "carga" | "scroll" | "no";
  alterna?: boolean;
  etiqueta?: string;
  /** Solo para la demo de Entre páginas. */
  morph?: boolean;
}) {
  const land = aterriza === "carga" ? "mo-land" : aterriza === "scroll" ? "mo-land-scroll" : "";
  return (
    <div className={`mo-wait fabric relative overflow-hidden bg-surface-2 ${className}`} style={morph ? { viewTransitionName: "vista-previa" } : undefined}>
      <img src={negra} alt="" width={800} height={1000} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {alterna && <img src={blanca} alt="" width={800} height={1000} loading="lazy" decoding="async" className="mo-swap absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute left-1/2 top-[22%] aspect-square w-[44%] max-w-[220px] -translate-x-1/2 rounded-tile border-2 border-dashed border-accent/70 p-[6%]">
        <img src={sol} alt="Diseño de ejemplo, un sol naranja, sobre una camiseta" className={`h-full w-full ${land}`} />
      </div>
      {etiqueta && (
        <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-3 py-1 text-[12px] font-semibold text-ink">{etiqueta}</span>
      )}
    </div>
  );
}
