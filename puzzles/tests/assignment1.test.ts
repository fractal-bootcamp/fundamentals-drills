import { describe, it, expect } from "vitest";
import { mostFrequentWord } from "../problems/assignment1";

describe("mostFrequentWord", () => {
  it("returns the most frequent word in a simple case", () => {
    expect(mostFrequentWord("the cat and the dog")).toBe("the");
  });

  it("returns the first word when all words have same frequency", () => {
    expect(mostFrequentWord("one two three")).toBe("one");
  });

  it("handles repeated words", () => {
    expect(mostFrequentWord("apple banana apple")).toBe("apple");
  });

  it("returns empty string for empty input", () => {
    expect(mostFrequentWord("")).toBe("");
  });

  it("handles single word", () => {
    expect(mostFrequentWord("hello")).toBe("hello");
  });

  it("is case-insensitive", () => {
    expect(mostFrequentWord("Hello world hello WORLD hello")).toBe("hello");
  });

  it("returns first occurrence when tied", () => {
    expect(mostFrequentWord("cat dog cat dog")).toBe("cat");
  });

  it("handles multiple spaces between words", () => {
    expect(mostFrequentWord("a  b  a")).toBe("a");
  });

  it("works with longer text", () => {
    const text = "the quick brown fox jumps over the lazy dog the fox runs";
    expect(mostFrequentWord(text)).toBe("the");
  });
});
