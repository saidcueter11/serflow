// PRI-525: dominio del sitio, sin "/" final. De aquí salen `site` en astro.config.mjs (canonical, og:url, sitemap y
// robots.txt), los JSON-LD y el link que llevan los mensajes de WhatsApp. PRI-531: dominio propio, sin www (Netlify
// redirige www y serflowctg.netlify.app aquí). Si cambia, cambiar también el default de NEXT_PUBLIC_SITE_URL en
// serflow-admin (src/lib/publish-status.ts).
export const SITE_URL = 'https://serflowctg.com'
