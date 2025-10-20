// @ts-nocheck
/**
 * Programming Puzzle — Library Checkout Tracker
 *
 * Context:
 * You manage a library system where patrons can BORROW and RETURN books.
 * Each patron is identified by a patron id string, and each book has a unique bookId.
 * Your task is to process checkout/return events, track who has which books,
 * record completed rentals, and reject invalid transactions deterministically.
 *
 * Input:
 * - events: Array<{ patronId: string; action: "borrow" | "return"; bookId: string; timestamp: number }>
 *   Invariants on a valid event:
 *     - patronId is a non-empty string
 *     - action is exactly "borrow" or "return"
 *     - bookId is a non-empty string
 *     - timestamp is a positive number
 *   Rules:
 *     1) "borrow": allowed only if the book is currently available (not checked out by anyone).
 *     2) "return": allowed only if this patron currently has this book checked out.
 *     3) Invalid events (missing fields / wrong types / negative timestamp) are ignored (not rejected).
 *     4) Rejections are recorded only for rule violations (1) and (2) above, in event order.
 *
 * Output:
 * Return an object:
 * {
 *   // books currently checked out (mapped to patron who has them and when borrowed)
 *   checkedOut: Record<string, { patronId: string; borrowedAt: number }>;
 *   // patrons with their currently borrowed books
 *   activePatrons: Record<string, Set<string>>;
 *   // completed rentals in the order they were returned
 *   completed: Array<{ patronId: string; bookId: string; borrowedAt: number; returnedAt: number; duration: number }>;
 *   // rejected events in input order
 *   // "reason" is "book unavailable" or "patron does not have book"
 *   rejected: Array<{ patronId: string; action: "borrow" | "return"; bookId: string; reason: string }>;
 *   // statistics
 *   stats: {
 *     totalBorrows: number;
 *     totalReturns: number;
 *     mostActivePatron: string | null; // patron with most completed rentals
 *   };
 * }
 *
 * Edge cases:
 * - Empty event list → all outputs empty, stats are zero/null.
 * - Patron tries to borrow a book already checked out (by them or someone else) → rejected as "book unavailable".
 * - Patron tries to return a book they don't have → rejected as "patron does not have book".
 * - Multiple patrons can have different books at the same time.
 * - A patron can have multiple books checked out simultaneously.
 *
 * Examples:
 * 1) events = [
 *      { patronId:"alice", action:"borrow", bookId:"book1", timestamp:100 },
 *      { patronId:"alice", action:"return", bookId:"book1", timestamp:200 }
 *    ]
 *    ⇒ completed: [{ patronId:"alice", bookId:"book1", borrowedAt:100, returnedAt:200, duration:100 }]
 *       checkedOut: {}, activePatrons: {}
 *
 * 2) events = [
 *      { patronId:"bob", action:"borrow", bookId:"book2", timestamp:50 },
 *      { patronId:"alice", action:"borrow", bookId:"book2", timestamp:60 }, // rejected: book unavailable
 *      { patronId:"alice", action:"return", bookId:"book3", timestamp:70 }  // rejected: patron does not have book
 *    ]
 *    ⇒ checkedOut: { book2: {patronId:"bob", borrowedAt:50} }
 *       activePatrons: { bob: Set{"book2"} }
 *       rejected: [
 *         { patronId:"alice", action:"borrow", bookId:"book2", reason:"book unavailable" },
 *         { patronId:"alice", action:"return", bookId:"book3", reason:"patron does not have book" }
 *       ]
 */

type Event = {
  patronId: string;
  action: "borrow" | "return";
  bookId: string;
  timestamp: number;
}

type Output = {
  checkedOut: Record<string, { patronId: string; borrowedAt: number }>;
  activePatrons: Record<string, Set<string>>;
  completed: Array<CompletedRental>;
  rejected: Array<RejectedEvent>;
  stats: {
    totalBorrows: number;
    totalReturns: number;
    mostActivePatron: string | null;
  };
}

