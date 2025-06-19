interface FormatOptions {
  style: 'decimal' | 'currency' | 'percent';
  currency: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export const formatNumber = (
  price: number,
  format: string = 'en-IN',
  options: FormatOptions = { style: 'currency', currency: 'USD' },
): string => {
  return new Intl.NumberFormat(format, {
    style: options.style,
    currency: options.currency,
  }).format(price);
};

export const formatThousand = (price: number): string => {
  if (price >= 1_000_000_000) {
    return (price / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (price >= 1_000) {
    return (price / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  if(price < 1_000 && price > 0) {
    return (price / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
  }
  return price.toString();
};
