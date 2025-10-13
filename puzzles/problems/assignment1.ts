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
  let currMax = 0;
  let indexMax = 0;
  let added = 0;
  let average = 0;


  for (let i = 0; i < students.length; i++) {
    average = 0;
    added = 0;
    if (students[i].scores.length != 0) {
      for (let s = 0; s < students[i].scores.length; s++) {
        added += students[i].scores[s];
      }
      average = (added / students[i].scores.length);
    }

    if (students[i].scores.length == 1) {
      average = students[i].scores[0];
    }
     if (students[i].scores.length == 0) {
      average = 0;
    }
    console.log(students[i].name + "average: " + average);


    if (average > currMax) {
      currMax = average;
      indexMax = i;
    }
  }

  if(students.length == 0)
  {
    throw "No students provided"
  }
  else
  {
    return students[indexMax].name;
  }
}