// (1841) start now. 
export function processLibraryCheckouts(events: Event[]): Output {
  const checkedOut: Record<string, { patronId: string; borrowedAt: number }> = {}
  const activePatrons: Record<string, Set<string>> = {}
  const completed: Array<{ patronId: string; bookId: string; borrowedAt: number; returnedAt: number; duration: number }> = []
  const rejected: Array<{ patronId: string; action: "borrow" | "return"; bookId: string; reason: string }> = []
  const counts = {
    totalBorrows: 0,
    totalReturns: 0,
  }
  // calculate mostActivePatron at end? 

  for (let event of events) {
    if (!event || !event.bookId || !event.patronId || event.timestamp < 0 || (event.action !== "borrow" && event.action !== "return")) {
      continue
    }
    const bookId = event.bookId
    const patronId = event.patronId
    if (event.action === 'borrow') {
      if (checkedOut[bookId]) {
        console.log('event checking out unavailable book', event)
        const { timestamp, ...eventWithoutTimestamp } = event
        rejected.push({ ...eventWithoutTimestamp, reason: "book unavailable" })
      } else {
        checkedOut[bookId] = { patronId, borrowedAt: event.timestamp }
        if (!activePatrons[patronId]) {
          activePatrons[patronId] = new Set();
        }
        activePatrons[patronId].add(bookId)
        counts.totalBorrows += 1
      }
    } else if (event.action === 'return') {
      if (!activePatrons[patronId] || !activePatrons[patronId].has(event.bookId)) {
        const { timestamp, ...eventWithoutTimestamp } = event
        rejected.push({ ...eventWithoutTimestamp, reason: "patron does not have book" })
      } else {
        const borrowedAt = checkedOut[bookId]!.borrowedAt
        const returnedAt = event.timestamp
        const duration = returnedAt - borrowedAt
        completed.push({ patronId, bookId, borrowedAt, returnedAt, duration })
        activePatrons[patronId].delete(bookId)
        if (activePatrons[patronId].size === 0) { delete activePatrons[patronId] }
        delete checkedOut[bookId]
        counts.totalReturns += 1
      }
    }
  }

  // const mostActivePatron = completed
  //   .map((book) => book.patronId)
  //   .reduce((acc, patron) => {
  //     return ''
  //   }, '')[0] ?? null
  const completedCountMap = new Map<string, number>();
  for (let rental of completed) {
    const patronId = rental.patronId
    completedCountMap.set(patronId, (completedCountMap.get(patronId) ?? 0) + 1)
  }

  const mostActivePatron = Array.from(completedCountMap.entries())
    .reduce((acc, patron) => {
      const [name, completed] = patron
      if (completed > acc[1]) {
        return [name, completed]
      }
      return [name < acc[0] ? name : acc[0], acc[1]]
    }, [null, 0])[0]

  const stats = {
    ...counts, mostActivePatron
  }

  return {
    checkedOut, activePatrons, completed, rejected, stats
  }
}

// Test cases
// const events1 = [
//   { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 100 },
//   { patronId: "alice", action: "return", bookId: "book1", timestamp: 200 }
// ];
// console.log("Test 1:", processLibraryCheckouts(events1));

// const events2 = [
//   { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 50 },
//   { patronId: "alice", action: "borrow", bookId: "book2", timestamp: 60 }, // rejected
//   { patronId: "alice", action: "return", bookId: "book3", timestamp: 70 }  // rejected
// ];
// console.log("Test 2:", processLibraryCheckouts(events2));

// const events3 = [
//   { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
//   { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 20 },
//   { patronId: "alice", action: "borrow", bookId: "book3", timestamp: 30 },
//   { patronId: "alice", action: "return", bookId: "book1", timestamp: 40 },
//   { patronId: "bob", action: "return", bookId: "book2", timestamp: 50 },
//   { patronId: "alice", action: "return", bookId: "book3", timestamp: 60 }
// ];
// console.log("Test 3:", processLibraryCheckouts(events3));
