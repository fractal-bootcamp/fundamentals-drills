/**
 * Assignment 1.5_02 — Library Book Tracker
 *
 * Context:
 * You are tracking books checked out from a library. Each transaction records a patron
 * borrowing or returning a book. Given a list of transactions, return a summary showing
 * which books are currently checked out and who has them.
 *
 * Input:
 *   - transactions: Array<{ action: "borrow" | "return"; bookId: string; patronName: string }>
 *     Transactions are given in chronological order (no need to sort).
 *
 * Output:
 *   - Record<string, string> — An object mapping bookId to patronName for all checked-out books.
 *     Only include books that are currently checked out (borrowed but not yet returned).
 *
 * Rules:
 *   - A book can only be held by one patron at a time.
 *   - If a patron borrows a book, it becomes checked out to them.
 *   - If anyone returns a book, it becomes available (not checked out).
 *   - Ignore invalid transactions (e.g., returning a book that isn't checked out).
 *   - The same patron can borrow multiple different books.
 *   - If a book is borrowed multiple times without being returned, only the most recent borrower counts.
 *
 * Examples:
 *   checkedOutBooks([
 *     { action: "borrow", bookId: "book1", patronName: "Alice" },
 *     { action: "borrow", bookId: "book2", patronName: "Bob" },
 *     { action: "return", bookId: "book1", patronName: "Alice" }
 *   ]) -> { book2: "Bob" }
 *
 *   checkedOutBooks([
 *     { action: "borrow", bookId: "book1", patronName: "Alice" },
 *     { action: "borrow", bookId: "book1", patronName: "Bob" }
 *   ]) -> { book1: "Bob" }
 */

type Transaction = Array<{
  action: ActionType
  bookId: Book
  patronName: Patron
}>

type ActionType = "borrow" | "return"
type Book = string
type Patron = string

export function checkedOutBooks(transactions: Transaction): Record<string, string> {
  const bookLedger = new Map()
  console.log('bookLedger initialized', bookLedger)

  transactions.forEach(transaction => {
    const action = transaction.action
    const bookId = transaction.bookId
    const patron = transaction.patronName

    // book gets assigned to patron
    if (action === 'borrow') {
      bookLedger.set(bookId, patron)
      console.log('Ledger updated on BORROW:', bookLedger)
    }

    if (action === 'return') {
      // remove book from bookLedger
      if (bookLedger.has(bookId)) {
        console.log('Ledger has:', bookId)

        bookLedger.delete(bookId)
        console.log('Deleted:', bookId)
      }
      // if book not in bookLedger, ignore this transaction
    }

  })

  return Object.fromEntries(bookLedger)
}
