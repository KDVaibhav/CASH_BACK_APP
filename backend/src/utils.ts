import { exchangeRates } from "./data";
import { CurrencyCode } from "./schema";

export const currencyConverter = (
  value: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
) => {
  if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
    throw new Error("Invalid currency code");
  }
  const valueInUSD = value / exchangeRates[fromCurrency];
  return valueInUSD * exchangeRates[toCurrency];
};

export const valUSD = ({
  value,
  currency,
}: {
  value: number;
  currency: string;
}) => {};
