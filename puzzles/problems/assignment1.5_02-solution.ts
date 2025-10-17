/**
 * Assignment 1.5_02 — Library Book Tracker (SOLUTION)
 *
 * This solution demonstrates:
 * 1. Using Map for efficient state tracking
 * 2. Converting Map back to a plain object for return value
 * 3. Simple conditional logic without nested loops
 */

export function checkedOutBooks(
  transactions: Array<{ action: "borrow" | "return"; bookId: string; patronName: string }>
): Record<string, string> {
  // Use a Map to track which books are checked out and who has them
  // Key: bookId, Value: patronName
  const checkedOut = new Map<string, string>();

  // Process each transaction in order
  for (const transaction of transactions) {
    if (transaction.action === "borrow") {
      // When someone borrows a book, record it (overwrites if already borrowed)
      checkedOut.set(transaction.bookId, transaction.patronName);
    } else {
      // When someone returns a book, remove it from checked out books
      // Only remove if it's actually checked out (ignore invalid returns)
      if (checkedOut.has(transaction.bookId)) {
        checkedOut.delete(transaction.bookId);
      }
    }
  }

  // Convert Map to a plain object for return
  // Object.fromEntries() takes an array of [key, value] pairs and makes an object
  return Object.fromEntries(checkedOut);
}

/**
 * Alternative solution using forEach instead of for...of:
 */
export function checkedOutBooksAlt(
  transactions: Array<{ action: "borrow" | "return"; bookId: string; patronName: string }>
): Record<string, string> {
  const checkedOut = new Map<string, string>();

  transactions.forEach(transaction => {
    if (transaction.action === "borrow") {
      checkedOut.set(transaction.bookId, transaction.patronName);
    } else if (checkedOut.has(transaction.bookId)) {
      checkedOut.delete(transaction.bookId);
    }
  });

  return Object.fromEntries(checkedOut);
}

/**
 * Alternative solution using reduce (more functional style):
 */
export function checkedOutBooksReduce(
  transactions: Array<{ action: "borrow" | "return"; bookId: string; patronName: string }>
): Record<string, string> {
  const checkedOut = transactions.reduce((map, transaction) => {
    if (transaction.action === "borrow") {
      map.set(transaction.bookId, transaction.patronName);
    } else if (map.has(transaction.bookId)) {
      map.delete(transaction.bookId);
    }
    return map;
  }, new Map<string, string>());

  return Object.fromEntries(checkedOut);
}
