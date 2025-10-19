/**
 * UNDERSTANDING REDUCE PARAMETERS
 *
 * The reduce method signature:
 * array.reduce(callback, initialValue)
 *
 * The callback function receives 4 parameters:
 * (accumulator, currentValue, currentIndex, array) => newAccumulator
 */

// ============================================================================
// THE BASIC ANATOMY
// ============================================================================

/**
 * REDUCE METHOD SIGNATURE:
 *
 * array.reduce(
 *   (acc, current, index, array) => { ... },
 *   initialValue
 * )
 *
 * Parameters breakdown:
 * - acc (accumulator): The value that "accumulates" across iterations
 * - current (currentValue): The current element being processed
 * - index (currentIndex): The index of the current element (optional)
 * - array: The original array being reduced (optional, rarely used)
 * - initialValue: The starting value for the accumulator
 */

// ============================================================================
// 1. ACCUMULATOR (acc)
// ============================================================================

/**
 * The ACCUMULATOR is like a running total or running state.
 * It carries forward the result from the previous iteration.
 *
 * Think of it as:
 * - A snowball rolling downhill, getting bigger
 * - A bucket that collects things
 * - A running scoreboard
 */

// Example 1: Simple sum (acc is a number)
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce(
  (acc, current) => {
    console.log(`acc: ${acc}, current: ${current}, returning: ${acc + current}`);
    return acc + current;
  },
  0  // ← Initial value of accumulator
);

console.log("\n=== SUMMING EXAMPLE ===");
console.log("Sum:", sum);

/**
 * Output:
 * acc: 0, current: 1, returning: 1
 * acc: 1, current: 2, returning: 3
 * acc: 3, current: 3, returning: 6
 * acc: 6, current: 4, returning: 10
 * acc: 10, current: 5, returning: 15
 * Sum: 15
 *
 * Notice how acc "accumulates" - it's always the return value from the previous iteration!
 */

// Example 2: Accumulator can be ANY type (object, array, etc.)
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Carol", age: 25 }
];

const groupedByAge = people.reduce(
  (acc, person) => {
    // acc is an object that groups people by age
    console.log("Before:", JSON.stringify(acc));

    const newAcc = {
      ...acc,
      [person.age]: [...(acc[person.age] || []), person.name]
    };

    console.log("After:", JSON.stringify(newAcc), "\n");
    return newAcc;
  },
  {} as Record<number, string[]>  // ← Accumulator starts as empty object
);

console.log("\n=== GROUPING EXAMPLE ===");
console.log("Grouped:", groupedByAge);

// ============================================================================
// 2. CURRENT VALUE (current)
// ============================================================================

/**
 * CURRENT is simply the element we're currently processing.
 * It's like the "loop variable" in a for loop.
 */

// Example: Processing each item
const items = ["apple", "banana", "cherry"];

const result = items.reduce(
  (acc, current, index) => {
    console.log(`Processing item #${index}: "${current}"`);
    return acc + current.length;
  },
  0
);

console.log("\n=== CURRENT VALUE EXAMPLE ===");
console.log("Total length:", result);

/**
 * Output:
 * Processing item #0: "apple"
 * Processing item #1: "banana"
 * Processing item #2: "cherry"
 * Total length: 17
 */

// ============================================================================
// 3. INDEX (index)
// ============================================================================

/**
 * INDEX is the position of the current element in the array.
 * It's OPTIONAL - only use it if you need it.
 */

// Example: Using index to number items
const fruits = ["apple", "banana", "cherry"];

const numberedList = fruits.reduce(
  (acc, current, index) => {
    return acc + `${index + 1}. ${current}\n`;
  },
  ""
);

console.log("\n=== INDEX EXAMPLE ===");
console.log(numberedList);

/**
 * Output:
 * 1. apple
 * 2. banana
 * 3. cherry
 */

// Example: Using index for conditional logic
const scores = [10, 20, 30, 40, 50];

const weightedSum = scores.reduce(
  (acc, current, index) => {
    // First and last items get double weight
    const weight = (index === 0 || index === scores.length - 1) ? 2 : 1;
    console.log(`Index ${index}: ${current} × ${weight} = ${current * weight}`);
    return acc + (current * weight);
  },
  0
);

console.log("\n=== WEIGHTED SUM EXAMPLE ===");
console.log("Weighted sum:", weightedSum);

// ============================================================================
// 4. ARRAY (the 4th parameter, rarely used)
// ============================================================================

/**
 * The original array is available as the 4th parameter.
 * Rarely needed because you can access it from outer scope.
 */

const nums = [1, 2, 3, 4, 5];

const avgDifference = nums.reduce(
  (acc, current, index, originalArray) => {
    const average = originalArray.reduce((s, n) => s + n, 0) / originalArray.length;
    const diff = Math.abs(current - average);
    return acc + diff;
  },
  0
);

console.log("\n=== ARRAY PARAMETER EXAMPLE ===");
console.log("Sum of differences from average:", avgDifference);

// ============================================================================
// VISUALIZING THE FLOW
// ============================================================================

console.log("\n=== DETAILED ITERATION FLOW ===");

const values = [10, 20, 30];
const detailedSum = values.reduce(
  (acc, current, index, array) => {
    console.log("\n--- Iteration", index, "---");
    console.log("Accumulator (acc):", acc);
    console.log("Current value (current):", current);
    console.log("Current index (index):", index);
    console.log("Original array (array):", array);

    const newAcc = acc + current;
    console.log("Returning:", newAcc);

    return newAcc;
  },
  0
);

