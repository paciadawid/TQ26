import { test as base, expect } from '@playwright/test';
import { GoRestUser } from '../api/GoRestUser';

type ApiFixtures = {
  goRestUser: GoRestUser;
  unauthenticatedGoRestUser: GoRestUser;
  createdUserIds: number[];
};

export const test = base.extend<ApiFixtures>({
  goRestUser: async ({ request }, use) => {
    await use(new GoRestUser(request));
  },
  unauthenticatedGoRestUser: async ({ playwright }, use, testInfo) => {
    const context = await playwright.request.newContext({
      baseURL: testInfo.project.use.baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
    await use(new GoRestUser(context));
    await context.dispose();
  },
  createdUserIds: async ({ goRestUser }, use) => {
    const ids: number[] = [];
    await use(ids);
    for (const id of ids) {
      await goRestUser.delete(id);
    }
  },
});

export { expect };
