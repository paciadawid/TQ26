import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  readonly headerLoginLink: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', {
      name: 'Username or email',
    });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Log in' });
    this.headerLoginLink = page.getByRole('link', { name: 'Log in' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
