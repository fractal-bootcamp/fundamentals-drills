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

export function findTopStudent(students): string {


  //calculate average of each student
  let highest = 0
  let out = ''

  for (const student of students) {
    let name = student.name
    let gradeArr = student.scores

    let studentTotal = gradeArr.reduce((total, grade) => total + grade)
    let studentAvg = studentTotal / gradeArr.length

    if (studentAvg > highest) {
      out = name
    }
  }

  return out
}