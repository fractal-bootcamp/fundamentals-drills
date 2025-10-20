// puzzles/problems/assignment1a.ts

/**
 * Problem: Most Frequent Word
 *
 * Context:
 * You receive a list of words (case-sensitive). Return the single word
 * that appears most frequently. If there is a tie, return the lexicographically
 * smallest word (Unicode order). If the list is empty, return null.
 * IGNORE TIE CONSTRAINT
 *
 * Input:
 * - words: string[] (can be empty). Each entry is a non-empty string.
 *
 * Output:
 * - string | null
 *   - The most frequent word by count; ties broken by lexicographic order.
 *   - Return null for empty input.
 *
 * Examples:
 * - ["a","b","a"] -> "a"
 * - ["b","a"] -> "a" (tie by count; "a" < "b")
 */

// sketch
// need to loop over the array and count how many times each word appears
// actually no, i can filter the array by each unique word appearance and use .length to get the total
// add the results to an object with the word and count, adding the objects to an array as i go
// loop over the new array to compare totals and pick the best
// with a conditional for if two words have the same count

//pseudo
// totals = []
// for (let i = 0; i < words.length; i++;){
//  word = words[i]
//  arrayToCount = words.filter((word, i)=> word === "words[i]"))
//  count = arrayToCount.length
//  wordWithCount = {word: word, count: count}
//  totals.push(wordWithCount)
// }
// wordsWithCounts = new Set(totals)
// highestCount = 0
// ties = []
// for (let i = 1; i < wordsWithCounts.length; i++;){
//  count = wordsWithCounts[i].count
//  prevCount = wordsWithCounts[i-1].count
//  if (count > prevCount) { highestCount = count }
//  if (count = prevCount) { ties.push(wordsWithCounts[i]) }
// }
// winner = []
//  if (ties != []) {
//  for (let i = 1; i < wordsWithCounts.length; i++;){
//    word = wordsWithCounts[i].word
//    prevWord = wordsWithCounts[i-1].word
//    if (word < word) { winner.push(wordsWithCounts[i]) }
//  }
// }
// return winner

type WordCount = {
  word: string,
  count: number,
}

export function mostFrequentWord(words: string[]): string | null {
  let totals = []
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    let arrayToCount = words.filter((word, i) => word === words[i]));
    let count = arrayToCount.length
    let wordWithCount = { word: word, count: count }
    totals.push(wordWithCount)
  }
  let wordsWithCounts: WordCount[] = new Set(totals)
  let highestCount = 0
  let ties = []
  for (let i = 1; i < wordsWithCounts.length; i++) {
    let count = wordsWithCounts[i].count
    let prevCount = wordsWithCounts[i - 1].count
    if (count > prevCount) { highestCount = count }
    if (count = prevCount) { ties.push(wordsWithCounts[i]) }
  }
  let winner = []
  if (ties != []) {
    for (let i = 1; i < wordsWithCounts.length; i++) {
      let word = wordsWithCounts[i].word
      let prevWord = wordsWithCounts[i - 1].word
      if (word < word) { winner.push(wordsWithCounts[i]) }
    }
  }
  let finalBoss = winner[0].word

  return finalBoss
}
