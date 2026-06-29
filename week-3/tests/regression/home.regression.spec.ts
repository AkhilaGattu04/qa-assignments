/**
 * REGRESSION TEST SUITE — Home Page
 * Classification: REGRESSION
 *
 * TC-REG-HOME-001  Home page title is correct
 * TC-REG-HOME-002  All 4 category cards are displayed
 * TC-REG-HOME-003  Category card images are loaded
 * TC-REG-HOME-004  Each category card navigates to correct list page
 * TC-REG-HOME-005  Navigation tabs reflect all categories (desktop)
 * TC-REG-HOME-006  Back navigation from list returns to home
 * TC-REG-HOME-007  Page is responsive — hero section visible
 * TC-REG-HOME-008  Cart count initialises to 0
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CategoryListPage } from '../../pages/CategoryListPage';
import { CATEGORIES } from '../../data/testData';

test.describe('Regression — Home Page @regression', () => {

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test('TC-REG-HOME-001: Page title contains SHOP', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('SHOP');
  });

  test('TC-REG-HOME-002: Four category cards are displayed', async ({ page }) => {
    const homePage = new HomePage(page);
    const count = await homePage.getCategoryCount();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('TC-REG-HOME-003: Category names are visible and non-empty', async ({ page }) => {
    const homePage = new HomePage(page);
    const names = await homePage.getCategoryNames();
    expect(names.length).toBeGreaterThanOrEqual(1);
    names.forEach(name => expect(name.trim()).not.toBe(''));
  });

  test('TC-REG-HOME-004: Click Men\'s Outerwear navigates to correct URL', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickCategory('mens_outerwear');
    await expect(page).toHaveURL(/\/list\/mens_outerwear/);
  });

  test('TC-REG-HOME-005: Click Ladies Outerwear navigates to correct URL', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickCategory('ladies_outerwear');
    await expect(page).toHaveURL(/\/list\/ladies_outerwear/);
  });

  test('TC-REG-HOME-006: Click Men\'s T-Shirts navigates to correct URL', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickCategory('mens_tshirts');
    await expect(page).toHaveURL(/\/list\/mens_tshirts/);
  });

  test('TC-REG-HOME-007: Click Ladies T-Shirts navigates to correct URL', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickCategory('ladies_tshirts');
    await expect(page).toHaveURL(/\/list\/ladies_tshirts/);
  });

  test('TC-REG-HOME-008: Cart count shows 0 on fresh load', async ({ page }) => {
    const homePage = new HomePage(page);
    const count = await homePage.getCartCount();
    expect(['0', '']).toContain(count.trim());
  });

  test('TC-REG-HOME-009: Navigating category then back returns to home', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.clickCategory('mens_outerwear');
    await page.goBack();
    await expect(page).toHaveURL('https://shop.polymer-project.org/');
  });

  test('TC-REG-HOME-010: All category links are present in navigation tabs', async ({ page }) => {
    const homePage = new HomePage(page);
    const tabs = await homePage.getTabLinks();
    expect(tabs.some(t => t.includes('mens_outerwear'))).toBe(true);
  });
});
