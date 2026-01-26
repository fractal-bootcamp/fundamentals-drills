/**
 * Assignment 1 — TypeScript Fundamentals
 *
 * This file contains three distinct problems to practice basic TypeScript syntax,
 * data structures, and logic.
 *
 * Constraints:
 * - Type safe.
 * - Do not use Regular Expressions (Regex) for logic, practice manual parsing/checking.
 */

// -----------------------------------------------------------------------------
// Problem 1: Format Names
// -----------------------------------------------------------------------------

export interface User {
  first: string;
  last: string;
  age: number;
}

/**
 * Given a list of users, return an array of formatted strings for all users
 * who are 18 or older.
 *
 * Format: "Last, First"
 * Ordering: The output array should be sorted alphabetically by Last name,
 *           then by First name for ties.
 *
 * Example:
 *   Input: [
 *     { first: "Alice", last: "Doe", age: 17 },
 *     { first: "Bob", last: "Smith", age: 25 },
 *     { first: "Charlie", last: "Doe", age: 20 }
 *   ]
 *   Output: ["Doe, Charlie", "Smith, Bob"]
 *   (Alice is filtered out)
 */
export function formatNames(users: User[]): string[] {
  return [];
}

// -----------------------------------------------------------------------------
// Problem 2: Find Peaks
// -----------------------------------------------------------------------------

/**
 * Given an array of integers, return the indices of all "peaks".
 * A peak is an element that is strictly greater than its neighbors.
 *
 * - For the first element, it is a peak if it is greater than the second.
 * - For the last element, it is a peak if it is greater than the second-to-last.
 * - For elements in the middle, they must be greater than both left and right neighbors.
 *
 * Example:
 *   Input: [1, 3, 2, 5, 4]
 *   Output: [1, 3]  (Values 3 and 5 are peaks)
 *
 *   Input: [5, 1, 2]
 *   Output: [0]     (Value 5 is a peak)
 */
export function findPeaks(nums: number[]): number[] {
  const newArr = [];

  for (let i = 0; i < nums.length; i++) {
    if (
      (i === 0 || nums[i] > nums[i - 1]) &&
      (i === nums.length - 1 || nums[i] > nums[i + 1])
    ) {
      newArr.push(i);
    }
  }

  return newArr;
}

// -----------------------------------------------------------------------------
// Problem 3: Count Character Types
// -----------------------------------------------------------------------------

export interface CharCounts {
  vowels: number;
  consonants: number;
  numbers: number;
  others: number;
}

/**
 * Analyze a string and count the number of vowels, consonants, numbers, and other characters.
 *
 * Definitions:
 * - Vowels: a, e, i, o, u (case insensitive)
 * - Consonants: Any other letter (case insensitive)
 * - Numbers: 0-9
 * - Others: Spaces, punctuation, symbols, emojis, etc.
 *
 * Constraint: Do NOT use Regular Expressions.
 *
 * Example:
 *   Input: "Hi 123!"
 *   Output: { vowels: 1, consonants: 1, numbers: 3, others: 2 }
 *           ('i' is vowel, 'H' is consonant, '1','2','3' are numbers, ' ' and '!' are others)
 */
export function countCharacterTypes(text: string): CharCounts {
  return { vowels: 0, consonants: 0, numbers: 0, others: 0 };
}
