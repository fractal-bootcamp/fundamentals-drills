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

import { L } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";
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
      state = processReturn(state, event.bookId, event.patronId, currentDate);
    } else if (event.type === "renew") {
      state = processRenewal(state, event.bookId, event.patronId, currentDate);
    } else if (event.type === "checkout") {
      state = processCheckout(state, event.bookId, event.holdRequests, currentDate);
    } else if (event.type === "addHold") {
      state = processAddHold(state, event.bookId, event.holdRequest);
      // console.log(`hold for ${event.bookId}`);
      // console.log(`request for ${event.holdRequest}`);
      // console.log(`hold queues: ${state.holdQueues}`);
    }
  }
  console.log("event logs:", state.eventLog);

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
): LibraryState {
  const loan = state.activeLoans.get(bookId);
  if (!loan) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Return failed: No active loan for book ${bookId}`],
    };
  }

  if (patronId !== loan.patronId) {
    return {
      ...state,
      eventLog: [
        ...state.eventLog,
        `Return failed: Book ${bookId} not loaned to patron ${patronId}`,
      ],
    };
  }

  // update patron balance
  const daysOverdue = calculateDaysOverdue(loan.dueDate, currentDate);
  const lateFee = calculateLateFee(daysOverdue, loan.type);
  const stateWithFee = updatePatronBalance(state, patronId, loan, currentDate);

  // remove from active loans
  const updatedLoans = new Map(stateWithFee.activeLoans);
  updatedLoans.delete(bookId);

  const returnMessage =
    stateWithFee.eventLog.length > state.eventLog.length
      ? `Book ${bookId} returned by ${patronId} Late fee: $${lateFee.toFixed(2)}` // late
      : `Book ${bookId} returned by ${patronId} on time`;

  return {
    ...stateWithFee,
    activeLoans: updatedLoans,
    eventLog: [...stateWithFee.eventLog, returnMessage],
  };
}

function processRenewal(
  state: LibraryState,
  bookId: string,
  patronId: string,
  currentDate: Date,
): LibraryState {
  const loan = state.activeLoans.get(bookId);
  if (!loan) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Renewal failed: No active loan for book ${bookId}`],
    };
  }

  if (loan.patronId !== patronId) {
    return {
      ...state,
      eventLog: [
        ...state.eventLog,
        `Renewal failed: Book ${bookId} not loaned to patron ${patronId}`,
      ],
    };
  }

  const bookIsEligible = isBookEligibleForRenewal(loan, currentDate);

  if (bookIsEligible) {
    const updatedLoan = {
      ...loan,
      renewalCount: loan.renewalCount + 1,
      dueDate: new Date(currentDate.getTime() + ONE_DAY_MS * 14),
    };
    const updatedLoans = new Map(state.activeLoans);

    updatedLoans.set(bookId, updatedLoan);

    return {
      ...state,
      activeLoans: updatedLoans,
      eventLog: [...state.eventLog, `${bookId} renewed for ${patronId}`],
    };
  } else {
    return {
      ...state,
      eventLog: [...state.eventLog, `Renewal denied for book ${bookId}`],
    };
  }
}

function processCheckout(
  state: LibraryState,
  bookId: string,
  holdRequests: Array<HoldRequest>,
  currentDate: Date,
): LibraryState {
  // is the book already on loan?
  if (state.activeLoans.has(bookId)) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Checkout failed: Book ${bookId} already on loan`],
    };
  }

  console.log(`Hold Requests prior to que: ${holdRequests}`);

  // create new loan for highest priority patron
  const prioritized = prioritizeHoldQueue(holdRequests);
  const nextPatron = prioritized[0];

  console.log(`Our prioritized que: ${prioritized}`);

  if (!nextPatron) {
    return {
      ...state,
      eventLog: [
        ...state.eventLog,
        `Checkout failed: No hold requests for book ${bookId}`,
      ],
    };
  }

  // create newLoan & add book to active loans
  const newLoan: Loan = {
    bookId,
    patronId: nextPatron.patronId,
    dueDate: new Date(currentDate.getTime() + ONE_DAY_MS * 14),
    renewalCount: 0,
    type: "standard",
  };

  const updatedLoans = new Map(state.activeLoans);

  updatedLoans.set(bookId, newLoan);

  return {
    ...state,
    activeLoans: updatedLoans,
    eventLog: [...state.eventLog, `Book ${bookId} checked out to ${nextPatron.patronId}`],
  };
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

  return {
    ...state,
    holdQueues: updatedHoldQueues,
    eventLog: [
      ...state.eventLog,
      `Hold added for book ${bookId} by patron ${holdRequest.patronId}`,
    ],
  };
}

/**
 * Updates patron balance by subtracting the late fee
 */
function updatePatronBalance(
  state: LibraryState,
  patronId: string,
  loan: Loan,
  currentDate: Date,
): LibraryState {
  const daysOverdue = calculateDaysOverdue(loan.dueDate, currentDate);
  const lateFee = calculateLateFee(daysOverdue, loan.type);

  const patron = state.patrons.get(patronId);
  if (!patron) return state; // no patron = no fee

  // create new patron object
  const updatedPatron = { ...patron, accountBalance: patron.accountBalance - lateFee };
  const updatedPatrons = new Map(state.patrons);
  updatedPatrons.set(patronId, updatedPatron);

  const updatedEventLog =
    lateFee > 0
      ? [...state.eventLog, `Late fee: $${lateFee.toFixed(2)}`]
      : state.eventLog;

  return {
    ...state,
    patrons: updatedPatrons,
    eventLog: updatedEventLog,
  };
}
