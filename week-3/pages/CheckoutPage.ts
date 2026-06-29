import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutFormData {
  email: string;
  phone: string;
  shipAddress: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  shipCountry?: string;
  cardName: string;
  cardNumber: string;
  cardExpiryMonth: string;  // e.g. '12'
  cardExpiryYear: string;   // e.g. '2026'
  cardCvc: string;
}

export class CheckoutPage extends BasePage {
  readonly orderSummary: Locator;
  readonly orderTotal: Locator;
  readonly orderItems: Locator;
  readonly placeOrderButton: Locator;
  readonly confirmationMessage: Locator;
  readonly formSection: Locator;

  // Account
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  // Shipping address
  readonly shipAddressInput: Locator;
  readonly shipCityInput: Locator;
  readonly shipStateInput: Locator;
  readonly shipZipInput: Locator;
  readonly shipCountrySelect: Locator;

  // Payment
  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryMonthSelect: Locator;
  readonly cardExpiryYearSelect: Locator;
  readonly cardCvcInput: Locator;

  constructor(page: Page) {
    super(page);
    this.orderSummary = page.locator('.order-summary, .main-frame');
    this.orderTotal = page.locator('.subtotal, .total');
    this.orderItems = page.locator('shop-cart-item, .order-item');
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.confirmationMessage = page.locator('.order-confirmation, .success');
    this.formSection = page.locator('iron-form form, form[method="post"]').first();

    this.emailInput = page.locator('input#accountEmail');
    this.phoneInput = page.locator('input#accountPhone');

    this.shipAddressInput = page.locator('input#shipAddress');
    this.shipCityInput = page.locator('input#shipCity');
    this.shipStateInput = page.locator('input#shipState');
    this.shipZipInput = page.locator('input#shipZip');
    this.shipCountrySelect = page.locator('select#shipCountry');

    this.cardNameInput = page.locator('input#ccName');
    this.cardNumberInput = page.locator('input#ccNumber');
    this.cardExpiryMonthSelect = page.locator('select#ccExpMonth');
    this.cardExpiryYearSelect = page.locator('select#ccExpYear');
    this.cardCvcInput = page.locator('input#ccCVV');
  }

  async goto() {
    await this.navigate('/checkout');
    await this.waitForPageLoad();
  }

  async isCheckoutPageLoaded(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    return this.page.url().includes('/checkout');
  }

  async getOrderTotal(): Promise<string> {
    try {
      return (await this.orderTotal.first().textContent()) ?? '0';
    } catch {
      return '0';
    }
  }

  async getOrderItemCount(): Promise<number> {
    return this.orderItems.count();
  }

  async fillAccountInfo(data: Pick<CheckoutFormData, 'email' | 'phone'>) {
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
  }

  async fillShippingAddress(data: Pick<CheckoutFormData, 'shipAddress' | 'shipCity' | 'shipState' | 'shipZip' | 'shipCountry'>) {
    await this.shipAddressInput.fill(data.shipAddress);
    await this.shipCityInput.fill(data.shipCity);
    await this.shipStateInput.fill(data.shipState);
    await this.shipZipInput.fill(data.shipZip);
    if (data.shipCountry) {
      await this.shipCountrySelect.selectOption({ value: data.shipCountry });
    }
  }

  async fillPaymentDetails(data: Pick<CheckoutFormData, 'cardName' | 'cardNumber' | 'cardExpiryMonth' | 'cardExpiryYear' | 'cardCvc'>) {
    await this.cardNameInput.fill(data.cardName);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.cardExpiryMonthSelect.selectOption({ value: data.cardExpiryMonth });
    await this.cardExpiryYearSelect.selectOption({ value: data.cardExpiryYear });
    await this.cardCvcInput.fill(data.cardCvc);
  }

  async fillFullForm(data: CheckoutFormData) {
    await this.fillAccountInfo(data);
    await this.fillShippingAddress(data);
    await this.fillPaymentDetails(data);
  }

  async clickPlaceOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForTimeout(2000);
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.isElementVisible(this.confirmationMessage);
  }

  async isFormVisible(): Promise<boolean> {
    return this.isElementVisible(this.formSection);
  }
}
