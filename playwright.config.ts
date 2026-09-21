import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const GOREST_ACCESS_TOKEN = process.env.GOREST_ACCESS_TOKEN;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on',
  },

  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://bearstore-testsite.smartbear.com',
        video: 'on',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://gorest.co.in',
        extraHTTPHeaders: {
          Accept: 'application/json',
          ...(GOREST_ACCESS_TOKEN
            ? { Authorization: `Bearer ${GOREST_ACCESS_TOKEN}` }
            : {}),
        },
        video: 'off',
      },
    },
  ],
});
