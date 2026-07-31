import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  use: { baseURL: 'http://127.0.0.1:4178', trace: 'retain-on-failure' },
  webServer: [
    { command: 'npm run e2e:serve', url: 'http://127.0.0.1:4178', reuseExistingServer: true },
    {
      command: 'npm run docs:preview -- --host 127.0.0.1 --port 4179',
      url: 'http://127.0.0.1:4179/mcui-oreui/',
      reuseExistingServer: true,
    },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.CI ? undefined : 'msedge' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
