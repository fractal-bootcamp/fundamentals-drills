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

type studentRecords= {
  name:string,
  scores:score[]
}

type score = number

export function findTopStudent(students): string {
  if (students.length == 0) throw new Error("No students provided");
  
  let maxName: string = students[0].name
  let maxScore: number | null = null 

  students.map(student=> student.average=avg(student))


  for (const student of students) {
      if (student.average> maxScore!) {
        maxName = student.name
        maxScore = student.average
      }
    
  }
return maxName
}

function avg(student:studentRecords):score {
  let total = 0
  for (const score of student.scores) {
    total += score
  }
  return total/student.scores.length
}