import { describe, it, expect } from "vitest";
import {
  sumOddNumbers,
  findLongestString,
  findLongBooks,
  allPositive,
  calculateTotal,
} from "../problems/assignment1";

describe("sumOddNumbers", () => {
  it("should sum odd numbers from mixed array", () => {
    expect(sumOddNumbers([1, 2, 3, 4, 5])).toBe(9);
  });

  it("should return 0 for all even numbers", () => {
    expect(sumOddNumbers([2, 4, 6])).toBe(0);
  });

  it("should sum multiple odd numbers", () => {
    expect(sumOddNumbers([11, 13])).toBe(24);
  });

  it("should return 0 for empty array", () => {
    expect(sumOddNumbers([])).toBe(0);
  });

  it("should handle single odd number", () => {
    expect(sumOddNumbers([7])).toBe(7);
  });

  it("should handle single even number", () => {
    expect(sumOddNumbers([8])).toBe(0);
  });

  it("should handle negative odd numbers", () => {
    expect(sumOddNumbers([-1, -3, 2])).toBe(-4);
  });

  it("should handle large array of mixed numbers", () => {
    expect(sumOddNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(25);
  });
});

describe("findLongestString", () => {
  it("should find the longest string", () => {
    expect(findLongestString(["cat", "elephant", "dog"])).toBe("elephant");
  });

  it("should return first when same length", () => {
    expect(findLongestString(["hi", "yo"])).toBe("hi");
  });

  it("should return first longest when multiple same length", () => {
    expect(findLongestString(["a", "bb", "cc", "d"])).toBe("bb");
  });

  it("should handle single string", () => {
    expect(findLongestString(["hello"])).toBe("hello");
  });

  it("should handle empty string in array", () => {
    expect(findLongestString(["", "a", "bb"])).toBe("bb");
  });

  it("should handle all empty strings", () => {
    expect(findLongestString(["", "", ""])).toBe("");
  });

  it("should handle increasing length strings", () => {
    expect(findLongestString(["a", "bb", "ccc", "dddd"])).toBe("dddd");
  });

  it("should handle decreasing length strings", () => {
    expect(findLongestString(["dddd", "ccc", "bb", "a"])).toBe("dddd");
  });
});

describe("findLongBooks", () => {
  it("should filter books with more than 200 pages", () => {
    expect(
      findLongBooks([
        { title: "Short", pages: 100 },
        { title: "Long", pages: 300 },
      ]),
    ).toEqual(["Long"]);
  });

  it("should return empty array when no books over 200 pages", () => {
    expect(
      findLongBooks([
        { title: "A", pages: 50 },
        { title: "B", pages: 150 },
      ]),
    ).toEqual([]);
  });

  it("should return multiple long books", () => {
    expect(
      findLongBooks([
        { title: "Epic", pages: 500 },
        { title: "Novel", pages: 250 },
      ]),
    ).toEqual(["Epic", "Novel"]);
  });

  it("should return empty array for empty input", () => {
    expect(findLongBooks([])).toEqual([]);
  });

  it("should handle exactly 200 pages (not included)", () => {
    expect(findLongBooks([{ title: "Exact", pages: 200 }])).toEqual([]);
  });

  it("should handle exactly 201 pages (included)", () => {
    expect(findLongBooks([{ title: "Just Over", pages: 201 }])).toEqual(["Just Over"]);
  });

  it("should preserve order of books", () => {
    expect(
      findLongBooks([
        { title: "Z", pages: 300 },
        { title: "A", pages: 250 },
        { title: "M", pages: 350 },
      ]),
    ).toEqual(["Z", "A", "M"]);
  });

  it("should handle mixed short and long books", () => {
    expect(
      findLongBooks([
        { title: "Short1", pages: 100 },
        { title: "Long1", pages: 300 },
        { title: "Short2", pages: 50 },
        { title: "Long2", pages: 400 },
      ]),
    ).toEqual(["Long1", "Long2"]);
  });
});

describe("allPositive", () => {
  it("should return true for all positive numbers", () => {
    expect(allPositive([1, 2, 3])).toBe(true);
  });

  it("should return false when any number is negative", () => {
    expect(allPositive([1, -1, 3])).toBe(false);
  });

  it("should return true for empty array", () => {
    expect(allPositive([])).toBe(true);
  });

  it("should return false for zero", () => {
    expect(allPositive([0])).toBe(false);
  });

  it("should return false when zero is mixed with positive", () => {
    expect(allPositive([1, 2, 0, 3])).toBe(false);
  });

  it("should return true for single positive number", () => {
    expect(allPositive([5])).toBe(true);
  });

  it("should return false for single negative number", () => {
    expect(allPositive([-5])).toBe(false);
  });

  it("should return false for all negative numbers", () => {
    expect(allPositive([-1, -2, -3])).toBe(false);
  });

  it("should handle large positive numbers", () => {
    expect(allPositive([1000, 2000, 3000])).toBe(true);
  });

  it("should handle decimal positive numbers", () => {
    expect(allPositive([0.1, 0.2, 0.3])).toBe(true);
  });
});

describe("calculateTotal", () => {
  it("should calculate total of multiple items", () => {
    expect(
      calculateTotal([
        { name: "apple", price: 1.5 },
        { name: "bread", price: 2.5 },
      ]),
    ).toBe(4.0);
  });

  it("should calculate total of single item", () => {
    expect(calculateTotal([{ name: "milk", price: 3.0 }])).toBe(3.0);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("should handle items with price 0", () => {
    expect(
      calculateTotal([
        { name: "free sample", price: 0 },
        { name: "apple", price: 1.5 },
      ]),
    ).toBe(1.5);
  });

  it("should handle all items with price 0", () => {
    expect(
      calculateTotal([
        { name: "free1", price: 0 },
        { name: "free2", price: 0 },
      ]),
    ).toBe(0);
  });

  it("should handle decimal prices", () => {
    expect(
      calculateTotal([
        { name: "item1", price: 1.99 },
        { name: "item2", price: 2.5 },
        { name: "item3", price: 0.51 },
      ]),
    ).toBe(5.0);
  });

  it("should handle large totals", () => {
    expect(
      calculateTotal([
        { name: "expensive", price: 100.0 },
        { name: "very expensive", price: 200.0 },
      ]),
    ).toBe(300.0);
  });

  it("should handle many items", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      name: `item${i}`,
      price: 1.0,
    }));
    expect(calculateTotal(items)).toBe(10.0);
  });
});
