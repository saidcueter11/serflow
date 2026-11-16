import type { APIRoute } from 'astro'

// PRI-525: el sitemap sale de `site` (src/lib/site.mjs): al cambiar el dominio, robots.txt cambia solo.
export const GET: APIRoute = ({ site }) => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`)
