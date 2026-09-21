import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly nextButton: Locator;
  private readonly shipToThisAddressButton: Locator;
  private readonly agreeToTermsCheckbox: Locator;
  private readonly confirmButton: Locator;
  readonly orderReceivedHeading: Locator;
  readonly firstNameRequiredError: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByRole('textbox', { name: 'First name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name *' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.shipToThisAddressButton = page.getByRole('button', {
      name: 'Ship to this address',
    });
    this.agreeToTermsCheckbox = page.getByRole('checkbox', {
      name: /I agree with the terms of service/,
    });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.orderReceivedHeading = page.getByRole('heading', {
      name: 'Your order has been received',
    });
    this.firstNameRequiredError = page.getByText(
      "'First name' should not be empty.",
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async submitBillingAddress(
    firstName: string,
    lastName: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.nextButton.click();
  }

  async continueWithoutBillingAddress(): Promise<void> {
    await this.nextButton.click();
  }

  async useSameAddressForShipping(): Promise<void> {
    await this.shipToThisAddressButton.click();
  }

  async continueWithDefaultShippingMethod(): Promise<void> {
    await this.nextButton.click();
  }

  async continueWithDefaultPaymentMethod(): Promise<void> {
    await this.nextButton.click();
  }

  async confirmOrder(): Promise<void> {
    await this.agreeToTermsCheckbox.check();
    await this.confirmButton.click();
  }
}
