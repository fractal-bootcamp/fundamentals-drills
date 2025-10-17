// puzzles/tests/assignment1.test.ts
import { describe, it, expect } from "vitest";
import { topScorer, type ScoreRecord } from "../problems/topscorer";

describe("topScorer", () => {
    it("aggregates scores per name and returns the top scorer", () => {
        const input: ScoreRecord[] = [
            { name: "alex", score: 5 },
            { name: "bee", score: 3 },
            { name: "alex", score: 2 },
            { name: "bee", score: 1 },
            { name: "carl", score: -2 },
        ];
        expect(topScorer(input)).toEqual("alex"); // alex:7, bee:4, carl:-2
    });

    it("applies lexicographic tiebreak on equal totals", () => {
        const input: ScoreRecord[] = [
            { name: "zoe", score: 4 },
            { name: "amy", score: 4 },
        ];
        expect(topScorer(input)).toEqual("amy"); // tie at 4; "amy" < "zoe"
    });

    it("returns null for empty input", () => {
        expect(topScorer([])).toBeNull();
    });

    it("handles negative and zero scores correctly", () => {
        const input: ScoreRecord[] = [
            { name: "nina", score: -5 },
            { name: "nina", score: 0 },
            { name: "otto", score: -3 },
            { name: "otto", score: -3 },
            { name: "pam", score: -4 },
            { name: "pam", score: 1 },
        ];
        // Totals: nina:-5, otto:-6, pam:-3 => winner is pam (highest total, even if negative)
        expect(topScorer(input)).toEqual("pam");
    });

    it("uses lexicographic order only when totals are tied", () => {
        const input: ScoreRecord[] = [
            { name: "amy", score: 1 },
            { name: "bob", score: 1 },
            { name: "amy", score: 1 },
            { name: "bob", score: 1 },
            // totals: amy:2, bob:2 => "amy" wins by name
        ];
        expect(topScorer(input)).toEqual("amy");
    });

    it("table of scenarios (deterministic, property-like coverage)", () => {
        const cases: { name: string; input: ScoreRecord[]; expected: string | null }[] = [
            {
                name: "single entry wins",
                input: [{ name: "solo", score: 10 }],
                expected: "solo",
            },
            {
                name: "multiple players, clear winner",
                input: [
                    { name: "a", score: 1 },
                    { name: "b", score: 5 },
                    { name: "a", score: 2 },
                ],
                expected: "b", // a:3, b:5
            },
            {
                name: "all zero totals => lexicographic",
                input: [
                    { name: "y", score: 0 },
                    { name: "x", score: 0 },
                    { name: "z", score: 0 },
                ],
                expected: "x",
            },
            {
                name: "negative totals with tie",
                input: [
                    { name: "m", score: -2 },
                    { name: "n", score: -1 },
                    { name: "m", score: -1 },
                    { name: "n", score: -2 },
                ],
                expected: "m", // m:-3, n:-3 => "m" < "n"
            },
            {
                name: "empty input",
                input: [],
                expected: null,
            },
        ];

        for (const c of cases) {
            expect(topScorer(c.input), c.name).toEqual(c.expected);
        }
    });
});
