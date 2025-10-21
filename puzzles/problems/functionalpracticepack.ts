// quick and dirty practice so i get the method shapes in my head and stop reaching for for loops to everygdthing
// i just decided each will be timed

// puzzles/problems/functionalpracticepack.ts
//
// Functional Practice Pack (Level 0.5 → 1)
// ----------------------------------------
// Goal: Practice array methods like map, filter, reduce, some, every, find.
// Rule: **No loops allowed.**
// Implement each function below according to the problem statement.
// Do not import or use external libraries. Pure and deterministic only.
//
// Each problem should take <5 minutes to complete.
// Keep them short, readable, and self-contained.
//
// ------------------------------------------------------------
// time: 1:06. add 2-3 mins to figure out why the syntax didn't 
// work: ^ is not an exponentiation operator. ** is
// 1. Squares Only
// Return a new array containing each number squared.
//
// Input: number[]
// Output: number[]
// Example:
//   squareAll([1, 2, 3]) -> [1, 4, 9]
export function squareAll(nums: number[]): number[] {
    nums = nums.map((num) => num ** 2)
    return nums
}

// ------------------------------------------------------------
// time: 1:15. add ~30s to notice the equal sign needed to be doubled to use comparison instead 
// of assignment and add return statement
// 2. Even Numbers Only
// Return all even numbers from the array.
//
// Input: number[]
// Output: number[]
// Example:
//   onlyEvens([1, 2, 3, 4]) -> [2, 4]
export function onlyEvens(nums: number[]): number[] {
    nums = nums.filter((num => num % 2 == 0))
    return nums
}

// ------------------------------------------------------------
// time: 1:52, including lookup for touppercase
// 3. Uppercase Words
// Convert every string in an array to uppercase.
//
// Input: string[]
// Output: string[]
// Example:
//   toUpper(["hi", "bye"]) -> ["HI", "BYE"]
export function toUpper(words: string[]): string[] {
    const upperCase = words.map((word) => word.toUpperCase())
    return upperCase
}

// ------------------------------------------------------------
// time: forgot to start timer. had to look up reduce params and how to use ternary operator to assign my if statement to a returnable variable
// 4. Sum of Positives
// Return the total of all numbers greater than 0.
//
// Input: number[]
// Output: number
// Example:
//   sumPositives([-1, 2, 3]) -> 5
export function sumPositives(nums: number[]): number {
    const poz = nums.filter((num) => num > 0)
    console.log(poz)
    const sumPoz = poz.length != 0
        ? poz.reduce((acc, curr) => acc + curr)
        : 0
    return sumPoz
}

// ------------------------------------------------------------
// time: 3:07, including getting briefly sniped by .normalize in MDN for some reason. passed all on first run though!
// 5. Count Long Words
// Count how many strings have length > 3.
//
// Input: string[]
// Output: number
// Example:
//   countLong(["hi", "code", "typescript", "yo"]) -> 2
// sketch: filter to words > 3, count array length
export function countLong(words: string[]): number {
    const longWords = words.filter((word) => word.length > 3)
    const wordCount = longWords.length
    return wordCount
}

// ------------------------------------------------------------
// time: 52s. add ~2-3 mins to find out that .find is typed number | undefined and conflicting with the type in the 
// function declaration gpt put in here smh
// 6. First Negative
// Return the first negative number in the array, or null if none.
//
// Input: number[]
// Output: number | null
// Example:
//   firstNegative([5, 2, -3, -1]) -> -3
export function firstNegative(nums: number[]): number | null {
    const res = nums.find((num) => num < 0)
    return res ?? null
}

// ------------------------------------------------------------
// time: 1:37. oneshotted it
// 7. All Non-Empty
// Return true if all strings are non-empty, else false.
//
// Input: string[]
// Output: boolean
// Example:
//   allNonEmpty(["a", "b", ""]) -> false
export function allNonEmpty(words: string[]): boolean {
    const nonEmpty = words.every((str) => str.length > 0)
    return nonEmpty
}

// ------------------------------------------------------------
// time: 49s. oneshotted
// 8. Has Any Zero
// Return true if at least one element is 0.
//
// Input: number[]
// Output: boolean
// Example:
//   hasZero([3, 1, 0, 4]) -> true
export function hasZero(nums: number[]): boolean {
    const check = nums.some((num) => num === 0)
    return check
}

// ------------------------------------------------------------
// time: 41s. oneshotted
// 9. Word Lengths
// Return an array of word lengths.
//
// Input: string[]
// Output: number[]
// Example:
//   wordLengths(["cat", "fish"]) -> [3, 4]
// sketch: loop over array and transform each element
// practice David asked for in 1:1
// function mauriaMap(words: string[]): number[] {
//     let wordsTransformed = []
//     for (let i = 0; i < words.length; i++) {
//         let word = words[i].length;
//         wordsTransformed.push(word)
//     }
//     return wordsTransformed
// }
export function wordLengths(words: string[]): number[] {
    const lengths = words.map((word) => word.length)
    return lengths

}

// ------------------------------------------------------------
// time: 1:37. add ~4-5 mins to discover the secret constraint in the test and make sure the function returns 0 
//  if array is empty
// 10. Total Character Count
// Return total number of characters across all words.
//
// Input: string[]
// Output: number
// Example:
//   totalChars(["hi", "bye"]) -> 5
// sketch: count string length, then sum
export function totalChars(words: string[]): number {
    if (words.length == 0) return 0
    const stringLengths = words.map((word) => word.length)
    const stringSum = stringLengths.reduce((acc, curr) => acc + curr)
    return stringSum
}
