export const formatCurrency = (amount: number) =>
  `\u20b9${amount.toLocaleString("en-IN")}`;

export function formatPrice(price?: number) {
  return price ? `\u20b9${price.toLocaleString("en-IN")}` : "Ask for Price";
}
export function isOrderItemForProduct(
  item: any,
  product: { id?: string; slug?: string; title?: string; name?: string }
) {
  const productIdentifiers = [product.id, product.slug, product.title]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const itemIdentifiers = [
    item?.name,
    item?.slug,
    item?.product?._id,
    item?.product?.id,
    item?.product?.slug,
    item?.product?.title,
    item?.product?.name,
    typeof item?.product === "string" ? item.product : undefined,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return itemIdentifiers.some((itemId) =>
    productIdentifiers.some(
      (prodId) =>
        itemId === prodId ||
        itemId.endsWith(prodId) ||
        prodId.endsWith(itemId)
    )
  );
}