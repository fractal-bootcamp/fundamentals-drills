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

interface student {
  name: string, 
  scores: number[]
}

export function findTopStudent(students: student[]): string {

  if (students.length < 1) {
    throw new Error("No students provided");
  }

  let max = -1;
  let index = -1;


  students.map((student) => {
    return student.scores.reduce(
      (acc, curr) => acc + curr / student.scores.length,
      0,
    );
  }).forEach((score, i) => {
    if (score > max) {
      max = score;
      index = i
    }
  })


  return students[index].name;
}