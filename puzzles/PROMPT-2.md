# Generator Prompt — Programming Puzzles

You are generating **one TypeScript programming assignment** plus its tests. This step measures core programming fundamentals without AI.
Create an `assignment4.ts` file and an `assignment4-test.ts` file.

Do **not** create any other files. Do **not** include explanations outside of the code blocks. Deterministic, no randomness.

---

## Constraints

- Language: **TypeScript**, `strict: true`.
- Export exactly **one** named function (e.g., `export function superSpenders(...)`).
- Include a concise problem statement as a file header comment **inside** each `.ts` file with:
  - Context in 2–4 sentences
  - Input/Output specification (types and invariants)
  - 1–2 short examples (not exhaustive)
- No external libraries. Node/built-ins only.
- Pure and deterministic. No I/O, no randomness, no dates, no floating-point tricks.
- Reasonable time budget: Assignment 4 should take a skilled student ~20–35 minutes.
- Line-count targets (not hard limits): solution ~40–90 LOC (Assignment 4). Tests can exceed this.

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

## Assignment 4 ("extended") — Content Requirements

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

**`assignment4.ts`**
- Export one named function with no types on the input/output (that's part of the modelling exercise for students).
- Include a clear problem statement header comment with rules and common edge cases spelled out.
- If a helper type or small internal helper function is natural, define it locally (not exported).

**`assignment4.test.ts`**
- Import the function from `../problems/assignment4`.
- 3-10 tests total, including at least:
  - One scenario that forces the intended abstraction
  - One minimal/empty-input scenario
  - One “realistic” full scenario

---

## Style & Quality

- Prefer small, composable helpers over clever one-liners.
- Name things clearly; avoid abbreviations.
- Keep mutation localized; prefer immutable transforms when reasonable.
- include a modest, purposeful abstraction on Assignment 4.

---

## Verification

All tests must pass **after** the student writes a correct solution. Ensure the tests reflect the stated rules precisely and unambiguously by running `bun test`. You are not done until all the tests pass.