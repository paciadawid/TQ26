import { type Locator, type Page } from '@playwright/test';

export class SearchResultsPage {
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.noResultsMessage = page.getByText(
      'Your search did not match any products.',
    );
  }
}
