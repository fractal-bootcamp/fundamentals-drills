import { describe, it, expect } from "vitest";
import {
  checkStock,
  calculateTotalWeight,
  findSmallestBox,
  reduceInventory,
  type Product,
  type Box,
  type OrderItem,
} from "../problems/assignment1";

describe("Assignment 1: Fulfillment Primitives", () => {
  const p1: Product = { id: "p1", weight: 100, stock: 10 };
  const p2: Product = { id: "p2", weight: 500, stock: 2 };
  const inventory = { p1, p2 };

  describe("checkStock", () => {
    it("returns true when sufficient stock", () => {
      expect(checkStock(inventory, "p1", 5)).toBe(true);
    });
    it("returns false when insufficient stock", () => {
      expect(checkStock(inventory, "p1", 11)).toBe(false);
    });
    it("returns false when product missing", () => {
      expect(checkStock(inventory, "z9", 1)).toBe(false);
    });
  });

  describe("calculateTotalWeight", () => {
    it("sums up weights correctly", () => {
      const items: OrderItem[] = [
        { productId: "p1", quantity: 2 }, // 2 * 100 = 200
        { productId: "p2", quantity: 1 }, // 1 * 500 = 500
      ];
      expect(calculateTotalWeight(items, inventory)).toBe(700);
    });
  });

  describe("findSmallestBox", () => {
    const boxes: Box[] = [
      { id: "medium", maxWeight: 1000 },
      { id: "small", maxWeight: 500 },
      { id: "large", maxWeight: 2000 },
    ];

    it("picks smallest box that fits", () => {
      // 400g fits in small(500)
      expect(findSmallestBox(boxes, 400)?.id).toBe("small");
      // 800g fits in medium(1000)
      expect(findSmallestBox(boxes, 800)?.id).toBe("medium");
    });

    it("returns null if too heavy", () => {
      expect(findSmallestBox(boxes, 5000)).toBe(null);
    });
  });

  describe("reduceInventory", () => {
    it("returns new product with lower stock", () => {
      const result = reduceInventory(p1, 3);
      expect(result.stock).toBe(7);
      expect(result).not.toBe(p1);
    });
  });
});
