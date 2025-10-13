import { describe, expect, test } from "vitest";
import { computeCheckoutSummary } from "./code";

describe("computeCheckoutSummary", () => {
  test("aggregates itemCount by summing quantities", () => {
    const result = computeCheckoutSummary(
      [
        { name: "notebook", price: 5, quantity: 2 },
        { name: "pencil", price: 1, quantity: 3 },
      ],
      0
    );
    expect(result.itemCount).toBe(5);
  });

  test("computes tax from a decimal taxRate", () => {
    const result = computeCheckoutSummary(
      [{ name: "jacket", price: 100, quantity: 1 }],
      0.08
    );
    expect(result.tax).toBeCloseTo(8, 5);
  });

  test("applies SAVE10 discount to subtotal", () => {
    const result = computeCheckoutSummary(
      [{ name: "headphones", price: 100, quantity: 1 }],
      0,
      "SAVE10"
    );
    expect(result.total).toBeCloseTo(90, 5);
  });

  test("grants free shipping when discounted subtotal is at least threshold", () => {
    const result = computeCheckoutSummary(
      [{ name: "books", price: 25, quantity: 2 }],
      0
    );
    expect(result.freeShipping).toBe(true);
  });
});
