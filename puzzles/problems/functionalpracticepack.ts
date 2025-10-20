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
// time: 
// 3. Uppercase Words
// Convert every string in an array to uppercase.
//
// Input: string[]
// Output: string[]
// Example:
//   toUpper(["hi", "bye"]) -> ["HI", "BYE"]
export function toUpper(words: string[]): string[] {
    // TODO: implement using .map()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 4. Sum of Positives
// Return the total of all numbers greater than 0.
//
// Input: number[]
// Output: number
// Example:
//   sumPositives([-1, 2, 3]) -> 5
export function sumPositives(nums: number[]): number {
    // TODO: implement using .filter() + .reduce()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 5. Count Long Words
// Count how many strings have length > 3.
//
// Input: string[]
// Output: number
// Example:
//   countLong(["hi", "code", "typescript", "yo"]) -> 2
export function countLong(words: string[]): number {
    // TODO: implement using .filter() and .length
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 6. First Negative
// Return the first negative number in the array, or null if none.
//
// Input: number[]
// Output: number | null
// Example:
//   firstNegative([5, 2, -3, -1]) -> -3
export function firstNegative(nums: number[]): number | null {
    // TODO: implement using .find()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 7. All Non-Empty
// Return true if all strings are non-empty, else false.
//
// Input: string[]
// Output: boolean
// Example:
//   allNonEmpty(["a", "b", ""]) -> false
export function allNonEmpty(words: string[]): boolean {
    // TODO: implement using .every()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 8. Has Any Zero
// Return true if at least one element is 0.
//
// Input: number[]
// Output: boolean
// Example:
//   hasZero([3, 1, 0, 4]) -> true
export function hasZero(nums: number[]): boolean {
    // TODO: implement using .some()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 9. Word Lengths
// Return an array of word lengths.
//
// Input: string[]
// Output: number[]
// Example:
//   wordLengths(["cat", "fish"]) -> [3, 4]
export function wordLengths(words: string[]): number[] {
    // TODO: implement using .map()
    throw new Error("Not implemented");
}

// ------------------------------------------------------------
// time: 
// 10. Total Character Count
// Return total number of characters across all words.
//
// Input: string[]
// Output: number
// Example:
//   totalChars(["hi", "bye"]) -> 5
export function totalChars(words: string[]): number {
    // TODO: implement using .map() + .reduce() or just .reduce()
    throw new Error("Not implemented");
}
