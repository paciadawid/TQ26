import { type Locator, type Page } from '@playwright/test';

export class RegisterPage {
  private readonly emailInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly submitButton: Locator;
  readonly headerLoginLink: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username *' });
    this.passwordInput = page.getByRole('textbox', {
      name: 'Password *',
      exact: true,
    });
    this.confirmPasswordInput = page.getByRole('textbox', {
      name: 'Confirm password *',
    });
    this.submitButton = page.getByRole('button', { name: 'Register' });
    this.headerLoginLink = page.getByRole('link', { name: 'Log in' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.submitButton.click();
  }
}
