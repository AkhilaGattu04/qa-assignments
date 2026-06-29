import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly cartItemQuantities: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly removeItemButtons: Locator;
  readonly cartSubtotal: Locator;
  readonly continueShopping: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('shop-cart-item');
    this.cartItemNames = page.locator('shop-cart-item .name, shop-cart-item .title');
    this.cartItemPrices = page.locator('shop-cart-item .price');
    this.cartItemQuantities = page.locator('shop-cart-item .quantity');
    this.cartTotal = page.locator('.subtotal, shop-cart .subtotal');
    this.checkoutButton = page.locator('shop-button a[href="/checkout"]').first();
    this.emptyCartMessage = page.locator('.empty-cart, .cart-empty-message');
    this.removeItemButtons = page.locator('shop-cart-item [aria-label*="remove"], .remove-btn, shop-cart-item button');
    this.cartSubtotal = page.locator('.subtotal, .cart-subtotal');
    this.continueShopping = page.locator('a[href="/"], .continue-shopping');
  }

  async goto() {
    await this.navigate('/cart');
    await this.waitForPageLoad();
  }

  async navigateToCart() {
    // Use JS dispatch to avoid fixed-position viewport issues with app-header
    await this.page.evaluate(() => {
      function clickCart(root: any): boolean {
        const link = root.querySelector('a[href="/cart"]');
        if (link) { link.click(); return true; }
        for (const el of root.querySelectorAll('*')) {
          if (el.shadowRoot && clickCart(el.shadowRoot)) return true;
        }
        return false;
      }
      clickCart(document);
    });
    await this.page.waitForURL(/\/cart/, { timeout: 10000 }).catch(() => {});
    await this.waitForPageLoad();
    // Wait for Polymer to stamp shop-cart-item elements into the DOM
    await this.cartItems.first().waitFor({ state: 'attached', timeout: 8000 }).catch(() => {});
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartTotal(): Promise<string> {
    try {
      return (await this.cartTotal.first().textContent()) ?? '0';
    } catch {
      return '0';
    }
  }

  async getCartItemNames(): Promise<string[]> {
    const count = await this.cartItemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.cartItemNames.nth(i).textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }

  async getCartItemPrices(): Promise<string[]> {
    const count = await this.cartItemPrices.count();
    const prices: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.cartItemPrices.nth(i).textContent();
      if (text) prices.push(text.trim());
    }
    return prices;
  }

  async removeItem(index: number) {
    await this.removeItemButtons.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  async removeAllItems() {
    const count = await this.removeItemButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeItemButtons.nth(i).click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickCheckout() {
    await this.checkoutButton.click({ force: true });
    await this.page.waitForURL(/\/checkout/, { timeout: 10000 }).catch(() => {});
    await this.waitForPageLoad();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.cartItems.count();
    return count === 0;
  }

  async isEmptyMessageVisible(): Promise<boolean> {
    return this.isElementVisible(this.emptyCartMessage);
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return this.isElementVisible(this.checkoutButton);
  }

  async getItemAtIndex(index: number): Promise<{ name: string; price: string }> {
    const name = (await this.cartItemNames.nth(index).textContent()) ?? '';
    const price = (await this.cartItemPrices.nth(index).textContent()) ?? '';
    return { name: name.trim(), price: price.trim() };
  }
}
