import { describe, it, expect } from "vitest";
import {
  getBookAvailability,
  canUserBorrow,
  decrementBookCopies,
  addLoanToUser,
  type Book,
  type User,
} from "../problems/assignment1";

describe("Assignment 1: Library Primitives", () => {
  describe("getBookAvailability", () => {
    const inventory: Record<string, Book> = {
      b1: { id: "b1", title: "A", totalCopies: 5, availableCopies: 1 },
      b2: { id: "b2", title: "B", totalCopies: 5, availableCopies: 0 },
    };

    it("returns true if copies > 0", () => {
      expect(getBookAvailability(inventory, "b1")).toBe(true);
    });

    it("returns false if copies == 0", () => {
      expect(getBookAvailability(inventory, "b2")).toBe(false);
    });

    it("returns false if book does not exist", () => {
      expect(getBookAvailability(inventory, "Z99")).toBe(false);
    });
  });

  describe("canUserBorrow", () => {
    it("allows student with < 2 books", () => {
      const u: User = {
        id: "u1",
        name: "S",
        type: "student",
        activeLoans: ["b1"],
      };
      expect(canUserBorrow(u)).toBe(true);
    });

    it("blocks student with 2 books", () => {
      const u: User = {
        id: "u1",
        name: "S",
        type: "student",
        activeLoans: ["b1", "b2"],
      };
      expect(canUserBorrow(u)).toBe(false);
    });

    it("allows teacher with 4 books", () => {
      const u: User = {
        id: "u2",
        name: "T",
        type: "teacher",
        activeLoans: ["1", "2", "3", "4"],
      };
      expect(canUserBorrow(u)).toBe(true);
    });
  });

  describe("decrementBookCopies", () => {
    it("reduces count by 1 immutably", () => {
      const book: Book = {
        id: "b1",
        title: "X",
        totalCopies: 5,
        availableCopies: 5,
      };
      const result = decrementBookCopies(book);

      expect(result.availableCopies).toBe(4);
      expect(result).not.toBe(book); // Reference check
    });
  });

  describe("addLoanToUser", () => {
    it("adds bookId to list immutably", () => {
      const user: User = {
        id: "u1",
        name: "S",
        type: "student",
        activeLoans: ["b1"],
      };
      const result = addLoanToUser(user, "b2");

      expect(result.activeLoans).toEqual(["b1", "b2"]);
      expect(result.activeLoans).toHaveLength(2);
      expect(result).not.toBe(user);
    });
  });
});
