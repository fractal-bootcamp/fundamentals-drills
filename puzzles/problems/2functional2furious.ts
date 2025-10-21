// puzzles/problems/functional_practice_pack_2.ts
//
// Functional Practice Pack 2 (Level 0.5 → 1)
// ------------------------------------------
// Goal: Practice array and string method fluency.
// Rule: No loops.
//
// Implement each function below to satisfy the examples in the comments.
// Keep implementations pure and deterministic.
//
// ------------------------------------------------------------
// 1) Double Odds
// Return a new array where odd numbers are doubled and even numbers are unchanged.
//
// time: forgot timer. at least 10 mins to debug until syntax was correct
// Input: number[]
// Output: number[]
// Examples:
//   doubleOdds([1, 2, 3]) -> [2, 2, 6]
//   doubleOdds([]) -> []
//  sketch: conditionally double or ignore elements of array based on odd or even

export function doubleOdds(nums: number[]): number[] {
    for (let i = 0; i < nums.length; i++) {
        let num = nums[i]

        if (num % 2 != 0) {
            nums[i] = num * 2
        }
    }
    return nums
}

//  note: extremely disappointing to see myself falling back on for loops after one stupid meeting, wtf.
//      this could have been done with .map and the ternary operator:
//      nums.map((n)=> n % 2 == 0 ? n * 2 : n )

// ------------------------------------------------------------
// 2) Only Unique Strings
// Return a new array with duplicate strings removed, keeping the first occurrence.
//
// time: 52s. +1m to find out why i couldn't return a set(wrong type) and fix( use Array.from to go back)
// Input: string[]
// Output: string[]
// Examples:
//   onlyUniqueStrings(["a", "b", "a", "c", "b"]) -> ["a", "b", "c"]
//   onlyUniqueStrings([]) -> []
export function onlyUniqueStrings(words: string[]): string[] {
    const unique = new Set(words)
    return Array.from(unique)
}
// note: more concise version is possible using the spread operator
//      const unique = [...new Set(words)]
//  can also use .filter + .indexOf (optimal go-to, does not require elements to be primitives and allows custom logic)-
//      return words.filter((word, index) => words.indexOf(word) === index)

// ------------------------------------------------------------
// 3) Count Truthy
// Return how many elements are truthy in the array.
//
// time: 1:49 first pass, didn't work[values.map((val) => val ? count + 1 : count)]
//      37s second pass, also didn't work[values.map((val) => val ? count + 1 : count)]
//      noticed const instead of let but it's still passing 0
// Input: unknown[]
// Output: number
// Examples:
//   countTruthy([0, 1, "", "x", null, {}, []]) -> 4
//   countTruthy([]) -> 0
export function countTruthy(values: unknown[]): number {
    let count = values.filter(Boolean).length
    return count
}

// ------------------------------------------------------------
// 4) Any Starts With
// Return true if any string starts with the given single-character prefix,
// case-insensitive; false otherwise.
//
// time: 1:19. another 1:21 to debug(.find returns the string, use conditional to return boolean). 
// another 2:30 to make case insensitive(lowercase both sides)
// Input: (words: string[], letter: string)
// Output: boolean
// Examples:
//   anyStartsWith(["apple", "banana", "Cherry"], "a") -> true
//   anyStartsWith(["dog", "cat"], "Z") -> false
export function anyStartsWith(words: string[], letter: string): boolean {
    let lowerLetter = letter.toLowerCase()
    if (words.find((word) => word[0].toLowerCase() == lowerLetter))
        return true
    else return false
}

// ------------------------------------------------------------
// 5) All Within Range
// Return true if all numbers are within the inclusive range [min, max].
//
// time: 3:17(looked up .every). another 4-5 or so to debug(needed <= not < to make it inclusive)
// Input: (nums: number[], min: number, max: number)
// Output: boolean
// Examples:
//   allWithinRange([3, 4, 5], 3, 5) -> true
//   allWithinRange([2, 6], 3, 5) -> false
//   allWithinRange([], 0, 1) -> true
export function allWithinRange(nums: number[], min: number, max: number): boolean {
    const check = nums.every((num) => min <= num && num <= max)
    return check

}

// ------------------------------------------------------------
// 6) Pick Key
// From an array of records, return an array of values for the given key,
// skipping records where the key is missing.
//
// time: 7:36 to get most of the way there. 30mins to decompress and talk out my frustrations this afternoon.
//      maybe 2mins to find out how to refer to the elements i wanted
// Input: (items: Array<Record<string, unknown>>, key: string)
// Output: unknown[]
// Examples:
//   pickKey([{a:1},{b:2},{a:3,c:0}], "a") -> [1, 3]
//   pickKey([], "x") -> []
// sketch: .filter by key, extract values into an array
export function pickKey(items: Array<Record<string, unknown>>, key: string): unknown[] {
    let keyedObjects = items.filter((item) => key in item)
    let keyedValues = keyedObjects.map((obj, i) => obj[key])
    return keyedValues
}

// ------------------------------------------------------------
// 7) Flatten Once
// Flatten a single level of nesting.
//
// time: 1:15 including looking up flatmap params
// Input: number[][]
// Output: number[]
// Examples:
//   flattenOnce([[1,2],[3],[4,5]]) -> [1,2,3,4,5]
//   flattenOnce([]) -> []
export function flattenOnce(nested: number[][]): number[] {
    return nested.flatMap((el) => el)
}

// ------------------------------------------------------------
// 8) Sum By Amount
// Given items with an `amount` field, return the total amount.
//
// time: 3:10 + ~2mins to fix failing test(return zero for empty array)
// Input: Array<{ amount: number }>
// Output: number
// Examples:
//   sumByAmount([{amount:2},{amount:5},{amount:-1}]) -> 6
//   sumByAmount([]) -> 0
export function sumByAmount(items: Array<{ amount: number }>): number {
    if (items.length != 0) {
        const values = items.map((item, i) => item.amount)
        return values.reduce((acc, curr) => acc + curr)
    }
    return 0
}

// ------------------------------------------------------------
// 9) Parity Counts
// Return an object with counts of even and odd numbers.
//
// time: 2:52 + 2 mins to debug syntax
// Input: number[]
// Output: { even: number; odd: number }
// Examples:
//   parityCounts([1,2,3,4,5]) -> { even: 2, odd: 3 }
//   parityCounts([]) -> { even: 0, odd: 0 }
export function parityCounts(nums: number[]): { even: number; odd: number } {
    let countEven = 0
    let countOdd = 0
    nums.forEach((num) => num % 2 == 0 ? countEven = countEven + 1 : countOdd = countOdd + 1)
    const sums = { even: countEven, odd: countOdd }
    return sums

}

// ------------------------------------------------------------
// 10) Longest Word
// Return the longest string. On ties, return the first longest. Empty input -> null.
//
// time: 10:17 w/lookup to use reduce this way and debugging syntax. addl 1m to add conditional
// Input: string[]
// Output: string | null
// Examples:
//   longestWord(["a","abcd","abc"]) -> "abcd"
//   longestWord([]) -> null
export function longestWord(words: string[]): string | null {
    if (words.length != 0) {
        let longest = words.reduce((best, current) => {
            if (current.length > best.length) {
                return current
            }
            return best
        })
        return longest
    }
    return null
}
