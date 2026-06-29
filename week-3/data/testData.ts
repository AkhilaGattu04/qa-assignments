export const CATEGORIES = [
  { name: 'Men\'s Outerwear', slug: 'mens_outerwear', displayName: "Men's Outerwear" },
  { name: 'Ladies Outerwear', slug: 'ladies_outerwear', displayName: "Ladies Outerwear" },
  { name: 'Men\'s T-Shirts',  slug: 'mens_tshirts',    displayName: "Men's T-Shirts" },
  { name: 'Ladies T-Shirts',  slug: 'ladies_tshirts',  displayName: "Ladies T-Shirts" },
];

export const PRODUCTS = [
  {
    category: 'mens_outerwear',
    name: 'Android Nylon Packable Jacket',
    encodedName: 'Android+Nylon+Packable+Jacket',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    category: 'mens_outerwear',
    name: 'Green Flex Fleece Zip Hoodie',
    encodedName: 'Green+Flex+Fleece+Zip+Hoodie',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    category: 'ladies_outerwear',
    name: 'Ladies Modern Stretch Full Zip',
    encodedName: 'Ladies+Modern+Stretch+Full+Zip',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    category: 'ladies_outerwear',
    name: 'Ladies Voyage Fleece Jacket',
    encodedName: 'Ladies+Voyage+Fleece+Jacket',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    category: 'mens_tshirts',
    name: 'Basic Black T-Shirt',
    encodedName: 'Basic+Black+T-Shirt',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    category: 'ladies_tshirts',
    name: 'Ladies Chrome T-Shirt',
    encodedName: 'Ladies+Chrome+T-Shirt',
    price: '$XX.XX',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

export const INVALID_ROUTES = [
  '/list/invalid_category',
  '/detail/mens_outerwear/NonExistentProduct',
  '/nonexistent-page',
];

export const QUANTITY_OPTIONS = ['1', '2', '3', '4', '5'];

export const SIZES = {
  EXTRA_SMALL: 'XS',
  SMALL: 'S',
  MEDIUM: 'M',
  LARGE: 'L',
  EXTRA_LARGE: 'XL',
};

export const EXPECTED_PAGE_TITLES = {
  home: 'SHOP',
  cart: 'SHOP — Cart',
  checkout: 'SHOP — Checkout',
};

export const BASE_URL = 'https://shop.polymer-project.org';
