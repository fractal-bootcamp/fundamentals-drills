// given an array, return `true` if the largest number in the array is even. examples:
// [1,2,113,8,42,111,10,3,523,6,226,7,7,7,227,87,7,7,7,743,7,7,34,34,43,3,343,3,333,3,323,3,3,3,5,6,7,8,1,3,435] => false
// [2,45,6,6,6,6,6,10] => true
// [1] => false

const myArr = [
  1, 2, 113, 8, 42, 111, 10, 3, 523, 6, 226, 7, 7, 7, 227, 87, 7, 7, 7, 743, 7, 7, 34, 34,
  43, 3, 343, 3, 333, 3, 323, 3, 3, 3, 5, 6, 7, 8, 1, 3, 435,
];
function isLargestNumberEven(arr: number[]): boolean {
  let biggestNumberSeenSoFar = arr[0];

  for (const currentWorkingNumber of arr) {
    if (currentWorkingNumber > biggestNumberSeenSoFar) {
      biggestNumberSeenSoFar = currentWorkingNumber;
      console.log(biggestNumberSeenSoFar);
    }
  }

  const remainder = biggestNumberSeenSoFar % 2;

  if (remainder == 0) {
    return true;
  } else return false;
}

// console.log(isLargestNumberEven(myArr))

// given an array of student scores, replace the "points" and "maxPossiblePoints" with a percentage grade instead. examples:
// [{ student: "steve", points: 50, maxPossiblePoints: 100}] => [ { student: "steve", grade: .5 }]
// [{ student: "bob", points: 50, maxPossiblePoints: 75}, { student: "joe", points: 1, maxPossiblePoints: 10}] =>
//    [ { student: "steve", grade: .6666666... }, { student: "joe", grade: .1 }]

type StudentInput = [
  {
    student: string;
    points: number;
    maxPossiblePoints: number;
  },
];

// this is the OUTPUT
type PercentageGrades = Student[];

type Student = {
  student: string;
  grade: number;
};

function convertToPercentages(
  scores: { student: string; points: number; maxPossiblePoints: number }[],
): PercentageGrades {
  const studentGrades: PercentageGrades = [];

  for (const data of scores) {
    const percentageGrade = data.points / data.maxPossiblePoints;

    const studentGradeObj = {
      student: data.student,
      grade: percentageGrade,
    };

    studentGrades.push(studentGradeObj);
  }

  return studentGrades;
}

// const testArr = [{ student: "steve", points: 50, maxPossiblePoints: 100 }]
// console.log(convertToPercentages(testArr))

// given an array of cats, return the names of all cats with blue eyes. examples:
// [{ name: "oreo", pelt: "tuxedo", eyes: "green"}, {name: "tiger", pelt: "orange", eyes: blue }] => ["tiger"]
// [{ name: "kitty", pelt: "orange", eyes: "red"}] => []
type CatType = {
  name: string;
  pelt: string;
  eyes: string;
};

type CatResults = string[];

function findBlueEyedCats(cats: CatType[]): string[] {
  const eyeColorArr: CatResults = [];

  for (const data of cats) {
    if (data.eyes === "blue") {
      const catResultObj = data.name;
      eyeColorArr.push(catResultObj.toString());
    }
  }

  return eyeColorArr;
}

const myCatsArr = [
  { name: "oreo", pelt: "tuxedo", eyes: "green" },
  { name: "tiger", pelt: "orange", eyes: "blue" },
];
// console.log(findBlueEyedCats(myCatsArr));

// given an array of numbers, return true if the array of numbers strictly decreases. examples:
// [5,4,3,1] => true
// [99,43,10] => true
// [5,4,3,2,3] => false
// [9,10,8,5,4,3] => false

// type InputArr = number[];
// let isDecreasingArr = [5, 4, 3, 1];
// let isDecreasingArr = [99, 43, 10];
// let isDecreasingArr = [5, 4, 3, 2, 3];
let isDecreasingArr = [9, 10, 8, 5, 4, 3];

function isDecreasing(input: number[]): boolean {
  let prevNum = input[0];

  for (let i = 0; i < input.length; i++) {
    const currentNum = input[i];

    if (currentNum > prevNum) {
      return false;
    }

    prevNum = currentNum;
  }

  return true;
}

console.log(isDecreasing(isDecreasingArr));
