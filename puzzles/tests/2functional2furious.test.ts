// puzzles/tests/functional_practice_pack_2.test.ts
import { describe, it, expect } from "vitest";
import {
    doubleOdds,
    onlyUniqueStrings,
    countTruthy,
    anyStartsWith,
    allWithinRange,
    pickKey,
    flattenOnce,
    sumByAmount,
    parityCounts,
    longestWord,
} from "../problems/2functional2furious";

// 1) doubleOdds
describe("doubleOdds", () => {
    it("doubles odd numbers and leaves evens unchanged (happy path)", () => {
        expect(doubleOdds([1, 2, 3, 4])).toEqual([2, 2, 6, 4]);
    });

    it("handles negatives and zero", () => {
        expect(doubleOdds([-3, -2, 0, 5])).toEqual([-6, -2, 0, 10]);
    });

    it("empty array -> empty array", () => {
        expect(doubleOdds([])).toEqual([]);
    });

    it("property-like: per-index parity rule holds, length preserved", () => {
        const src = [-2, -1, 0, 1, 2, 3];
        const out = doubleOdds(src);
        expect(out.length).toBe(src.length);
        for (let i = 0; i < src.length; i++) {
            const n = src[i];
            if (Math.abs(n) % 2 === 1) expect(out[i]).toBe(n * 2);
            else expect(out[i]).toBe(n);
        }
    });
});

// 2) onlyUniqueStrings
describe("onlyUniqueStrings", () => {
    it("removes duplicates, keeps first occurrence", () => {
        expect(onlyUniqueStrings(["a", "b", "a", "c", "b", "b", "a"])).toEqual(["a", "b", "c"]);
    });

    it("case-sensitive uniqueness", () => {
        expect(onlyUniqueStrings(["a", "A", "a"])).toEqual(["a", "A"]);
    });

    it("empty array -> empty array", () => {
        expect(onlyUniqueStrings([])).toEqual([]);
    });

    it("property-like: output has no duplicates and preserves first-appearance order", () => {
        const src = ["x", "y", "x", "z", "y", "x"];
        const out = onlyUniqueStrings(src);
        // no duplicates
        expect(new Set(out).size).toBe(out.length);
        // indices of first appearances are strictly increasing
        let last = -1;
        for (const w of out) {
            const idx = src.indexOf(w);
            expect(idx).toBeGreaterThan(last);
            last = idx;
        }
    });
});

// 3) countTruthy
describe("countTruthy", () => {
    it("counts truthy values", () => {
        expect(countTruthy([0, 1, "", "x", null, undefined, {}, [], NaN])).toBe(4);
        // truthy here: 1, "x", {}, []
    });

    it("empty array -> 0", () => {
        expect(countTruthy([])).toBe(0);
    });

    it("property-like: equals values.filter(Boolean).length", () => {
        const vals = [false, true, 0, 2, "", "ok", null, {}, []];
        const expected = vals.filter(Boolean).length;
        expect(countTruthy(vals)).toBe(expected);
    });
});

// 4) anyStartsWith
describe("anyStartsWith", () => {
    it("true when any word starts with given letter (case-insensitive)", () => {
        expect(anyStartsWith(["apple", "banana", "Cherry"], "a")).toBe(true);
        expect(anyStartsWith(["apple", "banana", "Cherry"], "C")).toBe(true);
    });

    it("false when none match", () => {
        expect(anyStartsWith(["dog", "cat"], "z")).toBe(false);
    });

    it("empty words -> false", () => {
        expect(anyStartsWith([], "a")).toBe(false);
    });

    it("property-like: equals words.some(w => w.toLowerCase().startsWith(letter.toLowerCase()))", () => {
        const words = ["Alpha", "beta", "gamma"];
        const letter = "G";
        const expected = words.some((w) => w.toLowerCase().startsWith(letter.toLowerCase()));
        expect(anyStartsWith(words, letter)).toBe(expected);
    });
});

