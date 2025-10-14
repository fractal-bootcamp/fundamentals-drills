// Training Roadmap:
// Level 1 - nested iteration drills (2D arrays)
// Level 2 – segment detection & adjacency
// Level 3 – typed data modeling
// Level 4 – combining logic
// Level 5 – tackle processReservations


// 1
function readGrid(grid: string[][]) {
  const newArray: string[] = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      newArray.push(row[c]);
    }
  }
  return newArray;
}

console.log(readGrid([
  ["A", "B", "C"],
  ["D", "E", "F"]
]))

// 2

function countTarget(grid: string[][]) {
  
  let count = 0
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r]
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "A") {
        count ++
      }
    }
  }
  return count
}

console.log(countTarget([
  ["A", "B", "R", "A", "A"],
  ["B", "R", "A", "A", "R"]
]))

// 3

function cloneGrid(grid: string[][]) {
  const gridCopy: string[][] = structuredClone(grid)
  return gridCopy
}

console.log(cloneGrid([
  ["A", "B", "R", "A", "A"],
  ["B", "R", "A", "A", "R"]
]))

// 4
function aToR(grid: string[][]) {
  let newArray = []
  for (let r = 0; r < grid.length; r++) {
    let row = grid[r]
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "A") {
        row[c] = "R"
      } else {
        continue
      }
    }
    newArray.push(row)
  }
  return newArray
}

console.log(aToR([
  ["A", "B", "R", "A", "A"],
  ["B", "R", "A", "A", "R"]
]))

// 5

// isn't 5 similar to what I did in 4?

// 6

function flatten(grid: string[][]) {
  let flat = []
  for (let r = 0; r < grid.length; r++) {
    let row = grid[r]
    for (let c = 0; c < row.length; c++) {
      flat.push(row[c])
    }
  }
  return flat
}

console.log(flatten([
  ["A", "B"],
  ["C", "D"]
]))

let unflattened = [
  ["A", "B"],
  ["C", "D"]
]

console.log(unflattened.flat())