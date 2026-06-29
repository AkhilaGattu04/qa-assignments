import { CheckoutFormData } from '../pages/CheckoutPage';

export const VALID_CHECKOUT_DATA: CheckoutFormData = {
  email: 'testuser@example.com',
  phone: '4155551234',
  shipAddress: '123 Main Street',
  shipCity: 'San Francisco',
  shipState: 'CA',
  shipZip: '94105',
  shipCountry: 'US',
  cardName: 'John Doe',
  cardNumber: '4111 1111 1111 1111',
  cardExpiryMonth: '12',
  cardExpiryYear: '2026',
  cardCvc: '123',
};

export const ALTERNATE_CHECKOUT_DATA: CheckoutFormData = {
  email: 'janesmith@example.com',
  phone: '2125559876',
  shipAddress: '456 Oak Avenue',
  shipCity: 'New York',
  shipState: 'NY',
  shipZip: '10001',
  shipCountry: 'US',
  cardName: 'Jane Smith',
  cardNumber: '5500 0055 5555 5559',
  cardExpiryMonth: '06',
  cardExpiryYear: '2027',
  cardCvc: '456',
};

export const INVALID_CHECKOUT_DATA = {
  emptyEmail: {
    ...VALID_CHECKOUT_DATA,
    email: '',
  },
  emptyAddress: {
    ...VALID_CHECKOUT_DATA,
    shipAddress: '',
  },
  shortZip: {
    ...VALID_CHECKOUT_DATA,
    shipZip: '123',
  },
  shortCard: {
    ...VALID_CHECKOUT_DATA,
    cardNumber: '1234',
  },
  missingCvc: {
    ...VALID_CHECKOUT_DATA,
    cardCvc: '',
  },
};
