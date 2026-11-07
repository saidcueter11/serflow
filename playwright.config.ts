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
    // PRI-131, PRI-150, PRI-413: extra builds with seeded data on 4232-4238. See e2e/promos/server.mjs.
    {
      command: 'node e2e/promos/server.mjs',
      url: 'http://localhost:4238',
      timeout: 20 * 60_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
