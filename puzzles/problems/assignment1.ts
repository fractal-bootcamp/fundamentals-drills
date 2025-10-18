/**
 * Assignment 1 — Most Frequent Item
 *
 * Context:
 * Counting and summarizing categorical data is a common analytics task. Given
 * an array of strings, return the single most frequent item. To make the
 * result deterministic, if multiple items share the highest frequency, return
 * the lexicographically smallest string among the tied items.
 *
 * Input:
 *  - items: string[] — may be empty; values are case-sensitive and may repeat.
 * Output:
 *  - string | null — the most frequent item, or null if the input is empty.
 *
 * Examples:
 *  - mostFrequent(["a","b","a","c"]) -> "a"
 *  - mostFrequent([]) -> null
 */
export function mostFrequent() {
  // ['a','b','a','b','c','a'] 
  // {'a':3, 'b':2, 'c':1}
  let items = ['a', 'b', 'a', 'b', 'c', 'a'];
  let itemsLowerCase = items.map(i => i.toLowerCase())
  const counts = itemsLowerCase.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {})



  // find the biggest number
  // return the key of highest value

}
