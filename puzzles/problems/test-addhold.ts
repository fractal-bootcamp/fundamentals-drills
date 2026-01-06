/**
 * Quick internal test for processAddHold function
 * Run with: tsx puzzles/problems/test-addhold.ts
 */

import { type HoldRequest, type LibraryState } from "./assignment2";

function processAddHold(state: LibraryState, bookId: string, holdRequest: HoldRequest) {
  const updatedHoldQueues = new Map(state.holdQueues);
  const currentQueue = state.holdQueues.get(bookId) || [];
  console.log("current queue:", currentQueue);

  const newQueue = [...currentQueue, holdRequest];
  console.log("new queue:", newQueue);

  updatedHoldQueues.set(bookId, newQueue);
  console.log("updated hold queues:", updatedHoldQueues);

  return { ...state, holdQueues: updatedHoldQueues };
}

// Test setup
const initialState: LibraryState = {
  activeLoans: new Map(),
  patrons: new Map(),
  holdQueues: new Map(),
  eventLog: [],
};

const testHoldRequest: HoldRequest = {
  patronId: "p1",
  requestDate: new Date("2024-01-10"),
  membershipTier: "basic",
};

console.log("\n=== Test 1: Adding hold to empty queue ===");
const result1 = processAddHold(initialState, "b1", testHoldRequest);
// console.log("Result state holdQueues:", result1.holdQueues);

console.log("\n=== Test 2: Adding second hold to existing queue ===");
const testHoldRequest2: HoldRequest = {
  patronId: "p2",
  requestDate: new Date("2024-01-15"),
  membershipTier: "elite",
};
const result2 = processAddHold(result1, "b1", testHoldRequest2);
// console.log("Result state holdQueues:", result2.holdQueues);

console.log("\n=== Test 3: Adding hold for different book ===");
const testHoldRequest3: HoldRequest = {
  patronId: "p3",
  requestDate: new Date("2024-01-12"),
  membershipTier: "premium",
};
const result3 = processAddHold(result2, "b2", testHoldRequest3);
// console.log("Result state holdQueues:", result3.holdQueues);
console.log("Final queue for b1:", result3.holdQueues.get("b1"));
console.log("Final queue for b2:", result3.holdQueues.get("b2"));
