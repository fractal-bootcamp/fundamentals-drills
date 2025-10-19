// Tic-Tac-Toe Winner Checker - Two Approaches

type Player = 'X' | 'O' | null;
type Board = Player[];

// ===== APPROACH 1: Match board state against winning combinations =====
// This approach checks if the current board matches any winning pattern

function checkWinnerByStateMatching(board: Board): Player {
  // All possible winning combinations (indices)
  const winningCombinations = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Check if any winning combination matches the current board state
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    // Check if all three positions have the same player and are not null
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null; // No winner
}


// ===== APPROACH 2: Iterate through combinations and check board =====
// This approach explicitly iterates through each winning combination

function checkWinnerByIteration(board: Board): Player {
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal (top-left to bottom-right)
    [2, 4, 6]  // Diagonal (top-right to bottom-left)
  ];

  // Iterate through every possible winning combination
  for (let i = 0; i < winningCombinations.length; i++) {
    const combination = winningCombinations[i];
    const position1 = combination[0];
    const position2 = combination[1];
    const position3 = combination[2];

    const cell1 = board[position1];
    const cell2 = board[position2];
    const cell3 = board[position3];

    // Check if this combination has a winner
    if (cell1 !== null && cell1 === cell2 && cell2 === cell3) {
      return cell1; // Return the winning player
    }
  }

  return null; // No winner found
}


// ===== TESTING EXAMPLES =====

// Example board states
const winningBoardX: Board = [
  'X', 'X', 'X',  // X wins on top row
  'O', 'O', null,
  null, null, null
];

const winningBoardO: Board = [
  'X', 'O', 'X',
  'X', 'O', null,
  null, 'O', null  // O wins on middle column
];

const noWinnerBoard: Board = [
  'X', 'O', 'X',
  'O', 'X', 'O',
  'O', 'X', 'O'
];

const diagonalWinX: Board = [
  'X', 'O', 'O',
  null, 'X', 'O',
  null, null, 'X'  // X wins on diagonal
];

// Test both approaches
console.log('=== APPROACH 1: State Matching ===');
console.log('Winning Board X:', checkWinnerByStateMatching(winningBoardX)); // 'X'
console.log('Winning Board O:', checkWinnerByStateMatching(winningBoardO)); // 'O'
console.log('No Winner Board:', checkWinnerByStateMatching(noWinnerBoard)); // null
console.log('Diagonal Win X:', checkWinnerByStateMatching(diagonalWinX)); // 'X'

console.log('\n=== APPROACH 2: Iteration ===');
console.log('Winning Board X:', checkWinnerByIteration(winningBoardX)); // 'X'
console.log('Winning Board O:', checkWinnerByIteration(winningBoardO)); // 'O'
console.log('No Winner Board:', checkWinnerByIteration(noWinnerBoard)); // null
console.log('Diagonal Win X:', checkWinnerByIteration(diagonalWinX)); // 'X'


// ===== KEY DIFFERENCES =====
/*
APPROACH 1 (State Matching):
- More concise and elegant
- Uses destructuring for cleaner code
- Same logic but written more functionally

APPROACH 2 (Iteration):
- More explicit and verbose
- Shows each step of the iteration clearly
- Accesses array elements individually
- Easier to understand for beginners

PERFORMANCE:
- Both have O(1) time complexity (checking max 8 combinations)
- Functionally equivalent in practice
- Approach 1 is more idiomatic TypeScript/JavaScript
*/

export { checkWinnerByStateMatching, checkWinnerByIteration };
