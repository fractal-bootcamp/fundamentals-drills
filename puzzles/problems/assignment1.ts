
// given an array, return `true` if the largest number in the array is even. examples:
// [1,2,3,8,42,111,10] => false
// [2,45,6,6,6,6,6,48] => true
// [1] => false

// loop over the array, add number to state if > last number seen. when loop completes comparison for divisible by 2
// wait Math.max?
function isLargestNumberEven(arr: number[]): boolean {
  let largest = 0;

  for (let i = 0; i < arr.length; i++) {
    if (i > largest) {
      largest = i
    }
  }
  if ((largest / 2 == 0)) {
    return true
  }

  return false
}

// given an array of student scores, replace the "points" and "maxPossiblePoints" with a percentage grade instead. examples:
// [{ student: "steve", points: 50, maxPossiblePoints: 100}] => [ { student: "steve", grade: .5 }]
// [{ student: "bob", points: 50, maxPossiblePoints: 75}, { student: "joe", points: 1, maxPossiblePoints: 10}] => 
//    [ { student: "steve", grade: .6666666... }, { student: "joe", grade: .1 }]

// tasks: use 2 params to calculate a new third, remove the two old ones, add the new param
type PercentageGrades = {
  student: string,
  grade: number
}[]

function convertToPercentages(scores: { student: string, points: number, maxPossiblePoints: number }[]): PercentageGrades {
  let updatedRecords: PercentageGrades = []

  for (let i = 0; i < scores.length; i++) {
    const num = scores[i].points
    const denom = scores[i].maxPossiblePoints

    const percent = (num / denom) * 100

    const recordWithGrade = { student: scores[i].student, grade: percent }
    updatedRecords.push(recordWithGrade)
  }

  return updatedRecords
}



// given an array of cats, return the names of all cats with blue eyes. examples:
// [{ name: "oreo", pelt: "tuxedo", eyes: "green"}, {name: "tiger", pelt: "orange", eyes: blue }] => ["tiger"]
// [{ name: "kitty", pelt: "orange", eyes: "red"}] => []

// filter the cats with blue eyes
type CatType = {
  name: string,
  pelt: string,
  eyes: string,

}
function findBlueEyedCats(cats: CatType[]): string[] {
  return cats
    .filter((cat) => cat.eyes == "blue")
    .map((cat) => cat.name)
}
// console.log(findBlueEyedCats([{ name: "oreo", pelt: "tuxedo", eyes: "green" }, { name: "tiger", pelt: "orange", eyes: "blue" }]))

// given an array of numbers, return true if the array of numbers strictly decreases. examples:
// [5,4,3,1] => true
// [99,43,10] => true
// [5,4,3,2,3] => false
// [9,10,8,5,4,3] => false

// want to loop over the array and check if each number is less than the previous. if it's greater return false
function isDecreasing(input: number[]): boolean {
  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      return false
    }
  }
  return true
}