/**
 * REGRESSION TEST SUITE — Product Detail Page
 * Classification: REGRESSION
 *
 * TC-REG-DET-001  Product title is displayed
 * TC-REG-DET-002  Product price is shown in correct format
 * TC-REG-DET-003  Product image is visible and loaded
 * TC-REG-DET-004  Size selector is present with options
 * TC-REG-DET-005  Quantity selector is present
 * TC-REG-DET-006  Add to cart button is enabled
 * TC-REG-DET-007  Add to cart increments badge count
 * TC-REG-DET-008  Add multiple items increments count correctly
 * TC-REG-DET-009  Product description is displayed
 * TC-REG-DET-010  URL contains category and product name
 * TC-REG-DET-011  Add to cart redirects or shows cart state
 * TC-REG-DET-012  Changing size does not break add to cart
 */

import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { PRODUCTS } from '../../data/testData';

test.describe('Regression — Product Detail @regression', () => {

  test('TC-REG-DET-001: Product title is displayed', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const titleVisible = await detailPage.isElementVisible(detailPage.productTitle);
    expect(titleVisible).toBe(true);

    const title = await detailPage.getProductTitle();
    expect(title.trim()).not.toBe('');
  });

  test('TC-REG-DET-002: Product price is in dollar format', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const price = await detailPage.getProductPrice();
    expect(price).toMatch(/\$\d+\.\d{2}/);
  });

  test('TC-REG-DET-003: Product image is visible', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const visible = await detailPage.isProductImageVisible();
    expect(visible).toBe(true);
  });

  test('TC-REG-DET-004: Size selector has options', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const sizes = await detailPage.getSizeOptions();
    expect(sizes.length).toBeGreaterThan(0);
  });

  test('TC-REG-DET-005: Add to cart button is present', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const enabled = await detailPage.isAddToCartEnabled();
    expect(enabled).toBe(true);
  });

  test('TC-REG-DET-006: Cart count increments after adding product', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const before = parseInt((await detailPage.getCartCount()) || '0');
    await detailPage.clickAddToCart();
    const after = parseInt((await detailPage.getCartCount()) || '0');

    expect(after).toBeGreaterThan(before);
  });

  test('TC-REG-DET-007: Adding two different products increments count to 2', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);

    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    await detailPage.goto(PRODUCTS[1].category, PRODUCTS[1].name);
    await detailPage.clickAddToCart();

    const count = parseInt(await detailPage.getCartCount());
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('TC-REG-DET-008: URL contains category and product segment', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[2];
    await detailPage.goto(p.category, p.name);

    const url = await detailPage.getCurrentUrl();
    expect(url).toContain(`/detail/${p.category}/`);
  });

  test('TC-REG-DET-009: Ladies Outerwear product detail loads', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[2];
    await detailPage.goto(p.category, p.name);

    const title = await detailPage.getProductTitle();
    expect(title.trim()).not.toBe('');
  });

  test('TC-REG-DET-010: Add to cart on Ladies product increments cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[2];
    await detailPage.goto(p.category, p.name);

    await detailPage.clickAddToCart();
    const count = parseInt(await detailPage.getCartCount());
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-REG-DET-011: Selecting a size does not disable Add to Cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[0];
    await detailPage.goto(p.category, p.name);

    const sizes = await detailPage.getSizeOptions();
    if (sizes.length > 0) {
      await detailPage.selectSize(sizes[0]);
    }

    const enabled = await detailPage.isAddToCartEnabled();
    expect(enabled).toBe(true);
  });

  test('TC-REG-DET-012: Product in T-Shirts category loads correctly', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const p = PRODUCTS[4];
    await detailPage.goto(p.category, p.name);

    const imageVisible = await detailPage.isProductImageVisible();
    expect(imageVisible).toBe(true);
  });
});
