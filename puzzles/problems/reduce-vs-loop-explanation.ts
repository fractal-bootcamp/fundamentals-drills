/**
 * WHY IS REDUCE FUNCTIONAL? (vs For Loops)
 *
 * Great question! Reduce and for loops can produce the same results,
 * but they represent fundamentally different paradigms.
 */

// ============================================================================
// IMPERATIVE (For Loop) vs DECLARATIVE (Reduce)
// ============================================================================

/**
 * IMPERATIVE APPROACH (for loop)
 * - Tells the computer HOW to do something, step by step
 * - Uses mutation and reassignment
 * - More like giving directions: "Turn left, go 2 blocks, turn right"
 */
function longestStreakImperative(nums: number[]): number {
  let maxStreak = 0;        // ← MUTATION: Variable changes over time
  let currentStreak = 0;    // ← MUTATION: Variable changes over time

  for (let i = 0; i < nums.length; i++) {  // ← Control flow: telling HOW to iterate
    if (i === 0) {
      currentStreak = 1;    // ← REASSIGNMENT
    } else if (nums[i] === nums[i - 1] + 1) {
      currentStreak++;      // ← MUTATION
    } else {
      currentStreak = 1;    // ← REASSIGNMENT
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;  // ← MUTATION
    }
  }

  return maxStreak;
}

/**
 * DECLARATIVE APPROACH (reduce)
 * - Describes WHAT the transformation is
 * - Uses immutable transformations
 * - More like giving a destination: "Take me to the library"
 */
function longestStreakDeclarative(nums: number[]): number {
  return nums.reduce(
    (state, current, index) => ({  // ← IMMUTABLE: Returns NEW object each time
      currentStreak:
        index === 0 ? 1 :
        current === nums[index - 1] + 1 ? state.currentStreak + 1 : 1,
      maxStreak: Math.max(
        state.maxStreak,
        index === 0 ? 1 :
        current === nums[index - 1] + 1 ? state.currentStreak + 1 : 1
      )
    }),
    { currentStreak: 0, maxStreak: 0 }  // ← Initial state
  ).maxStreak;
}

// ============================================================================
// KEY DIFFERENCES
// ============================================================================

/**
 * 1. MUTATION vs TRANSFORMATION
 */

// IMPERATIVE: Mutates variables
function sumImperative(numbers: number[]): number {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];  // ← total CHANGES in place
  }
  return total;
}

// FUNCTIONAL: Transforms state
function sumFunctional(numbers: number[]): number {
  return numbers.reduce(
    (accumulator, current) => accumulator + current,  // ← Returns NEW value
    0
  );
}

/**
 * 2. SIDE EFFECTS vs PURITY
 */

// IMPERATIVE: Can have side effects
function processBad(items: string[]): number {
  let count = 0;
  for (let item of items) {
    console.log(item);     // ← SIDE EFFECT!
    count++;
    items.push("extra");   // ← MUTATION OF INPUT!
  }
  return count;
}

// FUNCTIONAL: Pure function (no side effects)
function processGood(items: string[]): number {
  return items.reduce(
    (count) => count + 1,  // ← Pure: same inputs = same output
    0
  );
  // No console.log, no mutation
}

/**
 * 3. EXPLICIT STATE THREADING vs HIDDEN STATE
 */

// IMPERATIVE: State is "hidden" in variables
function countEvensImperative(nums: number[]): number {
  let evenCount = 0;      // ← State lives here (outside the loop)
  let oddCount = 0;       // ← More hidden state

  for (let num of nums) {
    if (num % 2 === 0) {
      evenCount++;        // ← Implicit state change
    } else {
      oddCount++;
    }
  }

  return evenCount;
}

// FUNCTIONAL: State is explicit and threaded through
function countEvensFunctional(nums: number[]): number {
  return nums.reduce(
    (state, num) => ({    // ← State is EXPLICIT (passed as parameter)
      evenCount: num % 2 === 0 ? state.evenCount + 1 : state.evenCount,
      oddCount: num % 2 === 1 ? state.oddCount + 1 : state.oddCount
    }),                   // ← State transformation is VISIBLE
    { evenCount: 0, oddCount: 0 }
  ).evenCount;
}

/**
 * 4. COMPOSITION vs STEPS
 */

// IMPERATIVE: Sequential steps
function processDataImperative(data: number[]): number {
  let doubled = [];
  for (let x of data) {
    doubled.push(x * 2);
  }

  let evens = [];
  for (let x of doubled) {
    if (x % 2 === 0) {
      evens.push(x);
    }
  }

  let sum = 0;
  for (let x of evens) {
    sum += x;
  }

  return sum;
}

// FUNCTIONAL: Composable pipeline
function processDataFunctional(data: number[]): number {
  return data
    .map(x => x * 2)           // ← Each step is independent
    .filter(x => x % 2 === 0)  // ← Can be composed
    .reduce((sum, x) => sum + x, 0);  // ← Can be reordered/tested separately
}

