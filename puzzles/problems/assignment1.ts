/**
 * Compact Ranges — Summarize consecutive integers
 *
 * Given a list of integers (unordered, may contain duplicates or negatives), produce a compact
 * summary of consecutive runs. First, treat duplicates as a single occurrence and sort ascending.
 * Then merge consecutive numbers into inclusive ranges. Emit each run as either "x" (single value)
 * or "x-y" (for a run of length >= 2). Return the list of range strings in ascending order.
 *
 * Input: `nums: number[]` — any integers, duplicates allowed.
 * Output: `string[]` — compacted ranges, sorted ascending, no overlaps, no duplicates.
 *
 * Examples:
 * - compactRanges([1, 2, 3, 5, 7, 8]) -> ["1-3", "5", "7-8"]
 * - compactRanges([5, 5, 4, 2, 3, 3]) -> ["2-5"]
 * - compactRanges([]) -> []
 */
export function compactRanges(nums: number[]): string[] {
  // 1.treat duplicates as a single occurrence
  // 2.sort ascending
  // [8, 10, 7, 5, 5, 4, 2, 3, 3]
  const ascendingNumsNoDup = Array.from(new Set(nums.sort()))

  let result = [];
  let start = ascendingNumsNoDup[0];
  let prev = ascendingNumsNoDup[0];

  for (let i = 1; i < ascendingNumsNoDup.length; i++) {
    const current = ascendingNumsNoDup[i]
    if (current !== prev + 1) {
      if (start === prev) {
        result.push(`${start}`)
      } else {
        result.push(`${start}-${prev}`)
      }
      start = current;
    }
    prev = current;
  }
  return result;
}

console.log(compactRanges([8, 10, 7, 5, 5, 4, 2, 3, 3]))