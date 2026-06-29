import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly productDescription: Locator;
  readonly sizeSelector: Locator;
  readonly quantitySelector: Locator;
  readonly addToCartButton: Locator;
  readonly breadcrumb: Locator;
  readonly outOfStockMessage: Locator;
  readonly sizeOptions: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    super(page);
    // Use .first() to avoid strict-mode violations (Polymer stamps multiple shop-detail instances)
    this.productTitle = page.locator('shop-detail h1').first();
    this.productPrice = page.locator('shop-detail .price').first();
    this.productImage = page.locator('shop-detail shop-image').first();
    this.productDescription = page.locator('shop-detail .description').first();
    this.sizeSelector = page.locator('select#sizeSelect').first();
    this.quantitySelector = page.locator('select#quantitySelect').first();
    // Use aria-label for add-to-cart button (most reliable selector)
    this.addToCartButton = page.getByRole('button', { name: /add.*cart/i });
    this.breadcrumb = page.locator('.breadcrumb');
    this.outOfStockMessage = page.locator('.out-of-stock');
    this.sizeOptions = page.locator('select#sizeSelect option').first();
    this.quantityInput = page.locator('select#quantitySelect').first();
  }

  async goto(category: string, productName: string) {
    // Polymer Shop encodes non-alphanumeric-non-hyphen as + in product URLs
    const encodedName = productName.replace(/[^a-zA-Z0-9-]/g, '+');
    await this.navigate(`/detail/${category}/${encodedName}`);
    await this.waitForProductLoad();
  }

  async waitForProductLoad() {
    await this.page.waitForLoadState('networkidle');
    // Wait for product title to be non-empty (Polymer async binding [[item.title]])
    await expect(this.productTitle).not.toBeEmpty({ timeout: 15000 }).catch(() => {});
  }

  async getProductTitle(): Promise<string> {
    return ((await this.productTitle.textContent()) ?? '').trim();
  }

  async getProductPrice(): Promise<string> {
    return ((await this.productPrice.textContent()) ?? '').trim();
  }

  async selectSize(size: string) {
    await this.page.locator('select#sizeSelect').first().selectOption({ value: size });
  }

  async selectQuantity(quantity: string) {
    await this.page.locator('select#quantitySelect').first().selectOption({ value: quantity });
  }

  async getSizeOptions(): Promise<string[]> {
    const sizeSelect = this.page.locator('select#sizeSelect').first();
    const options = sizeSelect.locator('option');
    const count = await options.count();
    const sizes: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text && text.trim() !== '') sizes.push(text.trim());
    }
    return sizes;
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
    // Poll until badge reflects the new count (Polymer binding is async)
    await expect(this.page.locator('.cart-badge').first()).not.toHaveText('0', { timeout: 8000 }).catch(() => {});
    // Brief wait for iron-localstorage to persist cart state before any page.goto()
    await this.page.waitForTimeout(400);
  }

  async isAddToCartEnabled(): Promise<boolean> {
    try {
      const disabled = await this.addToCartButton.getAttribute('disabled');
      return disabled === null;
    } catch {
      return false;
    }
  }

  async isProductImageVisible(): Promise<boolean> {
    return this.isElementVisible(this.productImage);
  }

  async isOutOfStock(): Promise<boolean> {
    return this.isElementVisible(this.outOfStockMessage);
  }

  async getDescriptionText(): Promise<string> {
    try {
      return (await this.productDescription.textContent()) ?? '';
    } catch {
      return '';
    }
  }

  async addToCartWithOptions(size?: string, quantity?: string) {
    if (size) await this.selectSize(size);
    if (quantity) await this.selectQuantity(quantity);
    await this.clickAddToCart();
  }
}
