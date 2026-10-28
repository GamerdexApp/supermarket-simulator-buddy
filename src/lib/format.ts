import {
  formatDateTime as formatDateTimeI18n,
  formatFixed,
  formatNumber,
  formatShortDate,
  formatTime,
} from "@/i18n/formatter";

/** A calendar date in the chosen date format, such as Oct 28, 2026. */
export const formatDate = formatShortDate;

export { formatShortDate, formatTime };

export const formatDateTime = formatDateTimeI18n;

/** Whole dollars in the chosen number format. The game shows prices in dollars in every language. */
export const formatMoney = (amount: number) => `$${formatNumber(amount)}`;

/** Dollars and cents, for loan amounts. */
export const formatCents = (amount: number) => `$${formatFixed(amount, 2)}`;

/** A daily rate such as 0.025 as 2.5%. */
export const formatPercent = (rate: number) => `${formatFixed(rate * 100, 1)}%`;

export { formatNumber };
