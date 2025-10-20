You are generating **One TypeScript programming assignment** plus their tests. This step measures core programming fundamentals without AI.
Replace the file below **every time** this prompt is run:

- `puzzles/problems/assignment1.ts`

Do **not** create any other files. Do **not** include explanations outside of the code blocks. Deterministic, no randomness.

Within this assignment I want 3-5 "level 1 difficulty" puzzles.

---

## Constraints

- Language: **TypeScript**, `strict: true`.
- Export exactly **one** named function per assignment (e.g., `export function superSpenders(...)`).
- Include a concise problem statement as a file header comment **above** each puzzle problem you generate.
  - Context in 2–4 sentences
  - Input/Output specification (types and invariants)
  - 1–2 short examples (not exhaustive)
- No external libraries. Node/built-ins only.
- Pure and deterministic. No I/O, no randomness, no dates, no floating-point tricks.
- Reasonable time budget: each puzzle within Assignment 1 should take a skilled student ~10 minutes to complete. This is about reptition to practice the meat and potatoes of the smaller atomic units of work most larger complex programming tasks consist of.
- Line-count targets (not hard limits): solution ~5-15 LOC (Assignment 1),

---

## Assignment 1 (“starter”) — Content Requirements

Our goal with this problem is to test basic typescript syntax familiarity and the ability to use all the core functions on objects, maps, sets, numbers, arrays, and strings. It should require 2-4 core operations (grouping, summing, filtering, sorting, if/else, for loop, while, etc) on 1-2 core data structures. Edge cases should be straightforward (empty inputs, boundary conditions) rather than tricky business rules. Do not use regexes.

**Examples**

- given an array, return `true` if the largest number in the array is even.
- given an array of student scores, replace the "points" and "maxPossiblePoints" with a percentage grade instead.
- given an array of cats, return the names of all cats with blue eyes.
- given an array of numbers, return true if the array of numbers strictly decreases.
- Given a list of tournament data in the format { winner: string, loser: string}, return the contestant with the most wins.
- an ideal example of problem statements & solutions for an assignment1 file can be found [@assignment1_01.ts](zed:///agent/file?path=%2FUsers%2Fea%2FProgramming%2Fweb%2Ffractal%2Ffundamentals-drills%2Fpuzzles%2Fproblems%2Fassignment1_01.ts)

## Style & Quality

- Prefer small, composable helpers over clever one-liners.
- Name things clearly; avoid abbreviations.
- Avoid over-abstraction on Assignment 1

## Verification

All tests must pass **after** the student writes a correct solution. Ensure the tests reflect the stated rules precisely and unambiguously by running `bun test`. You are not done until all the tests pass.

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
- Test should be written to this file: `puzzles/tests/assignment1.test.ts`
