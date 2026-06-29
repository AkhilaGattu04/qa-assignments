import { Page } from '@playwright/test';

export async function waitForShadowDOM(page: Page, selector: string, timeout = 10000): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return el !== null && el.shadowRoot !== null;
    },
    selector,
    { timeout }
  );
}

export async function getTextFromShadow(page: Page, hostSelector: string, innerSelector: string): Promise<string> {
  return page.evaluate(
    ({ host, inner }) => {
      const hostEl = document.querySelector(host);
      if (!hostEl || !hostEl.shadowRoot) return '';
      const innerEl = hostEl.shadowRoot.querySelector(inner);
      return innerEl ? (innerEl as HTMLElement).textContent?.trim() ?? '' : '';
    },
    { host: hostSelector, inner: innerSelector }
  );
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function parsePriceToNumber(priceStr: string): number {
  return parseFloat(priceStr.replace(/[$,]/g, ''));
}

export function encodeProductName(name: string): string {
  return encodeURIComponent(name).replace(/%20/g, '+');
}

export async function dismissAlert(page: Page): Promise<void> {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
}

export async function acceptAlert(page: Page): Promise<void> {
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
}

export function generateOrderId(): string {
  return `TEST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}
