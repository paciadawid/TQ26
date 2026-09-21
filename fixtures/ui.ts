import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

// BearStore is a public SmartBear demo/sandbox site; seeded accounts hold no
// real user data, so a fixed password in plaintext is fine here.
const SEEDED_USER_PASSWORD = 'Test1234!';

type UiFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

type UiWorkerFixtures = {
  workerStorageStatePath: string;
};

export const test = base.extend<UiFixtures, UiWorkerFixtures>({
  storageState: async ({ workerStorageStatePath }, use) => {
    await use(workerStorageStatePath);
  },
  workerStorageStatePath: [
    async ({ browser }, use, workerInfo) => {
      const fileName = resolve(
        workerInfo.project.outputDir,
        `.auth/${workerInfo.parallelIndex}.json`,
      );

      if (!existsSync(fileName)) {
        const page = await browser.newPage({
          baseURL: workerInfo.project.use.baseURL,
          storageState: undefined,
        });

        // Seed a fresh, disposable account per worker instead of reusing one
        // shared login, so parallel workers never contend for the same cart.
        const username = `pw-worker-${workerInfo.parallelIndex}-${randomUUID().slice(0, 8)}`;
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await registerPage.register(
          username,
          `${username}@example.com`,
          SEEDED_USER_PASSWORD,
        );
        await expect(registerPage.headerLoginLink).toBeHidden();

        mkdirSync(dirname(fileName), { recursive: true });
        await page.context().storageState({ path: fileName });
        await page.close();
      }

      await use(fileName);
    },
    { scope: 'worker' },
  ],
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect };
