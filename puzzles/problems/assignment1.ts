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
  if (students.length > 0) {
    let highestAverage = null
    for (const student of students) {
      if (student.scores.length > 0) {
        student.average = student.scores.reduce((accumulator, currentScore) => accumulator + currentScore)
        student.average = student.average / (student.scores.length)
      } else {
        student.average = 0
      }
      
      if (highestAverage === null || student.average > highestAverage.average) {
        highestAverage = student
      }
  }
  return highestAverage.name

  } else {
    throw Error('No students provided')
  }
}

export function betterFindTopStudent(students): string {
  const topStudent = students.reduce((topStudent, student) => {
    return 0
  })
}