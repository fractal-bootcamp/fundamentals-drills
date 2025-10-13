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
  name: string,
  scores: Array<number>
}

export function findTopStudent(students: Array<Student>): string {
  if (students.length === 0) throw new Error("No students provided")
    
  let [bestName, bestScore]: [string, number] = [students[0].name, -Infinity]

  for (const student of students) {
    const average: number = student.scores.reduce(
      (total, current) => total + current, 
    0) / student.scores.length

    if (average > bestScore) {
      [bestName, bestScore] = [student.name, average]
    }
  }

  return bestName
}