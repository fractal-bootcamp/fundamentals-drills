// puzzles/problems/assignment1.ts

/**
 * Assignment 1 — Top Scorer
 *
 * Context:
 * You're given game score events as a flat list. Each event records a player's name
 * and a signed integer score change for that event. Players may appear multiple times.
 * Your task is to aggregate scores per player and determine the winner.
 *
 * Input:
 * - records: Array<{ name: string; score: number }>
 *   - name: non-empty string (case-sensitive; "amy" and "Amy" are different)
 *   - score: integer (can be negative, zero, or positive)
 *
 * Output:
 * - The single winner's name as a string, or null if there are no records.
 * - Winner rules:
 *   1) Highest total (sum of all their scores).
 *   2) On ties, smallest name in lexicographic (Unicode) order.
 *
 * Examples:
 * - Input: [{name: "alex", score: 5}, {name: "bee", score: 3}, {name: "alex", score: 2}]
 *   -> "alex"  // alex totals 7, bee totals 3
 *
 * - Input: [{name: "zoe", score: 4}, {name: "amy", score: 4}]
 *   -> "amy"   // tie at 4; "amy" < "zoe"
 */

export type ScoreRecord = { name: string; score: number };


export function topScorer(records: ScoreRecord[]): string | null {
    // get list of names with aggregate scores
    if (records[0] != null) {
        let totalScoreList = []
        let perPlayerScores: ScoreRecord[] = []
        for (let i = 0; i < records.length; i++) {
            let player: string = records[i].name
            const perPlayerScores = records.filter((record) => record.name = player)
            let perPlayerTotalScore = 0
            for (let i = 0; i < perPlayerScores.length; i++) {
                const score = perPlayerScores[0].score
                perPlayerTotalScore += score
            }
            const aggPlayerObject = { name: player, score: perPlayerTotalScore }
            totalScoreList.push(aggPlayerObject)
        }

        // compare scores to find the highest
        let topScore = 0
        let winner = "~"
        for (let i = 0; i < totalScoreList.length; i++) {
            const score = totalScoreList[i].score
            if (score > 0 && score > topScore) {
                topScore = score
                winner = totalScoreList[i].name
            }
            if (score < 0 && score < topScore) {
                topScore = score
                winner = totalScoreList[i].name
            }
            if (score == topScore) {
                totalScoreList[i].name < winner ?
                    winner = totalScoreList[i].name :
                    winner = winner
            }
        }
        return winner
    }
    else return null
}

// sketch
// i want to aggregate scores by name and choose the highest
// use sort so if there's a tie i will still have the winner built in
// find all instances of a name, add them together. need to store who i've seen so i can skip them on future rounds
// wait no, just delete them from the list after they've been added and create new list with agg scores, then 
// sort and return name with highest score. if tie, sort and return the first one. this is a loop
// (p1, 1), (p2, 1), (p3, 1)(p2, 1)(p3, 1)(p1, 1)

// pseudo
// get list of names with aggregate scores
// totalScoreList = []
// for (i=0; i < events.length; i++) {
//  player = events[i].name
//  const perPlayerScores = events.forEach(events.filter((event)=> event.player = player))
//      perPlayerTotalScore = 0
//  for (p of perPlayerScores){
//      score = perPlayerScores[0].score
//      perPlayerTotalScore += score
//  }
//  aggPlayerObject = {name: player, score: perPlayerTotalScore}
// totalScoreList.push(aggPlayerObject)
// }
// compare scores to find the highest
// const topScorer = ""
// for (i=0; i < totalScoreList.length; i++){
//  score = totalScoreList[i].score
//  if (score > topScore) {
//      topScorer = totalScoreList[i].name
// }
// }