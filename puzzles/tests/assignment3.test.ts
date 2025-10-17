import { describe, it, expect } from "vitest";
import { processLibraryTransactions } from "../problems/assignment3";

describe("processLibraryTransactions", () => {
  it("should handle a simple checkout", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 2 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.books["978-1"].copies).toBe(1);
    expect(result.borrowed["alice"]).toEqual(["978-1"]);
    expect(result.transactions[0].success).toBe(true);
    expect(result.transactions[0].error).toBeUndefined();
  });

  it("should handle checkout and return", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "return", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.books["978-1"].copies).toBe(1);
    expect(result.borrowed["alice"]).toEqual([]);
    expect(result.transactions[0].success).toBe(true);
    expect(result.transactions[1].success).toBe(true);
  });

  it("should handle empty transactions", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [],
    });

    expect(result.books["978-1"].copies).toBe(1);
    expect(result.borrowed).toEqual({});
    expect(result.transactions).toEqual([]);
  });

  it("should reject checkout when book not found", () => {
    const result = processLibraryTransactions({
      books: {},
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-999" },
      ],
    });

    expect(result.transactions[0].success).toBe(false);
    expect(result.transactions[0].error).toContain("not found");
    expect(result.borrowed).toEqual({});
  });

  it("should reject checkout when no copies available", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 0 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.transactions[0].success).toBe(false);
    expect(result.transactions[0].error).toContain("no copies available");
    expect(result.borrowed).toEqual({});
  });

  it("should reject return when patron doesn't have the book", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [
        { type: "return", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.transactions[0].success).toBe(false);
    expect(result.transactions[0].error).toContain("does not have");
  });

  it("should handle multiple patrons", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 2 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-1" },
      ],
    });

    expect(result.books["978-1"].copies).toBe(0);
    expect(result.borrowed["alice"]).toEqual(["978-1"]);
    expect(result.borrowed["bob"]).toEqual(["978-1"]);
    expect(result.transactions[0].success).toBe(true);
    expect(result.transactions[1].success).toBe(true);
  });

  it("should handle patron borrowing multiple books", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
        "978-2": { title: "Book B", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "alice", isbn: "978-2" },
      ],
    });

    expect(result.borrowed["alice"]).toContain("978-1");
    expect(result.borrowed["alice"]).toContain("978-2");
    expect(result.borrowed["alice"].length).toBe(2);
  });

  it("should handle reserve transaction (not implemented)", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [
        { type: "reserve", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.transactions[0].success).toBe(false);
    expect(result.transactions[0].error).toContain("not implemented");
    expect(result.books["978-1"].copies).toBe(1);
  });

  it("should handle third patron trying to checkout when no copies left", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 2 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-1" },
        { type: "checkout", patron: "carol", isbn: "978-1" },
      ],
    });

    expect(result.books["978-1"].copies).toBe(0);
    expect(result.transactions[0].success).toBe(true);
    expect(result.transactions[1].success).toBe(true);
    expect(result.transactions[2].success).toBe(false);
    expect(result.transactions[2].error).toContain("no copies available");
    expect(result.borrowed["carol"]).toBeUndefined();
  });

  it("should handle return making book available again", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-1" }, // Should fail
        { type: "return", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-1" }, // Should succeed
      ],
    });

    expect(result.transactions[0].success).toBe(true);
    expect(result.transactions[1].success).toBe(false);
    expect(result.transactions[2].success).toBe(true);
    expect(result.transactions[3].success).toBe(true);
    expect(result.borrowed["alice"]).toEqual([]);
    expect(result.borrowed["bob"]).toEqual(["978-1"]);
  });

  it("should track transaction records accurately", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-999" },
      ],
    });

    expect(result.transactions.length).toBe(2);
    expect(result.transactions[0]).toEqual({
      success: true,
      patron: "alice",
      isbn: "978-1",
      type: "checkout",
    });
    expect(result.transactions[1]).toEqual({
      success: false,
      patron: "bob",
      isbn: "978-999",
      type: "checkout",
      error: "book 978-999 not found",
    });
  });

  it("should handle patron returning one book while keeping another", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 1 },
        "978-2": { title: "Book B", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "alice", isbn: "978-2" },
        { type: "return", patron: "alice", isbn: "978-1" },
      ],
    });

    expect(result.borrowed["alice"]).toEqual(["978-2"]);
    expect(result.books["978-1"].copies).toBe(1);
    expect(result.books["978-2"].copies).toBe(0);
  });

  it("should handle complex scenario with multiple patrons and books", () => {
    const result = processLibraryTransactions({
      books: {
        "978-1": { title: "Book A", copies: 2 },
        "978-2": { title: "Book B", copies: 1 },
      },
      transactions: [
        { type: "checkout", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "bob", isbn: "978-1" },
        { type: "checkout", patron: "alice", isbn: "978-2" },
        { type: "checkout", patron: "carol", isbn: "978-1" }, // No copies
        { type: "return", patron: "alice", isbn: "978-1" },
        { type: "checkout", patron: "carol", isbn: "978-1" }, // Now succeeds
        { type: "return", patron: "alice", isbn: "978-2" },
        { type: "checkout", patron: "bob", isbn: "978-2" },
      ],
    });

    expect(result.borrowed["alice"]).toEqual([]);
    expect(result.borrowed["bob"]).toEqual(["978-1", "978-2"]);
    expect(result.borrowed["carol"]).toEqual(["978-1"]);
    expect(result.books["978-1"].copies).toBe(0);
    expect(result.books["978-2"].copies).toBe(0);
    expect(result.transactions.filter((t: any) => t.success).length).toBe(7);
    expect(result.transactions.filter((t: any) => !t.success).length).toBe(1);
  });
});
