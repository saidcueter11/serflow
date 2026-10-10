import type { ComponentType } from "react";
import * as R2 from "./boards";

/** Ronda 2, descartada por Said: mismas láminas, atenuadas. Los ids no cambian, así los comentarios siguen pegados. */
const atenuar = (C: ComponentType) => () => (
  <div className="opacity-40 grayscale-[.4]">
    <C />
  </div>
);

export const CapaBDesktop = atenuar(R2.CapaBDesktop);
export const CapaBMobile = atenuar(R2.CapaBMobile);
export const Decisiones = atenuar(R2.Decisiones);
export const EstadosA = atenuar(R2.EstadosA);
export const EstantesCDesktop = atenuar(R2.EstantesCDesktop);
export const EstantesCMobile = atenuar(R2.EstantesCMobile);
export const GaleriaADesktop = atenuar(R2.GaleriaADesktop);
export const GaleriaADesktopCompleta = atenuar(R2.GaleriaADesktopCompleta);
export const GaleriaAMobile = atenuar(R2.GaleriaAMobile);
export const GaleriaAMobileBloque2 = atenuar(R2.GaleriaAMobileBloque2);
export const GaleriaAMobileCargandoMas = atenuar(R2.GaleriaAMobileCargandoMas);
export const GaleriaAMobileCientos = atenuar(R2.GaleriaAMobileCientos);
export const GaleriaAMobileCompleta = atenuar(R2.GaleriaAMobileCompleta);
export const GaleriaAMobileFotoQuitada = atenuar(R2.GaleriaAMobileFotoQuitada);
export const GaleriaAMobileLenta = atenuar(R2.GaleriaAMobileLenta);
export const GaleriaAMobileSinSenal = atenuar(R2.GaleriaAMobileSinSenal);
export const GaleriaAMobileUnaFoto = atenuar(R2.GaleriaAMobileUnaFoto);
export const GaleriaAMobileVacia = atenuar(R2.GaleriaAMobileVacia);
export const GaleriaBDesktop = atenuar(R2.GaleriaBDesktop);
export const GaleriaBMobile = atenuar(R2.GaleriaBMobile);
export const Intro = atenuar(R2.Intro);
export const Mensajes = atenuar(R2.Mensajes);
export const NotaA = atenuar(R2.NotaA);
export const NotaB = atenuar(R2.NotaB);
export const NotaC = atenuar(R2.NotaC);
export const Recomendacion = atenuar(R2.Recomendacion);
export const SeccionEstados = atenuar(R2.SeccionEstados);
export const SeccionOpciones = atenuar(R2.SeccionOpciones);
export const VisorADesktop = atenuar(R2.VisorADesktop);
export const VisorADesktopCompleta = atenuar(R2.VisorADesktopCompleta);
export const VisorAMobile = atenuar(R2.VisorAMobile);
export const VisorAMobileCargando = atenuar(R2.VisorAMobileCargando);
export const VisorAMobileCompleta = atenuar(R2.VisorAMobileCompleta);
export const VisorAMobileDescripcion = atenuar(R2.VisorAMobileDescripcion);
export const VisorAMobilePrimera = atenuar(R2.VisorAMobilePrimera);
export const VisorAMobileUnaFoto = atenuar(R2.VisorAMobileUnaFoto);
