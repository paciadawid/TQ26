import { test as base, expect } from '@playwright/test';
import { GoRestUser } from '../api/GoRestUser';

type ApiFixtures = {
  goRestUser: GoRestUser;
};

export const test = base.extend<ApiFixtures>({
  goRestUser: async ({ request }, use) => {
    await use(new GoRestUser(request));
  },
});

export { expect };
