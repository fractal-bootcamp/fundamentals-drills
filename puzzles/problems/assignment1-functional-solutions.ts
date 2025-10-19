/**
 * Functional Programming Solutions for Consecutive Sum Streak
 *
 * We'll explore multiple functional approaches, from beginner to advanced
 */

// ============================================================================
// APPROACH 1: Using reduce (Most Common Functional Pattern)
// ============================================================================

/**
 * Use reduce to thread state through the array
 * State contains: current streak length, max streak length
 */
export const longestStreakReduce = (nums: number[]): number => {
  if (nums.length === 0) return 0;

  const result = nums.reduce(
    (acc, current, index) => {
      if (index === 0) {
        return { currentStreak: 1, maxStreak: 1, prev: current };
      }

      // Check if current number continues the streak
      const isConsecutive = current === acc.prev + 1;
      const newCurrentStreak = isConsecutive ? acc.currentStreak + 1 : 1;
      const newMaxStreak = Math.max(acc.maxStreak, newCurrentStreak);

      return {
        currentStreak: newCurrentStreak,
        maxStreak: newMaxStreak,
        prev: current,
      };
    },
    { currentStreak: 0, maxStreak: 0, prev: 0 }
  );

  return result.maxStreak;
};

// ============================================================================
// APPROACH 2: Using Array Methods (Functional Pipeline)
// ============================================================================

/**
 * Transform the array into streak lengths, then find the max
 *
 * Pipeline:
 * 1. Pair each element with its index
 * 2. Map to boolean: is this element consecutive to previous?
 * 3. Group consecutive trues into chunks
 * 4. Map chunks to their lengths
 * 5. Find the maximum length
 */
export const longestStreakPipeline = (nums: number[]): number => {
  if (nums.length === 0) return 0;

  // Step 1: Create pairs of consecutive elements
  const pairs = nums.slice(1).map((num, i) => [nums[i], num]);

  // Step 2: Map to consecutive indicators
  const isConsecutive = pairs.map(([prev, curr]) => curr === prev + 1);

  // Step 3 & 4: Group consecutive trues and count lengths
  const streakLengths = isConsecutive.reduce(
    (acc, isConsec) => {
      if (isConsec) {
        // Increment the last streak
        acc[acc.length - 1]++;
      } else {
        // Start a new streak
        acc.push(1);
      }
      return acc;
    },
    [1] // Start with one streak of length 1
  );

  // Step 5: Find maximum
  return Math.max(...streakLengths);
};

// ============================================================================
// APPROACH 3: Recursive (Pure Functional)
// ============================================================================

/**
 * Recursive solution with tail-call optimization friendly structure
 *
 * Base cases:
 * - Empty array: return 0
 * - Single element: return 1
 *
 * Recursive case:
 * - Check if current continues streak
 * - Recurse with updated state
 */
export const longestStreakRecursive = (nums: number[]): number => {
  const helper = (
    index: number,
    currentStreak: number,
    maxStreak: number
  ): number => {
    // Base case: reached end of array
    if (index >= nums.length) {
      return maxStreak;
    }

    // First element
    if (index === 0) {
      return helper(1, 1, 1);
    }

    // Check if consecutive
    const isConsecutive = nums[index] === nums[index - 1] + 1;
    const newCurrentStreak = isConsecutive ? currentStreak + 1 : 1;
    const newMaxStreak = Math.max(maxStreak, newCurrentStreak);

    return helper(index + 1, newCurrentStreak, newMaxStreak);
  };

  return nums.length === 0 ? 0 : helper(0, 0, 0);
};

// ============================================================================
// APPROACH 4: Point-Free Style (Advanced)
// ============================================================================

/**
 * Point-free programming: functions without explicit parameters
 * Using composition and higher-order functions
 */

// Helper: Create sliding window pairs
const slidingPairs = <T>(arr: T[]): [T, T][] =>
  arr.slice(1).map((val, i) => [arr[i], val]);

// Helper: Check if pair is consecutive
const isConsecutivePair = ([a, b]: [number, number]): boolean => b === a + 1;

// Helper: Convert boolean array to streak lengths
const boolsToStreakLengths = (bools: boolean[]): number[] =>
  bools.reduce(
    (acc, bool) => {
      if (bool) {
        acc[acc.length - 1]++;
      } else {
        acc.push(1);
      }
      return acc;
    },
    [1]
  );

