// PRI-525: dominio del sitio, sin "/" final. De aquí salen `site` en astro.config.mjs (canonical, og:url, sitemap y
// robots.txt), los JSON-LD y el link que llevan los mensajes de WhatsApp. Al pasar a serflowctg.com: cambiar esta línea,
// revisar la CSP de netlify.toml y las URLs absolutas de serflow-admin ("Ya salió", /build.json). Pasos completos en el
// doc "Auditoría SEO 2026-11-15" (Docs > Serflow) y en el PR de PRI-525.
export const SITE_URL = 'https://serflowctg.netlify.app'