// ============================================================================
// WHY REDUCE IS FUNCTIONAL
// ============================================================================

/**
 * Reduce is functional because:
 *
 * 1. ✅ IMMUTABILITY
 *    - Each iteration returns a NEW accumulator
 *    - Original array is never modified
 *    - No variables are mutated
 *
 * 2. ✅ PURE FUNCTIONS
 *    - The reducer function should be pure
 *    - Same inputs always produce same outputs
 *    - No side effects
 *
 * 3. ✅ HIGHER-ORDER FUNCTION
 *    - Reduce takes a function as an argument
 *    - Abstracts the iteration pattern
 *    - You provide the "what", reduce handles the "how"
 *
 * 4. ✅ DECLARATIVE
 *    - Describes the transformation
 *    - Hides the iteration mechanics
 *    - Focuses on the data flow
 *
 * 5. ✅ COMPOSABLE
 *    - Can be chained with other array methods
 *    - Reducer functions can be extracted and reused
 *    - Easy to test in isolation
 */

// ============================================================================
// PRACTICAL EXAMPLE: Debugging Benefits
// ============================================================================

/**
 * With for loops, state is scattered and changes over time
 * With reduce, each state is a snapshot you can inspect
 */

// HARD TO DEBUG: Where did it go wrong?
function findBugImperative(items: string[]): number {
  let count = 0;
  let total = 0;
  let average = 0;

  for (let item of items) {
    count++;
    total += item.length;
    average = total / count;  // When did average become NaN?
  }

  return average;
}

// EASY TO DEBUG: Each state is explicit
function findBugFunctional(items: string[]): number {
  const result = items.reduce(
    (state, item) => {
      console.log("State:", state);  // ← Can inspect each transformation
      return {
        count: state.count + 1,
        total: state.total + item.length,
        average: (state.total + item.length) / (state.count + 1)
      };
    },
    { count: 0, total: 0, average: 0 }
  );

  return result.average;
}

// ============================================================================
// REDUCE ISN'T ALWAYS FUNCTIONAL
// ============================================================================

/**
 * You can write imperative code with reduce!
 * Just because you use reduce doesn't mean it's functional.
 */

// ❌ BAD: Using reduce imperatively (mutating accumulator)
const badReduce = [1, 2, 3].reduce((acc, num) => {
  acc.push(num * 2);  // ← MUTATION! Not functional!
  return acc;
}, [] as number[]);

// ✅ GOOD: Using reduce functionally (returning new values)
const goodReduce = [1, 2, 3].reduce((acc, num) => {
  return [...acc, num * 2];  // ← IMMUTABLE! Creates new array
}, [] as number[]);

// Or even better: use map for this
const bestApproach = [1, 2, 3].map(num => num * 2);

// ============================================================================
// WHEN TO USE EACH
// ============================================================================

/**
 * USE FOR LOOPS WHEN:
 * - Performance is critical (reduce has function call overhead)
 * - Early termination is needed (break/continue)
 * - Working with indexes heavily
 * - The logic is inherently imperative
 * - You're not concerned with FP principles
 *
 * USE REDUCE WHEN:
 * - You want immutability
 * - The transformation is clear and declarative
 * - You're building a composable pipeline
 * - You want to avoid mutation bugs
 * - You want easier testing and debugging
 * - You're folding/aggregating values
 */

// ============================================================================
// THE ANSWER
// ============================================================================

/**
 * Q: Why is reduce functional when it's similar to a for loop?
 *
 * A: Reduce is functional not because of WHAT it does (iteration),
 *    but because of HOW it does it:
 *
 *    1. It enforces immutability (new accumulator each time)
 *    2. It encourages pure functions (no side effects)
 *    3. It makes state transformations explicit
 *    4. It separates "what to do" from "how to iterate"
 *    5. It enables composition and reusability
 *
 *    A for loop CAN be written in a functional style, but reduce
 *    GUIDES you toward functional patterns by design.
 *
 *    Think of it like automatic vs manual transmission:
 *    - For loop = Manual (full control, more room for error)
 *    - Reduce = Automatic (guides you, safer defaults)
 */

// ============================================================================
// TEST IT OUT
// ============================================================================

if (import.meta.main) {
  const test = [1, 2, 3, 5, 6, 7, 8, 10];

  console.log("Testing imperative vs declarative:");
  console.log("Imperative:", longestStreakImperative(test));
  console.log("Declarative:", longestStreakDeclarative(test));
  console.log();

  console.log("Sum examples:");
  console.log("Imperative:", sumImperative([1, 2, 3, 4]));
  console.log("Functional:", sumFunctional([1, 2, 3, 4]));
  console.log();

  console.log("State threading:");
  console.log("Imperative:", countEvensImperative([1, 2, 3, 4, 5, 6]));
  console.log("Functional:", countEvensFunctional([1, 2, 3, 4, 5, 6]));
}
