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

export function findTopStudent(students: { name: string, scores: number[] }[]): string {
  if (students.length  === 0) throw new Error("No students provided")
  let topStudent = ""
  let topAverage = 0
  for (let i = 0; i < students.length; i++) {
    const name = students[i].name

    const scores = students[i].scores

    let totalScore = 0

    scores.forEach((score) => totalScore = totalScore + score)

    const average = totalScore/scores.length

    if (average > topAverage) {
      topAverage = average
      topStudent = name
    }
  }
  if (topStudent === "") return "everybody sucks"
  return topStudent
}