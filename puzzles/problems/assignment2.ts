/*
Assignment 2: Actions & Orchestration
Domain: Library Daily Loan Processing System

Main Action:
- Process daily loan events (returns, renewals, checkouts)
- Maintain library state (active loans, patron balances, hold queues)
- Use Assignment 1 calculations to determine fees and eligibility

Rules:
1. When a book is returned, calculate and charge any late fees to patron balance
2. When a renewal is requested, check eligibility and either approve or deny
3. When a checkout is requested, assign book from hold queue using priority
4. State updates occur sequentially as events are processed

Example Input:
initialPatrons: [
  { id: "p1", name: "Alice", membershipTier: "basic", accountBalance: 0 },
  { id: "p2", name: "Bob", membershipTier: "elite", accountBalance: -5 }
]
initialLoans: [
  { bookId: "b1", patronId: "p1", dueDate: Date("2024-01-10"), renewalCount: 0, type: "standard" }
]
events: [
  { type: "return", bookId: "b1", patronId: "p1" },
  { type: "checkout", bookId: "b1", holdRequests: [
    { patronId: "p2", requestDate: Date("2024-01-12"), membershipTier: "elite" }
  ]}
]
currentDate: Date("2024-01-20")

Example Output:
{
  finalState: {
    activeLoans: Map { "b1" => { bookId: "b1", patronId: "p2", dueDate: Date("2024-02-03"), ... } },
    patrons: Map {
      "p1" => { id: "p1", accountBalance: -5.00, ... },  // charged $5 late fee (10 days * $0.50)
      "p2" => { id: "p2", accountBalance: -5, ... }
    },
    holdQueues: Map {},
    eventLog: [
      "Book b1 returned by p1. Late fee: $5.00",
      "Book b1 checked out to p2"
    ]
  },
  eventsProcessed: 2
}

*/

import {
  calculateDaysOverdue,
  calculateLateFee,
  isBookEligibleForRenewal,
  prioritizeHoldQueue,
  type Loan,
  type Patron,
  type Book,
  type HoldRequest,
  ONE_DAY_MS,
} from "./assignment1";

// Event Types
export type LoanEvent =
  | { type: "return"; bookId: string; patronId: string }
  | { type: "renew"; bookId: string; patronId: string }
  | { type: "checkout"; bookId: string; holdRequests: Array<HoldRequest> }
  | { type: "addHold"; bookId: string; holdRequest: HoldRequest };

// State Types
export interface LibraryState {
  activeLoans: Map<string, Loan>; // bookId -> Loan
  patrons: Map<string, Patron>; // patronId -> Patron
  holdQueues: Map<string, Array<HoldRequest>>; // bookId -> HoldRequest[]
  eventLog: Array<string>; // Audit trail of what happened
}

export interface ProcessingResult {
  finalState: LibraryState;
  eventsProcessed: number;
}

// Main Action Function
export function processDailyEvents(
  initialPatrons: Array<Patron>,
  initialLoans: Array<Loan>,
  events: Array<LoanEvent>,
  currentDate: Date,
): ProcessingResult {
  // init state from arrays
  let state: LibraryState = {
    activeLoans: new Map(initialLoans.map((loan) => [loan.bookId, loan])),
    patrons: new Map(initialPatrons.map((patron) => [patron.id, patron])),
    holdQueues: new Map(),
    eventLog: [],
  };

  // process events
  for (const event of events) {
    if (event.type === "return") {
      processReturn(state, event.bookId, event.patronId, currentDate);
    } else if (event.type === "renew") {
      processRenewal(state, event.bookId, event.patronId, currentDate);
    } else if (event.type === "checkout") {
      processCheckout(state, event.bookId, event.holdRequests, currentDate);
    } else if (event.type === "addHold") {
      processAddHold(state, event.bookId, event.holdRequest);
      console.log(`hold for ${event.bookId}`);
      console.log(`request for ${event.holdRequest}`);
      console.log(`hold queues: ${state.holdQueues}`);
    }
  }
  // process returns, renewals, checkouts

  return {
    finalState: state,
    eventsProcessed: events.length,
  };
}

