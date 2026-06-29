import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly logo: Locator;
  readonly navLinks: Locator;
  readonly drawerToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('a[href="/cart"]');
    this.cartBadge = page.locator('.cart-badge').first();
    this.logo = page.locator('.logo a');
    this.navLinks = page.locator('shop-tab a');
    this.drawerToggle = page.locator('paper-icon-button.menu-btn, .menu-btn');
  }

  async navigate(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async clickLogo() {
    await this.logo.click();
    await this.waitForPageLoad();
  }

  async clickCartIcon() {
    await this.cartIcon.first().click();
    await this.waitForPageLoad();
  }

  async getCartCount(): Promise<string> {
    try {
      return (await this.cartBadge.textContent()) ?? '0';
    } catch {
      return '0';
    }
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
