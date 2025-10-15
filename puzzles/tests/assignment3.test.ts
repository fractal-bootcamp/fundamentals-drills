import { describe, it, expect } from "vitest";
import { simulateParkingLot } from "../problems/assignment3";

describe("simulateParkingLot", () => {
  it("should handle empty events", () => {
    const result = simulateParkingLot([5, 5], []);
    expect(result).toEqual({});
  });

  it("should park vehicles in lowest available spots", () => {
    const result = simulateParkingLot([2, 2], [
      { type: "park", vehicleId: "A" },
      { type: "park", vehicleId: "B" },
      { type: "park", vehicleId: "C" },
    ]);
    expect(result).toEqual({ A: 1, B: 2, C: 3 });
  });

  it("should reuse spots after departure", () => {
    const result = simulateParkingLot([3], [
      { type: "park", vehicleId: "A" },
      { type: "park", vehicleId: "B" },
      { type: "park", vehicleId: "C" },
      { type: "depart", vehicleId: "A" },
      { type: "park", vehicleId: "D" },
    ]);
    expect(result).toEqual({ B: 2, C: 3, D: 1 });
  });

  it("should ignore park when lot is full", () => {
    const result = simulateParkingLot([2], [
      { type: "park", vehicleId: "A" },
      { type: "park", vehicleId: "B" },
      { type: "park", vehicleId: "C" }, // Should be ignored
      { type: "park", vehicleId: "D" }, // Should be ignored
    ]);
    expect(result).toEqual({ A: 1, B: 2 });
  });

  it("should ignore depart for non-existent vehicle", () => {
    const result = simulateParkingLot([2], [
      { type: "park", vehicleId: "A" },
      { type: "depart", vehicleId: "B" }, // Vehicle B never parked
      { type: "depart", vehicleId: "C" }, // Vehicle C never parked
    ]);
    expect(result).toEqual({ A: 1 });
  });

  it("should ignore duplicate park attempts for same vehicle", () => {
    const result = simulateParkingLot([3], [
      { type: "park", vehicleId: "A" },
      { type: "park", vehicleId: "A" }, // Should be ignored
      { type: "park", vehicleId: "B" },
    ]);
    expect(result).toEqual({ A: 1, B: 2 });
  });

  it("should handle multi-level lot with complex event sequence", () => {
    const result = simulateParkingLot([2, 3, 1], [
      { type: "park", vehicleId: "car1" },
      { type: "park", vehicleId: "car2" },
      { type: "park", vehicleId: "car3" },
      { type: "depart", vehicleId: "car1" },
      { type: "park", vehicleId: "car4" },
      { type: "park", vehicleId: "car5" },
      { type: "depart", vehicleId: "car3" },
      { type: "park", vehicleId: "car6" },
      { type: "park", vehicleId: "car7" },
    ]);
    // Final spots: car2=2, car4=1, car5=4, car6=3, car7=5
    expect(result).toEqual({
      car2: 2,
      car4: 1,
      car5: 4,
      car6: 3,
      car7: 5,
    });
  });

  it("should handle all spots being used and freed", () => {
    const result = simulateParkingLot([2, 2], [
      { type: "park", vehicleId: "A" },
      { type: "park", vehicleId: "B" },
      { type: "park", vehicleId: "C" },
      { type: "park", vehicleId: "D" },
      { type: "depart", vehicleId: "A" },
      { type: "depart", vehicleId: "B" },
      { type: "depart", vehicleId: "C" },
      { type: "depart", vehicleId: "D" },
    ]);
    expect(result).toEqual({});
  });

  it("should process various edge cases systematically", () => {
    const testCases = [
      {
        levels: [1],
        events: [{ type: "park" as const, vehicleId: "solo" }],
        expected: { solo: 1 },
      },
      {
        levels: [5],
        events: [
          { type: "depart" as const, vehicleId: "ghost" },
          { type: "park" as const, vehicleId: "real" },
        ],
        expected: { real: 1 },
      },
      {
        levels: [0, 3],
        events: [
          { type: "park" as const, vehicleId: "X" },
          { type: "park" as const, vehicleId: "Y" },
        ],
        expected: { X: 1, Y: 2 },
      },
    ];

    for (const { levels, events, expected } of testCases) {
      const result = simulateParkingLot(levels, events);
      expect(result).toEqual(expected);
    }
  });
});