import { describe, it, expect } from "vitest";
import { processPizzaOrders } from "../problems/assignment4";

describe("processPizzaOrders", () => {
  it("should process a simple order with no discount", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
        "Soda": 3,
      },
      orders: [
        { customer: "Alice", items: ["Pizza", "Soda"] },
      ],
    });

    expect(result.orders.length).toBe(1);
    expect(result.orders[0].customer).toBe("Alice");
    expect(result.orders[0].subtotal).toBe(18);
    expect(result.orders[0].discount).toBe(0);
    expect(result.orders[0].tax).toBe(1.44);
    expect(result.orders[0].total).toBe(19.44);
    expect(result.orders[0].errors).toEqual([]);
  });

  it("should apply SAVE10 discount correctly", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [
        { customer: "Bob", items: ["Pizza"], discountCode: "SAVE10" },
      ],
    });

    expect(result.orders[0].subtotal).toBe(15);
    expect(result.orders[0].discount).toBe(10);
    expect(result.orders[0].tax).toBe(0.40);
    expect(result.orders[0].total).toBe(5.40);
    expect(result.orders[0].errors).toEqual([]);
  });

  it("should apply SAVE20 discount correctly", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
        "Salad": 8,
      },
      orders: [
        { customer: "Carol", items: ["Pizza", "Salad"], discountCode: "SAVE20" },
      ],
    });

    expect(result.orders[0].subtotal).toBe(23);
    expect(result.orders[0].discount).toBe(20);
    expect(result.orders[0].tax).toBe(0.24);
    expect(result.orders[0].total).toBe(3.24);
  });

  it("should apply HALF discount correctly", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 20,
      },
      orders: [
        { customer: "Dave", items: ["Pizza"], discountCode: "HALF" },
      ],
    });

    expect(result.orders[0].subtotal).toBe(20);
    expect(result.orders[0].discount).toBe(10);
    expect(result.orders[0].tax).toBe(0.80);
    expect(result.orders[0].total).toBe(10.80);
  });

  it("should handle invalid discount code", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [
        { customer: "Eve", items: ["Pizza"], discountCode: "INVALID" },
      ],
    });

    expect(result.orders[0].subtotal).toBe(15);
    expect(result.orders[0].discount).toBe(0);
    expect(result.orders[0].tax).toBe(1.20);
    expect(result.orders[0].total).toBe(16.20);
    expect(result.orders[0].errors).toContain("invalid discount code: INVALID");
  });

  it("should handle invalid menu items", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [
        { customer: "Frank", items: ["Pizza", "Burger"] },
      ],
    });

    expect(result.orders[0].subtotal).toBe(15);
    expect(result.orders[0].errors).toContain("item Burger not found");
  });

  it("should handle empty order", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [
        { customer: "Grace", items: [] },
      ],
    });

    expect(result.orders[0].subtotal).toBe(0);
    expect(result.orders[0].discount).toBe(0);
    expect(result.orders[0].tax).toBe(0);
    expect(result.orders[0].total).toBe(0);
  });

  it("should handle multiple items of the same type", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [
        { customer: "Henry", items: ["Pizza", "Pizza", "Pizza"] },
      ],
    });

    expect(result.orders[0].subtotal).toBe(45);
    expect(result.orders[0].tax).toBe(3.60);
    expect(result.orders[0].total).toBe(48.60);
  });

  it("should not allow discount to exceed subtotal", () => {
    const result = processPizzaOrders({
      menu: {
        "Soda": 3,
      },
      orders: [
        { customer: "Ivy", items: ["Soda"], discountCode: "SAVE20" },
      ],
    });

    // Subtotal is 3, discount should be capped at 3
    expect(result.orders[0].subtotal).toBe(3);
    expect(result.orders[0].discount).toBe(3);
    expect(result.orders[0].tax).toBe(0);
    expect(result.orders[0].total).toBe(0);
  });

  it("should handle multiple orders", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
        "Soda": 3,
      },
      orders: [
        { customer: "Alice", items: ["Pizza"] },
        { customer: "Bob", items: ["Soda"], discountCode: "SAVE10" },
      ],
    });

    expect(result.orders.length).toBe(2);
    expect(result.orders[0].customer).toBe("Alice");
    expect(result.orders[0].total).toBe(16.20);
    expect(result.orders[1].customer).toBe("Bob");
    expect(result.orders[1].total).toBe(0); // 3 - 3 (capped) = 0
  });

  it("should round values to 2 decimal places", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 10.99,
      },
      orders: [
        { customer: "Jack", items: ["Pizza"] },
      ],
    });

    // 10.99 * 0.08 = 0.8792, should round to 0.88
    expect(result.orders[0].subtotal).toBe(10.99);
    expect(result.orders[0].tax).toBe(0.88);
    expect(result.orders[0].total).toBe(11.87);
  });

  it("should handle HALF discount with rounding", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15.99,
      },
      orders: [
        { customer: "Kelly", items: ["Pizza"], discountCode: "HALF" },
      ],
    });

    expect(result.orders[0].subtotal).toBe(15.99);
    expect(result.orders[0].discount).toBe(8.00); // Half of 15.99 rounded
    expect(result.orders[0].tax).toBe(0.64); // 8% of 7.99
    expect(result.orders[0].total).toBe(8.63);
  });

  it("should handle complex order with multiple errors", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
        "Soda": 3,
      },
      orders: [
        {
          customer: "Leo",
          items: ["Pizza", "Burger", "Soda", "Fries"],
          discountCode: "BADCODE"
        },
      ],
    });

    expect(result.orders[0].subtotal).toBe(18); // Pizza + Soda only
    expect(result.orders[0].errors.length).toBe(3); // Burger, Fries, BADCODE
    expect(result.orders[0].errors).toContain("item Burger not found");
    expect(result.orders[0].errors).toContain("item Fries not found");
    expect(result.orders[0].errors).toContain("invalid discount code: BADCODE");
  });

  it("should handle no orders", () => {
    const result = processPizzaOrders({
      menu: {
        "Pizza": 15,
      },
      orders: [],
    });

    expect(result.orders).toEqual([]);
  });
});
