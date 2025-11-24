/**
 * Word Frequency Ranker
 *
 * Given a string of text, find the most frequently occurring word (case-insensitive).
 * Words are separated by spaces. If there is a tie, return the word that appears first.
 * Punctuation is considered part of the word (e.g., "hello," and "hello" are different).
 *
 * Input: A string of text (may be empty, may contain multiple words)
 * Output: The most frequent word as a string, or empty string if input is empty
 *
 * Examples:
 * - mostFrequentWord("the cat and the dog") => "the"
 * - mostFrequentWord("apple banana apple") => "apple"
 * - mostFrequentWord("one two three") => "one" (all tied, return first)
 * - mostFrequentWord("") => ""
 */

export function mostFrequentWord(text: string): string {
  // Your implementation here
  const words = text.split(' ')
  const ranker: Map<string, number> = new Map()
  for (let word of words) {
    if (Array.from(ranker.keys()).includes(word)) {
      let count = ranker.get(word)
      count += 1
      ranker.set(word, count)
    }
  }
}
