import { describe, it, expect } from "vitest";
import {
  teamScoreSummary,
  premiumProductNames,
  allOrdersComplete,
  groupCitiesByCountry,
  calculateDepartmentBudget,
} from "../problems/assignment1";

describe("teamScoreSummary", () => {
  it("should sum only scores above 10", () => {
    expect(
      teamScoreSummary([
        { name: "alice", points: 15 },
        { name: "bob", points: 8 },
      ])
    ).toBe(15);
  });

  it("should sum multiple qualifying scores", () => {
    expect(
      teamScoreSummary([
        { name: "charlie", points: 12 },
        { name: "diana", points: 20 },
      ])
    ).toBe(32);
  });

  it("should return 0 for empty array", () => {
    expect(teamScoreSummary([])).toBe(0);
  });

  it("should return 0 when all scores are 10 or below", () => {
    expect(
      teamScoreSummary([
        { name: "eve", points: 10 },
        { name: "frank", points: 5 },
        { name: "grace", points: 3 },
      ])
    ).toBe(0);
  });

  it("should handle exactly 11 points (included)", () => {
    expect(teamScoreSummary([{ name: "henry", points: 11 }])).toBe(11);
  });

  it("should handle mixed scores", () => {
    expect(
      teamScoreSummary([
        { name: "a", points: 5 },
        { name: "b", points: 15 },
        { name: "c", points: 10 },
        { name: "d", points: 20 },
        { name: "e", points: 8 },
      ])
    ).toBe(35);
  });

  it("should handle all qualifying scores", () => {
    expect(
      teamScoreSummary([
        { name: "a", points: 12 },
        { name: "b", points: 15 },
        { name: "c", points: 20 },
      ])
    ).toBe(47);
  });

describe("premiumProductNames", () => {
  it("should return premium in-stock products", () => {
    expect(
      premiumProductNames([
        { name: "laptop", price: 999, quantity: 5 },
        { name: "mouse", price: 25, quantity: 10 },
      ])
    ).toEqual(["laptop"]);
  });

  it("should exclude expensive but out-of-stock products", () => {
    expect(
      premiumProductNames([
        { name: "keyboard", price: 150, quantity: 0 },
        { name: "monitor", price: 200, quantity: 3 },
      ])
    ).toEqual(["monitor"]);
  });

  it("should return empty array for empty input", () => {
    expect(premiumProductNames([])).toEqual([]);
  });

  it("should sort results alphabetically", () => {
    expect(
      premiumProductNames([
        { name: "zebra-desk", price: 500, quantity: 2 },
        { name: "apple-watch", price: 400, quantity: 5 },
        { name: "microsoft-surface", price: 800, quantity: 3 },
      ])
    ).toEqual(["apple-watch", "microsoft-surface", "zebra-desk"]);
  });

  it("should handle exactly 100 price (included)", () => {
    expect(
      premiumProductNames([{ name: "headphones", price: 100, quantity: 1 }])
    ).toEqual(["headphones"]);
  });

  it("should exclude products with price 99", () => {
    expect(
      premiumProductNames([{ name: "cheap", price: 99, quantity: 10 }])
    ).toEqual([]);
  });

  it("should handle mixed conditions", () => {
    expect(
      premiumProductNames([
        { name: "tablet", price: 300, quantity: 0 }, // expensive but no stock
        { name: "charger", price: 25, quantity: 50 }, // in stock but cheap
        { name: "laptop", price: 1200, quantity: 2 }, // premium & in stock
        { name: "monitor", price: 250, quantity: 5 }, // premium & in stock
      ])
    ).toEqual(["laptop", "monitor"]);
  });

  it("should handle quantity 1 as in stock", () => {
    expect(
      premiumProductNames([
        { name: "rare-item", price: 500, quantity: 1 },
      ])
    ).toEqual(["rare-item"]);
  });
});

describe("allOrdersComplete", () => {
  it("should return true when all orders are shipped or delivered", () => {
    expect(
      allOrdersComplete([
        { orderId: "A1", status: "shipped" },
        { orderId: "A2", status: "delivered" },
      ])
    ).toBe(true);
  });

  it("should return false when any order is pending", () => {
    expect(
      allOrdersComplete([
        { orderId: "B1", status: "shipped" },
        { orderId: "B2", status: "pending" },
      ])
    ).toBe(false);
  });

  it("should return true for empty array", () => {
    expect(allOrdersComplete([])).toBe(true);
  });

  it("should return true for all shipped", () => {
    expect(
      allOrdersComplete([
        { orderId: "C1", status: "shipped" },
        { orderId: "C2", status: "shipped" },
        { orderId: "C3", status: "shipped" },
      ])
    ).toBe(true);
  });

  it("should return true for all delivered", () => {
    expect(
      allOrdersComplete([
        { orderId: "D1", status: "delivered" },
        { orderId: "D2", status: "delivered" },
      ])
    ).toBe(true);
  });

  it("should return false for processing status", () => {
    expect(
      allOrdersComplete([
        { orderId: "E1", status: "shipped" },
        { orderId: "E2", status: "processing" },
      ])
    ).toBe(false);
  });

  it("should return false for cancelled status", () => {
    expect(
      allOrdersComplete([
        { orderId: "F1", status: "delivered" },
        { orderId: "F2", status: "cancelled" },
      ])
    ).toBe(false);
  });

  it("should handle single shipped order", () => {
    expect(allOrdersComplete([{ orderId: "G1", status: "shipped" }])).toBe(true);
  });

  it("should handle single delivered order", () => {
    expect(allOrdersComplete([{ orderId: "H1", status: "delivered" }])).toBe(true);
  });
});

describe("groupCitiesByCountry", () => {
  it("should group cities by country", () => {
    expect(
      groupCitiesByCountry([
        { city: "Paris", country: "France" },
        { city: "Lyon", country: "France" },
      ])
    ).toEqual({ France: ["Paris", "Lyon"] });
  });

  it("should handle multiple countries", () => {
    expect(
      groupCitiesByCountry([
        { city: "Tokyo", country: "Japan" },
        { city: "Berlin", country: "Germany" },
      ])
    ).toEqual({ Japan: ["Tokyo"], Germany: ["Berlin"] });
  });

  it("should return empty object for empty array", () => {
    expect(groupCitiesByCountry([])).toEqual({});
  });

  it("should handle single city", () => {
    expect(
      groupCitiesByCountry([{ city: "Rome", country: "Italy" }])
    ).toEqual({ Italy: ["Rome"] });
  });

  it("should handle multiple cities per country", () => {
    expect(
      groupCitiesByCountry([
        { city: "New York", country: "USA" },
        { city: "Los Angeles", country: "USA" },
        { city: "Chicago", country: "USA" },
      ])
    ).toEqual({ USA: ["New York", "Los Angeles", "Chicago"] });
  });

  it("should preserve order of cities", () => {
    expect(
      groupCitiesByCountry([
        { city: "Madrid", country: "Spain" },
        { city: "London", country: "UK" },
        { city: "Barcelona", country: "Spain" },
      ])
    ).toEqual({ Spain: ["Madrid", "Barcelona"], UK: ["London"] });
  });

  it("should handle complex grouping", () => {
    expect(
      groupCitiesByCountry([
        { city: "Paris", country: "France" },
        { city: "Tokyo", country: "Japan" },
        { city: "Lyon", country: "France" },
        { city: "Osaka", country: "Japan" },
        { city: "Nice", country: "France" },
      ])
    ).toEqual({
      France: ["Paris", "Lyon", "Nice"],
      Japan: ["Tokyo", "Osaka"],
    });
  });
});

describe("calculateDepartmentBudget", () => {
  it("should calculate budget for engineering department only", () => {
    expect(
      calculateDepartmentBudget([
        { name: "alice", department: "engineering", salary: 100000 },
        { name: "bob", department: "sales", salary: 80000 },
      ])
    ).toBe(100000);
  });

  it("should sum multiple engineering salaries", () => {
    expect(
      calculateDepartmentBudget([
        { name: "charlie", department: "engineering", salary: 95000 },
        { name: "diana", department: "engineering", salary: 105000 },
      ])
    ).toBe(200000);
  });

  it("should return 0 for empty array", () => {
    expect(calculateDepartmentBudget([])).toBe(0);
  });

  it("should return 0 when no engineering employees", () => {
    expect(
      calculateDepartmentBudget([
        { name: "eve", department: "marketing", salary: 90000 },
        { name: "frank", department: "sales", salary: 85000 },
      ])
    ).toBe(0);
  });

  it("should ignore non-engineering departments", () => {
    expect(
      calculateDepartmentBudget([
        { name: "a", department: "engineering", salary: 100000 },
        { name: "b", department: "sales", salary: 80000 },
        { name: "c", department: "engineering", salary: 110000 },
        { name: "d", department: "marketing", salary: 90000 },
        { name: "e", department: "engineering", salary: 105000 },
      ])
    ).toBe(315000);
  });

  it("should handle single engineering employee", () => {
    expect(
      calculateDepartmentBudget([
        { name: "solo", department: "engineering", salary: 120000 },
      ])
    ).toBe(120000);
  });

  it("should handle case-sensitive department names", () => {
    expect(
      calculateDepartmentBudget([
        { name: "a", department: "Engineering", salary: 100000 },
        { name: "b", department: "engineering", salary: 110000 },
      ])
    ).toBe(110000);
  });

  it("should handle large engineering team", () => {
    expect(
      calculateDepartmentBudget([
        { name: "a", department: "engineering", salary: 100000 },
        { name: "b", department: "engineering", salary: 105000 },
        { name: "c", department: "engineering", salary: 110000 },
        { name: "d", department: "engineering", salary: 95000 },
        { name: "e", department: "engineering", salary: 115000 },
      ])
    ).toBe(525000);
  });
});
