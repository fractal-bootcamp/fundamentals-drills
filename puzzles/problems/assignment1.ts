
// given an array, return `true` if the largest number in the array is even. examples:
// [1,2,3,8,42,111,10] => false
// [2,45,6,6,6,6,6,48] => true
// [1] => false
function isLargestNumberEven(arr: number[]): boolean {
  return false
}

// given an array of student scores, replace the "points" and "maxPossiblePoints" with a percentage grade instead. examples:
// [{ student: "steve", points: 50, maxPossiblePoints: 100}] => [ { student: "steve", grade: .5 }]
// [{ student: "bob", points: 50, maxPossiblePoints: 75}, { student: "joe", points: 1, maxPossiblePoints: 10}] => 
//    [ { student: "steve", grade: .6666666... }, { student: "joe", grade: .1 }]
type PercentageGrades = {}[] // TODO! FILL THIS IN!
function convertToPercentages(scores: { student: string, points: number, maxPossiblePoints: number }[]): PercentageGrades {
  return []
}

// given an array of cats, return the names of all cats with blue eyes. examples:
// [{ name: "oreo", pelt: "tuxedo", eyes: "green"}, {name: "tiger", pelt: "orange", eyes: blue }] => ["tiger"]
// [{ name: "kitty", pelt: "orange", eyes: "red"}] => []
type CatType = {} // TODO! fill this in!
function findBlueEyedCats(cats: CatType[]): string[] {
  return []
}

// given an array of numbers, return true if the array of numbers strictly decreases. examples:
// [5,4,3,1] => true
// [99,43,10] => true
// [5,4,3,2,3] => false
// [9,10,8,5,4,3] => false
function isDecreasing(input: number[]): boolean {
  return false
}