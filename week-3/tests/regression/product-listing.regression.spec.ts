/**
 * REGRESSION TEST SUITE — Product Listing Page
 * Classification: REGRESSION
 *
 * TC-REG-LIST-001  Products are displayed for each category
 * TC-REG-LIST-002  Product titles are visible
 * TC-REG-LIST-003  Product prices are visible and formatted correctly
 * TC-REG-LIST-004  Product images are loaded
 * TC-REG-LIST-005  Clicking a product navigates to detail page
 * TC-REG-LIST-006  URL reflects the selected category
 * TC-REG-LIST-007  Switching categories updates the product list
 * TC-REG-LIST-008  Invalid category shows fallback
 */

import { test, expect } from '@playwright/test';
import { CategoryListPage } from '../../pages/CategoryListPage';
import { CATEGORIES, INVALID_ROUTES } from '../../data/testData';

test.describe('Regression — Product Listing @regression', () => {

  for (const category of CATEGORIES) {
    test(`TC-REG-LIST-001 [${category.slug}]: Products are displayed`, async ({ page }) => {
      const listPage = new CategoryListPage(page);
      await listPage.goto(category.slug);

      const count = await listPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  }

  test('TC-REG-LIST-002: Product titles are non-empty strings', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    const titles = await listPage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    titles.forEach(t => expect(t).not.toBe(''));
  });

  test('TC-REG-LIST-003: Product prices are in dollar format', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    const prices = await listPage.getProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(p => expect(p).toMatch(/\$\d+\.\d{2}/));
  });

  test('TC-REG-LIST-004: All product images are loaded without broken links', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    const allLoaded = await listPage.areAllImagesLoaded();
    expect(allLoaded).toBe(true);
  });

  test('TC-REG-LIST-005: Clicking first product navigates to detail URL', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    await listPage.clickProduct(0);

    const url = await listPage.getCurrentUrl();
    expect(url).toContain('/detail/');
    expect(url).toContain(CATEGORIES[0].slug);
  });

  test('TC-REG-LIST-006: URL reflects selected category', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[1].slug);

    const current = await listPage.getCurrentCategory();
    expect(current).toBe(CATEGORIES[1].slug);
  });

  test('TC-REG-LIST-007: Switching from one category to another updates the list', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);
    const titlesCategory1 = await listPage.getProductTitles();

    await listPage.goto(CATEGORIES[2].slug);
    const titlesCategory2 = await listPage.getProductTitles();

    expect(titlesCategory1).not.toEqual(titlesCategory2);
  });

  test('TC-REG-LIST-008: Ladies Outerwear shows products', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto('ladies_outerwear');

    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-REG-LIST-009: Men\'s T-Shirts category shows products', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto('mens_tshirts');

    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-REG-LIST-010: Ladies T-Shirts category shows products', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto('ladies_tshirts');

    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
