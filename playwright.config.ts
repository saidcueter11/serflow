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
  // Serves the static build from `npm run build` (needs PUBLIC_SUPABASE_* at build time).
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4231',
    reuseExistingServer: !process.env.CI,
  },
})