function processReturn(
  state: LibraryState,
  bookId: string,
  patronId: string,
  currentDate: Date,
): void {
  const loan = state.activeLoans.get(bookId);
  if (!loan) {
    state.eventLog.push(`Return failed: No active loan for book ${bookId}`);
    return;
  }

  if (patronId !== loan.patronId) {
    state.eventLog.push(`Return failed: Book ${bookId} not loaned to patron ${patronId}`);
    return;
  }

  // update patron balance
  const lateFee = updatePatronBalance(state, patronId, loan, currentDate);

  if (lateFee) {
    state.eventLog.push(`Late fee: $${lateFee.toFixed(2)}`);
  }

  // remove from active loans
  state.activeLoans.delete(bookId);

  // add to event eventLog
  state.eventLog.push(`Book ${bookId} returned by ${patronId} on time`);
}

function processRenewal(
  state: LibraryState,
  bookId: string,
  patronId: string,
  currentDate: Date,
) {
  const loan = state.activeLoans.get(bookId);
  if (!loan) {
    state.eventLog.push(`Renewal failed: No active loan for book ${bookId}`);
    return;
  }

  if (loan.patronId !== patronId) {
    state.eventLog.push(
      `Renewal failed: Book ${bookId} not loaned to patron ${patronId}`,
    );
    return;
  }

  const bookIsEligible = isBookEligibleForRenewal(loan, currentDate);

  if (bookIsEligible) {
    loan.renewalCount++;
    loan.dueDate = new Date(currentDate.getTime() + ONE_DAY_MS * 14);
    state.eventLog.push(`${bookId} renewed for ${patronId}`);
  } else {
    state.eventLog.push(`Renewal denied for book ${bookId}`);
  }
}

function processCheckout(
  state: LibraryState,
  bookId: string,
  holdRequests: Array<HoldRequest>,
  currentDate: Date,
): void {
  // is the book already on loan?
  if (state.activeLoans.has(bookId)) {
    state.eventLog.push(`Checkout failed: Book ${bookId} already on loan`);
    return;
  }

  // are there hold requests?
  if (holdRequests.length === 0) {
    state.eventLog.push(`Checkout failed: No Hold Requests for ${bookId}`);
  }

  // create new loan for highest priority patron
  const prioritized = prioritizeHoldQueue(holdRequests);
  const nextPatron = prioritized[0];

  if (!nextPatron) {
    state.eventLog.push(`Checkout failed: No hold requests for book ${bookId}`);
    return;
  }

  // create newLoan & add book to active loans
  const newLoan: Loan = {
    bookId,
    patronId: nextPatron.patronId,
    dueDate: new Date(currentDate.getTime() + ONE_DAY_MS * 14),
    renewalCount: 0,
    type: "standard",
  };

  state.activeLoans.set(bookId, newLoan);
  state.eventLog.push(`Book ${bookId} checked out to ${nextPatron.patronId}`);
}

function processAddHold(state: LibraryState, bookId: string, holdRequest: HoldRequest) {
  const updatedHoldQueues = new Map(state.holdQueues);
  const currentQueue = state.holdQueues.get(bookId) || [];
  console.log("current queue:", currentQueue);

  const newQueue = [...currentQueue, holdRequest];
  console.log("new queue:", newQueue);

  console.log(`Adding hold for bookId: "${bookId}"`);

  updatedHoldQueues.set(bookId, newQueue);
  console.log("updated hold queues:");

  return { ...state, holdQueues: updatedHoldQueues };
}

/**
 * Updates patron balance by subtracting the late fee
 */
function updatePatronBalance(
  state: LibraryState,
  patronId: string,
  loan: Loan,
  currentDate: Date,
): number {
  const daysOverdue = calculateDaysOverdue(loan.dueDate, currentDate);
  const lateFee = calculateLateFee(daysOverdue, loan.type);

  const patron = state.patrons.get(patronId);

  if (!patron) {
    return 0; // no patron = no fee
  }

  // create new patron object
  const updatedPatron = { ...patron, accountBalance: patron.accountBalance - lateFee };

  // update that patron's key w/ updatedPatron object
  state.patrons.set(patronId, updatedPatron);

  return lateFee;
}
