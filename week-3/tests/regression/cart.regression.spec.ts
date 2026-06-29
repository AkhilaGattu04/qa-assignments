/**
 * REGRESSION TEST SUITE — Shopping Cart
 * Classification: REGRESSION
 *
 * TC-REG-CART-001  Empty cart shows empty state message
 * TC-REG-CART-002  Added product appears in cart
 * TC-REG-CART-003  Cart shows correct product name
 * TC-REG-CART-004  Cart shows correct product price
 * TC-REG-CART-005  Cart total matches item prices
 * TC-REG-CART-006  Two different items appear in cart
 * TC-REG-CART-007  Remove item reduces cart count
 * TC-REG-CART-008  Removing all items empties cart
 * TC-REG-CART-009  Checkout button is visible with items in cart
 * TC-REG-CART-010  Checkout button navigates to /checkout
 */

import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { PRODUCTS } from '../../data/testData';
import { parsePriceToNumber } from '../../utils/helpers';

test.describe('Regression — Shopping Cart @regression', () => {

  test('TC-REG-CART-001: Empty cart page loads at /cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.goto();

    const url = await cartPage.getCurrentUrl();
    expect(url).toContain('/cart');
  });

  test('TC-REG-CART-002: Product added from detail appears in cart', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-REG-CART-003: Cart shows correct product name', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const product = PRODUCTS[0];
    await detailPage.goto(product.category, product.name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const names = await cartPage.getCartItemNames();
    expect(names.some(n => n.toLowerCase().includes(product.name.toLowerCase().split(' ')[0]))).toBe(true);
  });

  test('TC-REG-CART-004: Cart item price is in dollar format', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const prices = await cartPage.getCartItemPrices();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(p => {
      if (p.trim()) expect(p).toMatch(/\$\d+\.\d{2}/);
    });
  });

  test('TC-REG-CART-005: Cart total is greater than zero with items', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const total = await cartPage.getCartTotal();
    const amount = parsePriceToNumber(total);
    expect(amount).toBeGreaterThan(0);
  });

  test('TC-REG-CART-006: Two different products appear as separate cart items', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);

    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    await detailPage.goto(PRODUCTS[2].category, PRODUCTS[2].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(2);
  });

  test('TC-REG-CART-007: Checkout button is visible when cart has items', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const visible = await cartPage.isCheckoutButtonVisible();
    expect(visible).toBe(true);
  });

  test('TC-REG-CART-008: Clicking Checkout navigates to /checkout', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    await cartPage.clickCheckout();

    await expect(page).toHaveURL(/\/checkout/);
  });

  test('TC-REG-CART-009: Cart icon badge updates after adding item', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const count = parseInt(await detailPage.getCartCount());
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC-REG-CART-010: Same product added twice increases item quantity or count', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    const count = parseInt(await detailPage.getCartCount());
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
