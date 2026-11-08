import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4231',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    // Serves the static build from `npm run build` (needs PUBLIC_SUPABASE_* at build time). Since astro 7, `astro preview`
    // run by an agent goes to the background and exits, so Playwright sees it die; --ignore-lock keeps it in the foreground.
    {
      command: 'npm run preview -- --ignore-lock',
      url: 'http://localhost:4231',
      reuseExistingServer: !process.env.CI,
    },
    // PRI-131, PRI-150, PRI-413, PRI-438, PRI-433: extra builds with seeded data on 4232-4240. See e2e/promos/server.mjs.
    {
      command: 'node e2e/promos/server.mjs',
      url: 'http://localhost:4240',
      timeout: 20 * 60_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
