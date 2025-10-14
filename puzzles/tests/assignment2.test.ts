import { describe, it, expect } from "vitest";
import { processVendingSessions } from "../problems/assignment2";

describe("processVendingSessions", () => {
  // Basic functionality tests
  it("should handle successful purchase from example A", () => {
    const input = {
      inventory: { A: { price: 125, stock: 1 } },
      sessions: [
        [["insert", 100], ["insert", 25], ["select", "A"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ A: { price: 125, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "A",
      changeCoins: {},
      changeTotal: 0,
      spent: 125,
      errors: []
    }]);
  });

  it("should handle insufficient credit from example B", () => {
    const input = {
      inventory: { B: { price: 130, stock: 1 } },
      sessions: [
        [["insert", 100], ["insert", 25], ["select", "B"]],
        [["insert", 100], ["select", "B"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ B: { price: 130, stock: 1 } });
    expect(result.receipts[0]).toEqual({
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["insufficient credit: have 125, need 130"]
    });
    expect(result.receipts[1]).toEqual({
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["insufficient credit: have 100, need 130"]
    });
  });

  it("should handle purchase with change", () => {
    const input = {
      inventory: { C: { price: 75, stock: 1 } },
      sessions: [
        [["insert", 100], ["select", "C"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ C: { price: 75, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "C",
      changeCoins: { 25: 1 },
      changeTotal: 25,
      spent: 75,
      errors: []
    }]);
  });

  it("should handle complex change breakdown", () => {
    const input = {
      inventory: { D: { price: 35, stock: 1 } },
      sessions: [
        [["insert", 100], ["select", "D"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ D: { price: 35, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "D",
      changeCoins: { 50: 1, 10: 1, 5: 1 },
      changeTotal: 65,
      spent: 35,
      errors: []
    }]);
  });

  it("should handle cancel operation", () => {
    const input = {
      inventory: { E: { price: 50, stock: 1 } },
      sessions: [
        [["insert", 25], ["insert", 25], ["cancel"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ E: { price: 50, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: { 25: 2 },
      changeTotal: 50,
      spent: 0,
      errors: []
    }]);
  });

  it("should handle invalid coin denominations", () => {
    const input = {
      inventory: { F: { price: 50, stock: 1 } },
      sessions: [
        [["insert", 75], ["insert", 50], ["select", "F"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ F: { price: 50, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "F",
      changeCoins: {},
      changeTotal: 0,
      spent: 50,
      errors: ["unsupported coin: 75"]
    }]);
  });

  it("should handle invalid SKU", () => {
    const input = {
      inventory: { G: { price: 50, stock: 1 } },
      sessions: [
        [["insert", 100], ["select", "INVALID"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ G: { price: 50, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["invalid sku: INVALID"]
    }]);
  });

  it("should handle out of stock", () => {
    const input = {
      inventory: { H: { price: 50, stock: 0 } },
      sessions: [
        [["insert", 50], ["select", "H"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ H: { price: 50, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["out of stock: H"]
    }]);
  });

  it("should handle multiple sessions with inventory depletion", () => {
    const input = {
      inventory: { I: { price: 25, stock: 2 } },
      sessions: [
        [["insert", 25], ["select", "I"]],
        [["insert", 25], ["select", "I"]],
        [["insert", 25], ["select", "I"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ I: { price: 25, stock: 0 } });
    expect(result.receipts).toHaveLength(3);
    expect(result.receipts[0].dispensed).toBe("I");
    expect(result.receipts[1].dispensed).toBe("I");
    expect(result.receipts[2].dispensed).toBeUndefined();
    expect(result.receipts[2].errors).toEqual(["out of stock: I"]);
  });

  it("should handle noop operations", () => {
    const input = {
      inventory: { J: { price: 50, stock: 1 } },
      sessions: [
        [["noop"], ["insert", 50], ["noop"], ["select", "J"], ["noop"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ J: { price: 50, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "J",
      changeCoins: {},
      changeTotal: 0,
      spent: 50,
      errors: []
    }]);
  });

  it("should handle unknown actions", () => {
    const input = {
      inventory: { K: { price: 50, stock: 1 } },
      sessions: [
        [["unknown"], ["insert", 50], ["select", "K"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ K: { price: 50, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "K",
      changeCoins: {},
      changeTotal: 0,
      spent: 50,
      errors: ["unknown action: unknown"]
    }]);
  });

  it("should ignore actions after session ends", () => {
    const input = {
      inventory: { L: { price: 50, stock: 2 } },
      sessions: [
        [["insert", 50], ["select", "L"], ["insert", 100], ["select", "L"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ L: { price: 50, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: "L",
      changeCoins: {},
      changeTotal: 0,
      spent: 50,
      errors: []
    }]);
  });

  it("should handle cancel after session ends", () => {
    const input = {
      inventory: { M: { price: 25, stock: 1 } },
      sessions: [
        [["insert", 25], ["cancel"], ["insert", 50]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ M: { price: 25, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: { 25: 1 },
      changeTotal: 25,
      spent: 0,
      errors: []
    }]);
  });

  it("should handle empty sessions", () => {
    const input = {
      inventory: { N: { price: 50, stock: 1 } },
      sessions: [
        []
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ N: { price: 50, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: []
    }]);
  });

  it("should handle session that just inserts coins", () => {
    const input = {
      inventory: { O: { price: 50, stock: 1 } },
      sessions: [
        [["insert", 25], ["insert", 10]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ O: { price: 50, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: []
    }]);
  });

  it("should handle multiple errors in single session", () => {
    const input = {
      inventory: { P: { price: 100, stock: 1 } },
      sessions: [
        [["insert", 75], ["select", "INVALID"], ["insert", 50], ["select", "P"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ P: { price: 100, stock: 1 } });
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["unsupported coin: 75", "invalid sku: INVALID", "insufficient credit: have 50, need 100"]
    }]);
  });

  it("should handle zero price items", () => {
    const input = {
      inventory: { FREE: { price: 0, stock: 1 } },
      sessions: [
        [["select", "FREE"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ FREE: { price: 0, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "FREE",
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: []
    }]);
  });

  it("should handle large denomination breakdown", () => {
    const input = {
      inventory: { Q: { price: 1, stock: 1 } },
      sessions: [
        [["insert", 100], ["select", "Q"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({ Q: { price: 1, stock: 0 } });
    expect(result.receipts).toEqual([{
      dispensed: "Q",
      changeCoins: { 50: 1, 25: 1, 10: 2, 1: 4 },
      changeTotal: 99,
      spent: 1,
      errors: []
    }]);
  });

  it("should handle empty inventory", () => {
    const input = {
      inventory: {},
      sessions: [
        [["insert", 50], ["select", "ANYTHING"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({});
    expect(result.receipts).toEqual([{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["invalid sku: ANYTHING"]
    }]);
  });

  it("should handle malformed input gracefully", () => {
    const input = {
      inventory: null,
      sessions: null
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({});
    expect(result.receipts).toEqual([]);
  });

  it("should normalize inventory with negative values", () => {
    const input = {
      inventory: {
        R: { price: -50, stock: -1 },
        S: { price: 100.5, stock: 2.7 }
      },
      sessions: [
        [["insert", 100], ["select", "S"]]
      ]
    };

    const result = processVendingSessions(input);

    expect(result.inventory).toEqual({
      R: { price: 0, stock: 0 },
      S: { price: 100, stock: 1 }
    });
    expect(result.receipts).toEqual([{
      dispensed: "S",
      changeCoins: {},
      changeTotal: 0,
      spent: 100,
      errors: []
    }]);
  });
});