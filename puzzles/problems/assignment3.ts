/**
 * Programming Puzzle — Library Book Borrowing System
 *
 * You are building a simple library system that processes book checkouts and returns.
 * Each patron can borrow books and return them. The system tracks which books are available,
 * who has borrowed what, and handles errors gracefully.
 *
 * Input:
 *   {
 *     books: { [isbn: string]: { title: string, copies: number } }  // Available books and copy count
 *     transactions: Array<Transaction>
 *   }
 *
 *   Transaction is one of:
 *     { type: "checkout", patron: string, isbn: string }
 *     { type: "return", patron: string, isbn: string }
 *     { type: "reserve", patron: string, isbn: string }  // Does nothing (not implemented)
 *
 * Output:
 *   {
 *     books: { ...updated book inventory... },
 *     borrowed: { [patron: string]: string[] },  // Map of patrons to their borrowed book ISBNs
 *     transactions: Array<{
 *       success: boolean,
 *       patron: string,
 *       isbn: string,
 *       type: string,
 *       error?: string
 *     }>
 *   }
 *
 * Rules:
 *   - A patron can checkout a book if copies > 0
 *   - Checkout decrements available copies and adds book to patron's borrowed list
 *   - A patron can only return a book they currently have checked out
 *   - Return increments available copies and removes book from patron's borrowed list
 *   - Cannot checkout a book with ISBN that doesn't exist (error)
 *   - Cannot checkout when no copies available (error)
 *   - Cannot return a book the patron doesn't have (error)
 *   - "reserve" transactions are not implemented, so they fail with an error
 *   - Each transaction is recorded with success/failure status
 *
 * Examples:
 *   Simple checkout:
 *     books={ "978-1": {title: "Book A", copies: 2} }
 *     transactions=[ {type: "checkout", patron: "alice", isbn: "978-1"} ]
 *     => books["978-1"].copies = 1, borrowed["alice"] = ["978-1"]
 *
 *   Checkout and return:
 *     books={ "978-1": {title: "Book A", copies: 1} }
 *     transactions=[
 *       {type: "checkout", patron: "alice", isbn: "978-1"},
 *       {type: "return", patron: "alice", isbn: "978-1"}
 *     ]
 *     => books["978-1"].copies = 1, borrowed["alice"] = []
 */

type Book = {
  title: string;
  copies: number;
};

type CheckoutTransaction = {
  type: "checkout";
  patron: string;
  isbn: string;
};

type ReturnTransaction = {
  type: "return";
  patron: string;
  isbn: string;
};

type ReserveTransaction = {
  type: "reserve";
  patron: string;
  isbn: string;
};

type Transaction = CheckoutTransaction | ReturnTransaction | ReserveTransaction;

type TransactionRecord = {
  success: boolean;
  patron: string;
  isbn: string;
  type: string;
  error?: string;
};

export function processLibraryTransactions(input) {
  const { books, transactions } = input;

  // Clone books to avoid mutating input
  const currentBooks: { [isbn: string]: Book } = JSON.parse(JSON.stringify(books || {}));

  // Track what each patron has borrowed
  const borrowed: { [patron: string]: string[] } = {};

  // Record of all transaction results
  const transactionRecords: TransactionRecord[] = [];

  for (const transaction of transactions || []) {
    const { type, patron, isbn } = transaction;

    const record: TransactionRecord = {
      success: false,
      patron,
      isbn,
      type,
    };

    if (type === "checkout") {
      // Check if book exists
      if (!(isbn in currentBooks)) {
        record.error = `book ${isbn} not found`;
        transactionRecords.push(record);
        continue;
      }

      // Check if copies available
      if (currentBooks[isbn].copies <= 0) {
        record.error = `no copies available for ${isbn}`;
        transactionRecords.push(record);
        continue;
      }

      // Success - checkout the book
      currentBooks[isbn].copies -= 1;

      if (!borrowed[patron]) {
        borrowed[patron] = [];
      }
      borrowed[patron].push(isbn);

      record.success = true;
      transactionRecords.push(record);

    } else if (type === "return") {
      // Check if patron has this book
      if (!borrowed[patron] || !borrowed[patron].includes(isbn)) {
        record.error = `patron ${patron} does not have book ${isbn}`;
        transactionRecords.push(record);
        continue;
      }

      // Success - return the book
      currentBooks[isbn].copies += 1;

      const index = borrowed[patron].indexOf(isbn);
      borrowed[patron].splice(index, 1);

      record.success = true;
      transactionRecords.push(record);

    } else if (type === "reserve") {
      record.error = "reserve not implemented";
      transactionRecords.push(record);
    } else {
      record.error = `unknown transaction type: ${type}`;
      transactionRecords.push(record);
    }
  }

  return {
    books: currentBooks,
    borrowed,
    transactions: transactionRecords,
  };
}
