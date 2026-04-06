import { describe, it, expect } from 'vitest';
import {
  validateOrderItems,
  isOrderFulfillable,
  applyBulkDiscount,
  calculateOrderTotal,
  calculateRestockPriority,
  type InventoryItem,
  type OrderedItem,
} from '../problems/assignment1';

describe('Assignment 1: Data & Calculations', () => {
  const makeInventory = (items: InventoryItem[]) => new Map(items.map((i) => [i.productId, i]));

  describe('validateOrderItems', () => {
    const knownIds = new Set(['p1', 'p2']);

    it('returns no errors for valid lines', () => {
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 5, unitPrice: 10 }];
      expect(validateOrderItems(lines, knownIds)).toEqual([]);
    });

    it('reports unknown product ID', () => {
      const lines: OrderedItem[] = [{ productId: 'p99', quantity: 5, unitPrice: 10 }];
      const errors = validateOrderItems(lines, knownIds);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('p99');
    });

    it('reports non-positive quantity', () => {
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 0, unitPrice: 10 }];
      const errors = validateOrderItems(lines, knownIds);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('quantity');
    });

    it('reports negative unit price', () => {
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 5, unitPrice: -1 }];
      const errors = validateOrderItems(lines, knownIds);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('price');
    });

    it('returns multiple errors for multiple violations on one line', () => {
      const lines: OrderedItem[] = [{ productId: 'p99', quantity: -1, unitPrice: -5 }];
      const errors = validateOrderItems(lines, knownIds);
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });

    it('reports errors across multiple invalid lines', () => {
      const lines: OrderedItem[] = [
        { productId: 'p1', quantity: 0, unitPrice: 10 },
        { productId: 'unknown', quantity: 5, unitPrice: 10 },
      ];
      const errors = validateOrderItems(lines, knownIds);
      expect(errors.length).toBe(2);
    });
  });

  describe('isOrderFulfillable', () => {
    it('returns false for empty lines', () => {
      const inv = makeInventory([{ productId: 'p1', quantity: 10, reorderThreshold: 5 }]);
      expect(isOrderFulfillable([], inv)).toBe(false);
    });

    it('returns true when all items have sufficient stock', () => {
      const inv = makeInventory([{ productId: 'p1', quantity: 50, reorderThreshold: 5 }]);
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 50, unitPrice: 10 }];
      expect(isOrderFulfillable(lines, inv)).toBe(true);
    });

    it('returns false when one item has insufficient stock', () => {
      const inv = makeInventory([
        { productId: 'p1', quantity: 50, reorderThreshold: 5 },
        { productId: 'p2', quantity: 3, reorderThreshold: 5 },
      ]);
      const lines: OrderedItem[] = [
        { productId: 'p1', quantity: 10, unitPrice: 10 },
        { productId: 'p2', quantity: 5, unitPrice: 10 },
      ];
      expect(isOrderFulfillable(lines, inv)).toBe(false);
    });

    it('returns false for unknown product IDs', () => {
      const inv = makeInventory([{ productId: 'p1', quantity: 50, reorderThreshold: 5 }]);
      const lines: OrderedItem[] = [{ productId: 'unknown', quantity: 1, unitPrice: 10 }];
      expect(isOrderFulfillable(lines, inv)).toBe(false);
    });

    it('returns true when order quantity exactly matches stock', () => {
      const inv = makeInventory([{ productId: 'p1', quantity: 10, reorderThreshold: 5 }]);
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 10, unitPrice: 10 }];
      expect(isOrderFulfillable(lines, inv)).toBe(true);
    });
  });

  describe('applyBulkDiscount', () => {
    it('applies no discount for fewer than 10 units', () => {
      expect(applyBulkDiscount(9, 10)).toBe(90);
      expect(applyBulkDiscount(1, 10)).toBe(10);
    });

    it('applies 5% discount for 10–24 units', () => {
      expect(applyBulkDiscount(10, 10)).toBe(95); // 100 * 0.95
      expect(applyBulkDiscount(24, 10)).toBe(228); // 240 * 0.95
    });

    it('applies 10% discount for 25–99 units', () => {
      expect(applyBulkDiscount(25, 10)).toBe(225); // 250 * 0.90
      expect(applyBulkDiscount(50, 20)).toBe(900); // 1000 * 0.90
    });

    it('applies 15% discount for 100+ units', () => {
      expect(applyBulkDiscount(100, 10)).toBe(850); // 1000 * 0.85
    });

    it('handles tier boundaries correctly (24 vs 25 units)', () => {
      const below = applyBulkDiscount(24, 10); // 5% tier
      const above = applyBulkDiscount(25, 10); // 10% tier
      expect(below).toBeGreaterThan(above); // higher discount = lower total
    });
  });

  describe('calculateOrderTotal', () => {
    it('returns 0 for empty lines', () => {
      expect(calculateOrderTotal([])).toBe(0);
    });

    it('sums a single line with no discount', () => {
      const lines: OrderedItem[] = [{ productId: 'p1', quantity: 5, unitPrice: 10 }];
      expect(calculateOrderTotal(lines)).toBe(50);
    });

    it('sums discounted totals across multiple lines', () => {
      const lines: OrderedItem[] = [
        { productId: 'p1', quantity: 5, unitPrice: 10 }, // no discount: $50
        { productId: 'p2', quantity: 10, unitPrice: 20 }, // 5% discount: $190
      ];
      expect(calculateOrderTotal(lines)).toBe(240);
    });

    it('applies the correct discount tier per line independently', () => {
      const lines: OrderedItem[] = [
        { productId: 'p1', quantity: 100, unitPrice: 10 }, // 15% → $850
        { productId: 'p2', quantity: 5, unitPrice: 10 }, // 0%  → $50
      ];
      expect(calculateOrderTotal(lines)).toBe(900);
    });
  });

  describe('calculateRestockPriority', () => {
    it('returns 100 when quantity is 0 (out of stock)', () => {
      expect(calculateRestockPriority({ productId: 'p1', quantity: 0, reorderThreshold: 10 })).toBe(
        100,
      );
    });

    it('returns 100 when quantity equals threshold', () => {
      expect(
        calculateRestockPriority({ productId: 'p1', quantity: 10, reorderThreshold: 10 }),
      ).toBe(100);
    });

    it('returns 100 when quantity is below threshold', () => {
      expect(calculateRestockPriority({ productId: 'p1', quantity: 5, reorderThreshold: 10 })).toBe(
        100,
      );
    });

    it('returns 50 when quantity is between threshold and 2× threshold', () => {
      expect(
        calculateRestockPriority({ productId: 'p1', quantity: 15, reorderThreshold: 10 }),
      ).toBe(50);
    });

    it('returns 0 when stock is healthy (above 2× threshold)', () => {
      expect(
        calculateRestockPriority({ productId: 'p1', quantity: 21, reorderThreshold: 10 }),
      ).toBe(0);
    });

    it('returns 50 at exactly 2× threshold', () => {
      expect(
        calculateRestockPriority({ productId: 'p1', quantity: 20, reorderThreshold: 10 }),
      ).toBe(50);
    });
  });
});
