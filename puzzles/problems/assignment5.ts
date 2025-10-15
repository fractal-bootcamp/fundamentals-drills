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
[
  { op: "type", text: "hello" },
  { op: "move", offset: -2 }, // cursor at 3
  { op: "type", text: "X" }, // helXlo
  { op: "backspace", count: 2 }, // remove 'l' and 'X' -> helo, cursor 2
]

type Type = { op: "type", text: string }
type Backspace = { op: "backspace", count: number }
type Move = { op: "move", offset: number }
type Undo = { op: "undo" }
type Redo = { op: "redo" }

type Command = Type | Move | Backspace | Undo | Redo
type Commands = Command[]

type Output = { text: string, cursor: number }

type State = {
  text: string
  cursor: number
  undoStack: Commands
  redoStack: Commands
}

const initializeState = () => {
  return {
    text: "",
    cursor: 0,
    undoStack: [],
    redoStack: [],
  }
}

export const simulateEditor = (program: Commands): Output => {
  let state = initializeState()

  program.forEach((command) => {
    switch (command.op) {
      case "type":
        const newText = 
        const newCursor = state.cursor + 
        state = { ...state, text: command.text, }
      case "move":
      case "backspace":
      case "undo":
      case "redo":
    }
  })
//  *   - { op: "type", text: string } → insert `text` at the cursor, cursor moves to end of inserted text
//  *   - { op: "backspace", count?: number } → delete up to `count` chars before cursor (default 1), cursor moves left
//  *   - { op: "move", offset: number } → move cursor by `offset` (negative = left, positive = right), clamped to bounds
//  *   - { op: "undo" } → revert to the previous state if available
//  *   - { op: "redo" } → reapply a state undone by `undo` if available
//  * - Applying any command other than `undo`/`redo` clears the redo stack.
//  * - `undo` when there is no prior state is a no-op (same for `redo` with empty redo stack).
//  * - `backspace` on an empty document or with cursor at 0 is a no-op.
//  * - `move` clamps the cursor to `[0, text.length]`.
//  * - Inputs are pure data (no I/O); output is `{ text: string, cursor: number }`.
  return {text: state.text, cursor: state.cursor}
}
