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
  scores: number[]
}

export type individualStudentScore = {
  name: string,
  score: number
}

export function findTopStudent(students: Students[]): string {
  if (students.length === 0) throw new Error('No students provided')

  let topStudentSoFar: string = "";
  let topStudentScoreSoFar: number = 0;

  for (let student of students) {
    let totalScore = 0;
    for (let i of student.scores) {
      totalScore += (i / student.scores.length);
      if (totalScore > topStudentScoreSoFar) {
        topStudentScoreSoFar = totalScore;
        topStudentSoFar = student.name;
      }
    }
  }
  return topStudentSoFar;
}