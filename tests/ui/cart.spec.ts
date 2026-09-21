import { test, expect } from '../../fixtures/ui';

test.describe('Shopping cart', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.removeAllItems();
  });

  test.afterEach(async ({ cartPage }) => {
    await cartPage.removeAllItems();
  });

  test('should show the correct total after adding two products', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
  }) => {
    await homePage.goto();
    await homePage.search('Epic Sub Zero Driver');
    await searchResultsPage.openProduct('GBB Epic Sub Zero Driver');
    await productPage.addToCart();

    await homePage.goto();
    await homePage.search('CHRONOGRAPH');
    await searchResultsPage.openProduct('TRANSOCEAN CHRONOGRAPH');
    await productPage.addToCart();

    await cartPage.goto();

    const lineItemTotals = await cartPage.getLineItemTotals();
    const expectedTotal = lineItemTotals.reduce((sum, price) => sum + price, 0);

    expect(await cartPage.getTotal()).toBeCloseTo(expectedTotal, 2);
  });
});
