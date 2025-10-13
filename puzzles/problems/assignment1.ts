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
  let highest = -1
  let out = ''

  for (const student of students) {
    let name = student.name
    let gradeArr = student.scores

    console.log(name, gradeArr)

    let grade = 0

    const initialValue = 0;
    const studentTotal = gradeArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue,
    );
    // let studentTotal = gradeArr.reduce((total, curGrade) => total + grade, initialValue,)
    console.log(studentTotal)
    let studentAvg = studentTotal / (gradeArr.length === 0 ? 1 : gradeArr.length)
    console.log(studentAvg)

    if (studentAvg > highest) {
      out = name
      highest = studentAvg
    }
  }

  return out
}

const students = [{ name: "Perfect", scores: [100, 100, 100] }, { name: "AlmostPerfect", scores: [99, 100, 99] }]

console.log(findTopStudent(students))