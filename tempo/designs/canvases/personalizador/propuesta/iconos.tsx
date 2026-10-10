/* Íconos de línea del personalizador (Propuesta). Mismo trazo que los de ErrorState: 24px, stroke 1.8. */
import type { ReactNode } from "react";

function I({ children, className = "size-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

type P = { className?: string };
export const IconSubir = (p: P) => <I {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></I>;
export const IconArchivo = (p: P) => <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></I>;
export const IconMenos = (p: P) => <I {...p}><path d="M5 12h14" /></I>;
export const IconMas = (p: P) => <I {...p}><path d="M12 5v14M5 12h14" /></I>;
export const IconCentrar = (p: P) => <I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="3" /></I>;
export const IconCheck = (p: P) => <I {...p}><path d="M5 12.5l4.5 4.5L19 7" /></I>;
export const IconGuardar = (p: P) => <I {...p}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></I>;
export const IconCompartir = (p: P) => <I {...p}><path d="M12 15V3M8 7l4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" /></I>;
export const IconClip = (p: P) => <I {...p}><path d="M20 11.5l-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" /></I>;
export const IconCerrar = (p: P) => <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>;
export const IconInfo = (p: P) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></I>;
export const IconMover = (p: P) => <I {...p}><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" /></I>;
export const IconSinSenal = (p: P) => (
  <I {...p}>
    <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
    <path d="M3 3l18 18" />
  </I>
);

/** Girador de carga: se detiene con prefers-reduced-motion (queda el arco quieto). */
export function Girador({ className = "size-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={`pz-spin ${className}`} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.4" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
export const IconReintentar = (p: P) => <I {...p}><path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" /></I>;
