import { type Locator, type Page } from '@playwright/test';

export class SearchResultsPage {
  readonly noResultsMessage: Locator;

  constructor(private readonly page: Page) {
    this.noResultsMessage = page.getByText(
      'Your search did not match any products.',
    );
  }

  async openProduct(name: string): Promise<void> {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
