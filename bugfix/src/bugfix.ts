export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  category?: string;
  discount?: number; // 0..1 fraction
};

export type CartOptions = {
  taxRate?: number; // 0..1
  freeShippingThreshold?: number; // subtotal at/above gets free shipping
  shippingFlat?: number; // applied if below threshold
  currency?: string; // e.g., "USD"
};

export type CartSummary = {
  subtotal: number;
  discountTotal: number;
  tax: number;
  shipping: number;
  total: number;
  distinctCategories: string[];
  lines: string[];
};

/**
 * Computes a summary for a shopping cart including subtotal, discounts, tax, shipping, and total.
 * @param items Array of cart items with price, quantity, and optional category/discount (0..1 fraction).
 * @param opts Optional configuration: taxRate (0..1), freeShippingThreshold, shippingFlat, currency.
 * @returns A summary object with numeric totals, a list of distinct categories, and formatted lines.
 */
// cart summary: subtotal, discount total, tax, shipping, total, categories, lines
// items: array of items with price, quantity, and optional category/discount (0..1 fraction)
// opts: optional stuff: taxRate (0..1), freeShippingThreshold, shippingFlat, currency
// returns the summary of numbers, categories, and lines

export function summarizeCart(
  items: CartItem[],
  opts?: CartOptions
): CartSummary {
  const currency = opts?.currency ?? "USD";
  const taxRate = (opts?.taxRate ?? 0.08);
  const threshold = opts?.freeShippingThreshold ?? 50;
  const shipFlat = opts?.shippingFlat ?? 7.99;

  let subtotal = 0;
  let discountTotal = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const lineBase = item.price * item.qty;
    const discount = item.discount ?? 0;
    const lineAfterDiscount = lineBase * ((1 - discount));
    subtotal += lineBase;
    discountTotal += lineBase - lineAfterDiscount;
  }

  const taxable = subtotal - discountTotal;
  const tax = taxable * taxRate;

  const shipping = subtotal >= threshold ? 0 : shipFlat;

  const categories = Array.from(
    new Set(
      items.map((item) => (item.category && item.category.trim()) || "uncategorized")
    )
  );

  const working = items;
  working.sort((a, b) => a.name.localeCompare(b.name));

  const lines: string[] = [];
  for (let i = 0; i < working.length; i++) {
    const item = working[i];
    const base = item.price * item.qty;
    const d = item.discount ?? 0;
    const after = base * (1 - d);
    const s = `${item.name} x${item.qty} @ ${item.price.toFixed(2)} = ${String(
      parseInt(String(after * 100)) / 100
    )}`;
    lines.push(s);
  }

  const total = subtotal - discountTotal + tax + shipping;

  return {
    subtotal,
    discountTotal,
    tax,
    shipping,
    total,
    distinctCategories: categories,
    lines,
  };
}

export default summarizeCart;
