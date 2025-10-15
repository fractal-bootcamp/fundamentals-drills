// puzzles/tests/assignment2.test.ts
import { describe, it, expect } from "vitest";
import { simulateEditor } from "../problems/assignment2";

describe("simulateEditor", () => {
  it("minimal: empty program yields empty text at cursor 0", () => {
    expect(simulateEditor([])).toEqual({ text: "", cursor: 0 });
  });

  it("typing, moving, and backspacing", () => {
    const res = simulateEditor([
      { op: "type", text: "hello" },
      { op: "move", offset: -2 }, // cursor at 3
      { op: "type", text: "X" }, // helXlo
      { op: "backspace", count: 2 }, // remove 'l' and 'X' -> helo, cursor 2
    ]);
    expect(res).toEqual({ text: "helo", cursor: 2 });
  });

  it("undo/redo basic", () => {
    const res = simulateEditor([
      { op: "type", text: "ab" },
      { op: "undo" },
      { op: "redo" },
    ]);
    expect(res).toEqual({ text: "ab", cursor: 2 });
  });

  it("redo stack is cleared after new edit (forces intended abstraction)", () => {
    const res = simulateEditor([
      { op: "type", text: "ab" }, // state S1
      { op: "undo" }, // back to S0
      { op: "type", text: "X" }, // new branch, clears redo
      { op: "redo" }, // no effect
    ]);
    expect(res).toEqual({ text: "X", cursor: 1 });
  });

  it("backspace clamps at start and handles large count", () => {
    const res = simulateEditor([
      { op: "type", text: "abc" },
      { op: "backspace", count: 10 }, // deletes all
      { op: "backspace", count: 1 }, // no-op at start
    ]);
    expect(res).toEqual({ text: "", cursor: 0 });
  });

  it("move clamps within bounds and can insert in the middle", () => {
    const res = simulateEditor([
      { op: "type", text: "world" },
      { op: "move", offset: -5 }, // to 0
      { op: "move", offset: -10 }, // clamp to 0
      { op: "type", text: "hello " }, // "hello world", cursor 6
      { op: "move", offset: 100 }, // clamp to end
      { op: "type", text: "!" },
    ]);
    expect(res).toEqual({ text: "hello world!", cursor: 12 });
  });
});
