/**
 * Student Grade Calculator
 *
 * [Given an array of student records], find the student with the highest average grade.
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


//TODO create a function to calculate the average of one student, if time
//TODO: account for empty studentRecords, account for empty scores array

//student records contain a name and an array of test scores
type studentRecords = {
  name: string;
  scores: number[];
}

export function findTopStudent(student: studentRecords[]): string {
  let nameOfHighestStudentAverage = " ";
  let higheststudentAvg = 0;
  let scoreLen = student[0].scores.length;
  //iterate through the student Records
  //caluclate the average of each student, routinely set nameofHighest until you get to the end of the array of students
  for (let i = 0; i < student.length; i++) //need to loop through all students once in case last student has highest average
  {




    //loop to calculate average
    let tempAvg = 0;
    let tempTotalScore = 0;
    for (let z = 0; z < scoreLen; z++) {
      tempTotalScore += student[i].scores[z] //TODO: add all scores of one student, make sure youre specifying the right score
      console.log(tempTotalScore)
    }
    tempAvg = (tempTotalScore / scoreLen); //calculating average- total scores by number of scores
    if (tempAvg > higheststudentAvg) {
      if (tempAvg != higheststudentAvg) { //only store the first highest in the case of a tie
        nameOfHighestStudentAverage = student[i].name;
      }
    }

  }


  return (nameOfHighestStudentAverage);

}

//Students array contains records
//records contain: name, array of test scores
//TODO: Calculate each student's average
//TODO: If there is a tie, return the studeent whose name appears first in the array