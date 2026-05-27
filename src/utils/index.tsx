export const formatCurrency = (amount: number) =>
  `\u20b9${amount.toLocaleString("en-IN")}`;

export function formatPrice(price?: number) {
  return price ? `\u20b9${price.toLocaleString("en-IN")}` : "Ask for Price";
}