import { describe, it, expect } from "vitest";
import { lowStockItems } from "../problems/assignment1.5_03";

describe("lowStockItems", () => {
  it("returns empty array when no items are below threshold", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 100 },
          { itemId: "gadget", warehouse: "A", stock: 50 }
        ],
        [],
        10
      )
    ).toEqual([]);
  });

  it("returns items at or below threshold", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 5 },
          { itemId: "gadget", warehouse: "A", stock: 10 }
        ],
        [],
        5
      )
    ).toEqual([{ itemId: "widget", warehouse: "A", stock: 5 }]);
  });

  it("processes incoming shipments correctly", () => {
    expect(
      lowStockItems(
        [{ itemId: "widget", warehouse: "A", stock: 5 }],
        [{ type: "in", itemId: "widget", warehouse: "A", quantity: 10 }],
        10
      )
    ).toEqual([]);
  });

  it("processes outgoing shipments correctly", () => {
    expect(
      lowStockItems(
        [{ itemId: "widget", warehouse: "A", stock: 10 }],
        [{ type: "out", itemId: "widget", warehouse: "A", quantity: 8 }],
        3
      )
    ).toEqual([{ itemId: "widget", warehouse: "A", stock: 2 }]);
  });

  it("prevents stock from going below zero", () => {
    expect(
      lowStockItems(
        [{ itemId: "widget", warehouse: "A", stock: 5 }],
        [{ type: "out", itemId: "widget", warehouse: "A", quantity: 10 }],
        5
      )
    ).toEqual([{ itemId: "widget", warehouse: "A", stock: 0 }]);
  });

  it("ignores shipments for non-existent inventory items", () => {
    expect(
      lowStockItems(
        [{ itemId: "widget", warehouse: "A", stock: 5 }],
        [
          { type: "in", itemId: "gadget", warehouse: "A", quantity: 10 },
          { type: "out", itemId: "widget", warehouse: "B", quantity: 5 }
        ],
        10
      )
    ).toEqual([{ itemId: "widget", warehouse: "A", stock: 5 }]);
  });

  it("handles same item in multiple warehouses independently", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 10 },
          { itemId: "widget", warehouse: "B", stock: 2 }
        ],
        [{ type: "out", itemId: "widget", warehouse: "A", quantity: 8 }],
        5
      )
    ).toEqual([
      { itemId: "widget", warehouse: "B", stock: 2 },
      { itemId: "widget", warehouse: "A", stock: 2 }
    ]);
  });

  it("sorts results by stock level (lowest first)", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 5 },
          { itemId: "gadget", warehouse: "A", stock: 2 },
          { itemId: "doohickey", warehouse: "A", stock: 8 }
        ],
        [],
        10
      )
    ).toEqual([
      { itemId: "gadget", warehouse: "A", stock: 2 },
      { itemId: "widget", warehouse: "A", stock: 5 },
      { itemId: "doohickey", warehouse: "A", stock: 8 }
    ]);
  });

  it("sorts by itemId when stock levels are equal", () => {
    expect(
      lowStockItems(
        [
          { itemId: "zebra", warehouse: "A", stock: 5 },
          { itemId: "apple", warehouse: "A", stock: 5 },
          { itemId: "mango", warehouse: "A", stock: 5 }
        ],
        [],
        10
      )
    ).toEqual([
      { itemId: "apple", warehouse: "A", stock: 5 },
      { itemId: "mango", warehouse: "A", stock: 5 },
      { itemId: "zebra", warehouse: "A", stock: 5 }
    ]);
  });

  it("sorts by warehouse when itemId and stock are equal", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "C", stock: 5 },
          { itemId: "widget", warehouse: "A", stock: 5 },
          { itemId: "widget", warehouse: "B", stock: 5 }
        ],
        [],
        10
      )
    ).toEqual([
      { itemId: "widget", warehouse: "A", stock: 5 },
      { itemId: "widget", warehouse: "B", stock: 5 },
      { itemId: "widget", warehouse: "C", stock: 5 }
    ]);
  });

  it("handles complex scenario with multiple items, warehouses, and shipments", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 20 },
          { itemId: "widget", warehouse: "B", stock: 5 },
          { itemId: "gadget", warehouse: "A", stock: 15 },
          { itemId: "gadget", warehouse: "B", stock: 10 },
          { itemId: "doohickey", warehouse: "A", stock: 3 }
        ],
        [
          { type: "out", itemId: "widget", warehouse: "A", quantity: 18 },
          { type: "in", itemId: "gadget", warehouse: "B", quantity: 5 },
          { type: "out", itemId: "gadget", warehouse: "A", quantity: 10 },
          { type: "out", itemId: "doohickey", warehouse: "A", quantity: 2 }
        ],
        5
      )
    ).toEqual([
      { itemId: "doohickey", warehouse: "A", stock: 1 },
      { itemId: "widget", warehouse: "A", stock: 2 },
      { itemId: "gadget", warehouse: "A", stock: 5 },
      { itemId: "widget", warehouse: "B", stock: 5 }
    ]);
  });

  it("handles empty initial inventory", () => {
    expect(lowStockItems([], [], 10)).toEqual([]);
  });

  it("includes items at exactly the threshold", () => {
    expect(
      lowStockItems(
        [
          { itemId: "widget", warehouse: "A", stock: 10 },
          { itemId: "gadget", warehouse: "A", stock: 11 }
        ],
        [],
        10
      )
    ).toEqual([{ itemId: "widget", warehouse: "A", stock: 10 }]);
  });
});
