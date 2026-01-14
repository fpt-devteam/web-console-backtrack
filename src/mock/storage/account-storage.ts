import type { AccountDetails, BillingAddress, PaymentMethod } from '@/mock/data/mock-plan';

const STORAGE_KEYS = {
  ACCOUNT_DETAILS: '__MOCK_ACCOUNT_DETAILS__',
  BILLING_ADDRESS: '__MOCK_BILLING_ADDRESS__',
  PAYMENT_METHOD: '__MOCK_PAYMENT_METHOD__',
};

// Account Details
export function saveAccountDetails(data: AccountDetails): void {
  localStorage.setItem(STORAGE_KEYS.ACCOUNT_DETAILS, JSON.stringify(data));
}

export function getAccountDetails(defaultData: AccountDetails): AccountDetails {
  const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNT_DETAILS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

// Billing Address
export function saveBillingAddress(data: BillingAddress): void {
  localStorage.setItem(STORAGE_KEYS.BILLING_ADDRESS, JSON.stringify(data));
}

export function getBillingAddress(defaultData: BillingAddress): BillingAddress {
  const stored = localStorage.getItem(STORAGE_KEYS.BILLING_ADDRESS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

// Payment Method
export function savePaymentMethod(data: PaymentMethod): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENT_METHOD, JSON.stringify(data));
}

export function getPaymentMethod(defaultData: PaymentMethod): PaymentMethod {
  const stored = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHOD);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

