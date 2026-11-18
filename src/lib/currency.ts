import Decimal from 'decimal.js';
import { SUPPORTED_CURRENCIES } from '../types/household';

export function formatCurrency(
  amount: number | string | Decimal | undefined | null,
  currencyCode: string = 'USD',
  options?: { compact?: boolean; hideDecimals?: boolean }
): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '—';
  }

  const dec = new Decimal(amount);
  const numValue = dec.toNumber();

  const config = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  const minDecimals = options?.hideDecimals ? 0 : (config?.decimals ?? 2);
  const maxDecimals = options?.hideDecimals ? 0 : (config?.decimals ?? 2);

  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      notation: options?.compact ? 'compact' : 'standard',
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    });
    return formatter.format(numValue);
  } catch {
    // Fallback if browser locale doesn't recognize the currency code
    const symbol = config?.symbol || '$';
    return `${symbol}${numValue.toLocaleString('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    })}`;
  }
}

export function sumAmounts(amounts: (number | undefined | null)[]): number {
  return amounts
    .reduce((acc, curr) => {
      if (curr === undefined || curr === null || isNaN(curr)) return acc;
      return acc.plus(new Decimal(curr));
    }, new Decimal(0))
    .toNumber();
}
