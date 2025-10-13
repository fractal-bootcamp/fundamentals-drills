/**
 * Student Grade Calculator
 *
 * Given an array of student records, find the student with the highest average grade.
 * Each student record contains a name and an array of test scores. Calculate each
 * student's average and return the name of the student with the highest average.
 * If there's a tie, return the student whose name appears first in the array.
 *
 * Input: Array of objects with { name: string, scores: number[] }
 * Output: String representing the name of the top student
 *
 * Examples:
 * - [{ name: "Alice", scores: [85, 90, 78] }, { name: "Bob", scores: [92, 88] }] → "Bob"
 * - [{ name: "Charlie", scores: [80] }, { name: "Dana", scores: [80, 80] }] → "Charlie"
 */

type Student = {
  name: string;
  scores: number[];
};

export function findTopStudent(students: Student[]): string {
  const average = (s: Student): number => {
    const sum = (acc: number, cur: number) => acc + cur;
    const total = s.scores.reduce(sum, 0);
    return total / s.scores.length;
  };

  const lowestToHighest = (a: Student, b: Student): number => {
    // console.log("a", a.name, average(a));
    // console.log("b", b.name, average(b));
    // console.log("valence", average(a) - average(b));
    return average(a) - average(b);
  };

  let sorted = [...students];
  sorted = sorted.sort(lowestToHighest);
  sorted = sorted.reverse();

  return sorted[0].name;
}
