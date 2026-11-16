// PRI-525: lo del SEO que no sale de una página: el lastmod del sitemap y los 301 de las URLs viejas de las fotos.
// Es .mjs porque lo importa astro.config.mjs, como business-overrides.mjs.

const SLUG = /^[a-z0-9][a-z0-9-]*$/
const READ_TIMEOUT_MS = 8000

/** Ruta sin "/" final ni /pagina/N: la clave con que el sitemap busca su lastmod. */
export const rutaBase = (url) => new URL(url, 'https://x').pathname.replace(/\/pagina\/\d+\/?$/, '').replace(/\/$/, '') || '/'

/**
 * Ruta -> updated_at más reciente de lo que muestra (ISO). Una categoría cambia cuando cambia ella o una de sus fotos;
 * "Todo" y /promos, cuando cambia cualquiera. La portada no: también la cambian textos que no tienen fecha.
 * @param {{ slug: string, updated_at: string, categories: { slug: string, updated_at: string } }[]} products
 * @param {{ slug: string, updated_at: string }[]} promos
 */
export function lastmodPorRuta(products, promos) {
  const m = new Map()
  const poner = (ruta, fecha) => {
    const iso = fecha && new Date(fecha).toISOString()
    if (iso && !(m.get(ruta) >= iso)) m.set(ruta, iso)
  }
  for (const p of products) {
    const cat = p.categories
    poner(`/catalogo/${cat.slug}/${p.slug}`, p.updated_at)
    for (const ruta of [`/catalogo/${cat.slug}`, '/catalogo']) {
      poner(ruta, p.updated_at)
      poner(ruta, cat.updated_at)
    }
  }
  for (const p of promos) {
    poner(`/promos/${p.slug}`, p.updated_at)
    poner('/promos', p.updated_at)
  }
  return m
}

/**
 * Líneas de _redirects: cada URL vieja de una foto (product_slug_redirects) con 301 a la actual. Solo slugs con el formato
 * de la base: el texto va tal cual a un archivo de reglas de Netlify.
 * @param {{ category_slug: string, slug: string, products?: { slug: string, categories?: { slug: string } } }[]} rows
 */
export function lineasRedirect(rows) {
  return rows.flatMap((r) => {
    const cat = r.products?.categories?.slug
    const slug = r.products?.slug
    if (![r.category_slug, r.slug, cat, slug].every((s) => typeof s === 'string' && SLUG.test(s))) return []
    if (r.category_slug === cat && r.slug === slug) return []
    return [`/catalogo/${r.category_slug}/${r.slug}  /catalogo/${cat}/${slug}/  301`]
  })
}

async function leer(supabaseUrl, anonKey, path) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  })
  const body = await res.json()
  if (res.ok) return body
  // Tabla sin migrar (CI y deploy previews construyen antes de que se aplique la migración): sin redirects.
  if (body?.code === 'PGRST205' || body?.code === '42P01') return []
  throw new Error(`Failed to fetch ${path.split('?')[0]}: HTTP ${res.status}`)
}

/**
 * La RLS ya deja solo lo activo; los !inner sacan lo que cuelga de una categoría o un producto oculto. Sin anon key
 * (tests del config) no lee nada.
 * @returns {Promise<{ lastmod: Map<string, string>, redirects: string[] }>}
 */
export async function loadSeoBuild(supabaseUrl, anonKey) {
  if (!supabaseUrl || !anonKey) return { lastmod: new Map(), redirects: [] }
  const [products, promos, redirects] = await Promise.all([
    leer(supabaseUrl, anonKey, 'products?select=slug,updated_at,categories!inner(slug,updated_at)&is_active=eq.true'),
    leer(supabaseUrl, anonKey, 'promos?select=slug,updated_at&is_active=eq.true'),
    leer(supabaseUrl, anonKey, 'product_slug_redirects?select=category_slug,slug,products!inner(slug,categories!inner(slug))'),
  ])
  return { lastmod: lastmodPorRuta(products, promos), redirects: lineasRedirect(redirects) }
}
