import { defineConfig, devices } from '@playwright/test'

const fixtureUrl = process.env.E2E_URL ?? 'http://127.0.0.1:4178'
const docsUrl = process.env.DOCS_E2E_URL ?? 'http://127.0.0.1:4179'
const useExternalServers = Boolean(process.env.E2E_URL && process.env.DOCS_E2E_URL)

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  use: { baseURL: fixtureUrl, trace: 'retain-on-failure' },
  webServer: useExternalServers
    ? undefined
    : [
        { command: 'npm run e2e:serve', url: fixtureUrl, reuseExistingServer: true },
        {
          command: 'npm run docs:preview -- --host 127.0.0.1 --port 4179',
          url: `${docsUrl}/mcui-oreui/`,
          reuseExistingServer: true,
        },
      ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.CI ? undefined : 'msedge' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
