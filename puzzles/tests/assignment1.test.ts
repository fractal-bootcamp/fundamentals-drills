// tests/assignment1_state.test.ts
import { describe, it, expect } from 'vitest';

import {
  processSingleSKU,
  processMultiSKU,
  simulateCredit,
  processSessions,
  processWithSales,
} from '../problems/assignment1';

// -------------------------
// B1. Single SKU Tracker
// -------------------------
describe('B1: processSingleSKU', () => {
  it('reduces and increases stock across events', () => {
    const stock = 3;
    const events = [{ type: 'order', qty: 2 }, { type: 'restock', qty: 1 }];
    expect(processSingleSKU(stock, events)).toEqual(2);
  });

  it('handles no events', () => {
    expect(processSingleSKU(0, [])).toEqual(0);
    expect(processSingleSKU(5, [])).toEqual(5);
  });

  it('handles multiple orders and restocks', () => {
    const stock = 10;
    const events = [
      { type: 'order', qty: 3 },
      { type: 'order', qty: 2 },
      { type: 'restock', qty: 4 },
      { type: 'order', qty: 1 },
    ];
    // 10 -3 -2 +4 -1 = 8
    expect(processSingleSKU(stock, events)).toEqual(8);
  });
});

// -------------------------
// B2. Multi-SKU Tracker
// -------------------------
describe('B2: processMultiSKU', () => {
  it('updates each sku independently', () => {
    const stock = { A: 3, B: 2 };
    const events = [
      { type: 'order', sku: 'A', qty: 1 },
      { type: 'restock', sku: 'B', qty: 5 },
    ];
    expect(processMultiSKU(stock, events)).toEqual({ A: 2, B: 7 });
  });

  it('treats missing SKUs as starting at 0 and allows restock', () => {
    const stock: Record<string, number> = {};
    const events = [
      { type: 'restock', sku: 'C', qty: 3 },
      { type: 'order', sku: 'C', qty: 1 },
    ];
    // 0 +3 -1 = 2
    expect(processMultiSKU(stock, events)).toEqual({ C: 2 });
  });

  it('handles many events across multiple SKUs', () => {
    const stock = { A: 5, B: 0 };
    const events = [
      { type: 'order', sku: 'A', qty: 2 },   // A: 3
      { type: 'restock', sku: 'B', qty: 4 }, // B: 4
      { type: 'order', sku: 'B', qty: 1 },   // B: 3
      { type: 'restock', sku: 'A', qty: 2 }, // A: 5
    ];
    expect(processMultiSKU(stock, events)).toEqual({ A: 5, B: 3 });
  });
});

// -------------------------
// B3. Session Reset
// -------------------------
describe('B3: simulateCredit', () => {
  it('tracks credit and resets on cancel', () => {
    const actions: [string, number?][] = [
      ['insert', 25],
      ['insert', 10],
      ['cancel'],
      ['insert', 5],
    ];
    expect(simulateCredit(actions)).toEqual([25, 35, 0, 5]);
  });

  it('handles multiple cancels and empty input', () => {
    expect(
      simulateCredit([
        ['cancel'],
        ['insert', 100],
        ['cancel'],
      ])
    ).toEqual([0, 100, 0]);

    expect(simulateCredit([])).toEqual([]);
  });

  it('ignores non-insert amounts (if you choose to)', () => {
    // This case is here to ensure your implementation is robust.
    // If you prefer to treat unknown actions as no-ops, the expected output assumes that.
    const actions: [string, number?][] = [
      ['insert', 50],
      ['noop' as any],
      ['insert', 25],
    ];
    expect(simulateCredit(actions)).toEqual([50, 50, 75]);
  });
});

// -------------------------
// B4. Shared Inventory, Resetting Credit
// -------------------------
describe('B4: processSessions', () => {
  it('updates inventory on successful purchases and resets credit per session', () => {
    const inventory = {
      A: { price: 100, stock: 2 },
      B: { price: 50, stock: 1 },
    };

    const sessions: [string, any][][] = [
      // buy A
      [
        ['insert', 100],
        ['select', 'A'],
      ],
      // insufficient for B
      [
        ['insert', 25],
        ['select', 'B'],
      ],
      // then buy B in a new session
      [
        ['insert', 50],
        ['select', 'B'],
      ],
      // invalid sku selection (ignored)
      [
        ['insert', 100],
        ['select', 'Z'],
      ],
    ];

    const result = processSessions(inventory, sessions);
    expect(result).toEqual({
      A: { price: 100, stock: 1 },
      B: { price: 50, stock: 0 },
    });
  });

  it('ignores selections when stock is zero or credit is insufficient', () => {
    const inventory = {
      A: { price: 75, stock: 0 },
      B: { price: 60, stock: 2 },
    };
    const sessions: [string, any][][] = [
      [
        ['insert', 75],
        ['select', 'A'], // out of stock
      ],
      [
        ['insert', 50],
        ['select', 'B'], // insufficient credit
      ],
      [
        ['insert', 60],
        ['select', 'B'], // success
      ],
    ];

    const result = processSessions(inventory, sessions);
    expect(result).toEqual({
      A: { price: 75, stock: 0 },
      B: { price: 60, stock: 1 },
    });
  });
});

// -------------------------
// B5. Cumulative Sessions with Sales
// -------------------------
describe('B5: processWithSales', () => {
  it('returns final inventory and sales tallies', () => {
    const inventory = {
      A: { price: 100, stock: 2 },
      B: { price: 50, stock: 1 },
    };
    const sessions: [string, any][][] = [
      [
        ['insert', 100],
        ['select', 'A'], // sell A
      ],
      [
        ['insert', 25],
        ['select', 'B'], // insufficient
      ],
      [
        ['insert', 50],
        ['select', 'B'], // sell B
      ],
      [
        ['insert', 100],
        ['select', 'Z'], // invalid
      ],
    ];

    const { inventory: finalInv, sales } = processWithSales(inventory, sessions);
    expect(finalInv).toEqual({
      A: { price: 100, stock: 1 },
      B: { price: 50, stock: 0 },
    });
    expect(sales).toEqual({ A: 1, B: 1 });
  });

  it('accumulates multiple sales across sessions', () => {
    const inventory = { A: { price: 30, stock: 5 } };
    const sessions: [string, any][][] = [
      [
        ['insert', 30],
        ['select', 'A'],
      ],
      [
        ['insert', 60],
        ['select', 'A'],
        ['select', 'A'], // only one select should work unless your logic supports sequential purchases on remaining credit
      ],
      [
        ['insert', 30],
        ['select', 'A'],
      ],
    ];

    const { inventory: finalInv, sales } = processWithSales(inventory, sessions);
    // Depending on how you implement per-session logic, you may require a fresh insert for each purchase.
    // The expectations below assume one purchase per sufficient-credit moment and that the second select in session 2 is ignored unless the first purchase leaves enough credit.
    expect(finalInv.A.stock).toBe(2); // 5 start - 3 sold = 2
    expect(sales).toEqual({ A: 3 });
  });
});
