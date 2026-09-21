import { test, expect } from '../../fixtures/ui';

test.describe('Checkout', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.removeAllItems();
  });

  test.afterEach(async ({ cartPage }) => {
    await cartPage.removeAllItems();
  });

  test('should confirm the order after buying two Ball Chair colors', async ({
    homePage,
    searchResultsPage,
    productPage,
    checkoutPage,
  }) => {
    for (const color of ['White', 'Blue']) {
      await homePage.goto();
      await homePage.search('Ball Chair');
      await searchResultsPage.openProduct('Ball Chair');
      await productPage.selectLeatherColor(color);
      await productPage.addToCart();
    }

    await checkoutPage.goto();
    await checkoutPage.submitBillingAddress('Test', 'Worker');
    await checkoutPage.useSameAddressForShipping();
    await checkoutPage.continueWithDefaultShippingMethod();
    await checkoutPage.continueWithDefaultPaymentMethod();
    await checkoutPage.confirmOrder();

    await expect(checkoutPage.orderReceivedHeading).toBeVisible();
  });

  test('should show a validation error when billing address is missing required fields', async ({
    homePage,
    searchResultsPage,
    productPage,
    checkoutPage,
  }) => {
    await homePage.goto();
    await homePage.search('Ball Chair');
    await searchResultsPage.openProduct('Ball Chair');
    await productPage.selectLeatherColor('White');
    await productPage.addToCart();

    await checkoutPage.goto();
    await checkoutPage.continueWithoutBillingAddress();

    await expect(checkoutPage.firstNameRequiredError).toBeVisible();
  });
});
