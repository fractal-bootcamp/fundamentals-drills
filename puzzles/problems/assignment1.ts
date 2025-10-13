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
  // if students' scores array is empty
  // if (students.scores === []) return console.log('Students scores array is empty')

  // find the average of each student's scores
  const student1 = students[0]

  const student2 = students[1]

  for (let i = 0; i < student1.scores.length; i++) {
    const stu1avg = student1.scores / student1.scores.length
    const studentAvg1String = stu1avg.toString()
    return studentAvg1String
  }

  for (let i = 0; i < student2.scores.length; i++) {
    const stu2avg = student2.scores / student2.length
    const studentAvg2String = stu2avg.toString()
    // return studentAvg2String
  }

  // compare the two averages and return the name of student w/ highest avg.
  if (studentAvg1String > studentAvg2String) {
    return student1.name
  } else if (studentAvg1String < studentAvg2String) {
    return student2.name
  } else (studentAvg1String === studentAvg2String) {  // if tie return student who's name appears first in array
    return student1[0].name
  }
}