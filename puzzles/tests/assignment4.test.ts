// assignment4.test.ts
/**
 * Assignment 4 Tests — Bike-Share Station Event Processor
 *
 * Output spec:
 * {
 *   stations: {
 *     [stationId: string]: {
 *       capacity: number;
 *       bikes: number;
 *       rentQueue: string[];
 *       returnQueue: string[];
 *     };
 *   };
 *   riding: string[];
 * }
 *
 * Deterministic: No randomness; all queues FIFO.
 */

import { describe, it, expect } from "vitest";
import { processBikeShare } from "../problems/assignment4";

// convenience builders
type Station = { capacity: number; bikes: number };
type Input = {
  stations: Record<string, Station>;
  events: Array<[string, string, string]>;
};
type StationState = {
  capacity: number;
  bikes: number;
  rentQueue: string[];
  returnQueue: string[];
};

function buildInput(stations: Record<string, Station>, events: any[]): Input {
  return { stations, events };
}

function baseState(capacity: number, bikes: number): StationState {
  return { capacity, bikes, rentQueue: [], returnQueue: [] };
}

// ---------------------------------------------------------------------------

describe("processBikeShare", () => {
  it("handles empty system", () => {
    const input = buildInput({}, []);
    const result = processBikeShare(input as any);
    expect(result).toEqual({ stations: {}, riding: [] });
  });

  it("simple rent then return at same station", () => {
    const input = buildInput(
      { A: { capacity: 2, bikes: 1 } },
      [
        ["rent", "A", "r1"], // bikes -> 0
        ["return", "A", "r1"], // bikes -> 1
      ]
    );

    const result = processBikeShare(input as any);

    expect(result.stations["A"]).toEqual({
      capacity: 2,
      bikes: 1,
      rentQueue: [],
      returnQueue: [],
    });
    expect(result.riding).toEqual([]);
  });

  it("queues renters when no bikes, reconciles after returns", () => {
    const input = buildInput(
      { A: { capacity: 2, bikes: 0 } },
      [
        ["rent", "A", "r1"], // queue rent
        ["rent", "A", "r2"], // queue rent
        ["return", "A", "x1"], // creates supply -> rent to r1
        ["return", "A", "x2"], // creates supply -> rent to r2
      ]
    );

    const result = processBikeShare(input as any);

    expect(result.stations["A"]).toEqual({
      capacity: 2,
      bikes: 0,
      rentQueue: [],
      returnQueue: [],
    });

    expect(result.riding.sort()).toEqual(["r1", "r2"]);
  });

  it("queues returners when dock full, reconciles after rents", () => {
    const input = buildInput(
      { B: { capacity: 1, bikes: 1 } },
      [
        ["return", "B", "p1"], // full -> queue return
        ["rent", "B", "r1"], // frees dock -> p1 docks
      ]
    );

    const result = processBikeShare(input as any);

    expect(result.stations["B"]).toEqual({
      capacity: 1,
      bikes: 1,
      rentQueue: [],
      returnQueue: [],
    });
    expect(result.riding).toEqual(["r1"]);
  });

  it("isolates state between stations", () => {
    const input = buildInput(
      {
        A: { capacity: 2, bikes: 1 },
        C: { capacity: 1, bikes: 0 },
      },
      [
        ["rent", "A", "a1"],
        ["rent", "A", "a2"],
        ["return", "C", "x1"],
        ["rent", "C", "y1"],
        ["return", "A", "z1"],
      ]
    );

    const result = processBikeShare(input as any);

    expect(result.stations["A"]).toEqual({
      capacity: 2,
      bikes: 0,
      rentQueue: [],
      returnQueue: [],
    });

    expect(result.stations["C"]).toEqual({
      capacity: 1,
      bikes: 0,
      rentQueue: [],
      returnQueue: [],
    });

    expect(result.riding.sort()).toEqual(["a1", "a2", "y1"]);
  });

  it("conserves total bikes across events", () => {
    const table = [
      {
        stations: { A: { capacity: 2, bikes: 2 } },
        events: [],
      },
      {
        stations: { A: { capacity: 2, bikes: 0 } },
        events: [
          ["rent", "A", "r1"],
          ["return", "A", "x1"],
        ],
      },
      {
        stations: { B: { capacity: 1, bikes: 1 } },
        events: [
          ["return", "B", "u1"],
          ["rent", "B", "r1"],
        ],
      },
    ];

    for (const t of table) {
      const initial = Object.values(t.stations).reduce(
        (sum, s) => sum + s.bikes,
        0
      );
      const result = processBikeShare(t as any);

      const bikesAtStations = Object.values(result.stations).reduce(
        (sum, s) => sum + s.bikes,
        0
      );
      const queuedReturns = Object.values(result.stations).reduce(
        (sum, s) => sum + s.returnQueue.length,
        0
      );
      const riding = result.riding.length;
      const total = bikesAtStations + queuedReturns + riding;

      expect(total).toBe(initial);
    }
  });
});
