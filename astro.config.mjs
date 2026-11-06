// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { loadEnv } from 'vite'
import { loadBusinessOverrides } from './src/lib/business-overrides.mjs'

// PRI-413: datos del negocio editables. business.ts los lee también en la isla del personalizador, así que van inyectados
// al compilar y no en una consulta por componente. Sin datos, se usan los valores del código. Si la lectura falla, el build
// falla como con el catálogo y queda lo publicado; dev, check y preview siguen con los valores del código.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_')
const business = await loadBusinessOverrides(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY).catch((err) => {
  if (process.argv.includes('build')) throw err
  console.warn(`[site_settings] usando los datos del código: ${err.message}`)
  return {}
})

// https://astro.build/config
export default defineConfig({
  site: 'https://serflowctg.netlify.app/',
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
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
  },
  server: {
    allowedHosts: true,
    port: 4231,
  },

  integrations: [react(), sitemap()]
});