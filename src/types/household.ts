export type PropertyType =
  | 'single_family'
  | 'apartment'
  | 'townhouse'
  | 'estate'
  | 'vacation_home'
  | 'penthouse'
  | 'villa'
  | 'other';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', decimals: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', decimals: 2 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimals: 2 },
];

export interface Household {
  id: string;
  name: string;
  propertyType: PropertyType;
  address?: string;
  currency: string; // e.g. 'USD'
  yearBuilt?: number;
  squareMeters?: number;
  insurancePolicyLimit?: number;
  insuranceDeductible?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
