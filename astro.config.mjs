// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { appendFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { loadEnv } from 'vite'
import { loadBusinessOverrides } from './src/lib/business-overrides.mjs'
import { hostDeFotos } from './src/lib/fotos-host.mjs'
import { loadSeoBuild, rutaBase } from './src/lib/seo-build.mjs'
import { SITE_URL } from './src/lib/site.mjs'

// PRI-127: serflow-admin lee /build.json para saber si ya salió lo publicado. La hora se toma aquí, antes de leer
// Supabase: con la del final del build, uno que leyó los datos antes de publicar haría decir "Ya salió" al panel.
const builtAt = new Date().toISOString()

// PRI-150, PRI-421: el build solo decodifica JPEG, PNG y WebP. sharp 0.34.4 tenía avisos de RCE en los demás decodificadores
// y mira los bytes, no el tipo declarado. El bloqueo es de todo el proceso, así que también cubre la optimización de Astro.
sharp.block({ operation: ['VipsForeignLoadHeif', 'VipsForeignLoadSvg', 'VipsForeignLoadNsgif', 'VipsForeignLoadTiff', 'VipsForeignLoadVips'] })

// PRI-413: datos del negocio editables. business.ts los lee también en la isla del personalizador, así que van inyectados
// al compilar y no en una consulta por componente. Sin datos, se usan los valores del código. Si la lectura falla, el build
// falla como con el catálogo y queda lo publicado; dev, check y preview siguen con los valores del código.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_')
const business = await loadBusinessOverrides(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY).catch((err) => {
  if (process.argv.includes('build')) throw err
  console.warn(`[site_settings] usando los datos del código: ${err.message}`)
  return {}
})

const fotosHost = hostDeFotos(env)

// PRI-525: lastmod del sitemap y 301 de las URLs viejas de las fotos. Mismo manejo que los datos del negocio.
const seo = await loadSeoBuild(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY).catch((err) => {
  if (process.argv.includes('build')) throw err
  console.warn(`[seo] sin lastmod ni redirects de slugs: ${err.message}`)
  return { lastmod: new Map(), redirects: [] }
})

// https://astro.build/config
export default defineConfig({
  site: `${SITE_URL}/`,
  image: {
    // PRI-423: solo el proyecto propio. Un proyecto ajeno de Supabase podría responder distinto cuando Astro vuelve a bajar la foto.
    remotePatterns: fotosHost ? [{ protocol: 'https', hostname: fotosHost }] : [],
  },
  prefetch: {
    // Touch has no hover: prefetch visible links so a tap doesn't wait on the network (PRI-120).
    // Astro falls back to tap on 2G/saveData.
    defaultStrategy: 'viewport',
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
    define: { __SITE_BUSINESS__: JSON.stringify(business) },
    // PRI-436: el worker que quita fondos es un módulo (onnxruntime-web es ESM).
    worker: { format: 'es' },
  },
  server: {
    allowedHosts: true,
    port: 4231,
  },

  integrations: [
    react(),
    sitemap({
      serialize: (item) => {
        const lastmod = seo.lastmod.get(rutaBase(item.url))
        return lastmod ? { ...item, lastmod } : item
      },
    }),
    {
      name: 'build-json',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await writeFile(new URL('build.json', dir), JSON.stringify({ builtAt }))
          // PRI-525: un 301 por cada URL vieja de una foto (product_slug_redirects), después de las reglas de public/_redirects.
          if (seo.redirects.length) await appendFile(new URL('_redirects', dir), `\n${seo.redirects.join('\n')}\n`)
        },
      },
    },
  ]
});