/*
Assignment 2: Library Transaction Processor

Context:
We need to process a batch of "Checkout Requests".
We have the library's Inventory (a Record of Books) and a list of Users.
For each request, we must check if the book is available and if the user is allowed to borrow it.
If successful, we update BOTH the book's inventory count and the user's history.

Input:
{
  requests: Array<{ userId: string; bookId: string }>;
  inventory: Record<string, Book>;
  users: Array<User>;
}

Rules:
- Process requests in order.
- For each request:
  1. Find the User object in the `users` list. (If user not found, fail request).
  2. Check if the Book is available in `inventory`. (If not found or 0 copies, fail).
  3. Check if the User is allowed to borrow (based on quota).
  4. If all checks pass:
     - Update the Book in inventory (decrement copies).
     - Update the User in the user list (add to activeLoans).
     - Record success.
  5. If any check fails:
     - Record failure reason.

- Return:
  {
    inventory: Record<string, Book>, // Final state of books
    users: User[], // Final state of users
    errors: string[] // List of error messages for failed requests
  }

Edge Cases:
- User Id not found -> Error "User not found"
- Book Id not found -> Error "Book not found"
- No copies left -> Error "Book unavailable"
- User limit reached -> Error "User limit reached"

NOTE:
Use the helper functions from Assignment 1 to keep your code clean.
Focus on correct state updates (replacing objects in arrays/records).
*/

import {
  type Book,
  type User,
  getBookAvailability,
  canUserBorrow,
  decrementBookCopies,
  addLoanToUser,
} from "./assignment1";

type Request = {};

type LibraryInput = {};

type LibraryOutput = {};

export function processLibraryRequests() {}
