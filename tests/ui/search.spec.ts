import { test, expect } from '../../fixtures/ui';

test('should show no results when searching for Bear', async ({
  homePage,
  searchResultsPage,
}) => {
  await homePage.goto();
  await homePage.search('Bear');

  await expect(searchResultsPage.noResultsMessage).toBeVisible();
});
