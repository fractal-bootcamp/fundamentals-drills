// puzzles/tests/assignment1a.test.ts
import { describe, it, expect } from "vitest";
import { mostFrequentWord } from "../problems/mostfrequentword";

describe("mostFrequentWord", () => {
    it("returns null for empty input", () => {
        expect(mostFrequentWord([])).toBeNull();
    });

    it("returns the only word for singleton", () => {
        expect(mostFrequentWord(["solo"])).toBe("solo");
    });

    it("returns the most frequent word", () => {
        expect(mostFrequentWord(["a", "b", "a", "c", "b", "a"])).toBe("a");
    });

    it("breaks ties by lexicographic order", () => {
        expect(mostFrequentWord(["b", "a"])).toBe("a");
        expect(mostFrequentWord(["z", "y", "z", "y"])).toBe("y"); // tie → "y" < "z"
    });

    it("treats case as distinct", () => {
        expect(mostFrequentWord(["A", "a", "a", "A", "A"])).toBe("A");
    });

    it("handles many duplicates and mixed order", () => {
        const input = ["x", "y", "x", "y", "x", "z", "y", "y"];
        expect(mostFrequentWord(input)).toBe("y");
    });
});
