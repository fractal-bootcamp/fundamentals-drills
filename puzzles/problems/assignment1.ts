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


// export type avgScores = {
//   name: string
//   avgScore: number
// }


export function findTopStudent(students): string {
  // let avgScores: avgScores[] = []
  let avgScores = []
  for (let i = 0; i < students.length; i++) {
    let individualScores = students[i].scores
    const initialValue = 0  
    const sumScores = individualScores.reduce((accumulator, currentValue) => 
      accumulator + currentValue, initialValue
    )
    console.log(sumScores)
    const avgScore = sumScores / individualScores.length
    const studentAggregated = {
        name: students[i].name, 
        avgScore: avgScore
    }
    console.log(avgScore)
    avgScores.push(studentAggregated)
    
  }
  return avgScores
}