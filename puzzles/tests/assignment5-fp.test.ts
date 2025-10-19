import { describe, it, expect } from "vitest";
import { analyzeEventLog, analyzeEventLogImperative } from "../problems/assignment5-fp";

describe("analyzeEventLog (Functional)", () => {
  it("should handle the basic example", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "pageview", timestamp: 1010, data: { page: "home" } },
        { userId: "alice", type: "purchase", timestamp: 1020, data: { amount: 5000, product: "shirt" } },
        { userId: "alice", type: "logout", timestamp: 1100 },
        { userId: "bob", type: "login", timestamp: 2000 },
        { userId: "bob", type: "pageview", timestamp: 2010, data: { page: "home" } },
        { userId: "bob", type: "logout", timestamp: 2050 },
      ],
    });

    expect(result.totalUsers).toBe(2);
    expect(result.totalRevenue).toBe(5000);
    expect(result.averageSessionLength).toBe(75); // (100 + 50) / 2
    expect(result.topPages).toEqual([{ page: "home", views: 2 }]);
    expect(result.userSummaries).toHaveLength(2);
    expect(result.userSummaries[0].userId).toBe("alice");
    expect(result.userSummaries[0].sessionDurations).toEqual([100]);
  });

  it("should handle empty events", () => {
    const result = analyzeEventLog({ events: [] });

    expect(result.totalUsers).toBe(0);
    expect(result.totalRevenue).toBe(0);
    expect(result.averageSessionLength).toBe(0);
    expect(result.topPages).toEqual([]);
    expect(result.userSummaries).toEqual([]);
  });

  it("should calculate multiple purchases correctly", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "purchase", timestamp: 1010, data: { amount: 1000, product: "a" } },
        { userId: "alice", type: "purchase", timestamp: 1020, data: { amount: 2000, product: "b" } },
        { userId: "alice", type: "purchase", timestamp: 1030, data: { amount: 3000, product: "c" } },
        { userId: "alice", type: "logout", timestamp: 1100 },
      ],
    });

    expect(result.totalRevenue).toBe(6000);
    expect(result.userSummaries[0].purchaseCount).toBe(3);
    expect(result.userSummaries[0].totalSpent).toBe(6000);
  });

  it("should sort top pages by views then alphabetically", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "pageview", timestamp: 1000, data: { page: "zebra" } },
        { userId: "alice", type: "pageview", timestamp: 1010, data: { page: "apple" } },
        { userId: "alice", type: "pageview", timestamp: 1020, data: { page: "banana" } },
        { userId: "bob", type: "pageview", timestamp: 2000, data: { page: "apple" } },
        { userId: "bob", type: "pageview", timestamp: 2010, data: { page: "apple" } },
        { userId: "carol", type: "pageview", timestamp: 3000, data: { page: "banana" } },
      ],
    });

    expect(result.topPages).toEqual([
      { page: "apple", views: 3 },
      { page: "banana", views: 2 },
      { page: "zebra", views: 1 },
    ]);
  });

  it("should limit to top 3 pages", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "u1", type: "pageview", timestamp: 1, data: { page: "a" } },
        { userId: "u1", type: "pageview", timestamp: 2, data: { page: "a" } },
        { userId: "u1", type: "pageview", timestamp: 3, data: { page: "a" } },
        { userId: "u1", type: "pageview", timestamp: 4, data: { page: "a" } },
        { userId: "u2", type: "pageview", timestamp: 5, data: { page: "b" } },
        { userId: "u2", type: "pageview", timestamp: 6, data: { page: "b" } },
        { userId: "u2", type: "pageview", timestamp: 7, data: { page: "b" } },
        { userId: "u3", type: "pageview", timestamp: 8, data: { page: "c" } },
        { userId: "u3", type: "pageview", timestamp: 9, data: { page: "c" } },
        { userId: "u4", type: "pageview", timestamp: 10, data: { page: "d" } },
      ],
    });

    expect(result.topPages).toHaveLength(3);
    expect(result.topPages[0].page).toBe("a");
    expect(result.topPages[1].page).toBe("b");
    expect(result.topPages[2].page).toBe("c");
  });

  it("should handle sessions without logout (ignored for average)", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "logout", timestamp: 1100 }, // 100 second session
        { userId: "bob", type: "login", timestamp: 2000 },
        // Bob never logs out
      ],
    });

    expect(result.averageSessionLength).toBe(100); // Only alice's session counted
    expect(result.userSummaries[0].sessionDurations).toEqual([100]);
    expect(result.userSummaries[1].sessionDurations).toEqual([]); // Bob has no complete sessions
  });

  it("should handle multiple sessions per user", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "logout", timestamp: 1100 }, // Session 1: 100s
        { userId: "alice", type: "login", timestamp: 2000 },
        { userId: "alice", type: "logout", timestamp: 2200 }, // Session 2: 200s
        { userId: "alice", type: "login", timestamp: 3000 },
        { userId: "alice", type: "logout", timestamp: 3150 }, // Session 3: 150s
      ],
    });

    expect(result.userSummaries[0].loginCount).toBe(3);
    expect(result.userSummaries[0].sessionDurations).toEqual([100, 200, 150]);
    expect(result.averageSessionLength).toBe(150); // (100 + 200 + 150) / 3
  });

  it("should handle login without logout then another login", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "login", timestamp: 2000 }, // New login without logout
        { userId: "alice", type: "logout", timestamp: 2100 },
      ],
    });

    // First session incomplete, second session = 100s
    expect(result.userSummaries[0].sessionDurations).toEqual([100]);
    expect(result.averageSessionLength).toBe(100);
  });

  it("should count user metrics correctly", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "alice", type: "login", timestamp: 1000 },
        { userId: "alice", type: "login", timestamp: 1100 },
        { userId: "alice", type: "login", timestamp: 1200 },
        { userId: "alice", type: "purchase", timestamp: 1300, data: { amount: 100 } },
        { userId: "alice", type: "purchase", timestamp: 1400, data: { amount: 200 } },
      ],
    });

    expect(result.userSummaries[0].loginCount).toBe(3);
    expect(result.userSummaries[0].purchaseCount).toBe(2);
    expect(result.userSummaries[0].totalSpent).toBe(300);
  });

  it("should handle pages with same view count (alphabetical sort)", () => {
    const result = analyzeEventLog({
      events: [
        { userId: "u1", type: "pageview", timestamp: 1, data: { page: "zebra" } },
        { userId: "u2", type: "pageview", timestamp: 2, data: { page: "apple" } },
        { userId: "u3", type: "pageview", timestamp: 3, data: { page: "middle" } },
      ],
    });

    expect(result.topPages[0].page).toBe("apple");
    expect(result.topPages[1].page).toBe("middle");
    expect(result.topPages[2].page).toBe("zebra");
  });
});

