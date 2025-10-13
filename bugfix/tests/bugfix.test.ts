import { describe, it, expect } from "vitest";
import summarizeCart, { CartItem } from "../src/bugfix";

const baseItems: CartItem[] = [
  { id: "1", name: "Apple", price: 1.2, qty: 5, category: "produce" },
  {
    id: "2",
    name: "Milk",
    price: 3.5,
    qty: 2,
    category: "dairy",
    discount: 0.1,
  },
  { id: "3", name: "Bread", price: 2.0, qty: 1, category: "bakery" },
];

describe("summarizeCart (starter has bugs; these tests should initially fail)", () => {
  it("computes an 8% default tax, not 80%", () => {
    const r = summarizeCart(structuredClone(baseItems), {
      /* default tax */
    });
    const subtotal = 1.2 * 5 + 3.5 * 2 + 2.0 * 1; // 6 + 7 + 2 = 15
    // discount: Milk line 3.5*2 = 7, discount 10% of 7 = 0.7
    const discount = 0.7;
    const taxable = subtotal - discount; // 14.3
    const expectedTax = +(taxable * 0.08).toFixed(2); // 1.14
    expect(+r.tax.toFixed(2)).toBe(expectedTax);
  });

  it("treats discount as fraction (0..1), not percent", () => {
    const items = structuredClone(baseItems);
    const r = summarizeCart(items, { taxRate: 0 });
    const subtotal = 15;
    const expectedDiscount = 7 * 0.1; // 0.7
    expect(+r.discountTotal.toFixed(2)).toBe(+expectedDiscount.toFixed(2));
    const expectedTotal = subtotal - expectedDiscount;
    expect(+r.total.toFixed(2)).toBe(+expectedTotal.toFixed(2));
  });

  it("applies free shipping when subtotal >= threshold (default 50), otherwise charges flat", () => {
    const small: CartItem[] = [{ id: "1", name: "Pen", price: 2, qty: 2 }];
    const rSmall = summarizeCart(structuredClone(small), { taxRate: 0 });
    // subtotal = 4 < 50, should pay 7.99 shipping
    expect(+rSmall.shipping.toFixed(2)).toBe(7.99);

    const big: CartItem[] = [{ id: "a", name: "Chair", price: 60, qty: 1 }];
    const rBig = summarizeCart(structuredClone(big), { taxRate: 0 });
    // subtotal = 60 >= 50, shipping should be 0
    expect(rBig.shipping).toBe(0);
  });

  it("does not mutate the original items array order", () => {
    const items = structuredClone(baseItems);
    const originalNames = items.map((i) => i.name);
    summarizeCart(items, { taxRate: 0 });
    const afterNames = items.map((i) => i.name);
    expect(afterNames).toEqual(originalNames);
  });

  it("rounds line totals and final total to cents (no truncation)", () => {
    const items: CartItem[] = [
      { id: "x", name: "Gadget", price: 19.99, qty: 1, discount: 0.15 }, // 19.99 * (1 - .15) = 16.9915 -> 16.99
    ];
    const r = summarizeCart(structuredClone(items), {
      taxRate: 0.07,
      shippingFlat: 5,
      freeShippingThreshold: 100,
    });
    const expectedLine = "Gadget x1 @ 19.99 = 16.99";
    expect(r.lines.some((s) => s.includes(expectedLine))).toBe(true);

    const subtotal = 19.99;
    const discount = 19.99 * 0.15; // 2.9985 -> 3.00
    const taxable = subtotal - discount; // ~16.9915
    const tax = +(taxable * 0.07).toFixed(2); // ~1.19
    const shipping = 5;
    const expectedTotal = +(subtotal - discount + tax + shipping).toFixed(2);
    expect(+r.total.toFixed(2)).toBe(expectedTotal);
  });

  it("collects distinct categories including 'uncategorized' when missing", () => {
    const items: CartItem[] = [
      { id: "1", name: "A", price: 1, qty: 1, category: "alpha" },
      { id: "2", name: "B", price: 1, qty: 1 },
      { id: "3", name: "C", price: 1, qty: 1, category: "alpha" },
      { id: "4", name: "D", price: 1, qty: 1, category: " beta " },
    ];
    const r = summarizeCart(structuredClone(items), { taxRate: 0 });
    expect(r.distinctCategories.sort()).toEqual(
      ["alpha", "beta", "uncategorized"].sort()
    );
  });
});
