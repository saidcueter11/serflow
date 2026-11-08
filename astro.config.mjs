// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { loadEnv } from 'vite'
import { loadBusinessOverrides } from './src/lib/business-overrides.mjs'
import { hostDeFotos } from './src/lib/fotos-host.mjs'

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

// https://astro.build/config
export default defineConfig({
  site: 'https://serflowctg.netlify.app/',
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
  },
  server: {
    allowedHosts: true,
    port: 4231,
  },

  integrations: [
    react(),
    sitemap(),
    {
      name: 'build-json',
      hooks: {
        'astro:build:done': ({ dir }) => writeFile(new URL('build.json', dir), JSON.stringify({ builtAt })),
      },
    },
  ]
});