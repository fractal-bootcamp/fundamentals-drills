import { describe, it, expect } from "vitest";
import { packParcels } from "../problems/assignment2";

describe("packParcels", () => {
  it("returns empty packing for empty items", () => {
    const input = { boxTypes: [{ type: "S", capacity: 5 }], items: [] };
    const r = packParcels(input);
    expect(r.boxes).toEqual([]);
    expect(r.leftovers).toEqual([]);
    expect(r.errors).toEqual([]);
  });

  it("handles completely invalid top-level input", () => {
    const r = packParcels(null);
    expect(r.boxes).toEqual([]);
    expect(r.leftovers).toEqual([]);
    expect(r.errors.length).toBeGreaterThanOrEqual(1);
    expect(r.errors[0].error).toMatch(/invalid input/);
  });

  it("chooses lexicographically smallest type when capacities tie (deterministic tie-breaker)", () => {
    const input = {
      boxTypes: [
        { type: "Z", capacity: 5 },
        { type: "A", capacity: 5 }, // should win by lexicographic order
      ],
      items: [{ id: "i1", volume: 5 }],
    };
    const r = packParcels(input);
    expect(r.boxes).toHaveLength(1);
    expect(r.boxes[0].type).toBe("A");
    expect(r.boxes[0].items).toEqual(["i1"]);
    expect(r.leftovers).toEqual([]);
    expect(r.errors).toEqual([]);
  });

  it("respects fragile limits and opens new boxes when an open box's fragile quota is full", () => {
    const input = {
      boxTypes: [{ type: "F1", capacity: 5, fragileLimit: 1 }],
      items: [
        { id: "f1", volume: 1, fragile: true },
        { id: "f2", volume: 1, fragile: true }, // should open a new F1 box because fragileLimit is 1
      ],
    };

    const r = packParcels(input);
    expect(r.boxes.length).toBe(2);
    expect(r.boxes[0].type).toBe("F1");
    expect(r.boxes[1].type).toBe("F1");
    expect(r.boxes[0].items).toEqual(["f1"]);
    expect(r.boxes[1].items).toEqual(["f2"]);
    expect(r.leftovers).toEqual([]);
    expect(r.errors).toEqual([]);
  });

  it("realistic scenario: mixes zero-volume, fragile counts, oversized and invalid items", () => {
    const input = {
      boxTypes: [
        { type: "S", capacity: 5, fragileLimit: 1 },
        { type: "M", capacity: 10, fragileLimit: 2 },
        { type: "L", capacity: 20 }, // unlimited fragile
      ],
      items: [
        { id: "a", volume: 3, fragile: false }, // goes to S
        { id: "b", volume: 2, fragile: true },  // fits S (fragile 1)
        { id: "c", volume: 1, fragile: true },  // S full, opens M
        { id: "d", volume: 0, fragile: true },  // zero volume but counts fragile, goes to M
        { id: "e", volume: 25, fragile: false }, // too big -> leftover
        { id: "f", volume: -1 },                 // invalid -> leftover + error
        { id: "g", volume: 5, fragile: false },  // should fit into existing M if space
      ],
    };

    const r = packParcels(input);

    // Boxes: expect S then M created
    expect(r.boxes.length).toBeGreaterThanOrEqual(2);

    const boxS = r.boxes.find(b => b.type === "S");
    const boxM = r.boxes.find(b => b.type === "M");

    expect(boxS).toBeDefined();
    expect(boxM).toBeDefined();

    expect(boxS!.items).toEqual(["a", "b"]);
    expect(boxS!.usedVolume).toBe(5);
    expect(boxS!.fragileCount).toBe(1);

    // M should contain c, d, g in that order (d has zero volume)
    expect(boxM!.items).toEqual(["c", "d", "g"]);
    expect(boxM!.usedVolume).toBe(1 + 0 + 5);
    expect(boxM!.fragileCount).toBe(2); // c and d are fragile

    // leftovers should include the too-big and invalid items
    expect(r.leftovers).toContain("e");
    expect(r.leftovers).toContain("f");

    // errors should mention invalid or cannot accommodate where appropriate
    expect(r.errors.some(er => er.id === "f" && /invalid/i.test(er.error))).toBe(true);
    expect(r.errors.some(er => er.id === "e" && /no box type/i.test(er.error))).toBe(true);
  });
});