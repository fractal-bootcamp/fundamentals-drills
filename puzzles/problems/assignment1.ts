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

type StudentAverage = {
  name: string;
  average: number;
}

// return StudentAverage.name of StudentAverage.average.max()
// (1133) will probably do a reduce? here on StudentAverage[], mdn bb
// (1137) ffref: how to do type checking on consts?
// (1142) Student[] => StudentAverage[] => name of Math.max(StudentAverage[].average)
// (1147) first part done! next: how to access name tied to max of student_averages
// (1148) maybe: sort student_averages by average, then access last element?
// (1151) okay, looks like return type is satisfied; save and test?
// (1153) lmao we close with just indexing,,,
export function findTopStudent(students: Student[]): string {
  const student_averages = students.map((student) => {
    return ({
      name: student.name,
      average: student.scores.reduce((prev, current) => prev + current, 0) / student.scores.length
    })
  })

  const sorted_averages = student_averages.sort((a, b) => a.average - b.average)

  return sorted_averages[-1].name
}