console.log("\n=== Final result:", detailedSum, "===");

// ============================================================================
// COMMON PATTERNS
// ============================================================================

console.log("\n=== COMMON REDUCE PATTERNS ===\n");

// Pattern 1: ACCUMULATING A SINGLE VALUE
const pattern1 = [1, 2, 3].reduce(
  (acc, current) => acc + current,
  0
);
console.log("1. Sum:", pattern1);

// Pattern 2: BUILDING AN OBJECT
const pattern2 = ["a", "b", "c"].reduce(
  (acc, current, index) => ({ ...acc, [current]: index }),
  {}
);
console.log("2. Object:", pattern2);

// Pattern 3: BUILDING AN ARRAY
const pattern3 = [1, 2, 3, 4].reduce(
  (acc, current) => current % 2 === 0 ? [...acc, current] : acc,
  [] as number[]
);
console.log("3. Even numbers:", pattern3);

// Pattern 4: COUNTING OCCURRENCES
const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const pattern4 = words.reduce(
  (acc, word) => ({ ...acc, [word]: (acc[word] || 0) + 1 }),
  {} as Record<string, number>
);
console.log("4. Word count:", pattern4);

// Pattern 5: FINDING MIN/MAX
const pattern5 = [5, 2, 8, 1, 9].reduce(
  (acc, current) => ({
    min: Math.min(acc.min, current),
    max: Math.max(acc.max, current)
  }),
  { min: Infinity, max: -Infinity }
);
console.log("5. Min/Max:", pattern5);

// ============================================================================
// COMMON NAMING CONVENTIONS
// ============================================================================

/**
 * Different naming conventions you'll see:
 *
 * 1. acc, current, index
 *    - Most common
 *    - Short and clear
 *
 * 2. accumulator, currentValue, currentIndex
 *    - More descriptive
 *    - Official MDN documentation names
 *
 * 3. result, item, i
 *    - When context is obvious
 *
 * 4. Semantic names based on context:
 */

// Example with semantic names
const products = [
  { name: "Apple", price: 1.50 },
  { name: "Banana", price: 0.75 },
  { name: "Cherry", price: 2.00 }
];

const totalPrice = products.reduce(
  (total, product) => total + product.price,  // ← "total" and "product" are clearer
  0
);

const inventory = products.reduce(
  (catalog, product) => ({  // ← "catalog" and "product" are semantic
    ...catalog,
    [product.name]: product.price
  }),
  {}
);

console.log("\n=== SEMANTIC NAMING ===");
console.log("Total:", totalPrice);
console.log("Inventory:", inventory);

// ============================================================================
// INITIAL VALUE IS IMPORTANT!
// ============================================================================

/**
 * What happens if you don't provide an initial value?
 * - The first element becomes the accumulator
 * - Iteration starts from the second element
 */

console.log("\n=== WITH vs WITHOUT INITIAL VALUE ===\n");

// WITH initial value (recommended)
const withInitial = [1, 2, 3].reduce(
  (acc, current, index) => {
    console.log(`With: acc=${acc}, current=${current}, index=${index}`);
    return acc + current;
  },
  0  // ← Start with 0
);

console.log();

// WITHOUT initial value (use with caution)
const withoutInitial = [1, 2, 3].reduce(
  (acc, current, index) => {
    console.log(`Without: acc=${acc}, current=${current}, index=${index}`);
    return acc + current;
  }
  // No initial value - first element (1) becomes acc
);

console.log("\nWith initial:", withInitial);
console.log("Without initial:", withoutInitial);

/**
 * Output:
 * With: acc=0, current=1, index=0
 * With: acc=1, current=2, index=1
 * With: acc=3, current=3, index=2
 *
 * Without: acc=1, current=2, index=1  ← Started from index 1!
 * Without: acc=3, current=3, index=2
 *
 * Both give 6, but "with initial" is clearer and safer
 */

// ============================================================================
// DANGER: What if array is empty?
// ============================================================================

console.log("\n=== EMPTY ARRAY BEHAVIOR ===\n");

try {
  // WITH initial value - safe
  const safeEmpty = [].reduce((acc, current) => acc + current, 0);
  console.log("Empty array with initial:", safeEmpty);

  // WITHOUT initial value - ERROR!
  const dangerousEmpty = [].reduce((acc, current) => acc + current);
  console.log("Empty array without initial:", dangerousEmpty);
} catch (error) {
  console.log("Error:", (error as Error).message);
}

// ============================================================================
// QUICK REFERENCE
// ============================================================================

/**
 * QUICK REFERENCE CARD:
 *
 * array.reduce((acc, current, index, array) => newAcc, initialValue)
 *                 │     │       │      │           │
 *                 │     │       │      │           └─ Starting value
 *                 │     │       │      └─ Original array (rarely used)
 *                 │     │       └─ Current position (optional)
 *                 │     └─ Current element being processed
 *                 └─ Running result from previous iterations
 *
 * RETURNS: newAcc becomes the acc for the next iteration
 *
 * MENTAL MODEL:
 *
 * Iteration 0: acc = initialValue,  current = array[0]
 * Iteration 1: acc = return from 0, current = array[1]
 * Iteration 2: acc = return from 1, current = array[2]
 * ...
 * Final: return value from last iteration
 */
