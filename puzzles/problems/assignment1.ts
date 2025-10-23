// control_flow_A.ts
// Control Flow Drills — Focus: loops, conditionals, early-exit, continue, flags
// Instructions:
// 1) Implement each function (no external libs).
// 2) Run `ts-node control_flow_A.ts` to see pass/fail lines.
// 3) Stay disciplined: solve top-to-bottom without peeking ahead.
// 4) If a drill feels easy, do it twice with a different approach (for practice).

// ---------------------------------------------
// Common types used in a few drills

type Coin = 1 | 5 | 10 | 25 | 50 | 100;
type RawCoin = number;
type MiniAction = ["insert", number] | ["cancel"] | ["noop"];

// ---------------------------------------------
// Tiny test helper (no external framework)

function assertEqual<T>(name: string, actual: T, expected: T) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "PASS" : "FAIL"} — ${name}`);
  if (!pass) {
    console.log("  expected:", expected);
    console.log("  actual  :", actual);
  }
}

// ---------------------------------------------
// DRILL 1 — Filter valid coins
// Keep only valid denominations: [1,5,10,25,50,100]. Others are dropped.
// Examples:
//   filterValidCoins([100, 50, 7, 10, 1]) -> [100, 50, 10, 1]
//   filterValidCoins([]) -> []

export function filterValidCoins(input: number[]): number[] {
  const validCoins = [1, 5, 10, 25, 50, 100];

  let keepValidCoins = input.filter(coin => validCoins.includes(coin))

  return keepValidCoins;
}
//* notes on myself
// - always return something explicit 
// - 

// ---------------------------------------------
// DRILL 2 — Sum valid coins
// Sum only valid coins, ignoring invalid ones.
// Examples:
//   sumValidCoins([100, 25, 10]) -> 135
//   sumValidCoins([3, 4]) -> 0
//   sumValidCoins([1, 5, 10, 50, 100, 25]) -> 191

export function sumValidCoins(input: RawCoin[]): number {
  const validCoins = [1, 5, 10, 25, 50, 100];
  let keepValidCoins = input.filter(coin => validCoins.includes(coin));
  let coinTotal = keepValidCoins.reduce((prev, curr) => prev + curr, 0);

  return coinTotal;
}

// ---------------------------------------------
// DRILL 3 — Sum until cancel
// Given a sequence of mini-actions, accumulate inserted amounts until the first "cancel".
// After "cancel", ignore all remaining actions (stop).
// Valid coins only; ignore invalid coins silently.
// Examples:
//   sumUntilCancel([["insert", 25], ["insert", 7], ["cancel"], ["insert", 100]]) -> 25
//   sumUntilCancel([["noop"], ["insert", 10]]) -> 10
//   sumUntilCancel([]) -> 0

export function sumUntilCancel(actions: MiniAction[]): number {
  const validCoins = [1, 5, 10, 25, 50, 100];
  let totalCoin = 0;

  for (let act of actions) {
    if (act[0] === "insert") {
      if (validCoins.includes(act[1])) {
        totalCoin += act[1]
      }
    }
    if (act[0] === "cancel") {
      break;
    }
  }
  return totalCoin;
}
// Notes
// - if (act[1] in validCoins) checks for object keys, not array

// ---------------------------------------------
// DRILL 4 — Stop entire session if any invalid coin appears
// Same input as Drill 3, but NEW RULE:
// If an invalid coin ever appears before "cancel", the session total becomes 0 and you stop immediately.
// If there is no invalid coin, sum until first cancel (or end if no cancel).
// Examples:
//   strictSessionSum([["insert", 25], ["insert", 7], ["insert", 10]]) -> 0   (invalid 7 encountered first)
//   strictSessionSum([["insert", 25], ["insert", 10], ["cancel"], ["insert", 100]]) -> 35
//   strictSessionSum([["noop"], ["insert", 10]]) -> 10

export function strictSessionSum(actions: MiniAction[]): number {
  const validCoins = [1, 5, 10, 25, 50, 100];
  let totalCoin = 0;

  for (let act of actions) {
    if (act[0] === "insert") {
      if (!(validCoins.includes(act[1]))) {
        totalCoin = 0;
        break;
      }
      if (validCoins.includes(act[1])) {
        totalCoin += act[1]
      }
    }
    if (act[0] === "cancel") {
      break;
    }
  }
  return totalCoin;
}

// ---------------------------------------------
// DRILL 5 — First invalid coin
// Return the first invalid coin value seen, or null if all are valid.
// Examples:
//   firstInvalid([100, 50, 10]) -> null
//   firstInvalid([3, 1, 5]) -> 3
//   firstInvalid([]) -> null

export function firstInvalid(input: RawCoin[]): number | null {
  const validCoins = [1, 5, 10, 25, 50, 100];
  let countInvalidNum = null;
  for (let i of input) {
    if (!(validCoins.includes(i))) {
      countInvalidNum = i;
    }
  }
  return countInvalidNum;
}

// ---------------------------------------------
// DRILL 6 — Count action types
// Count how many "insert", "cancel", and "noop" actions appear.
// Examples:
//   countActions([["insert", 1], ["noop"], ["insert", 10], ["cancel"]]) -> { insert: 2, cancel: 1, noop: 1 }
//   countActions([]) -> { insert: 0, cancel: 0, noop: 0 }

export function countActions(actions: MiniAction[]): { insert: number; cancel: number; noop: number } {
  let countAct = { insert: 0, cancel: 0, noop: 0 };
  actions.forEach(act => {
    if (act[0] === "insert") {
      countAct.insert++;
    }
    if (act[0] === "cancel") {
      countAct.cancel++;
    }
    if (act[0] === "noop") {
      countAct.noop++;
    }
  })

  return countAct;
}

// ---------------------------------------------
// DRILL 7 — Take-while valid coins
// Return the longest prefix consisting only of valid coins; stop before the first invalid.
// Examples:
//   takeWhileValid([25, 10, 7, 1]) -> [25, 10]
//   takeWhileValid([1, 5, 10]) -> [1, 5, 10]
//   takeWhileValid([]) -> []

export function takeWhileValid(input: RawCoin[]): number[] {
  let allValidCoins: number[] = [];
  const validCoins = [1, 5, 10, 25, 50, 100];

  for (let coin of input) {
    if (!(validCoins.includes(coin))) {
      break;
    } else {
      allValidCoins.push(coin)
    }
  }

  return allValidCoins;
}

// ---------------------------------------------
// DRILL 8 — Sum range until threshold
// Given a list of positive integers and a threshold, sum numbers from the start
// until adding the next number would exceed the threshold, then stop.
// Return the sum you actually reached (which is <= threshold).
// Examples:
//   sumUntilThreshold([5, 7, 3], 10) -> 5  (5 + 7 would exceed 10)
//   sumUntilThreshold([2, 2, 2, 2], 7) -> 6
//   sumUntilThreshold([], 10) -> 0

// *** REVISIT THIS!!!! ***
export function sumUntilThreshold(nums: number[], threshold: number): number {
  let sumBeforeThreshold = 0;

  if (nums.length === 0) return 0;

  for (let num of nums) {
    if (sumBeforeThreshold + num > threshold) {
      break;
    }
    sumBeforeThreshold += num;
  }

  return sumBeforeThreshold;
}

// Notes
// 1. forEach() doesn't support break continue= => only work in for, for ... of, while loops
// 2. 3. Logic adjustment for threshold check
// I'm currently adding first, then checking if it exceeded.
// But we want to stop before exceeding.
// So we should check before the next addition

// ---------------------------------------------
// DRILL 9 — First affordable item index
// Given a credit amount and a list of prices, return the index of the first item
// whose price <= credit. If none are affordable, return -1.
// Examples:
//   firstAffordableIndex(50, [60, 70, 40, 30]) -> 2
//   firstAffordableIndex(25, [30, 25, 25]) -> 1
//   firstAffordableIndex(10, [11, 12]) -> -1

export function firstAffordableIndex(credit: number, prices: number[]): number {

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] <= credit) {
      return i;
    }
  }

  return -1;
}

// ---------------------------------------------
// DRILL 10 — Sum valid coins but reset on cancel markers
// Here actions are numeric coin values *or* the string "CANCEL".
// Accumulate valid coins; when the string "CANCEL" appears, add the current subtotal
// to a list of session totals and reset the subtotal to 0. At the end, if subtotal > 0,
// push it as the last session. Invalid coins are ignored (do not reset).
// Return the array of session totals.
// Examples:
//   sumWithResets([25, 10, "CANCEL", 100, 3, 1, "CANCEL", 50]) -> [35, 101, 50]
//     Explanation: 25+10=35, cancel -> [35]; 100 + (3 ignored) + 1 = 101, cancel -> [35,101]; final 50 -> [35,101,50]
//   sumWithResets([]) -> []
//   sumWithResets(["CANCEL"]) -> []

export function sumWithResets(stream): number[] {
  let totals = [];
  const validCoins = [1, 5, 10, 25, 50, 100];
  let sum = 0;

  if (stream.length === 0) {
    return totals = [];
  }

  for (let i of stream) {
    if (validCoins.includes(i)) {
      sum += i;
    }
    if (i === "CANCEL") {
      if (sum > 0) totals.push(sum);
      sum = 0;
    }
  }
  if (sum > 0) totals.push(sum);
  return totals;
}

// Notes
// 

// ---------------------------------------------
// OPTIONAL STRETCH 1 — Re-implement Drill 1 using Array.filter and a helper isValid()
// OPTIONAL STRETCH 2 — Re-implement Drill 3 using a for..of loop and break/continue
// OPTIONAL STRETCH 3 — Add a variant of Drill 10 where "CANCEL" also discards the subtotal instead of saving it.

// ---------------------------------------------
// Self-check runner (manual tests). Add more as you implement.

function runSelfChecks() {
  // DRILL 1
  assertEqual("filterValidCoins #1", filterValidCoins([100, 50, 7, 10, 1]), [100, 50, 10, 1]);
  assertEqual("filterValidCoins #2", filterValidCoins([]), []);

  // DRILL 2
  assertEqual("sumValidCoins #1", sumValidCoins([100, 25, 10]), 135);
  assertEqual("sumValidCoins #2", sumValidCoins([3, 4]), 0);

  // DRILL 3
  assertEqual(
    "sumUntilCancel #1",
    sumUntilCancel([["insert", 25], ["insert", 7], ["cancel"], ["insert", 100]]),
    25
  );
  assertEqual("sumUntilCancel #2", sumUntilCancel([["noop"], ["insert", 10]]), 10);
  assertEqual("sumUntilCancel #3", sumUntilCancel([]), 0);

  // DRILL 4
  assertEqual(
    "strictSessionSum #1",
    strictSessionSum([["insert", 25], ["insert", 7], ["insert", 10]]),
    0
  );
  assertEqual(
    "strictSessionSum #2",
    strictSessionSum([["insert", 25], ["insert", 10], ["cancel"], ["insert", 100]]),
    35
  );
  assertEqual("strictSessionSum #3", strictSessionSum([["noop"], ["insert", 10]]), 10);

  // DRILL 5
  assertEqual("firstInvalid #1", firstInvalid([100, 50, 10]), null);
  assertEqual("firstInvalid #2", firstInvalid([3, 1, 5]), 3);
  assertEqual("firstInvalid #3", firstInvalid([]), null);

  // DRILL 6
  assertEqual(
    "countActions #1",
    countActions([["insert", 1], ["noop"], ["insert", 10], ["cancel"]]),
    { insert: 2, cancel: 1, noop: 1 }
  );
  assertEqual("countActions #2", countActions([]), { insert: 0, cancel: 0, noop: 0 });

  // DRILL 7
  assertEqual("takeWhileValid #1", takeWhileValid([25, 10, 7, 1]), [25, 10]);
  assertEqual("takeWhileValid #2", takeWhileValid([1, 5, 10]), [1, 5, 10]);
  assertEqual("takeWhileValid #3", takeWhileValid([]), []);

  // DRILL 8
  assertEqual("sumUntilThreshold #1", sumUntilThreshold([5, 7, 3], 10), 5);
  assertEqual("sumUntilThreshold #2", sumUntilThreshold([2, 2, 2, 2], 7), 6);
  assertEqual("sumUntilThreshold #3", sumUntilThreshold([], 10), 0);

  // DRILL 9
  assertEqual("firstAffordableIndex #1", firstAffordableIndex(50, [60, 70, 40, 30]), 2);
  assertEqual("firstAffordableIndex #2", firstAffordableIndex(25, [30, 25, 25]), 1);
  assertEqual("firstAffordableIndex #3", firstAffordableIndex(10, [11, 12]), -1);

  // DRILL 10
  assertEqual(
    "sumWithResets #1",
    sumWithResets([25, 10, "CANCEL", 100, 3, 1, "CANCEL", 50]),
    [35, 101, 50]
  );
  assertEqual("sumWithResets #2", sumWithResets([]), []);
  assertEqual("sumWithResets #3", sumWithResets(["CANCEL"]), []);
}

if (require.main === module) {
  runSelfChecks();
}
