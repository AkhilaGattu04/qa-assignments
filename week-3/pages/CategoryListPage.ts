import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryListPage extends BasePage {
  readonly productItems: Locator;
  readonly productLinks: Locator;
  readonly productImages: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly pageTitle: Locator;
  readonly breadcrumb: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('ul.grid li');
    this.productLinks = page.locator('ul.grid li a');
    this.productImages = page.locator('shop-list-item img');
    this.productTitles = page.locator('shop-list-item .title');
    this.productPrices = page.locator('shop-list-item .price');
    this.pageTitle = page.locator('shop-list h2, .category-title, h1');
    this.breadcrumb = page.locator('.breadcrumb, shop-breadcrumb');
    this.loadingSpinner = page.locator('.loading-spinner, shop-loading-indicator');
  }

  async goto(category: string) {
    await this.navigate(`/list/${category}`);
    await this.waitForProducts();
  }

  async waitForProducts() {
    await this.page.waitForLoadState('networkidle');
    await this.productItems.first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  }

  async getProductCount(): Promise<number> {
    await this.productItems.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return this.productItems.count();
  }

  async getProductTitles(): Promise<string[]> {
    const count = await this.productTitles.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.productTitles.nth(i).textContent();
      if (text) titles.push(text.trim());
    }
    return titles;
  }

  async getProductPrices(): Promise<string[]> {
    const count = await this.productPrices.count();
    const prices: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.productPrices.nth(i).textContent();
      if (text) prices.push(text.trim());
    }
    return prices;
  }

  async clickProduct(index: number) {
    const link = this.productLinks.nth(index);
    await link.waitFor({ state: 'visible', timeout: 15000 });
    // Polymer's dom-repeat marks elements visible before href data-binding fires — wait for it
    await expect(link).toHaveAttribute('href', /.+/, { timeout: 10000 }).catch(() => {});
    const href = await link.getAttribute('href');
    if (href) {
      await this.navigate(href);
    } else {
      await link.click();
    }
    await this.waitForPageLoad();
  }

  async clickProductByName(name: string) {
    const item = this.productTitles.filter({ hasText: name });
    await item.click();
    await this.waitForPageLoad();
  }

  async getPageHeading(): Promise<string> {
    try {
      return (await this.pageTitle.first().textContent()) ?? '';
    } catch {
      return '';
    }
  }

  async areAllImagesLoaded(): Promise<boolean> {
    const count = await this.productImages.count();
    for (let i = 0; i < count; i++) {
      const img = this.productImages.nth(i);
      const loaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
      if (!loaded) return false;
    }
    return true;
  }

  async getCurrentCategory(): Promise<string> {
    const url = this.page.url();
    const match = url.match(/\/list\/([^/?]+)/);
    return match ? match[1] : '';
  }
}
