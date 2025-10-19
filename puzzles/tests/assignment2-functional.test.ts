import { describe, it, expect } from "vitest";
import { processVendingSessionsFunctional } from "../problems/assignment2-functional";

describe("processVendingSessionsFunctional", () => {
  it("should handle Example A - exact change", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 125, stock: 1 },
      },
      sessions: [[["insert", 100], ["insert", 25], ["select", "A"]]],
    });

    expect(result.inventory).toEqual({ A: { price: 125, stock: 0 } });
    expect(result.receipts[0].dispensed).toBe("A");
    expect(result.receipts[0].spent).toBe(125);
    expect(result.receipts[0].changeTotal).toBe(0);
    expect(result.receipts[0].errors).toEqual([]);
  });

  it("should handle Example B - insufficient credit then success", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        B: { price: 130, stock: 1 },
      },
      sessions: [
        [["insert", 100], ["insert", 25], ["select", "B"]],
        [["insert", 100], ["insert", 100], ["select", "B"]],
      ],
    });

    expect(result.inventory).toEqual({ B: { price: 130, stock: 0 } });
    expect(result.receipts[0].errors[0]).toContain("insufficient credit");
    expect(result.receipts[1].dispensed).toBe("B");
    expect(result.receipts[1].changeTotal).toBe(70);
    expect(result.receipts[1].changeCoins).toEqual({ 50: 1, 10: 2 });
  });

  it("should handle cancel refunding inserted coins", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 100, stock: 1 },
      },
      sessions: [[["insert", 50], ["insert", 25], ["insert", 10], ["cancel"]]],
    });

    expect(result.receipts[0].changeCoins).toEqual({ 50: 1, 25: 1, 10: 1 });
    expect(result.receipts[0].changeTotal).toBe(85);
    expect(result.receipts[0].spent).toBe(0);
    expect(result.receipts[0].dispensed).toBeUndefined();
  });

  it("should calculate greedy change correctly", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 100, stock: 1 },
      },
      sessions: [[["insert", 100], ["insert", 100], ["select", "A"]]],
    });

    expect(result.receipts[0].changeTotal).toBe(100);
    expect(result.receipts[0].changeCoins).toEqual({ 100: 1 });
  });

  it("should handle multiple sessions with shared inventory", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 50, stock: 2 },
      },
      sessions: [
        [["insert", 50], ["select", "A"]],
        [["insert", 50], ["select", "A"]],
        [["insert", 50], ["select", "A"]], // Out of stock
      ],
    });

    expect(result.inventory.A.stock).toBe(0);
    expect(result.receipts[0].dispensed).toBe("A");
    expect(result.receipts[1].dispensed).toBe("A");
    expect(result.receipts[2].dispensed).toBeUndefined();
    expect(result.receipts[2].errors[0]).toContain("out of stock");
  });

  it("should normalize negative inventory values", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: -50, stock: -2 },
        B: { price: 100.7, stock: 3.9 },
      },
      sessions: [],
    });

    expect(result.inventory.A).toEqual({ price: 0, stock: 0 });
    expect(result.inventory.B).toEqual({ price: 100, stock: 3 });
  });

  it("should handle unsupported coin denomination", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 50, stock: 1 },
      },
      sessions: [[["insert", 75], ["insert", 50], ["select", "A"]]],
    });

    expect(result.receipts[0].errors).toContain("unsupported coin: 75");
    expect(result.receipts[0].dispensed).toBe("A");
    expect(result.receipts[0].spent).toBe(50);
  });

  it("should end session after successful purchase", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 50, stock: 1 },
      },
      sessions: [
        [
          ["insert", 100],
          ["select", "A"],
          ["insert", 100], // Should be ignored
        ],
      ],
    });

    expect(result.receipts[0].changeTotal).toBe(50);
    // If the third insert was processed, we'd have more change
  });

  it("should handle noop command", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 50, stock: 1 },
      },
      sessions: [[["noop"], ["insert", 50], ["noop"], ["select", "A"]]],
    });

    expect(result.receipts[0].dispensed).toBe("A");
    expect(result.receipts[0].errors).toEqual([]);
  });

  it("should handle empty sessions", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 50, stock: 1 },
      },
      sessions: [[]],
    });

    expect(result.receipts.length).toBe(1);
    expect(result.receipts[0].spent).toBe(0);
    expect(result.receipts[0].changeTotal).toBe(0);
    expect(result.receipts[0].dispensed).toBeUndefined();
  });

  it("should be a pure function (no mutation)", () => {
    const originalInventory = {
      A: { price: 100, stock: 1 },
    };

    const input = {
      inventory: originalInventory,
      sessions: [[["insert", 100], ["select", "A"]]],
    };

    const result = processVendingSessionsFunctional(input);

    // Original inventory should not be mutated
    expect(input.inventory.A.stock).toBe(1);
    expect(originalInventory.A.stock).toBe(1);

    // Result should have updated inventory
    expect(result.inventory.A.stock).toBe(0);
  });

  it("should handle complex change breakdown", () => {
    const result = processVendingSessionsFunctional({
      inventory: {
        A: { price: 37, stock: 1 },
      },
      sessions: [[["insert", 100], ["select", "A"]]],
    });

    // Change = 63 = 50 + 10 + 1 + 1 + 1
    expect(result.receipts[0].changeTotal).toBe(63);
    expect(result.receipts[0].changeCoins).toEqual({
      50: 1,
      10: 1,
      1: 3,
    });
  });
});
