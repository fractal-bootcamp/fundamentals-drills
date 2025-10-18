// puzzles/tests/intermediate2.test.ts
import { describe, it, expect } from "vitest";
import { miniLeagueTable } from "../problems/StepUpminileaguetable";

describe("miniLeagueTable", () => {
    it("handles empty input", () => {
        expect(miniLeagueTable([])).toEqual([]);
    });

    it("single match win/loss", () => {
        const table = miniLeagueTable([
            { home: "A", away: "B", homeGoals: 1, awayGoals: 0 },
        ]);
        expect(table).toEqual([
            {
                team: "A", played: 1, won: 1, drawn: 0, lost: 0,
                goalsFor: 1, goalsAgainst: 0, goalDiff: 1, points: 3
            },
            {
                team: "B", played: 1, won: 0, drawn: 0, lost: 1,
                goalsFor: 0, goalsAgainst: 1, goalDiff: -1, points: 0
            },
        ]);
    });

    it("draw match updates both teams", () => {
        const table = miniLeagueTable([
            { home: "A", away: "B", homeGoals: 2, awayGoals: 2 },
        ]);
        expect(table).toEqual([
            {
                team: "A", played: 1, won: 0, drawn: 1, lost: 0,
                goalsFor: 2, goalsAgainst: 2, goalDiff: 0, points: 1
            },
            {
                team: "B", played: 1, won: 0, drawn: 1, lost: 0,
                goalsFor: 2, goalsAgainst: 2, goalDiff: 0, points: 1
            },
        ]);
    });

    it("sorting by points, then goalDiff, then goalsFor, then name", () => {
        const table = miniLeagueTable([
            { home: "A", away: "B", homeGoals: 2, awayGoals: 0 }, // A +3, GD +2
            { home: "C", away: "D", homeGoals: 3, awayGoals: 1 }, // C +3, GD +2
            { home: "A", away: "C", homeGoals: 1, awayGoals: 1 }, // draw A,C +1
            { home: "B", away: "D", homeGoals: 1, awayGoals: 0 }, // B +3
        ]);
        // After these:
        // A: played2, W1 D1 L0, GF3 GA1 GD+2, Pts4
        // C: played2, W1 D1 L0, GF4 GA2 GD+2, Pts4  (more GF than A)
        // B: played2, W1 D0 L1, GF1 GA2 GD-1, Pts3
        // D: played2, W0 D0 L2, GF1 GA4 GD-3, Pts0
        expect(table.map(r => r.team)).toEqual(["C", "A", "B", "D"]);
        const A = table.find(r => r.team === "A")!;
        expect(A.points).toBe(4);
        expect(A.goalDiff).toBe(2);
        expect(A.played).toBe(2);
    });

    it("accumulates multi-game stats correctly", () => {
        const table = miniLeagueTable([
            { home: "X", away: "Y", homeGoals: 0, awayGoals: 0 },
            { home: "Y", away: "X", homeGoals: 2, awayGoals: 1 },
            { home: "X", away: "Z", homeGoals: 3, awayGoals: 3 },
            { home: "Z", away: "Y", homeGoals: 1, awayGoals: 4 },
        ]);
        // Sanity checks
        const X = table.find(t => t.team === "X")!;
        const Y = table.find(t => t.team === "Y")!;
        const Z = table.find(t => t.team === "Z")!;
        expect(X.played).toBe(3);
        expect(Y.played).toBe(3);
        expect(Z.played).toBe(2);
        expect(X.goalsFor - X.goalsAgainst).toBe(X.goalDiff);
        expect(Y.goalsFor - Y.goalsAgainst).toBe(Y.goalDiff);
        expect(Z.goalsFor - Z.goalsAgainst).toBe(Z.goalDiff);
    });
});
