import { describe, it, expect } from 'vitest';
import { processVendingMachine } from '../problems/assignment4';

describe('processVendingMachine', () => {
  it('should handle successful purchase with exact change', () => {
    const inventory = {
      chips: { price: 100, quantity: 5 }
    };
    const transactions = [
      { item: 'chips', coinsInserted: 100 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: true, change: 0 }
    ]);
  });

  it('should handle successful purchase with change returned', () => {
    const inventory = {
      soda: { price: 125, quantity: 3 }
    };
    const transactions = [
      { item: 'soda', coinsInserted: 150 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: true, change: 25 }
    ]);
  });

  it('should reject purchase with insufficient funds', () => {
    const inventory = {
      candy: { price: 75, quantity: 10 }
    };
    const transactions = [
      { item: 'candy', coinsInserted: 50 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: false, reason: 'insufficient funds' }
    ]);
  });

  it('should reject purchase when item is out of stock', () => {
    const inventory = {
      gum: { price: 50, quantity: 0 }
    };
    const transactions = [
      { item: 'gum', coinsInserted: 75 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: false, reason: 'out of stock' }
    ]);
  });

  it('should reject purchase when item does not exist', () => {
    const inventory = {
      chips: { price: 100, quantity: 5 }
    };
    const transactions = [
      { item: 'nonexistent', coinsInserted: 150 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: false, reason: 'item not found' }
    ]);
  });

  it('should deplete inventory across multiple transactions', () => {
    const inventory = {
      soda: { price: 125, quantity: 2 }
    };
    const transactions = [
      { item: 'soda', coinsInserted: 150 },
      { item: 'soda', coinsInserted: 125 },
      { item: 'soda', coinsInserted: 200 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: true, change: 25 },
      { success: true, change: 0 },
      { success: false, reason: 'out of stock' }
    ]);
  });

  it('should handle empty transaction list', () => {
    const inventory = {
      chips: { price: 100, quantity: 5 }
    };
    const transactions = [];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([]);
  });

  it('should process complex realistic scenario with multiple items and mixed outcomes', () => {
    const inventory = {
      soda: { price: 125, quantity: 2 },
      chips: { price: 100, quantity: 1 },
      candy: { price: 75, quantity: 3 },
      gum: { price: 50, quantity: 0 }
    };
    const transactions = [
      { item: 'soda', coinsInserted: 150 },
      { item: 'chips', coinsInserted: 100 },
      { item: 'candy', coinsInserted: 50 },
      { item: 'gum', coinsInserted: 100 },
      { item: 'chips', coinsInserted: 100 },
      { item: 'soda', coinsInserted: 200 },
      { item: 'cookie', coinsInserted: 100 },
      { item: 'candy', coinsInserted: 100 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: true, change: 25 },
      { success: true, change: 0 },
      { success: false, reason: 'insufficient funds' },
      { success: false, reason: 'out of stock' },
      { success: false, reason: 'out of stock' },
      { success: true, change: 75 },
      { success: false, reason: 'item not found' },
      { success: true, change: 25 }
    ]);
  });

  it('should not modify original inventory object', () => {
    const inventory = {
      soda: { price: 125, quantity: 2 }
    };
    const transactions = [
      { item: 'soda', coinsInserted: 150 }
    ];
    
    processVendingMachine(inventory, transactions);
    
    expect(inventory.soda.quantity).toBe(2);
  });

  it('should handle edge case with zero-priced items', () => {
    const inventory = {
      free: { price: 0, quantity: 1 }
    };
    const transactions = [
      { item: 'free', coinsInserted: 0 },
      { item: 'free', coinsInserted: 25 }
    ];
    
    const result = processVendingMachine(inventory, transactions);
    
    expect(result).toEqual([
      { success: true, change: 0 },
      { success: false, reason: 'out of stock' }
    ]);
  });
});