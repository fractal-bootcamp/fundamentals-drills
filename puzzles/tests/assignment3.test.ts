// assignment4.test.ts
/**
 * Tests for Parcel Locker Assignment
 *
 * Context:
 * We assign parcels to locker sites by size with upgrade rules. Parcels are processed in order.
 * Each parcel has a preferred site list; we first try exact size at a site, then upgrades at that same site.
 *
 * Input/Output:
 *   Uses the function under test to produce { placed, remaining, waitlist } as per the assignment header.
 *
 * Examples:
 *   - Empty inputs yield empty placed and waitlist.
 *   - If "S" is unavailable but "M" is available at a preferred site, an "S" parcel takes an "M" locker.
 */

import { describe, it, expect } from "vitest";
import { assignParcelsToLockers } from "../problems/assignment3";

// Helper to deep-freeze to ensure purity
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === "object") {
    Object.freeze(obj);
    for (const k of Object.keys(obj as any)) {
      // @ts-ignore
      deepFreeze((obj as any)[k]);
    }
  }
  return obj;
}

describe("assignment3 - Parcel Locker Assignment", () => {
  it("minimal / empty input scenario", () => {
    const input = deepFreeze({ sites: {}, parcels: [] });
    const out = assignParcelsToLockers(input);

    expect(out.placed).toEqual({});
    expect(out.remaining).toEqual({});
    expect(out.waitlist).toEqual([]);
  });

  it("happy path with exact matches only (no upgrades needed)", () => {
    const input = deepFreeze({
      sites: {
        A: { S: 2, M: 1, L: 0 },
        B: { S: 0, M: 1, L: 1 },
      },
      parcels: [
        { id: "p1", size: "S", prefs: ["A"] },
        { id: "p2", size: "M", prefs: ["B"] },
        { id: "p3", size: "S", prefs: ["A"] },
      ],
    });

    const out = assignParcelsToLockers(input);

    expect(out.placed.A.S).toEqual(["p1", "p3"]);
    expect(out.placed.B.M).toEqual(["p2"]);
    expect(out.remaining.A).toEqual({ S: 0, M: 1, L: 0 });
    expect(out.remaining.B).toEqual({ S: 0, M: 0, L: 1 });
    expect(out.waitlist).toEqual([]);
  });

  it("upgrade within a site when exact size is unavailable", () => {
    const input = deepFreeze({
      sites: { A: { S: 0, M: 1, L: 0 } },
      parcels: [
        { id: "p1", size: "S", prefs: ["A"] }, // upgrades to M at A
        { id: "p2", size: "S", prefs: ["A"] }, // no capacity left => waitlist
      ],
    });

    const out = assignParcelsToLockers(input);

    expect(out.placed.A.M).toEqual(["p1"]);
    expect(out.remaining.A).toEqual({ S: 0, M: 0, L: 0 });
    expect(out.waitlist).toEqual(["p2"]);
  });

  it("ordering & ties: process in order; earlier parcels consume capacity first", () => {
    const input = deepFreeze({
      sites: { A: { S: 1, M: 0, L: 0 }, B: { S: 1, M: 0, L: 0 } },
      parcels: [
        { id: "p1", size: "S", prefs: ["A", "B"] },
        { id: "p2", size: "S", prefs: ["A", "B"] },
      ],
    });

    const out = assignParcelsToLockers(input);

    // p1 takes A.S; p2 falls back to B.S
    expect(out.placed.A.S).toEqual(["p1"]);
    expect(out.placed.B.S).toEqual(["p2"]);
    expect(out.waitlist).toEqual([]);
  });

  it("property-like table: upgrade chains per size are respected deterministically", () => {
    type Case = {
      need: "S" | "M" | "L";
      caps: { S: number; M: number; L: number };
      expectPlacedSize: "S" | "M" | "L" | null;
      label: string;
    };

    const cases: Case[] = [
      { label: "S->S", need: "S", caps: { S: 1, M: 0, L: 0 }, expectPlacedSize: "S" },
      { label: "S->M", need: "S", caps: { S: 0, M: 2, L: 0 }, expectPlacedSize: "M" },
      { label: "S->L", need: "S", caps: { S: 0, M: 0, L: 5 }, expectPlacedSize: "L" },
      { label: "M->M", need: "M", caps: { S: 9, M: 1, L: 0 }, expectPlacedSize: "M" },
      { label: "M->L", need: "M", caps: { S: 9, M: 0, L: 1 }, expectPlacedSize: "L" },
      { label: "L only", need: "L", caps: { S: 9, M: 9, L: 1 }, expectPlacedSize: "L" },
      { label: "no capacity", need: "S", caps: { S: 0, M: 0, L: 0 }, expectPlacedSize: null },
    ];

    for (const c of cases) {
  const input = { sites: { X: { ...c.caps } }, parcels: [{ id: "p", size: c.need, prefs: ["X"] }] };
  const out = assignParcelsToLockers(deepFreeze(input));
  const placedX = out.placed.X ?? {};

  const gotSize =
    ((placedX.S ?? []).includes("p")) ? "S" :
    ((placedX.M ?? []).includes("p")) ? "M" :
    ((placedX.L ?? []).includes("p")) ? "L" :
    null;

  expect(gotSize).toEqual(c.expectPlacedSize); // no message param

  if (gotSize !== null) {
    const before = c.caps[gotSize];
    const after  = out.remaining.X[gotSize];
    expect(before - after).toBe(1);
  } else {
    expect(out.remaining.X).toEqual(c.caps);
    expect(out.waitlist).toEqual(["p"]);
  }
}
  });

  it("realistic multi-site scenario forces abstraction (site-local upgrades only)", () => {
    const input = deepFreeze({
      sites: {
        A: { S: 1, M: 0, L: 1 },
        B: { S: 0, M: 1, L: 0 },
        C: { S: 2, M: 0, L: 0 },
      },
      parcels: [
        { id: "p1", size: "M", prefs: ["A", "B"] }, // A lacks M; A can upgrade to L -> place at A.L
        { id: "p2", size: "S", prefs: ["B", "C"] }, // B lacks S; no upgrade (M is NOT an upgrade from S? (it is)) -> B.M is acceptable -> place at B.M
        { id: "p3", size: "S", prefs: ["A"] },       // A has S=1 -> place at A.S
        { id: "p4", size: "S", prefs: ["B", "C"] }, // B now no caps; go to C.S
        { id: "p5", size: "L", prefs: ["A", "C"] }, // A.L used by p1; C has no L -> waitlist
      ],
    });

    const out = assignParcelsToLockers(input);

    expect(out.placed.A.L).toEqual(["p1"]);
    expect(out.placed.A.S).toEqual(["p3"]);
    expect(out.placed.B.M).toEqual(["p2"]);
    expect(out.placed.C.S).toEqual(["p4"]);
    expect(out.waitlist).toEqual(["p5"]);

    expect(out.remaining.A).toEqual({ S: 0, M: 0, L: 0 });
    expect(out.remaining.B).toEqual({ S: 0, M: 0, L: 0 });
    expect(out.remaining.C).toEqual({ S: 1, M: 0, L: 0 });
  });

  it("purity: input objects are not mutated", () => {
    const input = {
      sites: { A: { S: 1, M: 0, L: 0 } },
      parcels: [{ id: "p1", size: "S", prefs: ["A"] }],
    };
    deepFreeze(input);
    const snapshot = JSON.parse(JSON.stringify(input));

    const _ = assignParcelsToLockers(input);

    expect(input).toEqual(snapshot);
  });
});
