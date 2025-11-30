// Problem: E-Commerce Primitives
// We are building a fulfillment system for an online store.
// We need helpers to check stock, calculate shipment weights, find boxes, and update inventory.

import { Inventory } from "./assignment2";

// SHARED TYPES
export type Product = {
  id: string;
  weight: number; // in grams
  stock: number; // quantity available
};

export type Box = {
  id: string;
  maxWeight: number;
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
  inventory: Inventory,
  productId: string,
  requestedQuantity: number,
): boolean {
  const product = inventory[productId];

  if (!product) {
    return false;
  }

  if (product.stock < requestedQuantity) {
    return false;
  }

  return true;
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
  items: Array<OrderItem>,
  inventory: Inventory,
): number {
  let total = 0;

  for (const item of items) {
    const productId = item.productId;
    let currentWeight = 0;

    if (!inventory[productId].id) {
      currentWeight = 0;
    } else {
      currentWeight = currentWeight + inventory[productId].weight;
    }
    total = total + item.quantity * currentWeight;
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

export function findSmallestBox(boxes: Array<Box>, weight: number): Box | null {
  const bigEnoughBoxes = boxes.filter((box) => box.maxWeight >= weight);
  const smallestAvailBoxes = bigEnoughBoxes.sort((a, b) => a.maxWeight - b.maxWeight);

  return smallestAvailBoxes[0] || null;
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

export function reduceInventory(product: Product, quantity: number) {
  return {
    ...product,
    stock: product.stock - quantity,
  };
}
