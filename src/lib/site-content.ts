import { supabase } from './supabase'
import { cleanText } from './business-overrides.mjs'
import { filas } from './medios'

// Contenido editable de la portada (PRI-413). Se lee en el build. Lo vacío o inválido se omite y HomePage usa el texto
// del código: un dato malo nunca rompe el build ni se publica. Los límites son los mismos de la migración. Las fotos las
// valida fotoRemota (medios-build.ts) al optimizarlas.

export const SECTION_SLUGS = ['hero', 'personalizador', 'que-hacemos', 'disponible', 'quienes-somos', 'visitanos'] as const
export type SectionSlug = (typeof SECTION_SLUGS)[number]
export type SectionText = { title?: string; description?: string }

export interface HeroSlideRow {
  image_url: string
  alt: string
  position?: string
}
export interface ServiceCardRow {
  title: string
  description: string
  image_url?: string
  image_alt: string
}
export interface ReasonRow {
  title: string
  copy: string
}
export interface SiteContent {
  sections: Partial<Record<SectionSlug, SectionText>>
  heroSlides: HeroSlideRow[]
  services: ServiceCardRow[]
  reasons: ReasonRow[]
}

export const MAX_HERO_SLIDES = 6
export const MIN_SERVICE_CARDS = 2
export const MAX_SERVICE_CARDS = 6
export const MAX_REASONS = 6
type Row = Record<string, unknown>

const byOrder = (rows: Row[]) => [...rows].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))

/** Encuadre de la foto para object-position: "50% 35%". */
export function cleanPosition(value: unknown): string | undefined {
  return typeof value === 'string' && /^(100|\d{1,2})% (100|\d{1,2})%$/.test(value) ? value : undefined
}

export function parseSections(rows: Row[]): SiteContent['sections'] {
  const sections: SiteContent['sections'] = {}
  for (const row of rows) {
    const slug = SECTION_SLUGS.find((s) => s === row.slug)
    if (slug) sections[slug] = { title: cleanText(row.title, 80), description: cleanText(row.description, 400) }
  }
  return sections
}

export function parseHeroSlides(rows: Row[]): HeroSlideRow[] {
  return byOrder(rows)
    .filter((r) => typeof r.image_url === 'string' && r.image_url)
    .slice(0, MAX_HERO_SLIDES)
    .map((r) => ({
      image_url: r.image_url as string,
      alt: cleanText(r.alt, 140) ?? 'Trabajo de Serflow',
      position: cleanPosition(r.object_position),
    }))
}

/** Menos de 2 tarjetas válidas no llenan la rejilla: queda la lista del código. */
export function parseServices(rows: Row[]): ServiceCardRow[] {
  const cards = byOrder(rows).flatMap((r) => {
    const title = cleanText(r.title, 40)
    const description = cleanText(r.description, 140)
    if (!title || !description) return []
    return [{ title, description, image_url: typeof r.image_url === 'string' && r.image_url ? r.image_url : undefined, image_alt: cleanText(r.image_alt, 140) ?? title }]
  })
  return cards.length < MIN_SERVICE_CARDS ? [] : cards.slice(0, MAX_SERVICE_CARDS)
}

export function parseReasons(rows: Row[]): ReasonRow[] {
  return byOrder(rows)
    .flatMap((r) => {
      const title = cleanText(r.title, 40)
      const copy = cleanText(r.description, 140)
      return title && copy ? [{ title, copy }] : []
    })
    .slice(0, MAX_REASONS)
}

async function read(table: string, onlyActive: boolean): Promise<Row[]> {
  const query = supabase.from(table).select('*')
  return filas<Row>(table, await (onlyActive ? query.eq('is_active', true) : query))
}

export async function getSiteContent(): Promise<SiteContent> {
  const [sections, slides, cards, reasons] = await Promise.all([
    read('site_sections', false),
    read('hero_slides', true),
    read('service_cards', true),
    read('about_reasons', true),
  ])
  return {
    sections: parseSections(sections),
    heroSlides: parseHeroSlides(slides),
    services: parseServices(cards),
    reasons: parseReasons(reasons),
  }
}
