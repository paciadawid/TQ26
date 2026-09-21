import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  private readonly addToCartLink: Locator;
  private readonly addedToCartAlert: Locator;
  private readonly leatherColorGroup: Locator;

  constructor(private readonly page: Page) {
    this.addToCartLink = page.getByRole('link', { name: 'Add to cart' });
    this.addedToCartAlert = page.getByRole('alert').filter({
      hasText: 'has been successfully added to your cart',
    });
    // Scoped CSS: the "Leather color" swatch group has no accessible role,
    // and its swatch titles (e.g. "White") collide with the separate "Color"
    // group's swatch titles, so a plain getByTitle would be ambiguous.
    this.leatherColorGroup = page
      .locator('.form-group.choice')
      .filter({ hasText: 'Leather color' });
  }

  async selectLeatherColor(color: string): Promise<void> {
    await this.leatherColorGroup.getByTitle(color).click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartLink.click();
    // Wait for the async add-to-cart confirmation before returning, so callers
    // don't navigate away and cancel the still-in-flight request.
    await this.addedToCartAlert.waitFor({ state: 'visible' });
  }
}