describe("Functional vs Imperative - Same Results", () => {
  const testCases = [
    {
      name: "basic example",
      events: [
        { userId: "alice", type: "login" as const, timestamp: 1000 },
        { userId: "alice", type: "pageview" as const, timestamp: 1010, data: { page: "home" } },
        { userId: "alice", type: "purchase" as const, timestamp: 1020, data: { amount: 5000, product: "shirt" } },
        { userId: "alice", type: "logout" as const, timestamp: 1100 },
      ],
    },
    {
      name: "multiple users and sessions",
      events: [
        { userId: "alice", type: "login" as const, timestamp: 1000 },
        { userId: "alice", type: "logout" as const, timestamp: 1100 },
        { userId: "bob", type: "login" as const, timestamp: 2000 },
        { userId: "bob", type: "logout" as const, timestamp: 2200 },
        { userId: "carol", type: "login" as const, timestamp: 3000 },
        { userId: "carol", type: "logout" as const, timestamp: 3300 },
      ],
    },
    {
      name: "complex scenario",
      events: [
        { userId: "alice", type: "login" as const, timestamp: 1000 },
        { userId: "alice", type: "pageview" as const, timestamp: 1010, data: { page: "home" } },
        { userId: "alice", type: "pageview" as const, timestamp: 1020, data: { page: "products" } },
        { userId: "alice", type: "purchase" as const, timestamp: 1030, data: { amount: 1000 } },
        { userId: "alice", type: "logout" as const, timestamp: 1100 },
        { userId: "bob", type: "login" as const, timestamp: 2000 },
        { userId: "bob", type: "pageview" as const, timestamp: 2010, data: { page: "home" } },
        { userId: "bob", type: "pageview" as const, timestamp: 2020, data: { page: "home" } },
        { userId: "bob", type: "purchase" as const, timestamp: 2030, data: { amount: 2000 } },
        { userId: "bob", type: "purchase" as const, timestamp: 2040, data: { amount: 3000 } },
        { userId: "bob", type: "logout" as const, timestamp: 2100 },
      ],
    },
  ];

  testCases.forEach(({ name, events }) => {
    it(`should produce same results for: ${name}`, () => {
      const functionalResult = analyzeEventLog({ events });
      const imperativeResult = analyzeEventLogImperative({ events });

      expect(functionalResult).toEqual(imperativeResult);
    });
  });
});
