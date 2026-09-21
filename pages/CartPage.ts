import { type Locator, type Page } from '@playwright/test';

function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

export class CartPage {
  private readonly lineItems: Locator;
  private readonly lineItemTotals: Locator;
  private readonly removeItemLinks: Locator;
  private readonly totalRow: Locator;

  constructor(private readonly page: Page) {
    this.lineItems = page.locator('.cart-body .cart-row');
    this.lineItemTotals = this.lineItems.locator('.cart-col-subtotal');
    this.removeItemLinks = page
      .locator('.cart-body .cart-row-actions')
      .getByRole('link', { name: '×' });
    this.totalRow = page
      .getByRole('row')
      .filter({ has: page.getByRole('cell', { name: 'Total:', exact: true }) });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
  }

  async removeAllItems(): Promise<void> {
    while ((await this.lineItems.count()) > 0) {
      const countBeforeRemoval = await this.lineItems.count();
      await this.removeItemLinks.first().click();
      await this.lineItems
        .nth(countBeforeRemoval - 1)
        .waitFor({ state: 'detached' });
    }
  }

  async getLineItemTotals(): Promise<number[]> {
    const texts = await this.lineItemTotals.allTextContents();
    return texts.map(parsePrice);
  }

  async getTotal(): Promise<number> {
    const text = await this.totalRow.getByRole('cell').last().textContent();
    return parsePrice(text ?? '');
  }
}
