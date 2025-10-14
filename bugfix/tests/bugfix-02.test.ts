import { processOrder, Product, Order, OrderResult } from '../src/bugfix-02';

describe('processOrder', () => {
  let inventory: Product[];

  beforeEach(() => {
    inventory = [
      { id: 'P001', name: 'Laptop', price: 999.99, stock: 10 },
      { id: 'P002', name: 'Mouse', price: 29.99, stock: 50 },
      { id: 'P003', name: 'Keyboard', price: 79.99, stock: 30 },
      { id: 'P004', name: 'Monitor', price: 299.99, stock: 15 },
      { id: 'P005', name: 'USB Cable', price: 9.99, stock: 100 }
    ];
  });

  describe('validation', () => {
    it('should reject orders with no items', () => {
      const order: Order = {
        orderId: 'ORD001',
        customerId: 'C001',
        items: [],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Order must contain at least one item');
      expect(result.totalAmount).toBe(0);
    });

    it('should reject items with negative quantity', () => {
      const order: Order = {
        orderId: 'ORD002',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: -5 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(false);
      expect(result.failedItems).toContain('Invalid quantity for product Laptop');
    });

    it('should reject items for products not in inventory', () => {
      const order: Order = {
        orderId: 'ORD003',
        customerId: 'C001',
        items: [
          { productId: 'P999', quantity: 1 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(false);
      expect(result.failedItems).toContain('Product P999 not found');
    });

    it('should reject items with insufficient stock', () => {
      const order: Order = {
        orderId: 'ORD004',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 15 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(false);
      expect(result.failedItems).toContain('Insufficient stock for product Laptop');
    });

    it('should accept items with quantity equal to stock', () => {
      const order: Order = {
        orderId: 'ORD005',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 10 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(9999.90);
    });

    it('should accept zero quantity orders', () => {
      const order: Order = {
        orderId: 'ORD006',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 0 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(0);
    });
  });

  describe('order processing', () => {
    it('should process a single item order successfully', () => {
      const order: Order = {
        orderId: 'ORD007',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 5 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('ORD007');
      expect(result.totalAmount).toBe(149.95);
      expect(result.message).toBe('Order processed successfully');
    });

    it('should process multiple items order successfully', () => {
      const order: Order = {
        orderId: 'ORD008',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 2 },
          { productId: 'P002', quantity: 3 },
          { productId: 'P003', quantity: 1 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(2169.94);
    });

    it('should calculate total correctly for multiple quantities', () => {
      const order: Order = {
        orderId: 'ORD009',
        customerId: 'C001',
        items: [
          { productId: 'P005', quantity: 10 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(99.90);
    });
  });

  describe('inventory management', () => {
    it('should update inventory stock after successful order', () => {
      const order: Order = {
        orderId: 'ORD010',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 3 }
        ],
        timestamp: new Date()
      };

      const initialStock = inventory[0].stock;
      processOrder(order, inventory);

      expect(inventory[0].stock).toBe(initialStock - 3);
    });

    it('should update multiple items inventory correctly', () => {
      const order: Order = {
        orderId: 'ORD011',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 2 },
          { productId: 'P002', quantity: 5 },
          { productId: 'P003', quantity: 3 }
        ],
        timestamp: new Date()
      };

      const initialStocks = [
        inventory[0].stock,
        inventory[1].stock,
        inventory[2].stock
      ];

      processOrder(order, inventory);

      expect(inventory[0].stock).toBe(initialStocks[0] - 2);
      expect(inventory[1].stock).toBe(initialStocks[1] - 5);
      expect(inventory[2].stock).toBe(initialStocks[2] - 3);
    });

    it('should not update inventory for fully failed orders', () => {
      const order: Order = {
        orderId: 'ORD012',
        customerId: 'C001',
        items: [
          { productId: 'P999', quantity: 1 }
        ],
        timestamp: new Date()
      };

      const initialStocks = inventory.map(p => p.stock);
      processOrder(order, inventory);

      inventory.forEach((product, index) => {
        expect(product.stock).toBe(initialStocks[index]);
      });
    });
  });

  describe('partial order processing', () => {
    it('should process valid items even when some items fail', () => {
      const order: Order = {
        orderId: 'ORD013',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 2 },
          { productId: 'P999', quantity: 1 },
          { productId: 'P002', quantity: 3 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(2089.95);
      expect(result.failedItems).toBeUndefined();
    });

    it('should handle mix of valid and out-of-stock items', () => {
      const order: Order = {
        orderId: 'ORD014',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 5 },
          { productId: 'P001', quantity: 20 },
          { productId: 'P005', quantity: 10 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(249.85);
    });

    it('should handle mix of valid and invalid quantity items', () => {
      const order: Order = {
        orderId: 'ORD015',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 5 },
          { productId: 'P003', quantity: -2 },
          { productId: 'P005', quantity: 3 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(179.92);
    });
  });

  describe('edge cases', () => {
    it('should handle orders with duplicate product IDs', () => {
      const order: Order = {
        orderId: 'ORD016',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 5 },
          { productId: 'P002', quantity: 3 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(239.92);
      expect(inventory[1].stock).toBe(42);
    });

    it('should preserve original order ID in result', () => {
      const order: Order = {
        orderId: 'SPECIAL-ORDER-12345',
        customerId: 'C001',
        items: [
          { productId: 'P001', quantity: 1 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.orderId).toBe('SPECIAL-ORDER-12345');
    });

    it('should handle large quantity orders', () => {
      const order: Order = {
        orderId: 'ORD017',
        customerId: 'C001',
        items: [
          { productId: 'P005', quantity: 99 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect(result.totalAmount).toBe(989.01);
    });

    it('should not include failedItems in successful responses', () => {
      const order: Order = {
        orderId: 'ORD018',
        customerId: 'C001',
        items: [
          { productId: 'P002', quantity: 1 }
        ],
        timestamp: new Date()
      };

      const result = processOrder(order, inventory);

      expect(result.success).toBe(true);
      expect('failedItems' in result).toBe(false);
    });
  });
});