// Compose the pipeline
export const longestStreakPointFree = (nums: number[]): number => {
  if (nums.length === 0) return 0;

  return Math.max(
    ...boolsToStreakLengths(
      slidingPairs(nums).map(isConsecutivePair)
    )
  );
};

// ============================================================================
// APPROACH 5: Functional with Immutable Data Structures (Most Pure)
// ============================================================================

/**
 * Using purely immutable transformations
 * Every step creates new data without mutation
 */

type StreakState = {
  readonly currentStreak: number;
  readonly maxStreak: number;
  readonly previousValue: number | null;
};

const initialState: StreakState = {
  currentStreak: 0,
  maxStreak: 0,
  previousValue: null,
};

const processNumber = (state: StreakState, num: number): StreakState => {
  // First number
  if (state.previousValue === null) {
    return {
      currentStreak: 1,
      maxStreak: 1,
      previousValue: num,
    };
  }

  // Check if consecutive
  const isConsecutive = num === state.previousValue + 1;
  const newCurrentStreak = isConsecutive ? state.currentStreak + 1 : 1;

  return {
    currentStreak: newCurrentStreak,
    maxStreak: Math.max(state.maxStreak, newCurrentStreak),
    previousValue: num,
  };
};

export const longestStreakImmutable = (nums: number[]): number => {
  const finalState = nums.reduce(processNumber, initialState);
  return finalState.maxStreak;
};

// ============================================================================
// APPROACH 6: Using Generator Functions (Lazy Evaluation)
// ============================================================================

/**
 * Generators allow lazy evaluation - process elements one at a time
 * Memory efficient for large arrays
 */

function* generateStreakLengths(nums: number[]): Generator<number> {
  if (nums.length === 0) return;

  let currentStreak = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      currentStreak++;
    } else {
      yield currentStreak;
      currentStreak = 1;
    }
  }

  yield currentStreak; // Don't forget the last streak
}

export const longestStreakGenerator = (nums: number[]): number => {
  if (nums.length === 0) return 0;

  const streaks = Array.from(generateStreakLengths(nums));
  return Math.max(...streaks);
};

// ============================================================================
// COMPARISON AND BEST PRACTICES
// ============================================================================

/**
 * Which approach to use?
 *
 * 1. REDUCE (Approach 1) ⭐ RECOMMENDED
 *    - Most common in real-world FP
 *    - Good balance of readability and performance
 *    - Single pass through array
 *    - TypeScript friendly
 *
 * 2. PIPELINE (Approach 2)
 *    - Very readable and declarative
 *    - Multiple passes through data
 *    - Good for learning FP concepts
 *
 * 3. RECURSIVE (Approach 3)
 *    - Classic FP approach
 *    - Can hit stack limit on large arrays
 *    - Good for small arrays or learning
 *
 * 4. POINT-FREE (Approach 4)
 *    - Advanced FP style
 *    - Can be hard to debug
 *    - Use when you have reusable utilities
 *
 * 5. IMMUTABLE (Approach 5) ⭐ RECOMMENDED FOR PRODUCTION
 *    - Explicit state transitions
 *    - Easy to test and reason about
 *    - TypeScript loves this
 *    - Clear separation of concerns
 *
 * 6. GENERATOR (Approach 6)
 *    - Memory efficient
 *    - Lazy evaluation
 *    - Use for very large datasets
 *
 * Performance Ranking (best to worst):
 * 1. Reduce / Immutable (single pass)
 * 2. Generator (single pass, lazy)
 * 3. Recursive (single pass, function call overhead)
 * 4. Pipeline (multiple passes)
 * 5. Point-free (multiple passes + function composition overhead)
 */

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

if (import.meta.main) {
  const testCases = [
    [1, 2, 3, 5, 6, 7, 8, 10],
    [5, 5, 5],
    [],
    [1],
    [10, 9, 8, 7],
    [1, 2, 3, 4, 5],
  ];

  console.log("Testing all functional approaches:\n");

  testCases.forEach((test, i) => {
    console.log(`Test case ${i + 1}: [${test.join(", ")}]`);
    console.log(`  Reduce:      ${longestStreakReduce(test)}`);
    console.log(`  Pipeline:    ${longestStreakPipeline(test)}`);
    console.log(`  Recursive:   ${longestStreakRecursive(test)}`);
    console.log(`  Point-free:  ${longestStreakPointFree(test)}`);
    console.log(`  Immutable:   ${longestStreakImmutable(test)}`);
    console.log(`  Generator:   ${longestStreakGenerator(test)}`);
    console.log();
  });
}
