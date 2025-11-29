import { describe, it, expect } from "vitest";
import { processOrders } from "../problems/assignment2";
import type { Product, Box } from "../problems/assignment1";

describe("Assignment 2: Fulfillment Processor", () => {
  const p1: Product = { id: "p1", weight: 100, stock: 10 };
  const p2: Product = { id: "p2", weight: 500, stock: 5 };
  const smallBox: Box = { id: "small", maxWeight: 1000 };

  it("fulfills a valid order", () => {
    const input = {
      orders: [{ id: "o1", items: [{ productId: "p1", quantity: 2 }] }],
      inventory: { p1 },
      boxes: [smallBox],
    };

    const result = processOrders(input);

    expect(result.failedOrders).toHaveLength(0);
    expect(result.shipments).toHaveLength(1);
    expect(result.shipments[0].totalWeight).toBe(200);
    expect(result.inventory["p1"].stock).toBe(8); // 10 - 2
  });

  it("fails if item out of stock", () => {
    const input = {
      orders: [{ id: "o1", items: [{ productId: "p1", quantity: 20 }] }],
      inventory: { p1 },
      boxes: [smallBox],
    };

    const result = processOrders(input);

    expect(result.shipments).toHaveLength(0);
    expect(result.failedOrders[0].reason).toContain("Item");
    expect(result.inventory["p1"].stock).toBe(10); // Unchanged
  });

  it("fails if order too heavy for any box", () => {
    const input = {
      orders: [{ id: "o1", items: [{ productId: "p2", quantity: 3 }] }], // 1500g
      inventory: { p2 },
      boxes: [smallBox], // Max 1000g
    };

    const result = processOrders(input);

    expect(result.failedOrders[0].reason).toBe("Too heavy");
  });

  it("updates inventory for multi-item orders correctly", () => {
    const input = {
      orders: [
        {
          id: "o1",
          items: [
            { productId: "p1", quantity: 1 },
            { productId: "p2", quantity: 1 },
          ],
        },
      ],
      inventory: { p1, p2 },
      boxes: [smallBox],
    };

    const result = processOrders(input);

    expect(result.inventory["p1"].stock).toBe(9);
    expect(result.inventory["p2"].stock).toBe(4);
  });
});
