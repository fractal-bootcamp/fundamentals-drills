// puzzles/tests/assignment1.test.ts
import { describe, it, expect } from "vitest";
import { topCategory } from "../problems/assignment4";

describe("topCategory", () => {
    it("returns null for empty input", () => {
        expect(topCategory([])).toBeNull();
    });

    it("single entry is the winner", () => {
        expect(topCategory([{ category: "reading", minutes: 25 }])).toBe("reading");
    });

    it("sums minutes per category and picks the largest", () => {
        const tasks = [
            { category: "reading", minutes: 15 },
            { category: "coding", minutes: 20 },
            { category: "reading", minutes: 30 },
            { category: "exercise", minutes: 10 },
        ];
        expect(topCategory(tasks)).toBe("reading");
    });

    it("tie breaks by lexicographic order", () => {
        const tasks = [
            { category: "beta", minutes: 10 },
            { category: "alpha", minutes: 10 },
        ];
        expect(topCategory(tasks)).toBe("alpha");
    });

    it("ignores negative minutes defensively; still computes result", () => {
        const tasks = [
            { category: "alpha", minutes: 10 },
            { category: "alpha", minutes: -5 }, // ignored
            { category: "beta", minutes: 9 },
        ];
        expect(topCategory(tasks)).toBe("alpha");
    });

    it("property-like: order of entries should not matter", () => {
        const a = [
            { category: "x", minutes: 3 },
            { category: "y", minutes: 5 },
            { category: "x", minutes: 2 },
        ];
        const b = [
            { category: "x", minutes: 2 },
            { category: "y", minutes: 5 },
            { category: "x", minutes: 3 },
        ];
        expect(topCategory(a)).toBe(topCategory(b));
    });
});
