
// given an array, return `true` if the largest number in the array is even. examples:
// [1,2,3,8,42,111,10] => false
// [2,45,6,6,6,6,6,48] => true
// [1] => false
function isLargestNumberEven(arr: number[]): boolean {
  let largestNumberSoFar = -Infinity;

  arr.forEach(num => {
    if (num > largestNumberSoFar) {
      largestNumberSoFar = num;
    }
  })

  if (largestNumberSoFar % 2 === 0) {
    return true;
  } else {
    return false
  }
}

// given an array of student scores, replace the "points" and "maxPossiblePoints" with a percentage grade instead. 
// examples: 50 100 -> (50/100) * 100, 50 75 -> (50/75) * 100
// [{ student: "steve", points: 50, maxPossiblePoints: 100}] => [ { student: "steve", grade: 50 }]
// [{ student: "bob", points: 50, maxPossiblePoints: 75}, { student: "joe", points: 1, maxPossiblePoints: 10}] => 
//    [ { student: "steve", grade: 66.66 }, { student: "joe", grade: 10 }]
type StudentGrade = { student: string, grade: number }
type PercentageGrades = Array<StudentGrade>

function convertToPercentages(scores: { student: string, points: number, maxPossiblePoints: number }[]): PercentageGrades {
  let studentPercentageGrade: StudentGrade = { student: "", grade: 0 };
  let allStudentsPercentageGrades: PercentageGrades = [];

  for (let studentScore of scores) {
    studentPercentageGrade = { student: studentScore.student, grade: (studentScore.points / studentScore.maxPossiblePoints) * 100 }
  }

  allStudentsPercentageGrades.push(studentPercentageGrade);

  return allStudentsPercentageGrades;
}

// given an array of cats, return the names of all cats with blue eyes. examples:
// [{ name: "oreo", pelt: "tuxedo", eyes: "green"}, {name: "tiger", pelt: "orange", eyes: blue }] => ["tiger"]
// [{ name: "kitty", pelt: "orange", eyes: "red"}] => []
type CatType = { name: string, pelt: string, eyes: string }

function findBlueEyedCats(cats: CatType[]): string[] {
  let blueEyesCat = "";
  let blueEyesCats: string[] = [];
  cats.forEach(cat => {
    if (cat.eyes === "blue") {
      blueEyesCat = cat.name;
      blueEyesCats.push(blueEyesCat);
    }
  })
  return blueEyesCats;
}

// given an array of numbers, return true if the array of numbers strictly decreases. examples:
// [5,4,3,1] => true
// [99,43,10] => true
// [5,4,3,2,3] => false
// [9,10,8,5,4,3] => false
// [9999,34,20,19,18,17,16,15,14,13,12,11,10,9,8,6,7,5,4,3,2,1] 
function isDecreasing(input: number[]): boolean {
  for (let i = 1; i < input.length; i++) {
    const previousNumber = input[i - 1];
    const currentNum = input[i];

    if (currentNum >= previousNumber) {
      return false;
    }
  }

}

console.log(isDecreasing([99, 43, 10, 10]))