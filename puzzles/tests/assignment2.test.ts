import { describe, it, expect } from "vitest";
import {
  processDailyEvents,
  type LoanEvent,
  type LibraryState,
} from "../problems/assignment2";
import type { Patron, Loan, HoldRequest } from "../problems/assignment1";

describe("Assignment 2: Actions & Orchestration", () => {
  const createPatron = (
    id: string,
    tier: "basic" | "premium" | "elite" = "basic",
    balance: number = 0,
  ): Patron => ({
    id,
    name: `Patron ${id}`,
    membershipTier: tier,
    accountBalance: balance,
  });

  const createLoan = (
    bookId: string,
    patronId: string,
    dueDate: Date,
    renewalCount: number = 0,
  ): Loan => ({
    bookId,
    patronId,
    dueDate,
    renewalCount,
    type: "standard",
  });

  describe("processReturn action", () => {
    it("processes on-time return without fees", () => {
      const patrons = [createPatron("p1", "basic", 0)];
      const loans = [createLoan("b1", "p1", new Date("2024-01-20"))];
      const events: LoanEvent[] = [{ type: "return", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.activeLoans.has("b1")).toBe(false);
      expect(result.finalState.patrons.get("p1")?.accountBalance).toBe(0);
      expect(result.finalState.eventLog).toContain("Book b1 returned by p1 on time");
    });

    it("processes overdue return and charges late fees", () => {
      const patrons = [createPatron("p1", "basic", 0)];
      const loans = [createLoan("b1", "p1", new Date("2024-01-10"))];
      const events: LoanEvent[] = [{ type: "return", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-20");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.activeLoans.has("b1")).toBe(false);
      // 10 days overdue * $0.50 = $5.00
      expect(result.finalState.patrons.get("p1")?.accountBalance).toBe(-5);
      expect(result.finalState.eventLog[0]).toContain("Late fee: $5.00");
    });

    it("rejects return for non-existent loan", () => {
      const patrons = [createPatron("p1")];
      const loans: Loan[] = [];
      const events: LoanEvent[] = [{ type: "return", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.eventLog).toContain(
        "Return failed: No active loan for book b1",
      );
    });

    it("rejects return from wrong patron", () => {
      const patrons = [createPatron("p1"), createPatron("p2")];
      const loans = [createLoan("b1", "p1", new Date("2024-01-20"))];
      const events: LoanEvent[] = [{ type: "return", bookId: "b1", patronId: "p2" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.activeLoans.has("b1")).toBe(true);
      expect(result.finalState.eventLog).toContain(
        "Return failed: Book b1 not loaned to patron p2",
      );
    });
  });

  describe("processRenewal action", () => {
    it("approves renewal for eligible loan", () => {
      const patrons = [createPatron("p1")];
      const loans = [createLoan("b1", "p1", new Date("2024-01-20"), 0)];
      const events: LoanEvent[] = [{ type: "renew", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      const loan = result.finalState.activeLoans.get("b1");
      expect(loan?.renewalCount).toBe(1);
      expect(loan?.dueDate.getTime()).toBeGreaterThan(new Date("2024-01-20").getTime());
      expect(result.finalState.eventLog[0]).toContain("renewed");
    });

    it("denies renewal for overdue loan", () => {
      const patrons = [createPatron("p1")];
      const loans = [createLoan("b1", "p1", new Date("2024-01-10"), 0)];
      const events: LoanEvent[] = [{ type: "renew", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      const loan = result.finalState.activeLoans.get("b1");
      expect(loan?.renewalCount).toBe(0);
      expect(result.finalState.eventLog).toContain("Renewal denied for book b1");
    });

    it("denies renewal when already renewed twice", () => {
      const patrons = [createPatron("p1")];
      const loans = [createLoan("b1", "p1", new Date("2024-01-20"), 2)];
      const events: LoanEvent[] = [{ type: "renew", bookId: "b1", patronId: "p1" }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      const loan = result.finalState.activeLoans.get("b1");
      expect(loan?.renewalCount).toBe(2);
      expect(result.finalState.eventLog).toContain("Renewal denied for book b1");
    });
  });

  describe("processCheckout action", () => {
    it("checks out book to highest priority patron", () => {
      const patrons = [createPatron("p1", "basic"), createPatron("p2", "elite")];
      const loans: Loan[] = [];
      const holdRequests: HoldRequest[] = [
        { patronId: "p1", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
        { patronId: "p2", requestDate: new Date("2024-01-12"), membershipTier: "elite" },
      ];
      const events: LoanEvent[] = [{ type: "checkout", bookId: "b1", holdRequests }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      const loan = result.finalState.activeLoans.get("b1");
      expect(loan?.patronId).toBe("p2"); // Elite patron has priority
      expect(result.finalState.eventLog).toContain("Book b1 checked out to p2");
    });

    it("rejects checkout when book is already on loan", () => {
      const patrons = [createPatron("p1"), createPatron("p2")];
      const loans = [createLoan("b1", "p1", new Date("2024-01-20"))];
      const holdRequests: HoldRequest[] = [
        { patronId: "p2", requestDate: new Date("2024-01-10"), membershipTier: "basic" },
      ];
      const events: LoanEvent[] = [{ type: "checkout", bookId: "b1", holdRequests }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.eventLog).toContain(
        "Checkout failed: Book b1 already on loan",
      );
    });

    it("rejects checkout when no hold requests exist", () => {
      const patrons = [createPatron("p1")];
      const loans: Loan[] = [];
      const events: LoanEvent[] = [{ type: "checkout", bookId: "b1", holdRequests: [] }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.eventLog).toContain(
        "Checkout failed: No hold requests for book b1",
      );
    });
  });

  describe("processAddHold action", () => {
    it("adds hold request to queue", () => {
      const patrons = [createPatron("p1")];
      const loans: Loan[] = [];
      const holdRequest: HoldRequest = {
        patronId: "p1",
        requestDate: new Date("2024-01-15"),
        membershipTier: "basic",
      };
      const events: LoanEvent[] = [{ type: "addHold", bookId: "b1", holdRequest }];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      const queue = result.finalState.holdQueues.get("b1");
      expect(queue?.length).toBe(1);
      expect(queue?.[0].patronId).toBe("p1");
      expect(result.finalState.eventLog).toContain("Hold added for book b1 by patron p1");
    });
  });

  describe("Integration: Calculations driving Actions", () => {
    it("processes complete book lifecycle with calculations", () => {
      const patrons = [createPatron("p1", "basic", 0), createPatron("p2", "elite", 0)];
      const loans = [createLoan("b1", "p1", new Date("2024-01-10"), 0)];
      const holdRequests: HoldRequest[] = [
        { patronId: "p2", requestDate: new Date("2024-01-12"), membershipTier: "elite" },
      ];

      // Sequence: return (with late fee), checkout to next patron, renew
      const events: LoanEvent[] = [
        { type: "return", bookId: "b1", patronId: "p1" },
        { type: "checkout", bookId: "b1", holdRequests },
        { type: "renew", bookId: "b1", patronId: "p2" },
      ];
      const currentDate = new Date("2024-01-20");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      // Verify late fee was charged (10 days * $0.50)
      expect(result.finalState.patrons.get("p1")?.accountBalance).toBe(-5);

      // Verify book was checked out to elite patron
      const loan = result.finalState.activeLoans.get("b1");
      expect(loan?.patronId).toBe("p2");

      // Verify renewal was approved
      expect(loan?.renewalCount).toBe(1);

      // Verify all events were logged
      expect(result.eventsProcessed).toBe(3);
      expect(result.finalState.eventLog.length).toBe(3);
    });

    it("processes multiple returns with varying late fees", () => {
      const patrons = [
        createPatron("p1", "basic", 0),
        createPatron("p2", "basic", 0),
        createPatron("p3", "basic", 0),
      ];
      const loans = [
        createLoan("b1", "p1", new Date("2024-01-15"), 0), // 0 days overdue
        createLoan("b2", "p2", new Date("2024-01-10"), 0), // 5 days overdue
        createLoan("b3", "p3", new Date("2024-01-05"), 0), // 10 days overdue
      ];
      const events: LoanEvent[] = [
        { type: "return", bookId: "b1", patronId: "p1" },
        { type: "return", bookId: "b2", patronId: "p2" },
        { type: "return", bookId: "b3", patronId: "p3" },
      ];
      const currentDate = new Date("2024-01-15");

      const result = processDailyEvents(patrons, loans, events, currentDate);

      expect(result.finalState.patrons.get("p1")?.accountBalance).toBe(0);
      expect(result.finalState.patrons.get("p2")?.accountBalance).toBe(-2.5);
      expect(result.finalState.patrons.get("p3")?.accountBalance).toBe(-5);
    });
  });
});
