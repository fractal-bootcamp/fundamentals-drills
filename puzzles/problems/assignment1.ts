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

export type Students = {
  name: string,
  scores: number[],
} 
export function findTopStudent(students: Students[]): string {

      let topStudentScore = 0
      let topStudent = null

  for (let i = 0; i < students.length; i++) {
     const student = students[i]
    const sorted = student.scores.sort((a, b) => {return b - a})
    console.log(student.scores)

    if (student.scores[i] > topStudentScore) {
    topStudentScore = student.scores[i]
    topStudent = student
    }
  }

  return topStudent
}