// Problem: Library System Primitives
// We are building a checkout system for a library.
// We need helper functions to handle lookups, validation, and immutable state updates.
//
// Key Concepts:
// - Dictionary/Record access (finding things by ID)
// - Immutable updates (creating copies of objects/arrays)
// - Simple validation logic

// SHARED TYPES
export type Book = {
  id: string;
  title: string;
  totalCopies: number;
  availableCopies: number;
};

export type User = {
  id: string;
  name: string;
  type: "student" | "teacher";
  activeLoans: Array<string>; // list of book IDs currently borrowed
};

// ------------------------------------------------------------------

// Function 1: Get Book Availability
// Check if a book exists in the inventory AND has copies available.
//
// Input: Inventory object (Record<string, Book>), bookId (string)
// Output: boolean
//
// Examples:
// Inventory: { "b1": { availableCopies: 1 ... }, "b2": { availableCopies: 0 ... } }
// getBookAvailability(inv, "b1") => true
// getBookAvailability(inv, "b2") => false
// getBookAvailability(inv, "missing") => false

export function getBookAvailability(
  inventory: Record<string, Book>,
  bookId: string,
): boolean {
  const book = inventory[bookId];

  // if book exists and has more than 0 inventory book is avail
  if (book && book.availableCopies > 0) {
    return true;
  }
  return false;
}

// ------------------------------------------------------------------

// Function 2: Can User Borrow
// Check if a user is allowed to borrow more books.
// Rules:
// - "student" can have max 2 active loans.
// - "teacher" can have max 5 active loans.
//
// Input: User object
// Output: boolean
//
// Examples:
// User: { type: "student", activeLoans: ["b1"] } (1 loan) => true
// User: { type: "student", activeLoans: ["b1", "b2"] } (2 loans) => false

export function canUserBorrow(user: User): boolean {
  // can a user rent more books?
  const limit = user.type === "teacher" ? 5 : 2;

  if (user.activeLoans.length >= limit) {
    return false;
  }
  return true;
}

// ------------------------------------------------------------------

// Function 3: Decrement Book Copies
// Return a NEW Book object with availableCopies decreased by 1.
// Do NOT mutate the original.
// If copies are already 0, return the original book (or handle as you wish, but assume valid input for this helper).
//
// Input: Book object
// Output: New Book object
//
// Examples:
// Book: { id: "b1", availableCopies: 5 ... }
// => { id: "b1", availableCopies: 4 ... }

export function decrementBookCopies(book: Book): Book {
  // update book inventory
  if (book.availableCopies === 0) {
    return book;
  }

  const outgoingBook = {
    ...book,
    availableCopies: book.availableCopies - 1,
  };

  return outgoingBook;
}

// ------------------------------------------------------------------

// Function 4: Add Loan to User
// Return a NEW User object with the new bookId added to their activeLoans list.
// Do NOT mutate the original.
//
// Input: User object, bookId (string)
// Output: New User object
//
// Examples:
// User: { activeLoans: ["b1"] ... }, bookId: "b2"
// => { activeLoans: ["b1", "b2"] ... }

export function addLoanToUser(user: User, bookId: string): User {
  return {
    ...user,
    activeLoans: [...user.activeLoans, bookId],
  };
}
