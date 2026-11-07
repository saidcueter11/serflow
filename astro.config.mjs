// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { writeFile } from 'node:fs/promises'

// PRI-127: serflow-admin lee /build.json para saber si ya salió lo publicado. La hora se toma aquí, antes de leer
// Supabase: con la del final del build, uno que leyó los datos antes de publicar haría decir "Ya salió" al panel.
const builtAt = new Date().toISOString()

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
    plugins: [tailwindcss()]
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