# Reduce Parameters: Visual Guide

## The Complete Signature

```typescript
array.reduce(
  (accumulator, currentValue, currentIndex, array) => {
    return newAccumulator;
  },
  initialValue
)
```

---

## Parameter 1: ACCUMULATOR (acc)

**The "snowball" that grows as it rolls**

```
Initial: 0
   │
   ▼
[1, 2, 3, 4, 5]
 │
 ├─ acc: 0, current: 1  →  return 1
 │                             │
 ├─ acc: 1, current: 2  →  return 3
 │                             │
 ├─ acc: 3, current: 3  →  return 6
 │                             │
 ├─ acc: 6, current: 4  →  return 10
 │                             │
 └─ acc: 10, current: 5 →  return 15
                               │
                               ▼
                           Final: 15
```

**Key Point:** The accumulator is ALWAYS the return value from the previous iteration!

### Accumulator Can Be Any Type

```typescript
// Number
reduce((acc, num) => acc + num, 0)

// Array
reduce((acc, item) => [...acc, item * 2], [])

// Object
reduce((acc, person) => ({ ...acc, [person.id]: person }), {})

// String
reduce((acc, word) => acc + word + " ", "")

// Custom Type
reduce((acc, data) => ({
  count: acc.count + 1,
  sum: acc.sum + data.value,
  items: [...acc.items, data]
}), { count: 0, sum: 0, items: [] })
```

---

## Parameter 2: CURRENT VALUE (current)

**The element we're currently processing**

```
Array: ["apple", "banana", "cherry"]

Iteration 0:  current = "apple"   ◄─── Processing this
Iteration 1:  current = "banana"  ◄─── Now this
Iteration 2:  current = "cherry"  ◄─── Finally this
```

Think of it like a spotlight moving through the array:

```
[🔦apple, banana, cherry]  ← Iteration 0
[apple, 🔦banana, cherry]  ← Iteration 1
[apple, banana, 🔦cherry]  ← Iteration 2
```

---

## Parameter 3: INDEX (index)

**The position of the current element (0-based)**

```
Array: [10, 20, 30, 40, 50]
Index:  0   1   2   3   4

reduce((acc, current, index) => {
  console.log(`Position ${index}: ${current}`);
  return acc;
}, ...)

Output:
Position 0: 10
Position 1: 20
Position 2: 30
Position 3: 40
Position 4: 50
```

**When to use index:**
- Numbering items (1st, 2nd, 3rd...)
- Conditional logic based on position
- Skipping first/last elements
- Accessing neighboring elements

---

## Parameter 4: ARRAY (rarely used)

**The original array being reduced**

```typescript
const numbers = [10, 20, 30];

numbers.reduce((acc, current, index, originalArray) => {
  console.log("Original array:", originalArray);
  //                             ^^^^^^^^^^^^^^
  //                             Always [10, 20, 30]
  return acc + current;
}, 0);
```

**Usually not needed** because you can access it from outer scope:

```typescript
// Instead of using the 4th parameter:
numbers.reduce((acc, curr, i, arr) => {
  const avg = arr.reduce((s, n) => s + n) / arr.length;
  return acc + (curr - avg);
}, 0);

// Just use the outer variable:
const avg = numbers.reduce((s, n) => s + n) / numbers.length;
numbers.reduce((acc, curr) => {
  return acc + (curr - avg);  // ← Using outer scope
}, 0);
```

---

## The Flow: Putting It All Together

```
Initial State
┌─────────────────────────┐
│ initialValue            │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Iteration 0                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐│
│  │   acc    │  │ current  │  │ index│  │  array  ││
│  │   = 0    │  │   = 1    │  │  = 0 │  │ [1,2,3] ││
│  └──────────┘  └──────────┘  └──────┘  └─────────┘│
│         │                                            │
│         └──────► Process ──────► return 1           │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Iteration 1                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐│
│  │   acc    │  │ current  │  │ index│  │  array  ││
│  │   = 1    │  │   = 2    │  │  = 1 │  │ [1,2,3] ││
│  └──────────┘  └──────────┘  └──────┘  └─────────┘│
│         │                                            │
│         └──────► Process ──────► return 3           │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Iteration 2                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐│
│  │   acc    │  │ current  │  │ index│  │  array  ││
│  │   = 3    │  │   = 3    │  │  = 2 │  │ [1,2,3] ││
│  └──────────┘  └──────────┘  └──────┘  └─────────┘│
│         │                                            │
│         └──────► Process ──────► return 6           │
└─────────────────────────────────────────────────────┘
            │
            ▼
    ┌─────────────┐
    │ Final: 6    │
    └─────────────┘
```

---

## Common Patterns with Each Parameter

### Using Only ACC and CURRENT (most common)

