import { describe, it, expect } from "vitest";
import { processLibraryRequests } from "../problems/assignment2";
import type { Book, User } from "../problems/assignment1";

describe("Assignment 2: Library Processor", () => {
  const baseBook: Book = {
    id: "b1",
    title: "Ts",
    totalCopies: 2,
    availableCopies: 2,
  };
  const baseUser: User = {
    id: "u1",
    name: "A",
    type: "student",
    activeLoans: [],
  };

  it("processes a valid checkout", () => {
    const input = {
      requests: [{ userId: "u1", bookId: "b1" }],
      inventory: { b1: baseBook },
      users: [baseUser],
    };

    const result = processLibraryRequests(input);

    // Check errors
    expect(result.errors).toHaveLength(0);

    // Check user updated
    expect(result.users[0].activeLoans).toContain("b1");

    // Check inventory updated
    expect(result.inventory["b1"].availableCopies).toBe(1);
  });

  it("fails if user limit reached", () => {
    // Student with 2 books already
    const maxedUser: User = {
      ...baseUser,
      activeLoans: ["x", "y"],
    };
    const input = {
      requests: [{ userId: "u1", bookId: "b1" }],
      inventory: { b1: baseBook },
      users: [maxedUser],
    };

    const result = processLibraryRequests(input);

    expect(result.errors[0]).toContain("limit reached");
    expect(result.users[0].activeLoans).toHaveLength(2); // Unchanged
    expect(result.inventory["b1"].availableCopies).toBe(2); // Unchanged
  });

  it("fails if book unavailable", () => {
    const emptyBook = { ...baseBook, availableCopies: 0 };
    const input = {
      requests: [{ userId: "u1", bookId: "b1" }],
      inventory: { b1: emptyBook },
      users: [baseUser],
    };

    const result = processLibraryRequests(input);

    expect(result.errors[0]).toContain("unavailable");
    expect(result.users[0].activeLoans).toHaveLength(0);
  });

  it("handles multiple requests updating the same state", () => {
    // Two users borrow the SAME book (copies=2)
    const u2 = { ...baseUser, id: "u2" };
    const input = {
      requests: [
        { userId: "u1", bookId: "b1" },
        { userId: "u2", bookId: "b1" },
      ],
      inventory: { b1: baseBook },
      users: [baseUser, u2],
    };

    const result = processLibraryRequests(input);

    expect(result.errors).toHaveLength(0);
    expect(result.inventory["b1"].availableCopies).toBe(0); // 2 - 1 - 1 = 0
    expect(result.users[0].activeLoans).toContain("b1");
    expect(result.users[1].activeLoans).toContain("b1");
  });
});