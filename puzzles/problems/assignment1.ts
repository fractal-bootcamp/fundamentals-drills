// Puzzle 1 — Range of an array
// Given an array of numbers, return the difference between the largest and smallest value.
// If the array has length 0 or 1, return 0.
// Examples:
// rangeOf([1, 2, 3, 8, 42, 10]) -> 41   // 42 - 1
// rangeOf([5]) -> 0
// rangeOf([]) -> 0

export function rangeOf(nums: number[]): number {
  if (nums.length === 0 || 1) 0;
  let largestNum = nums[0];
  let smallestNum = nums[0];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < smallestNum) {
      smallestNum = nums[i]
    }

    if (nums[i] > largestNum) {
      largestNum = nums[i]
    }
  }
  return largestNum - smallestNum;
}


// Puzzle 2 — Sum amounts by category
// You are given a list of transactions, each with a category and an amount (can be positive or negative).
// Return an object mapping each category to the total of its amounts.
//
// Examples:
// sumByCategory([
//   { category: "food", amount: 5 },
//   { category: "books", amount: 7 },
//   { category: "food", amount: 4 },
// ])
// -> { food: 9, books: 7 }
//
// sumByCategory([]) -> {}
type Txn = { category: string; amount: number };
type TotalsByCategory = Record<string, number>;

export function sumByCategory(txns: Txn[]): TotalsByCategory {
  let totalSum = txns.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});
  return totalSum;
}


// Puzzle 3 — Strictly alternating parity
// Given an array of integers, return true if the numbers alternate even/odd/even/odd... (or odd/even/odd/...).
// Arrays of length 0 or 1 should return true.
//
// Examples:
// hasAlternatingParity([2, 5, 8, 11, 14]) -> true
// hasAlternatingParity([1, 4, 7, 10]) -> true
// hasAlternatingParity([2, 2]) -> false
// hasAlternatingParity([9, 10, 8]) -> false  // 10 -> 8 is even->even
export function hasAlternatingParity(nums: number[]): boolean {
  if (nums.length === 0 || 1) true;

  for (let i = 1; i < nums.length; i++) {
    let prevNum = nums[i - 1];
    let currentNum = nums[i];

    if (prevNum % 2 === 0 && currentNum % 2 === 0) {
      return false;
    }

    if (prevNum % 2 !== 0 && currentNum % 2 !== 0) {
      return false;
    }
  }
  return true;
}
