/**
 * Assignment 1 — Array Fluency
 *
 * This assignment contains two problems designed to test your ability to
 * manipulate arrays and objects using modern JavaScript/TypeScript patterns.
 */

/**
 * Problem 1: Find Local Peaks
 *
 * Context:
 * In terrain analysis, a "peak" is a point higher than its immediate neighbors.
 * Given an array of numbers, return the indices of all local peaks.
 *
 * Rules:
 * - A peak is strictly greater than its neighbors.
 * - For indices 0 and N-1, consider only the single neighbor that exists.
 * - If the array has only one element, it is considered a peak.
 *
 * Input:
 *   - nums: number[]
 * Output:
 *   - number[] (array of indices)
 *
 * Examples:
 *   findPeaks([1, 2, 1, 3, 5, 2]) -> [1, 4]
 *   findPeaks([4, 4, 4]) -> []
 *   findPeaks([10, 8, 6]) -> [0]
 */
export function findPeaks(nums: Array<number>): Array<number> {
  const newArr = [];

  for (let i = 0; i < nums.length; i++) {
    if (
      (i === 0 || nums[i] > nums[i - 1]) &&
      (i === nums.length - 1 || nums[i] > nums[i + 1])
    ) {
      newArr.push(i);
      // console.log(newArr);
    }
  }

  return newArr;
}

/**
 * Problem 2: Department Spending Summary
 *
 * Context:
 * You have a list of purchase records. You need to identify which departments
 * are over-budget.
 *
 * Tasks:
 * 1. Calculate the total spending per department.
 * 2. Filter for departments that spent strictly more than a given `threshold`.
 * 3. Return the results as an array of objects, sorted by total spending (highest first).
 *
 * Input:
 *   - purchases: { dept: string, amount: number }[]
 *   - threshold: number
 * Output:
 *   - { dept: string, total: number }[]
 *
 * Examples:
 *   summarizeSpending([{dept: 'IT', amount: 100}, {dept: 'HR', amount: 50}, {dept: 'IT', amount: 200}], 150)
 *   -> [{dept: 'IT', total: 300}]
 */
export type Purchase = {
  dept: string;
  amount: number;
};

export type DeptSummary = {
  dept: string;
  total: number;
};

export function summarizeSpending(
  purchases: Array<Purchase>,
  threshold: number,
): DeptSummary[] {
  const totals: Record<string, number> = {};

  purchases.forEach((purchase) => {
    const dept = purchase.dept;
    const amount = purchase.amount;

    if (totals[dept] === undefined) {
      totals[dept] = amount;
    } else {
      totals[dept] += amount;
    }
  });

  const summaryArr = Object.entries(totals).map(([dept, total]) => {
    return { dept, total };
  });

  const filteredDepts = summaryArr.filter((department) => department.total > threshold);
  const sortedList = filteredDepts.sort((a, b) => b.total - a.total);

  console.log("summaryArr:", summaryArr);
  console.log("filteredDepts:", filteredDepts);
  console.log("sortedList", sortedList);

  return sortedList;
}
