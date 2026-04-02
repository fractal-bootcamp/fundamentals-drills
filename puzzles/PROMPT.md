# Generator Prompt — "Grokking Simplicity" Drills

You are generating **two linked TypeScript programming assignments** plus their tests.
You will strictly follow the **Actions, Calculations, Data (ACD)** paradigm from the book _Grokking Simplicity_.

Replace the four files below **every time** this prompt is run:

- `puzzles/problems/assignment1.ts`
- `puzzles/tests/assignment1.test.ts`
- `puzzles/problems/assignment2.ts`
- `puzzles/tests/assignment2.test.ts`

Do **not** create any other files. Do **not** include explanations outside of the code blocks. Deterministic, no randomness.

---

## Global Constraints

- Language: **TypeScript**, `strict: true`.
- No external libraries. Node/built-ins only.
- **Dependency Rule**: `assignment2.ts` depends on `assignment1.ts`.

---

## Assignment 1: "Data & Calculations" (The Pure Layer)

**Conceptual Goal:**
This file represents the **functional core**. It contains **Data** (types) and **Calculations** (pure functions).
It must be testable without any context, state, or setup.

**Content Requirements:**

1.  **Data**: Define the interface/types for the domain (e.g., `Cart`, `TaxRate`, `GameState`).
2.  **Calculations**: Export **3 to 6** pure functions.
    - These functions take inputs and return outputs.
    - **No side effects.** No reading global state. No mutation.
    - _Tip for the Generator_: Look for complex logic (e.g., "determine winner", "calculate pro-rated refund", "validate strict password rules") and extract it here.

**Header Comment:**

- Context: "We are building the pure logic for a [Domain Name]."
- **Architecture**: List the exported functions and explicitly label them as `// Calculation`.
  - Example: `calculateNextPosition(current, move) // Calculation: determines next coord`
- **Example Data Sketch**: Provide a rough input/output example for the main calculation to help visualize intent.
  - Example:
    ```typescript
    // Example Input:
    // { position: { x: 5, y: 3 }, move: "north", gridSize: 10 }
    // Example Output:
    // { x: 5, y: 4 }
    ```

---

## Assignment 2: "Actions" (The Imperative Shell)

**Conceptual Goal:**
This file represents the **stateful shell**. It contains the **Actions**.
It manages the timeline of events, side effects, and state updates.

**Content Requirements:**

1.  **Context**: A system that processes a series of inputs over time (e.g., processing a stream of payments, simulating a robot vacuum).
2.  **The Main Action**: Export exactly **one** function (e.g., `processBatch`, `runSimulation`).
    - Initialize local state (Data).
    - Loop through inputs.
    - **Call Assignment 1 Calculations** to decide what to do next.
    - Based on the result of the calculation, **mutate** the local state.
3.  **Constraint**: The Main Action should contain **minimal logic**. It should mostly consist of calling helpers and assigning results.

**Header Comment:**

- Context: "We are processing a timeline of [Events]."
- Rules: Explain how the state changes over time.
- **Example Data Sketch**: Provide a rough example of the input structure to help visualize the action flow.
  - Example:
    ```typescript
    // Example Input:
    // {
    //   initialState: { robot: { x: 0, y: 0 }, cleanedCells: [] },
    //   moves: ["north", "north", "east", "south"]
    // }
    // Example Output:
    // { robot: { x: 1, y: 1 }, cleanedCells: [[0,0], [0,1], [0,2], [1,2], [1,1]] }
    ```

---

## Tests

- Use **Vitest** (`describe`, `it`, `expect`) only.
- **`assignment1.test.ts`**:
  - **Calculation Tests**: Verify input -> output. Focus on edge cases (empty arrays, negatives).
- **`assignment2.test.ts`**:
  - **Action Tests**: Verify the state changes correctly after a sequence of events.
  - Include a test case called "Integration: Calculations driving Actions".

---

## File Templates

**`assignment1.ts`** structure:

```typescript
/*
Assignment 1: Data & Calculations
Domain: [Domain Name]

Calculations to Implement:
1. [Name] - [Description]
2. ...
*/

// TODO: Export Data Types

// TODO: Export Pure Calculations
```

**`assignment2.ts`** structure:

```typescript
/*
Assignment 2: Actions & Orchestration
Domain: [Domain Name]

Main Action:
- Iterate through [Inputs]
- Maintain [State]
- Use Assignment 1 to determine outcomes
*/

import {} from // Import Types and Calculations
'./assignment1';

// TODO: Export Main Action Function
```

---

## Style & Quality

- **Calculation Complexity**: Make sure the helpers in Assignment 1 are not just trivial one-liners. They should handle specific business rules (e.g., "Items expire 3 days after production unless frozen").
- **Action Simplicity**: The code in Assignment 2 should be readable like a manual: "If item is valid (calc), add to cart (action). Else, log error (action)."

---
