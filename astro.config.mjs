// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: 'https://serflowctg.netlify.app/',
  vite: {
    plugins: [tailwindcss()]
  },
  server: {
    allowedHosts: true,
    port: 4231,
  },

  integrations: [react()]
});