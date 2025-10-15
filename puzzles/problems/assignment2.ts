// puzzles/problems/assignment2.ts

/**
 * Tiny Text Editor — Undo/Redo, Cursor, and Editing
 *
 * Build a tiny text editor that processes a list of commands and returns the final `text`
 * and `cursor` position. The cursor is an index in `[0, text.length]` (between characters).

 *
 * Example:
 *   simulateEditor(
 * [                        [1,2,3,4,5]
 *                          cursor = 1
 * 
 *     { op: "type", text: "hello" },
 *     { op: "move", offset: -2 },
 *     { op: "type", text: "X" }
 *   ]
 * )  // -> { text: "helXlo", cursor: 4 }
 *
 *   simulateEditor([
 *     { op: "type", text: "ab" },
 *     { op: "undo" },
 *     { op: "redo" }
 *   ])  // -> { text: "ab", cursor: 2 }
 */

//  * Supported commands (objects) are:
//  *   - { op: "type", text: string } → insert `text` at the cursor, cursor moves to end of inserted text
//  *   - { op: "backspace", count?: number } → delete up to `count` chars before cursor (default 1), cursor moves left
//  *   - { op: "move", offset: number } → move cursor by `offset` (negative = left, positive = right), clamped to bounds
//  *   - { op: "undo" } → revert to the previous state if available
//  *   - { op: "redo" } → reapply a state undone by `undo` if available
//  *
//  * Rules & Edge Cases:
//  * - Applying any command other than `undo`/`redo` clears the redo stack.
//  * - `undo` when there is no prior state is a no-op (same for `redo` with empty redo stack).
//  * - `backspace` on an empty document or with cursor at 0 is a no-op.
//  * - `move` clamps the cursor to `[0, text.length]`.
//  * - Inputs are pure data (no I/O); output is `{ text: string, cursor: number }`.

// add 0
// old --  []
// current [0]
// redo    []

//next run
//

// undo
// old     [0]   - current (current)
// current []    - old
// redo    [0]   - current (redo)

// redo
// old     []   - current (current)
// current [0]  - current (redo)
// redo    []   -

type commands =
  | { op: "type"; text: string }
  | { op: "backspace"; count?: number }
  | { op: "move"; offset: number }
  | { op: "undo" }
  | { op: "redo" };

export function simulateEditor(program: commands[]) {
  let current = { text: "", cursor: 0 };
  let old = [];
  let redo = [];

  for (const command of program) {
    if (command.op === "undo") {
      if (old.length > 0) {
        //current -> redo
        redo.push(structuredClone(current));
        // old -> current
        current = old.pop()!;
      }
      continue;
    }

    if (command.op === "redo") {
      if (redo.length > 0) {
        // current -> old
        old.push(structuredClone(current));
        //current on redo -> current
        current = redo.pop()!;
      }
      continue;
    }

    //current -> old
    old.push(structuredClone(current));
    // new redo for next command
    redo = [];

    if (command.op === "move") {
      const newCursor = current.cursor + command.offset;
      current.cursor = Math.max(0, Math.min(current.text.length, newCursor));
    } else if (command.op === "backspace") {
      const count = command.count ?? 1;
      if (current.cursor > 0) {
        const newCursor = Math.max(0, current.cursor - count);
        const before = current.text.slice(0, newCursor);
        const after = current.text.slice(current.cursor);
        current.text = before + after;
        current.cursor = newCursor;
      }
    } else if (command.op === "type") {
      const before = current.text.slice(0, current.cursor);
      const after = current.text.slice(current.cursor);
      current.text = before + command.text + after;
      current.cursor += command.text.length;
    }
  }

  return current;
}
