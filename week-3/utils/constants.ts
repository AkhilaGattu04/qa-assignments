export const BASE_URL = 'https://shop.polymer-project.org';

export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LIST: (category: string) => `/list/${category}`,
  DETAIL: (category: string, product: string) => `/detail/${category}/${encodeURIComponent(product)}`,
};

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000,
  PAGE_LOAD: 20000,
};

export const CATEGORIES = {
  MENS_OUTERWEAR:  'mens_outerwear',
  LADIES_OUTERWEAR: 'ladies_outerwear',
  MENS_TSHIRTS:    'mens_tshirts',
  LADIES_TSHIRTS:  'ladies_tshirts',
};

export const TEST_TAGS = {
  SANITY: '@sanity',
  REGRESSION: '@regression',
  E2E: '@e2e',
  SMOKE: '@smoke',
};
