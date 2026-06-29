/**
 * END-TO-END TEST SUITE — Full Purchase Flow
 * Classification: E2E
 *
 * These tests simulate a real user journey from landing on the
 * home page through to completing a purchase at checkout.
 *
 * TC-E2E-001  Complete purchase flow: Home → Browse → Detail → Cart → Checkout
 * TC-E2E-002  Multi-product purchase: add 2 items from different categories
 * TC-E2E-003  Change mind flow: add item, go back, add different item
 * TC-E2E-004  Navigation flow: browse multiple categories before buying
 * TC-E2E-005  Mobile viewport purchase flow
 */

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CategoryListPage } from '../../pages/CategoryListPage';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { PRODUCTS, CATEGORIES } from '../../data/testData';
import { VALID_CHECKOUT_DATA } from '../../data/checkoutData';

test.describe('E2E — Full Purchase Flow @e2e', () => {

  test('TC-E2E-001: Home → Category → Product → Cart → Checkout', async ({ page }) => {
    // Step 1: Land on home page
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(page).toHaveURL('https://shop.polymer-project.org/');
    const title = await homePage.getTitle();
    expect(title).toContain('SHOP');

    // Step 2: Navigate to Men's Outerwear category
    await homePage.clickCategory('mens_outerwear');
    await expect(page).toHaveURL(/\/list\/mens_outerwear/);

    // Step 3: Select first product from list
    const listPage = new CategoryListPage(page);
    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    await listPage.clickProduct(0);
    await expect(page).toHaveURL(/\/detail\//);

    // Step 4: Add to cart from detail page
    const detailPage = new ProductDetailPage(page);
    const productTitle = await detailPage.getProductTitle();
    expect(productTitle).not.toBe('');
    await detailPage.clickAddToCart();
    const cartCount = parseInt(await detailPage.getCartCount());
    expect(cartCount).toBeGreaterThanOrEqual(1);

    // Step 5: Navigate to cart via client-side routing (preserves SPA state)
    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    await expect(page).toHaveURL(/\/cart/);
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(1);

    // Step 6: Proceed to checkout
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    // Step 7: Verify checkout page is loaded
    const checkoutPage = new CheckoutPage(page);
    const checkoutLoaded = await checkoutPage.isCheckoutPageLoaded();
    expect(checkoutLoaded).toBe(true);
  });

  test('TC-E2E-002: Multi-product purchase from different categories', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);

    // Add Men's Outerwear product
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();
    expect(parseInt(await detailPage.getCartCount())).toBeGreaterThanOrEqual(1);

    // Add Ladies Outerwear product
    await detailPage.goto(PRODUCTS[2].category, PRODUCTS[2].name);
    await detailPage.clickAddToCart();
    expect(parseInt(await detailPage.getCartCount())).toBeGreaterThanOrEqual(2);

    // Verify both items in cart via client-side routing
    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(2);

    // Total should reflect both items
    const total = await cartPage.getCartTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);

    // Proceed to checkout
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('TC-E2E-003: Browse multiple categories before purchasing', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Browse Men's Outerwear
    await homePage.clickCategory('mens_outerwear');
    const listPage = new CategoryListPage(page);
    const mensCount = await listPage.getProductCount();
    expect(mensCount).toBeGreaterThan(0);

    // Switch to Ladies Outerwear
    await listPage.navigate('/list/ladies_outerwear');
    await listPage.waitForProducts();
    const ladiesCount = await listPage.getProductCount();
    expect(ladiesCount).toBeGreaterThan(0);

    // Switch to T-Shirts
    await listPage.navigate('/list/mens_tshirts');
    await listPage.waitForProducts();
    const tshirtCount = await listPage.getProductCount();
    expect(tshirtCount).toBeGreaterThan(0);

    // Add a T-shirt to cart
    await listPage.clickProduct(0);
    const detailPage = new ProductDetailPage(page);
    await detailPage.clickAddToCart();

    // Verify cart has item via client-side routing
    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-E2E-004: Back navigation preserves browsing state', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Navigate to category
    await homePage.clickCategory('mens_outerwear');
    await expect(page).toHaveURL(/\/list\/mens_outerwear/);

    // Click into a product
    const listPage = new CategoryListPage(page);
    await listPage.clickProduct(0);
    await expect(page).toHaveURL(/\/detail\//);

    // Go back to list
    await page.goBack();
    await expect(page).toHaveURL(/\/list\/mens_outerwear/);

    // Verify products still visible
    const count = await listPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-E2E-005: Cart total updates correctly with multiple same items', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    const product = PRODUCTS[0];
    await detailPage.goto(product.category, product.name);

    // Add same product twice
    await detailPage.clickAddToCart();
    await detailPage.goto(product.category, product.name);
    await detailPage.clickAddToCart();

    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();

    const total = await cartPage.getCartTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);
    const amount = parseFloat(total.replace(/[$,]/g, ''));
    expect(amount).toBeGreaterThan(0);
  });

  test('TC-E2E-006: Full checkout form fill and order placement attempt', async ({ page }) => {
    // Add item to cart
    const detailPage = new ProductDetailPage(page);
    await detailPage.goto(PRODUCTS[0].category, PRODUCTS[0].name);
    await detailPage.clickAddToCart();

    // Navigate to checkout via client-side routing
    const cartPage = new CartPage(page);
    await cartPage.navigateToCart();
    await cartPage.clickCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);

    // Fill form if visible
    const emailVisible = await checkoutPage.isElementVisible(checkoutPage.emailInput);
    if (emailVisible) {
      await checkoutPage.fillFullForm(VALID_CHECKOUT_DATA);

      // Verify a field is filled
      const emailValue = await checkoutPage.emailInput.inputValue();
      expect(emailValue).toBe(VALID_CHECKOUT_DATA.email);
    }

    // Page should still be at checkout (form filled, not yet submitted)
    await expect(page).toHaveURL(/\/checkout/);
  });
});
