/**
 * SANITY TEST SUITE — Polymer Shop
 * Classification: SANITY / SMOKE
 *
 * Purpose: Rapid health-check of core application flows.
 * Run after every deployment to verify the app is functional.
 * Execution time: ~2 minutes
 *
 * Coverage:
 *   TC-SAN-001  Home page loads
 *   TC-SAN-002  Category navigation
 *   TC-SAN-003  Product listing loads
 *   TC-SAN-004  Product detail loads
 *   TC-SAN-005  Add to cart
 *   TC-SAN-006  Cart page loads
 *   TC-SAN-007  Checkout page accessible
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CategoryListPage } from '../../pages/CategoryListPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CATEGORIES, PRODUCTS } from '../../data/testData';

test.describe('Sanity Suite @sanity', () => {

  test('TC-SAN-001: Home page loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const title = await homePage.getTitle();
    expect(title).toContain('SHOP');

    const url = await homePage.getCurrentUrl();
    expect(url).toBe('https://shop.polymer-project.org/');
  });

  test('TC-SAN-002: All category tabs are present on home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const visible = await homePage.isCategoryGridVisible();
    expect(visible).toBe(true);

    const count = await homePage.getCategoryCount();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('TC-SAN-003: Product listing page loads for Men\'s Outerwear', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);

    const url = await listPage.getCurrentUrl();
    expect(url).toContain('/list/mens_outerwear');
  });

  test('TC-SAN-004: Product detail page loads', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const product = PRODUCTS[0];
    await detailPage.goto(product.category, product.name);

    const titleVisible = await detailPage.isElementVisible(detailPage.productTitle);
    expect(titleVisible).toBe(true);

    const imageVisible = await detailPage.isProductImageVisible();
    expect(imageVisible).toBe(true);
  });

  test('TC-SAN-005: Add to cart works', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const product = PRODUCTS[0];
    await detailPage.goto(product.category, product.name);

    await detailPage.clickAddToCart();

    const cartCount = await detailPage.getCartCount();
    expect(parseInt(cartCount)).toBeGreaterThanOrEqual(1);
  });

  test('TC-SAN-006: Cart page loads and displays items', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const url = await cartPage.getCurrentUrl();
    expect(url).toContain('/cart');

    const checkoutVisible = await cartPage.isCheckoutButtonVisible();
    expect(checkoutVisible).toBe(true);
  });

  test('TC-SAN-007: Checkout page is accessible from cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    await cartPage.clickCheckout();

    const url = await page.url();
    expect(url).toContain('/checkout');
  });

  test('TC-SAN-008: Logo click returns to home page', async ({ page }) => {
    const listPage = new CategoryListPage(page);
    await listPage.goto(CATEGORIES[0].slug);

    await listPage.clickLogo();

    const url = await listPage.getCurrentUrl();
    expect(url).toBe('https://shop.polymer-project.org/');
  });

  test('TC-SAN-009: Cart icon navigates to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.clickCartIcon();

    const url = await homePage.getCurrentUrl();
    expect(url).toContain('/cart');
  });
});