```typescript
// Sum
[1, 2, 3].reduce((acc, curr) => acc + curr, 0)

// Concatenate
["a", "b", "c"].reduce((acc, curr) => acc + curr, "")

// Max value
[5, 2, 8, 1].reduce((acc, curr) => Math.max(acc, curr), -Infinity)
```

### Using ACC, CURRENT, and INDEX

```typescript
// Add line numbers
lines.reduce((acc, line, i) => acc + `${i + 1}. ${line}\n`, "")

// Skip first element
arr.reduce((acc, curr, i) => i === 0 ? acc : [...acc, curr], [])

// Process pairs (current + next)
arr.reduce((acc, curr, i, array) => {
  if (i < array.length - 1) {
    return [...acc, [curr, array[i + 1]]];
  }
  return acc;
}, [])
```

### Using All Four Parameters (rare)

```typescript
// Calculate deviations from mean
numbers.reduce((acc, curr, i, array) => {
  const mean = array.reduce((s, n) => s + n, 0) / array.length;
  return acc + Math.abs(curr - mean);
}, 0)

// But this is better done in two passes:
const mean = numbers.reduce((s, n) => s + n, 0) / numbers.length;
const deviations = numbers.reduce((acc, curr) => {
  return acc + Math.abs(curr - mean);
}, 0);
```

---

## The Initial Value Matters!

### With Initial Value (Recommended)

```typescript
[1, 2, 3].reduce((acc, curr) => acc + curr, 0)
//                                          ^
//                                     start here

Iteration 0: acc = 0, curr = 1  →  return 1
Iteration 1: acc = 1, curr = 2  →  return 3
Iteration 2: acc = 3, curr = 3  →  return 6
```

### Without Initial Value (Use Caution)

```typescript
[1, 2, 3].reduce((acc, curr) => acc + curr)
//                                     no initial value

Iteration 0: SKIPPED (first element becomes acc)
Iteration 1: acc = 1, curr = 2  →  return 3
Iteration 2: acc = 3, curr = 3  →  return 6
```

### Danger Zone: Empty Array

```typescript
// ✅ SAFE
[].reduce((acc, curr) => acc + curr, 0)  // Returns: 0

// ❌ ERROR!
[].reduce((acc, curr) => acc + curr)     // TypeError!
```

---

## Memory Aid: The Restaurant Analogy

Think of `reduce` like a restaurant kitchen:

```
┌─────────────────────────────────────────────┐
│              RESTAURANT KITCHEN              │
├─────────────────────────────────────────────┤
│                                              │
│  ACCUMULATOR (acc)                           │
│  = The Dish You're Building                  │
│    Starts empty, ingredients added over time │
│                                              │
│  CURRENT VALUE (current)                     │
│  = The Ingredient You're Adding Right Now    │
│    One at a time from the recipe list        │
│                                              │
│  INDEX (index)                               │
│  = Step Number in the Recipe                 │
│    "Step 1: Add flour"                       │
│                                              │
│  ARRAY (array)                               │
│  = The Full Recipe List                      │
│    Occasionally check what's coming next     │
│                                              │
│  INITIAL VALUE                               │
│  = Empty Bowl / Starting Point               │
│    What you start with before any cooking    │
│                                              │
└─────────────────────────────────────────────┘
```

Example:
```typescript
const ingredients = ["flour", "eggs", "milk"];

const cake = ingredients.reduce(
  (dish, ingredient, step) => {
    console.log(`Step ${step + 1}: Add ${ingredient} to ${dish}`);
    return dish + " + " + ingredient;
  },
  "empty bowl"
);

// Output:
// Step 1: Add flour to empty bowl
// Step 2: Add eggs to empty bowl + flour
// Step 3: Add milk to empty bowl + flour + eggs
// Result: "empty bowl + flour + eggs + milk"
```

---

## Quick Reference Card

| Parameter | Type | Description | When to Use |
|-----------|------|-------------|-------------|
| **acc** | any | Running result | Always |
| **current** | array element | Current item | Always |
| **index** | number | Current position | Sometimes |
| **array** | array | Original array | Rarely |

**Most Common:**
```typescript
.reduce((acc, current) => ..., initialValue)
```

**Sometimes:**
```typescript
.reduce((acc, current, index) => ..., initialValue)
```

**Rarely:**
```typescript
.reduce((acc, current, index, array) => ..., initialValue)
```

---

## Summary

- **ACC** = The snowball (grows with each iteration)
- **CURRENT** = The current snowflake being added
- **INDEX** = Which snowflake number we're on
- **ARRAY** = The complete bag of snowflakes
- **INITIAL VALUE** = The starting snowball size

**Remember:** What you RETURN becomes the ACC for the next iteration! 🔄
