// Problem: E-Commerce Primitives
// We are building a fulfillment system for an online store.
// We need helpers to check stock, calculate shipment weights, find boxes, and update inventory.

// SHARED TYPES
export type Product = {
  id: string;
  weight: number; // in grams
  stock: number; // quantity available
};

export type Box = {
  id: string;
  maxWeight: number; // in grams
};

export type OrderItem = {
  productId: string;
  quantity: number;
};

// ------------------------------------------------------------------

// Function 1: Check Stock
// Return true if the product exists AND has enough stock for the requested quantity.
//
// Input: Inventory (Record<string, Product>), productId (string), requestedQuantity (number)
// Output: boolean
//
// Examples:
// Inv: { "p1": { stock: 10 ... } }
// checkStock(inv, "p1", 5) => true
// checkStock(inv, "p1", 11) => false (not enough)
// checkStock(inv, "z9", 1) => false (product missing)

export function checkStock(
  inventory: Record<string, Product>,
  productId: string,
  quantity: number,
): boolean {
  const product = inventory[productId];
  if (!product) {
    return false;
  }
  return product.stock >= quantity;
}

// ------------------------------------------------------------------

// Function 2: Calculate Total Weight
// Calculate the total weight of a list of items.
// You need to look up each product's weight in the inventory.
// If a product is missing from inventory, assume weight is 0 (or handle gracefully).
//
// Input: OrderItem[], Inventory (Record<string, Product>)
// Output: number (total grams)
//
// Examples:
// Items: [{id: "p1", qty: 2}], Inv: {"p1": {weight: 100...}}
// => 200

export function calculateTotalWeight(
  items: OrderItem[],
  inventory: Record<string, Product>,
): number {
  let total = 0;
  for (const item of items) {
    const product = inventory[item.productId];
    if (product) {
      total += product.weight * item.quantity;
    }
  }
  return total;
}

// ------------------------------------------------------------------

// Function 3: Find Smallest Box
// Given a total weight and a list of available box types, return the box with the
// SMALLEST maxWeight that can still hold the total weight.
// If no box fits, return null.
//
// Input: Box[], weight (number)
// Output: Box | null
//
// Examples:
// Boxes: [{max: 500}, {max: 1000}], Weight: 400
// => Box {max: 500}
// Weight: 800 => Box {max: 1000}
// Weight: 2000 => null

export function findSmallestBox(boxes: Box[], weight: number): Box | null {
  // Filter for boxes that can hold the weight
  const validBoxes = boxes.filter((b) => b.maxWeight >= weight);

  if (validBoxes.length === 0) {
    return null;
  }

  // Sort by size ascending (smallest first)
  validBoxes.sort((a, b) => a.maxWeight - b.maxWeight);

  return validBoxes[0];
}

// ------------------------------------------------------------------

// Function 4: Reduce Inventory
// Return a NEW Product object with stock reduced by quantity.
// Do NOT mutate original.
//
// Input: Product, quantity (number)
// Output: Product
//
// Examples:
// Product: { stock: 10 ... }, qty: 3
// => { stock: 7 ... }

export function reduceInventory(product: Product, quantity: number): Product {
  return {
    ...product,
    stock: product.stock - quantity,
  };
}
