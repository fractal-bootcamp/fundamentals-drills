/**
 * Tournament Standings — Sum points and assign ranks
 *
 * You receive match results as a list of { player, points } entries (points may be
 * positive or negative). Aggregate total points per player, then return a standings list
 * sorted by: (1) higher total points first, (2) name ascending for ties. Assign standard
 * competition ranks (1, 1, 3, 4, 4, 4, ...): players with equal totals share the same rank,
 * and the next rank increments by the count of players strictly ahead.
 *
 * Input: `results: { player: string; points: number }[]`
 * Output: `{ player: string; points: number; rank: number }[]` — sorted standings with ranks.
 * Invariants: pure, deterministic, no I/O. Empty input yields `[]`.
 *
 * Examples:
 * - standings([
 *     { player: "Ada", points: 3 },
 *     { player: "Bob", points: 2 },
 *     { player: "Ada", points: 1 },
 *   ]) -> [
 *     { player: "Ada", points: 4}
 *   ]
 * - standings([]) -> []
 */

type Player = { player: string, points: number }
type Result = { player: string, points: number }

export function standings(results: Player[]): Result {
  // sum
  let totalPointsbyPlayer = results.reduce((acc, result) => {
    acc[result.player] = (acc[result.player] || 0) + result.points;
    return acc;
  }, {})
  // acc = {"Ada":4, "Bob":2}

  let highestPointsSoFar = 0;
  let highestPointsPlayerSoFar = "";
  let winnerPlayer = [];

  for (let i in totalPointsbyPlayer) {
    if (highestPointsSoFar < totalPointsbyPlayer[i]) {
      highestPointsSoFar = totalPointsbyPlayer[i];
      highestPointsPlayerSoFar = i
    }
  }

  winnerPlayer.push({ player: highestPointsPlayerSoFar, points: highestPointsSoFar })

  return winnerPlayer;
}

console.log(standings([
  { player: "Ada", points: 3 },
  { player: "Bob", points: 2 },
  { player: "Ada", points: 1 },
]))
