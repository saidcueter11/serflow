import type { CSSProperties } from "react";
import { StatusPill } from "../../../../src/components/ui/StatusPill";
import { hastaCorto, type Photo, type PromoDemo } from "./data";

/*
 * Componentes NUEVOS que propone este canvas (PRI-131). Viven aquí porque este run no toca src/;
 * al aprobarse pasan tal cual a src/components/ui/ (React estático, sin hooks, 0 KB de JS) con su
 * defineAsset en el canvas de su familia. Cada uno está marcado "Propuesta" en el canvas.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Propuesta · familia cards. Una promo en /promos (y en la 404 cuando hay promos vigentes).
 * Toda la card es un link al detalle. Foto 4:3 como ProductCard, vigencia en StatusPill accent,
 * título, descripción a 2 líneas y "Ver promo". Sin ends_at no hay píldora. Fluida: el ancho lo pone la lista.
 */
export function PromoCard({ promo, headingLevel = 2 }: { promo: PromoDemo; headingLevel?: 2 | 3 }) {
  const hasta = hastaCorto(promo.endsAt);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <a
      href={`/promos/${promo.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface text-ink no-underline transition-[transform,border-color] duration-(--motion-slow) ease-out hover:-translate-y-1 hover:border-secondary ${FOCUS}`}
    >
      <div className="overflow-hidden">
        <img
          src={promo.cover.src}
          alt={promo.cover.alt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className="fabric reveal-wipe aspect-[4/3] h-auto w-full bg-surface-2 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col items-start gap-2 p-4">
        {hasta && <StatusPill tone="accent">{hasta}</StatusPill>}
        <H className="font-display text-[22px] font-bold leading-tight">{promo.title}</H>
        {promo.description && <p className="line-clamp-2 text-[15px] leading-relaxed text-muted">{promo.description}</p>}
        <span className="mt-auto pt-1 text-[14px] font-semibold text-accent group-hover:underline group-hover:underline-offset-4">
          Ver promo →
        </span>
      </div>
    </a>
  );
}

/**
 * Propuesta · familia media. Fotos de una promo sin huecos, para cualquier cantidad:
 * la primera (portada) siempre a lo ancho en 4:3; las demás de a dos en cuadrado; si sobra una, va a lo ancho al final.
 * 1 → una ancha · 2 → dos anchas · 3 → ancha + par · 4 → ancha + par + ancha · 5 → ancha + 2 pares.
 * Solo la primera es eager (es el LCP del detalle).
 */
export function PromoGallery({ photos }: { photos: Photo[] }) {
  const rest = photos.length - 1;
  return (
    <div className="grid grid-cols-2 gap-2 @4xl:gap-3">
      {photos.map((ph, i) => {
        const wide = i === 0 || (rest % 2 === 1 && i === photos.length - 1);
        return (
          <img
            key={ph.src + i}
            src={ph.src}
            alt={ph.alt}
            width={wide ? 1200 : 600}
            height={wide ? 900 : 600}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding={i === 0 ? "auto" : "async"}
            className={`fabric h-auto w-full rounded-tile border border-line bg-surface-2 object-cover ${wide ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}
          />
        );
      })}
    </div>
  );
}

export type PromoLink = { title: string; href: string };
const SECONDS = 5;

/**
 * Propuesta · cambio a PromoBar (familia motion). Con UNA promo queda igual que hoy: enlaza a su detalle.
 * Con VARIAS, toda la barra es un solo link a /promos: los títulos rotan pero lo que se toca no se mueve
 * ("Ver las 3" fijo a la derecha). Antes cada título rotando era su propio link: un blanco que se mueve.
 */
export function PromoBarPropuesta({ promos }: { promos: PromoLink[] }) {
  const n = promos.length;
  if (n === 0) return null;
  const show = 100 / n;
  const css =
    n > 1
      ? `@keyframes pb-rot-${n} { 0%, ${(show * 0.92).toFixed(2)}% { opacity: 1; transform: none } ${show.toFixed(2)}% { opacity: 0; transform: translateY(-100%) } ${(show + 0.01).toFixed(2)}%, ${(100 - show * 0.08).toFixed(2)}% { opacity: 0; transform: translateY(100%) } 100% { opacity: 1; transform: none } }
.pb-rot { animation: pb-rot-${n} ${n * SECONDS}s linear infinite both; animation-delay: var(--d); }
.promo-bar:hover .pb-rot, .promo-bar:focus-within .pb-rot { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .pb-rot { animation: none; } .pb-rot:not(:first-child) { visibility: hidden; } }`
      : "";
  const href = n > 1 ? "/promos" : promos[0].href;
  return (
    <div className="promo-bar @container overflow-hidden bg-accent font-body text-primary">
      {css && <style>{css}</style>}
      <a
        href={href}
        className="flex min-h-16 items-center gap-3 px-4 py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary @4xl:justify-center @4xl:px-12"
        aria-label={n > 1 ? `Ver las ${n} promos de hoy` : undefined}
      >
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-[.12em] text-accent">
          {n > 1 ? `${n} promos` : "Promo"}
        </span>
        <span className="grid min-w-0 flex-1 @4xl:flex-none" aria-hidden={n > 1 ? true : undefined}>
          {promos.map((p, i) => (
            <span
              key={p.href}
              className={`${n > 1 ? "pb-rot" : ""} col-start-1 row-start-1 line-clamp-2 text-[14px] font-semibold leading-snug @4xl:text-[16px]`}
              style={{ "--d": `${i === 0 ? 0 : i * SECONDS - n * SECONDS}s` } as CSSProperties}
            >
              {p.title}
            </span>
          ))}
        </span>
        <span className="ml-auto shrink-0 text-[14px] font-bold underline underline-offset-4 @4xl:ml-0 @4xl:text-[15px]">
          {n > 1 ? `Ver las ${n}` : "Ver promo"}
        </span>
      </a>
    </div>
  );
}
