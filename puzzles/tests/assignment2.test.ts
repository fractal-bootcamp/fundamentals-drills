import { describe, it, expect } from "vitest";
import { simulateDeliveryRoute } from "../problems/assignment2";

describe("simulateDeliveryRoute", () => {
  it("should handle basic movement and delivery from example 1", () => {
    const result = simulateDeliveryRoute([
      "forward 5",
      "pickup A",
      "right",
      "forward 3",
      "deliver A"
    ]);

    expect(result.finalPosition).toEqual([3, 5]);
    expect(result.finalDirection).toBe("East");
    expect(result.undeliveredPackages).toEqual([]);
    expect(result.deliveryLocations).toEqual({ A: [3, 5] });
  });

  it("should handle undelivered packages from example 2", () => {
    const result = simulateDeliveryRoute([
      "pickup X",
      "forward 2",
      "pickup Y",
      "left",
      "forward 1",
      "deliver X"
    ]);

    expect(result.finalPosition).toEqual([-1, 2]);
    expect(result.finalDirection).toBe("West");
    expect(result.undeliveredPackages).toEqual(["Y"]);
    expect(result.deliveryLocations).toEqual({ X: [-1, 2] });
  });

  it("should handle empty instructions", () => {
    const result = simulateDeliveryRoute([]);

    expect(result.finalPosition).toEqual([0, 0]);
    expect(result.finalDirection).toBe("North");
    expect(result.undeliveredPackages).toEqual([]);
    expect(result.deliveryLocations).toEqual({});
  });

  it("should handle movement in all four directions", () => {
    const result = simulateDeliveryRoute([
      "forward 5",      // North to [0, 5]
      "right",          // Face East
      "forward 3",      // East to [3, 5]
      "right",          // Face South
      "forward 2",      // South to [3, 3]
      "right",          // Face West
      "forward 1"       // West to [2, 3]
    ]);

    expect(result.finalPosition).toEqual([2, 3]);
    expect(result.finalDirection).toBe("West");
  });

  it("should handle full 360 rotation", () => {
    const result = simulateDeliveryRoute([
      "left",
      "left",
      "left",
      "left"
    ]);

    expect(result.finalPosition).toEqual([0, 0]);
    expect(result.finalDirection).toBe("North");
  });

  it("should ignore delivery attempts for packages not picked up", () => {
    const result = simulateDeliveryRoute([
      "forward 2",
      "deliver A",
      "pickup B",
      "forward 1",
      "deliver B"
    ]);

    expect(result.finalPosition).toEqual([0, 3]);
    expect(result.undeliveredPackages).toEqual([]);
    expect(result.deliveryLocations).toEqual({ B: [0, 3] });
  });

  it("should handle multiple packages at same location", () => {
    const result = simulateDeliveryRoute([
      "pickup A",
      "pickup B",
      "pickup C",
      "forward 5",
      "deliver A",
      "deliver B",
      "deliver C"
    ]);

    expect(result.finalPosition).toEqual([0, 5]);
    expect(result.undeliveredPackages).toEqual([]);
    expect(result.deliveryLocations).toEqual({
      A: [0, 5],
      B: [0, 5],
      C: [0, 5]
    });
  });

  it("should sort undelivered packages alphabetically", () => {
    const result = simulateDeliveryRoute([
      "pickup Z",
      "pickup A",
      "pickup M",
      "pickup B",
      "forward 1"
    ]);

    expect(result.undeliveredPackages).toEqual(["A", "B", "M", "Z"]);
  });

  it("should handle case-sensitive package IDs", () => {
    const result = simulateDeliveryRoute([
      "pickup a",
      "pickup A",
      "forward 1",
      "deliver a"
    ]);

    expect(result.undeliveredPackages).toEqual(["A"]);
    expect(result.deliveryLocations).toEqual({ a: [0, 1] });
  });

  it("should handle complex route with multiple pickups and deliveries", () => {
    const result = simulateDeliveryRoute([
      "pickup Package1",
      "forward 3",
      "pickup Package2",
      "right",
      "forward 2",
      "deliver Package1",
      "forward 1",
      "pickup Package3",
      "left",
      "forward 1",
      "deliver Package2",
      "left",
      "forward 1",
      "deliver Package3"
    ]);

    expect(result.finalPosition).toEqual([2, 4]);
    expect(result.finalDirection).toBe("West");
    expect(result.undeliveredPackages).toEqual([]);
    expect(result.deliveryLocations).toEqual({
      Package1: [2, 3],
      Package2: [3, 4],
      Package3: [2, 4]
    });
  });

  it("should handle turning left from each direction", () => {
    const testCases = [
      { start: "North", expected: "West" },
      { start: "West", expected: "South" },
      { start: "South", expected: "East" },
      { start: "East", expected: "North" }
    ];

    for (const { start, expected } of testCases) {
      let instructions = [];

      // Turn to face starting direction
      if (start === "East") instructions.push("right");
      if (start === "South") instructions.push("right", "right");
      if (start === "West") instructions.push("left");

      instructions.push("left");

      const result = simulateDeliveryRoute(instructions);
      expect(result.finalDirection).toBe(expected);
    }
  });

  it("should handle negative coordinates", () => {
    const result = simulateDeliveryRoute([
      "left",
      "forward 5",
      "left",
      "forward 3"
    ]);

    expect(result.finalPosition).toEqual([-5, -3]);
    expect(result.finalDirection).toBe("South");
  });

  it("should handle duplicate package IDs (re-pickup after delivery)", () => {
    const result = simulateDeliveryRoute([
      "pickup A",
      "forward 1",
      "deliver A",
      "forward 1",
      "pickup A",
      "forward 1",
      "deliver A"
    ]);

    expect(result.deliveryLocations).toEqual({ A: [0, 3] });
    expect(result.undeliveredPackages).toEqual([]);
  });

  it("should handle zero-distance forward", () => {
    const result = simulateDeliveryRoute([
      "forward 0",
      "pickup A",
      "forward 0",
      "deliver A"
    ]);

    expect(result.finalPosition).toEqual([0, 0]);
    expect(result.deliveryLocations).toEqual({ A: [0, 0] });
  });
});
