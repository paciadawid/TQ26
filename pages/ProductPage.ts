import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  private readonly addToCartLink: Locator;
  private readonly addedToCartAlert: Locator;

  constructor(private readonly page: Page) {
    this.addToCartLink = page.getByRole('link', { name: 'Add to cart' });
    this.addedToCartAlert = page.getByRole('alert').filter({
      hasText: 'has been successfully added to your cart',
    });
  }

  async addToCart(): Promise<void> {
    await this.addToCartLink.click();
    // Wait for the async add-to-cart confirmation before returning, so callers
    // don't navigate away and cancel the still-in-flight request.
    await this.addedToCartAlert.waitFor({ state: 'visible' });
  }
}
