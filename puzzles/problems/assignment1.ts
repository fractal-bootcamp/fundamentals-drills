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
}

export function findTopStudent(students: Student[]): string {
  // reduce over the array of students, calculate the average of each student and compare to the current highest and replace otherwise
  const getAverage = (array) => {
    return array.reduce((acc, score) => {
      return acc + score
    }, 0) / array.length
  }
  const studentsWithAverages = students.map((student) => {
    const average = getAverage(student.scores)
    return { ...student, average }
  })

  const highestAverage = studentsWithAverages.reduce((topStudent, currentStudent) => {
    if (currentStudent.average > topStudent.average) {
      return currentStudent;
    } else {
      return topStudent;
    }
  }, studentsWithAverages[0])

  console.log(highestAverage)

  return highestAverage.name
}