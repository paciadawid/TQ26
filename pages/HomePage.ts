import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  private readonly searchInput: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByRole('textbox', {
      name: 'What are you looking for?',
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}
