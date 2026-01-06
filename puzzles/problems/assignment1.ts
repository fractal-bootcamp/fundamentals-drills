/*
Assignment 1: Data & Calculations
Domain: Library Book Loan Management System

Calculations to Implement:
1. calculateDaysOverdue - Determines how many days a book is overdue
2. calculateLateFee - Computes the late fee based on overdue days and book type
3. isBookEligibleForRenewal - Checks if a book can be renewed based on loan history
4. prioritizeHoldQueue - Sorts library patrons by priority for reserved books
*/

// Data Types

export type BookType = "standard" | "reference" | "rare";

export interface Book {
  id: string;
  title: string;
  type: BookType;
}

export interface Patron {
  id: string;
  name: string;
  membershipTier: "basic" | "premium" | "elite";
  accountBalance: number; // negative means they owe money
}

export interface Loan {
  bookId: string;
  patronId: string;
  dueDate: Date;
  renewalCount: number;
  type: BookType;
}

export interface HoldRequest {
  patronId: string;
  requestDate: Date;
  membershipTier: "basic" | "premium" | "elite";
}

export const ONE_DAY_MS = 1000 * 60 * 60 * 24;

// Pure Calculations

// Calculation: Determines how many days a book is overdue (0 if not overdue)
export function calculateDaysOverdue(dueDate: Date, currentDate: Date): number {
  const msOverdue = currentDate.getTime() - dueDate.getTime();
  const daysOverdue = Math.floor(msOverdue / ONE_DAY_MS);

  return Math.max(0, daysOverdue);
}

// Calculation: Computes the late fee based on overdue days and book type
// Standard: $0.50/day, Reference: $1.00/day, Rare: $2.50/day
// Fee caps at $25 for standard, $50 for reference, $100 for rare
export function calculateLateFee(daysOverdue: number, bookType: BookType): number {
  if (daysOverdue === 0) return 0;

  const fees: Record<BookType, { dailyRate: number; cap: number }> = {
    standard: { dailyRate: 0.5, cap: 25 },
    reference: { dailyRate: 1.0, cap: 50 },
    rare: { dailyRate: 2.5, cap: 100 },
  };

  const fee = fees[bookType];
  const totalFee = daysOverdue * fee.dailyRate;
  return Math.min(totalFee, fee.cap);
}

// Calculation: Checks if a book can be renewed
// Rules:
// - Cannot renew if already renewed 2 or more times
// - Cannot renew if overdue
// - Reference books cannot be renewed at all
export function isBookEligibleForRenewal(loan: Loan, currentDate: Date): boolean {
  if (loan.type === "reference") return false;
  if (loan.renewalCount >= 2) return false;

  const isOverdue = calculateDaysOverdue(loan.dueDate, currentDate);
  if (isOverdue > 0) return false;

  return true;
}

// Calculation: Sorts hold requests by priority
// Priority rules (highest to lowest):
// 1. Elite members come first
// 2. Premium members come second
// 3. Basic members come last
// 4. Within same tier, earlier request date has priority
export function prioritizeHoldQueue(holds: HoldRequest[]): HoldRequest[] {
  return [...holds].sort((a, b) => {
    const tierPriority = { elite: 1, premium: 2, basic: 3 };

    if (tierPriority[a.membershipTier] !== tierPriority[b.membershipTier]) {
      return tierPriority[a.membershipTier] - tierPriority[b.membershipTier];
    }

    return a.requestDate.getTime() - b.requestDate.getTime();
  });
}

// // Test data
// const testHolds: HoldRequest[] = [
//   { patronId: "p1", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
//   { patronId: "p2", requestDate: new Date("2024-01-15"), membershipTier: "elite" },
//   { patronId: "p3", requestDate: new Date("2024-01-08"), membershipTier: "elite" },
//   { patronId: "p4", requestDate: new Date("2024-01-12"), membershipTier: "premium" },
// ];

// console.log("Input:", testHolds);
// console.log("Sorted:", prioritizeHoldQueue(testHolds));
