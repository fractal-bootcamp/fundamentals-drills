import { describe, it, expect } from "vitest";
import {
  calculateDaysOverdue,
  calculateLateFee,
  isBookEligibleForRenewal,
  prioritizeHoldQueue,
  type Loan,
  type HoldRequest,
} from "../problems/assignment1";

describe("Assignment 1: Data & Calculations", () => {
  describe("calculateDaysOverdue", () => {
    it("returns 0 when book is not overdue", () => {
      const dueDate = new Date("2024-01-15");
      const currentDate = new Date("2024-01-10");
      expect(calculateDaysOverdue(dueDate, currentDate)).toBe(0);
    });

    it("returns 0 when book is due today", () => {
      const dueDate = new Date("2024-01-15");
      const currentDate = new Date("2024-01-15");
      expect(calculateDaysOverdue(dueDate, currentDate)).toBe(0);
    });

    it("calculates correct days overdue", () => {
      const dueDate = new Date("2024-01-15");
      const currentDate = new Date("2024-01-20");
      expect(calculateDaysOverdue(dueDate, currentDate)).toBe(5);
    });

    it("handles large overdue periods", () => {
      const dueDate = new Date("2024-01-01");
      const currentDate = new Date("2024-12-31");
      expect(calculateDaysOverdue(dueDate, currentDate)).toBe(365);
    });
  });

  describe("calculateLateFee", () => {
    it("returns 0 when no days overdue", () => {
      expect(calculateLateFee(0, "standard")).toBe(0);
      expect(calculateLateFee(0, "reference")).toBe(0);
      expect(calculateLateFee(0, "rare")).toBe(0);
    });

    it("calculates standard book fee correctly", () => {
      expect(calculateLateFee(10, "standard")).toBe(5); // 10 * 0.50
    });

    it("calculates reference book fee correctly", () => {
      expect(calculateLateFee(10, "reference")).toBe(10); // 10 * 1.00
    });

    it("calculates rare book fee correctly", () => {
      expect(calculateLateFee(10, "rare")).toBe(25); // 10 * 2.50
    });

    it("caps standard book fee at $25", () => {
      expect(calculateLateFee(100, "standard")).toBe(25);
    });

    it("caps reference book fee at $50", () => {
      expect(calculateLateFee(100, "reference")).toBe(50);
    });

    it("caps rare book fee at $100", () => {
      expect(calculateLateFee(100, "rare")).toBe(100);
    });

    it("handles fees exactly at cap", () => {
      expect(calculateLateFee(50, "standard")).toBe(25); // would be 25, capped at 25
      expect(calculateLateFee(50, "reference")).toBe(50); // would be 50, capped at 50
      expect(calculateLateFee(40, "rare")).toBe(100); // would be 100, capped at 100
    });
  });

  describe("isBookEligibleForRenewal", () => {
    it("allows renewal for standard book with no renewals and not overdue", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-20"),
        renewalCount: 0,
        type: "standard",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(true);
    });

    it("disallows renewal for reference books", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-20"),
        renewalCount: 0,
        type: "reference",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(false);
    });

    it("disallows renewal when renewal count is 2", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-20"),
        renewalCount: 2,
        type: "standard",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(false);
    });

    it("disallows renewal when renewal count exceeds 2", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-20"),
        renewalCount: 3,
        type: "rare",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(false);
    });

    it("disallows renewal when book is overdue", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-10"),
        renewalCount: 0,
        type: "standard",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(false);
    });

    it("allows renewal for rare book with 1 renewal and not overdue", () => {
      const loan: Loan = {
        bookId: "1",
        patronId: "p1",
        dueDate: new Date("2024-01-20"),
        renewalCount: 1,
        type: "rare",
      };
      const currentDate = new Date("2024-01-15");
      expect(isBookEligibleForRenewal(loan, currentDate)).toBe(true);
    });
  });

  describe("prioritizeHoldQueue", () => {
    it("returns empty array for empty input", () => {
      expect(prioritizeHoldQueue([])).toEqual([]);
    });

    it("prioritizes elite over premium over basic", () => {
      const holds: HoldRequest[] = [
        { patronId: "p1", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
        { patronId: "p2", requestDate: new Date("2024-01-10"), membershipTier: "elite" },
        {
          patronId: "p3",
          requestDate: new Date("2024-01-10"),
          membershipTier: "premium",
        },
      ];
      const result = prioritizeHoldQueue(holds);
      expect(result[0].patronId).toBe("p2");
      expect(result[1].patronId).toBe("p3");
      expect(result[2].patronId).toBe("p1");
    });

    it("sorts by request date within same tier", () => {
      const holds: HoldRequest[] = [
        { patronId: "p1", requestDate: new Date("2024-01-15"), membershipTier: "basic" },
        { patronId: "p2", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
        { patronId: "p3", requestDate: new Date("2024-01-12"), membershipTier: "basic" },
      ];
      const result = prioritizeHoldQueue(holds);
      expect(result[0].patronId).toBe("p2");
      expect(result[1].patronId).toBe("p3");
      expect(result[2].patronId).toBe("p1");
    });

    it("applies both tier and date sorting", () => {
      const holds: HoldRequest[] = [
        { patronId: "p1", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
        { patronId: "p2", requestDate: new Date("2024-01-15"), membershipTier: "elite" },
        { patronId: "p3", requestDate: new Date("2024-01-08"), membershipTier: "elite" },
        {
          patronId: "p4",
          requestDate: new Date("2024-01-12"),
          membershipTier: "premium",
        },
      ];
      const result = prioritizeHoldQueue(holds);
      expect(result[0].patronId).toBe("p3"); // elite, earliest
      expect(result[1].patronId).toBe("p2"); // elite, later
      expect(result[2].patronId).toBe("p4"); // premium
      expect(result[3].patronId).toBe("p1"); // basic
    });

    it("does not mutate the original array", () => {
      const holds: HoldRequest[] = [
        { patronId: "p1", requestDate: new Date("2024-01-15"), membershipTier: "basic" },
        { patronId: "p2", requestDate: new Date("2024-01-10"), membershipTier: "elite" },
      ];
      const original = [...holds];
      prioritizeHoldQueue(holds);
      expect(holds).toEqual(original);
    });
  });
});