// 5) allWithinRange
describe("allWithinRange", () => {
    it("inclusive boundaries hold", () => {
        expect(allWithinRange([3, 4, 5], 3, 5)).toBe(true);
        expect(allWithinRange([3, 5, 6], 3, 5)).toBe(false);
    });

    it("empty array -> true (vacuous truth)", () => {
        expect(allWithinRange([], 0, 1)).toBe(true);
    });

    it("property-like: equals nums.every(n => min <= n && n <= max)", () => {
        const nums = [-1, 0, 1, 2, 3];
        const min = 0;
        const max = 2;
        const expected = nums.every((n) => min <= n && n <= max);
        expect(allWithinRange(nums, min, max)).toBe(expected);
    });
});

// 6) pickKey
describe("pickKey", () => {
    it("collects values for present key, skips missing", () => {
        const items = [{ a: 1 }, { b: 2 }, { a: 3, c: 0 }];
        expect(pickKey(items, "a")).toEqual([1, 3]);
    });

    it("includes undefined when key exists with undefined", () => {
        const items = [{ a: undefined }, {}, { a: 0 }];
        expect(pickKey(items, "a")).toEqual([undefined, 0]);
    });

    it("empty items -> empty array", () => {
        expect(pickKey([], "x")).toEqual([]);
    });

    it("property-like: length equals count of records where key in record", () => {
        const items = [{ x: 1 }, { y: 2 }, { x: 3 }, {}, { x: undefined }];
        const key = "x";
        const expectedLen = items.filter((r) => key in r).length;
        expect(pickKey(items, key).length).toBe(expectedLen);
    });
});

// 7) flattenOnce
describe("flattenOnce", () => {
    it("flattens one level", () => {
        expect(flattenOnce([[1, 2], [3], [4, 5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it("handles inner empty arrays", () => {
        expect(flattenOnce([[], [1], [], [2, 3], []])).toEqual([1, 2, 3]);
    });

    it("empty input -> empty output", () => {
        expect(flattenOnce([])).toEqual([]);
    });

    it("property-like: equals nested.reduce((acc, arr) => acc.concat(arr), [])", () => {
        const nested = [[-1, 0], [], [2, 3]];
        const expected = nested.reduce<number[]>((acc, arr) => acc.concat(arr), []);
        expect(flattenOnce(nested)).toEqual(expected);
    });
});

// 8) sumByAmount
describe("sumByAmount", () => {
    it("sums amount fields", () => {
        expect(sumByAmount([{ amount: 2 }, { amount: 5 }, { amount: -1 }])).toBe(6);
    });

    it("empty -> 0", () => {
        expect(sumByAmount([])).toBe(0);
    });

    it("property-like: equals items.reduce((s, x) => s + x.amount, 0)", () => {
        const items = [{ amount: 10 }, { amount: -4 }, { amount: 0 }];
        const expected = items.reduce((s, x) => s + x.amount, 0);
        expect(sumByAmount(items)).toBe(expected);
    });
});

// 9) parityCounts
describe("parityCounts", () => {
    it("counts even and odd numbers", () => {
        expect(parityCounts([1, 2, 3, 4, 5])).toEqual({ even: 2, odd: 3 });
    });

    it("empty -> { even:0, odd:0 }", () => {
        expect(parityCounts([])).toEqual({ even: 0, odd: 0 });
    });

    it("handles negatives and zero", () => {
        expect(parityCounts([-3, -2, 0, 7])).toEqual({ even: 2, odd: 2 });
    });

    it("property-like: even + odd equals input length", () => {
        const nums = [-2, -1, 0, 1, 2, 3, 4];
        const out = parityCounts(nums);
        expect(out.even + out.odd).toBe(nums.length);
    });
});

// 10) longestWord
describe("longestWord", () => {
    it("returns the longest string; on tie returns first", () => {
        expect(longestWord(["a", "abcd", "abc"])).toBe("abcd");
        expect(longestWord(["xx", "yyyy", "yyyy", "zzz"])).toBe("yyyy");
    });

    it("empty input -> null", () => {
        expect(longestWord([])).toBeNull();
    });

    it("property-like: result is a member of input unless null", () => {
        const words = ["one", "three", "two"];
        const res = longestWord(words);
        expect(res === null || words.includes(res)).toBe(true);
    });

    it("property-like: no word is longer than the returned one", () => {
        const words = ["alpha", "βeta", "kappa"];
        const res = longestWord(words);
        if (res !== null) {
            for (const w of words) {
                expect(w.length <= res.length).toBe(true);
            }
        }
    });
});
