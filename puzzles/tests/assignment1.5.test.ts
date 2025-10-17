import { describe, it, expect } from "vitest";
import { vehiclesInLot } from "../problems/assignment1.5";

describe("vehiclesInLot", () => {
  it("returns empty array for no events", () => {
    expect(vehiclesInLot([])).toEqual([]);
  });

  it("tracks a single vehicle entry", () => {
    expect(
      vehiclesInLot([{ type: "entry", plateNumber: "ABC123", order: 1 }])
    ).toEqual(["ABC123"]);
  });

  it("removes vehicle after exit", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 1 },
        { type: "exit", plateNumber: "ABC123", order: 2 },
      ])
    ).toEqual([]);
  });

  it("tracks multiple vehicles and returns them sorted by entry order", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 1 },
        { type: "entry", plateNumber: "XYZ789", order: 3 },
        { type: "entry", plateNumber: "DEF456", order: 2 },
      ])
    ).toEqual(["ABC123", "DEF456", "XYZ789"]);
  });

  it("handles vehicle leaving and re-entering", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 1 },
        { type: "exit", plateNumber: "ABC123", order: 2 },
        { type: "entry", plateNumber: "ABC123", order: 3 },
      ])
    ).toEqual(["ABC123"]);
  });

  it("ignores exit without prior entry", () => {
    expect(
      vehiclesInLot([
        { type: "exit", plateNumber: "ABC123", order: 1 },
        { type: "entry", plateNumber: "XYZ789", order: 2 },
      ])
    ).toEqual(["XYZ789"]);
  });

  it("handles multiple entries without exit (uses most recent)", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 1 },
        { type: "entry", plateNumber: "ABC123", order: 3 },
        { type: "entry", plateNumber: "XYZ789", order: 2 },
      ])
    ).toEqual(["XYZ789", "ABC123"]);
  });

  it("processes events not sorted by order", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 5 },
        { type: "entry", plateNumber: "XYZ789", order: 1 },
        { type: "exit", plateNumber: "ABC123", order: 6 },
        { type: "entry", plateNumber: "DEF456", order: 3 },
      ])
    ).toEqual(["XYZ789", "DEF456"]);
  });

  it("handles complex scenario with multiple vehicles and events", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "CAR1", order: 1 },
        { type: "entry", plateNumber: "CAR2", order: 2 },
        { type: "exit", plateNumber: "CAR1", order: 3 },
        { type: "entry", plateNumber: "CAR3", order: 4 },
        { type: "entry", plateNumber: "CAR1", order: 5 },
        { type: "exit", plateNumber: "CAR2", order: 6 },
      ])
    ).toEqual(["CAR3", "CAR1"]);
  });

  it("handles same vehicle with multiple entry-exit cycles", () => {
    expect(
      vehiclesInLot([
        { type: "entry", plateNumber: "ABC123", order: 1 },
        { type: "exit", plateNumber: "ABC123", order: 2 },
        { type: "entry", plateNumber: "ABC123", order: 3 },
        { type: "exit", plateNumber: "ABC123", order: 4 },
        { type: "entry", plateNumber: "ABC123", order: 5 },
      ])
    ).toEqual(["ABC123"]);
  });
});
