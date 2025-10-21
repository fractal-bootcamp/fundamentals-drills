// puzzles/tests/functional_practice_pack.test.ts
import { describe, it, expect } from "vitest";
import {
    squareAll,
    onlyEvens,
    toUpper,
    sumPositives,
    countLong,
    firstNegative,
    allNonEmpty,
    hasZero,
    wordLengths,
    totalChars,
} from "../problems/functionalpracticepack";

// 1) squareAll
describe("squareAll", () => {
    it("squares each number (happy path)", () => {
        expect(squareAll([1, 2, 3])).toEqual([1, 4, 9]);
    });

    it("empty array -> empty array", () => {
        expect(squareAll([])).toEqual([]);
    });

    it("property-like: result[i] === input[i]^2", () => {
        const nums = [-3, -1, 0, 2, 5];
        const out = squareAll(nums);
        expect(out.length).toBe(nums.length);
        for (let i = 0; i < nums.length; i++) {
            expect(out[i]).toBe(nums[i] * nums[i]);
        }
    });
});

// 2) onlyEvens
describe("onlyEvens", () => {
    it("filters to even numbers", () => {
        expect(onlyEvens([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    });

    it("handles negatives and zero", () => {
        expect(onlyEvens([-3, -2, -1, 0, 1, 2])).toEqual([-2, 0, 2]);
    });

    it("empty array -> empty array", () => {
        expect(onlyEvens([])).toEqual([]);
    });

    it("property-like: all results are even and sourced from input", () => {
        const inputs = [-5, -4, -3, -2, -1, 0, 1, 2];
        const outputs = [-4, -2, 0, 2]
        const out = onlyEvens(inputs);
        expect(out).toEqual(outputs);
    });
});

// 3) toUpper
describe("toUpper", () => {
    it("uppercases words (happy path)", () => {
        expect(toUpper(["hi", "Bye"])).toEqual(["HI", "BYE"]);
    });

    it("non-letters unaffected except case context", () => {
        expect(toUpper(["123", "a1b2"])).toEqual(["123", "A1B2"]);
    });

    it("empty array -> empty array", () => {
        expect(toUpper([])).toEqual([]);
    });

    it("property-like: lengths preserved", () => {
        const words = ["Type", "Script", ""];
        const out = toUpper(words);
        expect(out.map((w) => w.length)).toEqual(words.map((w) => w.length));
    });
});

// 4) sumPositives
describe("sumPositives", () => {
    it("sums only numbers > 0", () => {
        expect(sumPositives([-1, 2, 3, 0, -5, 4])).toEqual(9);
    });

    it("all non-positives -> 0", () => {
        expect(sumPositives([-3, -2, 0])).toEqual(0);
    });

    it("empty array -> 0", () => {
        expect(sumPositives([])).toEqual(0);
    });

    it("property-like: equals filter(n>0).reduce(sum)", () => {
        const nums = [-2, -1, 0, 1, 2, 10];
        const expected = nums.filter((n) => n > 0).reduce((a, b) => a + b, 0);
        expect(sumPositives(nums)).toBe(expected);
    });
});

// 5) countLong
describe("countLong", () => {
    it("counts strings with length > 3", () => {
        expect(countLong(["hi", "code", "typescript", "yo"])).toBe(2);
    });

    it("boundary: length 3 is not counted; length 4 is counted", () => {
        expect(countLong(["aaa", "aaaa"])).toBe(1);
    });

    it("empty array -> 0", () => {
        expect(countLong([])).toBe(0);
    });

    it("property-like: equals words.filter(len>3).length", () => {
        const words = ["", "a", "abc", "abcd", "abcdef"];
        const expected = words.filter((w) => w.length > 3).length;
        expect(countLong(words)).toBe(expected);
    });
});

// 6) firstNegative
describe("firstNegative", () => {
    it("returns the first negative number", () => {
        expect(firstNegative([5, 0, -3, -1])).toBe(-3);
    });

    it("returns null when no negatives", () => {
        expect(firstNegative([0, 1, 2])).toBeNull();
    });

    it("handles negative at index 0", () => {
        expect(firstNegative([-1, -2, 3])).toBe(-1);
    });

    it("empty array -> null", () => {
        expect(firstNegative([])).toBeNull();
    });
});

// 7) allNonEmpty
describe("allNonEmpty", () => {
    it("true when all strings non-empty", () => {
        expect(allNonEmpty(["a", "bb", "ccc"])).toBe(true);
    });

    it("false when any string is empty", () => {
        expect(allNonEmpty(["a", "", "c"])).toBe(false);
    });

    it("empty array -> true (vacuous truth)", () => {
        expect(allNonEmpty([])).toBe(true);
    });
});

// 8) hasZero
describe("hasZero", () => {
    it("true when array contains 0", () => {
        expect(hasZero([3, 1, 0, 4])).toBe(true);
    });

    it("false when array has no 0", () => {
        expect(hasZero([1, 2, 3])).toBe(false);
    });

    it("empty array -> false", () => {
        expect(hasZero([])).toBe(false);
    });

    it("true when multiple zeros present", () => {
        expect(hasZero([0, 0, 1])).toBe(true);
    });
});

// 9) wordLengths
describe("wordLengths", () => {
    it("maps each word to its length", () => {
        expect(wordLengths(["cat", "fish"])).toEqual([3, 4]);
    });

    it("empty array -> empty array", () => {
        expect(wordLengths([])).toEqual([]);
    });

    it("property-like: length of output equals length of input", () => {
        const words = ["a", "", "xyz"];
        const out = wordLengths(words);
        expect(out.length).toBe(words.length);
    });

    it("property-like: each out[i] === words[i].length", () => {
        const words = ["Type", "Script", ""];
        const out = wordLengths(words);
        for (let i = 0; i < words.length; i++) {
            expect(out[i]).toBe(words[i].length);
        }
    });
});

// 10) totalChars
describe("totalChars", () => {
    it("sums total characters across words", () => {
        expect(totalChars(["hi", "bye"])).toBe(5);
    });

    it("empty array -> 0", () => {
        expect(totalChars([])).toBe(0);
    });

    it("handles empty strings inside the array", () => {
        expect(totalChars(["", "a", ""])).toBe(1);
    });

    it("property-like: equals words.map(len).reduce(sum)", () => {
        const words = ["alpha", "β", ""]; // include a non-ASCII example
        const expected = words.map((w) => w.length).reduce((a, b) => a + b, 0);
        expect(totalChars(words)).toBe(expected);
    });
});
