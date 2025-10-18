// puzzles/tests/assignment1d.test.ts
import { describe, it, expect } from "vitest";
import { hasMeetingConflict } from "../problems/meetingroomconflict";

describe("hasMeetingConflict", () => {
    it("handles empty or single meeting", () => {
        expect(hasMeetingConflict([])).toBe(false);
        expect(hasMeetingConflict([{ start: 0, end: 10 }])).toBe(false);
    });

    it("detects no conflict with touching endpoints", () => {
        expect(
            hasMeetingConflict([
                { start: 0, end: 30 },
                { start: 30, end: 60 },
            ])
        ).toBe(false);
    });

    it("detects overlapping meetings", () => {
        expect(
            hasMeetingConflict([
                { start: 0, end: 30 },
                { start: 29, end: 40 },
            ])
        ).toBe(true);
    });

    it("detects multiple overlaps", () => {
        expect(
            hasMeetingConflict([
                { start: 10, end: 20 },
                { start: 5, end: 15 },
                { start: 20, end: 25 },
            ])
        ).toBe(true);
    });

    it("no overlap when sorted or unsorted but disjoint", () => {
        expect(
            hasMeetingConflict([
                { start: 50, end: 60 },
                { start: 0, end: 10 },
                { start: 20, end: 30 },
            ])
        ).toBe(false);
    });
});
