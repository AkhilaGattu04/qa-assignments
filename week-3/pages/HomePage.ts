import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly categoryCards: Locator;
  readonly heroSection: Locator;
  readonly featuredCategories: Locator;
  readonly categoryLinks: Locator;
  readonly shopTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryCards = page.locator('shop-home a[href*="/list/"]');
    this.heroSection = page.locator('shop-home');
    this.featuredCategories = page.locator('shop-home');
    this.categoryLinks = page.locator('shop-home a[href*="/list/"]');
    this.shopTabs = page.locator('shop-tab a');
  }

  async goto() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async getCategoryCount(): Promise<number> {
    await this.categoryCards.first().waitFor({ state: 'visible', timeout: 15000 });
    return this.categoryCards.count();
  }

  async getCategoryNames(): Promise<string[]> {
    await this.categoryLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    const count = await this.categoryLinks.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.categoryLinks.nth(i).getAttribute('href');
      if (href) names.push(href.replace('/list/', '').trim());
    }
    return names;
  }

  async clickCategory(categoryName: string) {
    const link = this.page.locator(`a[href*="${categoryName}"]`).first();
    await link.click();
    await this.waitForPageLoad();
  }

  async clickCategoryByIndex(index: number) {
    await this.categoryCards.nth(index).locator('a').first().click();
    await this.waitForPageLoad();
  }

  async getTabLinks(): Promise<string[]> {
    const count = await this.shopTabs.count();
    const links: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.shopTabs.nth(i).getAttribute('href');
      if (href) links.push(href);
    }
    return links;
  }

  async clickNavTab(tabText: string) {
    const tab = this.shopTabs.filter({ hasText: tabText });
    await tab.click();
    await this.waitForPageLoad();
  }

  async isCategoryGridVisible(): Promise<boolean> {
    return this.isElementVisible(this.featuredCategories);
  }
}
