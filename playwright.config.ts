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
    // Serves the static build from `npm run build` (needs PUBLIC_SUPABASE_* at build time).
    {
      command: 'npm run preview',
      url: 'http://localhost:4231',
      reuseExistingServer: !process.env.CI,
    },
    // PRI-131: three extra builds with seeded promos (0, 1 and 3) on 4232-4234. See e2e/promos/server.mjs.
    {
      command: 'node e2e/promos/server.mjs',
      url: 'http://localhost:4234',
      timeout: 15 * 60_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
