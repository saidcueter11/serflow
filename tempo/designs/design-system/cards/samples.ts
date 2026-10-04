/*
 * Fotos de ejemplo para el canvas de Cards. No hay fotos reales de productos ni de
 * trabajos en el repo todavía: son siluetas SVG en data URI (pocos bytes, como la
 * referencia Noche caribe). En el sitio se reemplazan por fotos reales del cliente.
 */
const BG = "#2a271c";
const STROKE = "rgba(0,0,0,.35)";
const MARK = "#FFD700";

function svg(w: number, h: number, body: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${BG}"/>${body}</svg>`,
  )}`;
}

function shirt(x: number, y: number, s: number, color: string) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M30 10 L48 4 Q60 14 72 4 L90 10 L106 34 L89 43 L86 37 L86 112 L34 112 L34 37 L31 43 L14 34 Z" fill="${color}" stroke="${STROKE}" stroke-width="1.5"/><rect x="44" y="34" width="32" height="34" rx="3" fill="none" stroke="${MARK}" stroke-width="1.5" stroke-dasharray="4 3"/></g>`;
}

function cap(x: number, y: number, s: number, color: string) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M18 66 Q18 22 62 18 Q104 22 106 66 Z" fill="${color}" stroke="${STROKE}" stroke-width="1.5"/><path d="M62 66 Q104 62 126 74 Q96 84 60 76 Z" fill="${color}" stroke="${STROKE}" stroke-width="1.5"/><rect x="44" y="34" width="34" height="20" rx="3" fill="none" stroke="${MARK}" stroke-width="1.5" stroke-dasharray="4 3"/></g>`;
}

/* 4:3, para ProductCard */
export const SHIRT_WHITE = svg(400, 300, shirt(128, 80, 1.2, "#F4F1E6"));
export const SHIRT_BLACK = svg(400, 300, shirt(128, 80, 1.2, "#111"));
export const SHIRT_RED = svg(400, 300, shirt(128, 80, 1.2, "#7a1f2b"));
export const CAP_NAVY = svg(400, 300, cap(96, 78, 1.6, "#1f3a5f"));
export const CAP_GREEN = svg(400, 300, cap(96, 78, 1.6, "#3f5a3a"));

/* 4:5, para WorkCard */
export const WORK_CAPS = svg(400, 500, cap(40, 70, 1.6, "#1f3a5f") + cap(150, 260, 1.6, "#1f3a5f"));
export const WORK_SHIRTS = svg(400, 500, shirt(30, 120, 1.5, "#F4F1E6") + shirt(190, 200, 1.5, "#F4F1E6"));
export const WORK_DTF = svg(400, 500, shirt(70, 110, 2.2, "#111"));
export const WORK_POLO = svg(400, 500, shirt(70, 110, 2.2, "#3f5a3a"));
