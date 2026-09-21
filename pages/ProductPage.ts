import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  private readonly addToCartLink: Locator;

  constructor(private readonly page: Page) {
    this.addToCartLink = page.getByRole('link', { name: 'Add to cart' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartLink.click();
  }
}
