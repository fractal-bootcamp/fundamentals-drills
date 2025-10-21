/*
Assignment 1 — Top Voters

Context:
Given a list of votes where each vote is the name of a candidate (string), return the
candidate(s) with the highest number of votes. This exercises counting with maps,
basic array operations, and simple sorting.

Input:
- `votes: string[]` — an array of candidate names (case-sensitive). May be empty.
Output:
- `string[]` — array of candidate name(s) with the maximum vote count.
  - If multiple candidates tie for top votes, return them sorted alphabetically.
  - If the input is empty, return an empty array.

Examples:
- `topVoters(["alice","bob","alice"])` -> `["alice"]`
- `topVoters(["a","b","b","a"])` -> `["a","b"]` (tie returned sorted)
*/

export function topVoters(votes: string[]): string[] {
  return votes
    .reduce((topVoter: string[], currentVoter) => {
      if (topVoter[0] === currentVoter) {
        topVoter += votes[currentVoter]
        topVoter.push(currentVoter)
      }
    return topVoter
    },[])
}
