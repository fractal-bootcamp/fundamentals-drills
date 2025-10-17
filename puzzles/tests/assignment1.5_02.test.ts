import { describe, it, expect } from "vitest";
import { checkedOutBooks } from "../problems/assignment1.5_02";

describe("checkedOutBooks", () => {
  it("returns empty object for no transactions", () => {
    expect(checkedOutBooks([])).toEqual({});
  });

  it("tracks a single book borrowed", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" }
      ])
    ).toEqual({ book1: "Alice" });
  });

  it("removes book when returned", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "return", bookId: "book1", patronName: "Alice" }
      ])
    ).toEqual({});
  });

  it("tracks multiple books checked out to different patrons", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book2", patronName: "Bob" },
        { action: "borrow", bookId: "book3", patronName: "Charlie" }
      ])
    ).toEqual({
      book1: "Alice",
      book2: "Bob",
      book3: "Charlie"
    });
  });

  it("handles book borrowed and returned by same patron", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book2", patronName: "Bob" },
        { action: "return", bookId: "book1", patronName: "Alice" }
      ])
    ).toEqual({ book2: "Bob" });
  });

  it("ignores return of book that was never borrowed", () => {
    expect(
      checkedOutBooks([
        { action: "return", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book2", patronName: "Bob" }
      ])
    ).toEqual({ book2: "Bob" });
  });

  it("handles same book borrowed by different patrons (most recent wins)", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book1", patronName: "Bob" }
      ])
    ).toEqual({ book1: "Bob" });
  });

  it("allows same patron to borrow multiple books", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book2", patronName: "Alice" },
        { action: "borrow", bookId: "book3", patronName: "Alice" }
      ])
    ).toEqual({
      book1: "Alice",
      book2: "Alice",
      book3: "Alice"
    });
  });

  it("handles complex scenario with multiple borrows and returns", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book2", patronName: "Bob" },
        { action: "return", bookId: "book1", patronName: "Alice" },
        { action: "borrow", bookId: "book3", patronName: "Charlie" },
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "return", bookId: "book2", patronName: "Bob" }
      ])
    ).toEqual({
      book1: "Alice",
      book3: "Charlie"
    });
  });

  it("ignores return when book is already available", () => {
    expect(
      checkedOutBooks([
        { action: "borrow", bookId: "book1", patronName: "Alice" },
        { action: "return", bookId: "book1", patronName: "Alice" },
        { action: "return", bookId: "book1", patronName: "Bob" }
      ])
    ).toEqual({});
  });
});
