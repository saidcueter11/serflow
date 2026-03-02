// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

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
    defaultStrategy: 'hover',
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    allowedHosts: true,
    port: 4231,
  },

  integrations: [react(), sitemap()]
});