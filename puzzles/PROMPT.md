# Generator Prompt — Programming Puzzles

You are generating **one TypeScript programming assignment** plus its tests. This step measures core programming fundamentals without AI.
Replace the four files below **every time** this prompt is run:

- `puzzles/problems/assignment2.ts`
- `puzzles/tests/assignment2.test.ts`

Do **not** create any other files. Do **not** include explanations outside of the code blocks. Deterministic, no randomness.

---

## Constraints (both assignments)

- Language: **TypeScript**, `strict: true`.
- Export exactly **one** named function per assignment (e.g., `export function superSpenders(...)`).
- Include a concise problem statement as a file header comment **inside** each `.ts` file with:
  - Context in 2–4 sentences
  - Input/Output specification (types and invariants)
  - 1–2 short examples (not exhaustive)
- No external libraries. Node/built-ins only.
- Pure and deterministic. No I/O, no randomness, no dates, no floating-point tricks.
- Reasonable time budget: Assignment 1 should take a skilled student ~10–20 minutes; Assignment 2 ~20–35 minutes.
- Line-count targets (not hard limits): solution ~15–40 LOC (Assignment 1), ~40–90 LOC (Assignment 2). Tests can exceed this.

---

## Tests

- Use **Vitest** (`describe`, `it`, `expect`) only.
- Cover:
  - Representative “happy path” cases
  - Edge cases (empty inputs, boundaries, duplicates, ties, ordering)
  - At least one property-like check or randomized-free table of cases
- Tests must import the exported function from the assignment file.
- No flaky or timing-dependent tests.
- Keep names and error messages clear.

---

## Assignment 1 (“starter”) — Content Requirements

Our goal with this problem is to test basic typescript syntax familiarity and the ability to use all the core functions on objects, maps, sets, numbers, arrays, and strings. It should require 2-4 core operations (grouping, summing, filtering, sorting, if/else, for loop, while, etc) on 1-2 core data structures. Edge cases should be straightforward (empty inputs, boundary conditions) rather than tricky business rules. Do not use regexes.

**Examples**
These examples give you a sense of the difficulty and level of modeling. They are for abstract inspiration, not for copying. Be creative and create different problem types. Do not build a sales order analyzer, simple calculator, scheduler problem, etc.

 - Given a list of tournament data in the format { winner: string, loser: string}, return the contestant with the most wins.
 - Evaluate a simple expression of a string like `number operator number`, where `number` is any integer and `operator` is one of `+ / - *`
 - Given a list of elevation data, return the indexes of all peaks. For instance, [1,2,1,9,4,6,4] would return [1,3,5].
 - Given a list of meetings for a given meeting room (with times modeled as minutes since midnight), return if there are any scheduling conflicts.
 - Given a board of the game connect 4, return if red or black or nobody has won.

---

## Assignment 2 ("extended") — Content Requirements

Our goal with this problem is to test the ability to come up with good data models and types and produce at least one good abstraction.

We are heavily inspiried by [Advent of Code](https://adventofcode.com/) and [Codewars Kata](https://www.codewars.com/kata/search), which do involve abstract data modeling and algorithms, but in a deeply practical problem domain. Usually you're solving a problem with real objects, or real-world rules, or modelling a system, and not just making abstract transformations on abstract data structures. Mapping from real-world objects to abstract data models is part of the problem. Often, the inputs and outputs are simple, and there is lots of emergent complexity in modeling the system.

**Examples**:
Do not re-use these (e.g. don't ask someone to simulate a booking system or a tournament).

 - You are driving a toy car that starts at `0,0`. given a bunch of commands of `turnleft, turnright, moveforward, moveback`, return the final location of the car.
 - Simulate a rock-paper-scissors tournament. Each player only plays one of `R,P,S`, and matches are processed left to right. For instance, given
  ` {steve: "R", joe: "P", bob: "S", james: "S"} and a match setup like ["steve", "joe", "bob", "james"], first steve and joe play, and the winner of that plays the winner of the bob vs james match. In case of a tie, the left/first player wins. Return the winner of the tournament (in this case, bob).
 - You are running a college class reservation system. Given a list of classes and their capacity, and a list of student requests to join a class, return the people in each class and the waitlist. Requests are processed in order.

---

### File Content Requirements

**`assignment1.ts`**
- Export one named function with explicit parameter and return types.
- Include the problem statement header comment with Input/Output and relevant examples.
- No console I/O.

**`assignment1.test.ts`**
- Import the function from `../problems/assignment1`.
- 3-10 tests total, covering normal + edge cases.
- Use only Vitest. Deterministic.

**`assignment2.ts`**
- Export one named function with no types on the input/output (that's part of the modelling exercise for students).
- Include a clear problem statement header comment with rules and common edge cases spelled out.
- If a helper type or small internal helper function is natural, define it locally (not exported).

**`assignment2.test.ts`**
- Import the function from `../problems/assignment2`.
- 3-10 tests total, including at least:
  - One scenario that forces the intended abstraction
  - One minimal/empty-input scenario
  - One “realistic” full scenario

---

## Style & Quality

- Prefer small, composable helpers over clever one-liners.
- Name things clearly; avoid abbreviations.
- Keep mutation localized; prefer immutable transforms when reasonable.
- Avoid over-abstraction on Assignment 1; include a modest, purposeful abstraction on Assignment 2.

---

## Verification

All tests must pass **after** the student writes a correct solution. Ensure the tests reflect the stated rules precisely and unambiguously by running `bun test`. You are not done until all the tests pass.
