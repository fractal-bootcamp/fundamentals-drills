/*
Assignment 1: Data & Calculations
Domain: Warehouse Inventory Management

We are building the pure logic for a warehouse order fulfillment system.

Calculations to Implement:
1. validateOrderItems(items, knownProductIds)   // Calculation: returns error messages for invalid product IDs, quantities, or prices
2. isOrderFulfillable(items, inventory)         // Calculation: returns true if all line items have sufficient stock
3. applyBulkDiscount(quantity, unitPrice)       // Calculation: tiered volume discount (0% / 5% / 10% / 15%)
4. calculateOrderTotal(items)                   // Calculation: sums discounted line totals across all items
5. calculateRestockPriority(item)               // Calculation: urgency score 0–100 based on stock vs. reorder threshold

Example Input / Output:
// calculateOrderTotal([{ productId: "p1", quantity: 50, unitPrice: 20.00 }])
// → 900.00   (50 * $20 = $1000, minus 10% bulk discount for 25–99 units)
//
// calculateRestockPriority({ productId: "p1", quantity: 5, reorderThreshold: 20 })
// → 100   (quantity is at or below threshold → critical)
*/

// --- Data Types ---

export interface InventoryItem {
  productId: string;
  quantity: number; // current units in stock
  reorderThreshold: number; // trigger restocking when stock falls to or below this
}

export interface OrderedItem {
  productId: string;
  quantity: number;
  unitPrice: number; // selling price per unit
}

export type OrderStatus = 'fulfilled' | 'cancelled' | 'rejected';

export interface Order {
  orderId: string;
  items: Array<OrderedItem>;
  status: OrderStatus;
  total: number;
}

// --- Pure Calculations ---

// Calculation: validates that all OrderedItems reference known product IDs and have
// positive quantities and non-negative prices.
// Returns a list of error messages; an empty array means the order is valid.
//
// Example: validateOrderItems([{ productId: "p99", quantity: 0, unitPrice: 10 }], new Set(["p1"]))
// → ["Unknown product: p99", "Invalid quantity for p99: 0"]
export function validateOrderItems(
  items: Array<OrderedItem>,
  knownProductIds: Set<string>,
): Array<string> {
  // knownId = for id in knownProductIds.productId
  const resultObject: Array<string> = [];

  for (const item of items) {
    // unknown productId
    if (!knownProductIds.has(item.productId)) {
      resultObject.push(`Unknown product: ${item.productId}`);
    }
    // invalid quantity
    if (item.quantity <= 0) {
      resultObject.push(`Invalid quantity for ${item.productId}: ${item.quantity}`);
    }
    // invalid price
    if (item.unitPrice < 0) {
      resultObject.push(`Invalid price for ${item.productId}: ${item.unitPrice}`);
    }
  }

  return resultObject;
}

// Calculation: returns true only if every line item has a matching product in
// inventory AND that product has enough stock to cover the requested quantity.
// An empty items array is considered unfulfillable.
//
// Example: isOrderFulfillable([{ productId: "p1", quantity: 5, unitPrice: 10 }], Map { "p1" => { quantity: 3, ... } })
// → false  (only 3 in stock, need 5)
export function isOrderFulfillable(
  items: Array<OrderedItem>,
  inventory: Map<string, InventoryItem>,
): boolean {
  for (const item of items) {
    // does producut exist in inventory?
    const inventoryItem = inventory.get(item.productId);

    // is there enough stock to support the order?
    if (!inventoryItem || inventoryItem.quantity < item.quantity) {
      return false;
    }
  }
  return true;
}

// Calculation: applies a tiered bulk discount to a single line's subtotal.
// Tiers: 1–9 units → 0%, 10–24 → 5%, 25–99 → 10%, 100+ → 15%
//
// Example: applyBulkDiscount(25, 10)  → 225.00  (250 * 0.90)
// Example: applyBulkDiscount(9, 10)   → 90.00   (no discount)
export function applyBulkDiscount(quantity: number, unitPrice: number): number {
  let discount = 0;

  if (quantity >= 1 && quantity <= 9) {
    discount = 0;
  } else if (quantity >= 10 && quantity <= 24) {
    discount = 5 / 100;
  } else if (quantity >= 25 && quantity <= 99) {
    discount = 10 / 100;
  } else discount = 15 / 100;

  const subtotal = quantity * unitPrice;

  return subtotal * (1 - discount);
}

// Calculation: sums the discounted totals of all order items.
// Delegates per-line discounting to applyBulkDiscount.
//
// Example: calculateOrderTotal([{ productId: "p1", quantity: 10, unitPrice: 20 }])
// → 190.00  (200 * 0.95, 5% discount for 10–24 units)
export function calculateOrderTotal(items: Array<OrderedItem>): number {
  let total = 0;

  for (const item of items) {
    const discount = applyBulkDiscount(item.quantity, item.unitPrice);
    total += discount; // add to running total
  }

  return total;
}

// Calculation: produces an urgency score for restocking decisions.
// 100 = out of stock or at/below threshold (critical)
// 50  = between threshold and 2× threshold (low)
// 0   = above 2× threshold (healthy)
//
// Example: calculateRestockPriority({ productId: "p1", quantity: 15, reorderThreshold: 10 })
// → 50   (15 is between 10 and 20)
export function calculateRestockPriority(item: InventoryItem): number {
  if (item.quantity <= item.reorderThreshold) {
    // set inventory warning to 100 - critical
    return 100;
  }

  const twiceThreshold = item.reorderThreshold * 2;
  if (item.quantity <= twiceThreshold) {
    // set inventory warning to 50 - low
    return 50;
  }
  // anythying else, set inventory warning to 0 - healthy
  return 0;
}
