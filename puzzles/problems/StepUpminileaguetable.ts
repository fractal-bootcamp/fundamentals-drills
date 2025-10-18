// puzzles/problems/intermediate2.ts

/**
 * Problem (Intermediate): Mini League Table
 *
 * Context:
 * Build standings from match results of a mini league. Each match lists home/away
 * teams and their goals. A win gives 3 points, a draw 1, a loss 0. The table
 * must include played, won, drawn, lost, goalsFor, goalsAgainst, goalDiff, points.
 * Sort by: points desc, goalDiff desc, goalsFor desc, then team name asc.
 *
 * Input:
 * - results: Array<{ home: string; away: string; homeGoals: number; awayGoals: number }>
 *   - Invariant: goals are integers >= 0.
 *
 * Output:
 * - Array<{
 *     team: string; played: number; won: number; drawn: number; lost: number;
 *     goalsFor: number; goalsAgainst: number; goalDiff: number; points: number;
 *   }>
 *   - One row per team, sorted as specified.
 *
 * Examples:
 * - Single match: A 1–0 B → A: 3 pts, B: 0 pts.
 * - Draw adds 1 point to both, goalsFor/Against update accordingly.
 */
export function miniLeagueTable(
    results: Array<{ home: string; away: string; homeGoals: number; awayGoals: number }>
): Array<{
    team: string; played: number; won: number; drawn: number; lost: number;
    goalsFor: number; goalsAgainst: number; goalDiff: number; points: number;
}> {
    throw new Error("Not implemented");
}
