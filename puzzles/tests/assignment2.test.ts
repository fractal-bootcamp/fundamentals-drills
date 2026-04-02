import { describe, it, expect } from 'vitest';
import { processWarehouseEvents, type WarehouseEvent } from '../problems/assignment2';
import type { InventoryItem, OrderedItem } from '../problems/assignment1';

describe('Assignment 2: Actions & Orchestration', () => {
  const makeItem = (productId: string, quantity: number, reorderThreshold = 10): InventoryItem => ({
    productId,
    quantity,
    reorderThreshold,
  });

  describe('placeOrder event', () => {
    it('fulfills a valid order and deducts inventory', () => {
      const inventory = [makeItem('p1', 100)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 30, unitPrice: 10 }],
        },
      ];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.inventory.get('p1')?.quantity).toBe(70);
      expect(result.finalState.orders.get('o1')?.status).toBe('fulfilled');
      expect(result.finalState.totalRevenue).toBeGreaterThan(0);
      expect(result.finalState.eventLog[0]).toContain('fulfilled');
    });

    it('rejects order when stock is insufficient', () => {
      const inventory = [makeItem('p1', 5)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 10, unitPrice: 10 }],
        },
      ];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.orders.has('o1')).toBe(false);
      expect(result.finalState.inventory.get('p1')?.quantity).toBe(5); // unchanged
      expect(result.finalState.totalRevenue).toBe(0);
      expect(result.finalState.eventLog[0]).toContain('rejected');
    });

    it('rejects order with unknown product ID', () => {
      const inventory = [makeItem('p1', 100)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'ghost', quantity: 1, unitPrice: 10 }],
        },
      ];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.orders.has('o1')).toBe(false);
      expect(result.finalState.eventLog[0]).toContain('rejected');
    });

    it('applies bulk discount for large orders (100+ units = 15% off)', () => {
      const inventory = [makeItem('p1', 200)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 100, unitPrice: 10 }],
        },
      ];
      const result = processWarehouseEvents(inventory, events);

      // 100 * $10 * 0.85 = $850
      expect(result.finalState.orders.get('o1')?.total).toBe(850);
      expect(result.finalState.totalRevenue).toBe(850);
    });

    it('deducts inventory across multiple lines in one order', () => {
      const inventory = [makeItem('p1', 100), makeItem('p2', 50)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [
            { productId: 'p1', quantity: 20, unitPrice: 10 },
            { productId: 'p2', quantity: 15, unitPrice: 20 },
          ],
        },
      ];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.inventory.get('p1')?.quantity).toBe(80);
      expect(result.finalState.inventory.get('p2')?.quantity).toBe(35);
    });
  });

  describe('restock event', () => {
    it('increases inventory quantity and logs the new stock level', () => {
      const inventory = [makeItem('p1', 50)];
      const events: WarehouseEvent[] = [{ type: 'restock', productId: 'p1', quantity: 100 }];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.inventory.get('p1')?.quantity).toBe(150);
      expect(result.finalState.eventLog[0]).toContain('Restocked');
      expect(result.finalState.eventLog[0]).toContain('150');
    });

    it('logs CRITICAL status when stock is still at or below threshold after restock', () => {
      const inventory = [makeItem('p1', 0, 20)];
      const events: WarehouseEvent[] = [{ type: 'restock', productId: 'p1', quantity: 5 }];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.eventLog[0]).toContain('CRITICAL');
    });

    it('logs HEALTHY status when stock rises above 2× threshold', () => {
      const inventory = [makeItem('p1', 0, 10)];
      const events: WarehouseEvent[] = [{ type: 'restock', productId: 'p1', quantity: 25 }];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.eventLog[0]).toContain('HEALTHY');
    });

    it('fails gracefully for unknown product', () => {
      const inventory = [makeItem('p1', 50)];
      const events: WarehouseEvent[] = [{ type: 'restock', productId: 'unknown', quantity: 100 }];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.inventory.get('p1')?.quantity).toBe(50); // unchanged
      expect(result.finalState.eventLog[0]).toContain('failed');
    });
  });

  describe('cancelOrder event', () => {
    it('cancels a fulfilled order and restores inventory', () => {
      const inventory = [makeItem('p1', 100)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 30, unitPrice: 10 }],
        },
        { type: 'cancelOrder', orderId: 'o1' },
      ];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.inventory.get('p1')?.quantity).toBe(100); // restored
      expect(result.finalState.orders.get('o1')?.status).toBe('cancelled');
      expect(result.finalState.totalRevenue).toBe(0); // revenue reversed
      expect(result.finalState.eventLog[1]).toContain('cancelled');
    });

    it('fails gracefully for non-existent order', () => {
      const inventory = [makeItem('p1', 100)];
      const events: WarehouseEvent[] = [{ type: 'cancelOrder', orderId: 'ghost' }];
      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.eventLog[0]).toContain('not found');
    });

    it('fails gracefully when cancelling an already-cancelled order', () => {
      const inventory = [makeItem('p1', 100)];
      const events: WarehouseEvent[] = [
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 10, unitPrice: 10 }],
        },
        { type: 'cancelOrder', orderId: 'o1' },
        { type: 'cancelOrder', orderId: 'o1' }, // duplicate cancel
      ];
      const result = processWarehouseEvents(inventory, events);

      // inventory should only be restored once
      expect(result.finalState.inventory.get('p1')?.quantity).toBe(100);
      expect(result.finalState.eventLog[2]).toContain('not fulfilled');
    });
  });

  describe('Integration: Calculations driving Actions', () => {
    it('processes a full order lifecycle: place → restock → place again → cancel first', () => {
      const inventory = [makeItem('p1', 200, 20), makeItem('p2', 10, 15)];
      const events: WarehouseEvent[] = [
        // Large order: p1 gets 15% discount, p2 has no discount
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [
            { productId: 'p1', quantity: 100, unitPrice: 20 }, // 100 * $20 * 0.85 = $1700
            { productId: 'p2', quantity: 5, unitPrice: 50 }, // 5  * $50 * 1.00 = $250
          ],
        },
        // Restock p2 after low stock
        { type: 'restock', productId: 'p2', quantity: 50 },
        // Second order: p2 gets 5% discount (10 units)
        {
          type: 'placeOrder',
          orderId: 'o2',
          lines: [{ productId: 'p2', quantity: 10, unitPrice: 50 }], // 10 * $50 * 0.95 = $475
        },
        // Cancel first order
        { type: 'cancelOrder', orderId: 'o1' },
      ];

      const result = processWarehouseEvents(inventory, events);

      // o1 cancelled → p1 fully restored, p2 restored by 5 units
      expect(result.finalState.inventory.get('p1')?.quantity).toBe(200);
      // p2: 10 - 5 (o1) + 50 (restock) - 10 (o2) + 5 (cancel o1) = 50
      expect(result.finalState.inventory.get('p2')?.quantity).toBe(50);

      expect(result.finalState.orders.get('o1')?.status).toBe('cancelled');
      expect(result.finalState.orders.get('o2')?.status).toBe('fulfilled');

      // Only o2's $475 remains after o1 is cancelled
      expect(result.finalState.totalRevenue).toBe(475);
      expect(result.eventsProcessed).toBe(4);
    });

    it('handles sequential stock depletion, restock, and retry', () => {
      const inventory = [makeItem('p1', 20, 10)];
      const events: WarehouseEvent[] = [
        // o1 takes 15 units, leaving 5
        {
          type: 'placeOrder',
          orderId: 'o1',
          lines: [{ productId: 'p1', quantity: 15, unitPrice: 10 }],
        },
        // o2 fails: only 5 in stock, needs 10
        {
          type: 'placeOrder',
          orderId: 'o2',
          lines: [{ productId: 'p1', quantity: 10, unitPrice: 10 }],
        },
        // restock brings p1 to 35
        { type: 'restock', productId: 'p1', quantity: 30 },
        // o3 now succeeds
        {
          type: 'placeOrder',
          orderId: 'o3',
          lines: [{ productId: 'p1', quantity: 10, unitPrice: 10 }],
        },
      ];

      const result = processWarehouseEvents(inventory, events);

      expect(result.finalState.orders.get('o1')?.status).toBe('fulfilled');
      expect(result.finalState.orders.has('o2')).toBe(false); // rejected
      expect(result.finalState.orders.get('o3')?.status).toBe('fulfilled');

      // 20 - 15 (o1) + 30 (restock) - 10 (o3) = 25
      expect(result.finalState.inventory.get('p1')?.quantity).toBe(25);
      expect(result.eventsProcessed).toBe(4);
    });
  });
});
