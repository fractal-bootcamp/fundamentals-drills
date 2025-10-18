/**
 * Assignment 2 — Text Editor Simulator
 *
 * Context:
 * You are modeling the core text buffer of a very small text editor that
 * maintains a cursor and supports a handful of editing operations. The editor
 * applies a sequence of operations to an initially empty document and returns
 * the final text content. This focuses on clean data modeling and a simple
 * internal abstraction (e.g., two-stack cursor model).
 *
 * Input:
 *  - ops: an array of operation objects processed from left to right. Each op
 *    has a shape:
 *      { op: 'type', text: string }                  // insert text at cursor
 *      { op: 'left', count?: number }                // move cursor left
 *      { op: 'right', count?: number }               // move cursor right
 *      { op: 'backspace', count?: number }           // delete left of cursor
 *      { op: 'delete', count?: number }              // delete at cursor
 *    Invariants: counts are positive integers; if omitted, treat as 1. Movement
 *    and deletions that exceed boundaries simply stop at the boundary.
 * Output:
 *  - string — the final text content after all operations are applied.
 *
 * Examples:
 *  - simulateEditor([{ op: 'type', text: 'abc' }]) -> 'abc'
 *  - simulateEditor([
 *      { op: 'type', text: 'ab' },
 *      { op: 'left', count: 1 },
 *      { op: 'type', text: 'X' }
 *    ]) -> 'aXb'
 *
 * Notes:
 *  - Avoid using regexes or I/O — this should be a pure function.
 *  - A helpful abstraction is to maintain two arrays: the text to the left of
 *    the cursor and the text to the right of the cursor. At the end, join the
 *    left with the reversed right.
 */
export function simulateEditor(ops) {
  // TODO: Implement using a two-stack (left/right) cursor model.
  // Requirements:
  //  - Process each operation in order.
  //  - Treat missing counts as 1 and stop at document boundaries.
  //  - Return the final string content.
  void ops;
  return '';
}
