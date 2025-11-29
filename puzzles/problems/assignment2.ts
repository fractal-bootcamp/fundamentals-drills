/*
Assignment 2: Order Fulfillment Processor

Context:
We are processing a batch of customer orders.
We need to verify stock for ALL items in an order, find a box for the shipment,
and then update our inventory.

Input:
{
  orders: Array<{ id: string, items: Array<{ productId: string, quantity: number }> }>,
  inventory: Record<string, Product>,
  boxes: Array<Box>
}

Rules:
- Process orders in order.
- For each order:
  1. Check if ALL items are in stock. If any item is missing or low stock, fail the whole order.
  2. Calculate the total weight of the order.
  3. Find the smallest box that fits the order. (If no box fits, fail the order "Too heavy").
  4. If all checks pass:
     - Update inventory for EVERY item in the order.
     - Create a shipment record.
  5. If failed:
     - Add to 'failedOrders' list with reason.

- Return:
  {
    inventory: Record<string, Product>, // Final state
    shipments: Array<{ orderId: string, boxId: string, totalWeight: number }>,
    failedOrders: Array<{ orderId: string, reason: string }>
  }

Edge Cases:
- Order with item not in inventory -> Fail "Item ... invalid"
- Order with insufficient stock -> Fail "Item ... out of stock"
- Order too heavy for any box -> Fail "Too heavy"

NOTE:
Use helpers from Assignment 1.
Be careful to update inventory for ALL items only if the order succeeds.
*/

import {
  type Product,
  type Box,
  type OrderItem,
  checkStock,
  calculateTotalWeight,
  findSmallestBox,
  reduceInventory,
} from "./assignment1";

type Order = {
  id: string;
  items: OrderItem[];
};

type FulfillmentInput = {
  orders: Order[];
  inventory: Record<string, Product>;
  boxes: Box[];
};

type Shipment = {
  orderId: string;
  boxId: string;
  totalWeight: number;
};

type FailedOrder = {
  orderId: string;
  reason: string;
};

type FulfillmentOutput = {
  inventory: Record<string, Product>;
  shipments: Shipment[];
  failedOrders: FailedOrder[];
};

export function processOrders(input: FulfillmentInput): FulfillmentOutput {
  // Initialize State
  const inventory = { ...input.inventory }; // Shallow copy of record
  const shipments: Shipment[] = [];
  const failedOrders: FailedOrder[] = [];

  for (const order of input.orders) {
    // 1. Verify Stock for ALL items
    let stockError: string | null = null;

    for (const item of order.items) {
      if (!checkStock(inventory, item.productId, item.quantity)) {
        // We can be specific: is it missing or just low stock?
        // For simplicity, generic error or specific if you want.
        stockError = `Item ${item.productId} issue`;
        break; // Stop checking items for this order
      }
    }

    if (stockError) {
      failedOrders.push({ orderId: order.id, reason: stockError });
      continue;
    }

    // 2. Calculate Weight
    const weight = calculateTotalWeight(order.items, inventory);

    // 3. Find Box
    const box = findSmallestBox(input.boxes, weight);

    if (!box) {
      failedOrders.push({ orderId: order.id, reason: "Too heavy" });
      continue;
    }

    // --- EXECUTE FULFILLMENT ---
    // At this point, we know stock is good AND box is good.
    // Now we must commit the transaction.

    // 4. Update Inventory for all items
    for (const item of order.items) {
      const currentProduct = inventory[item.productId];
      // Save the updated product back to the record
      inventory[item.productId] = reduceInventory(currentProduct, item.quantity);
    }

    // 5. Create Shipment
    shipments.push({
      orderId: order.id,
      boxId: box.id,
      totalWeight: weight,
    });
  }

  return {
    inventory,
    shipments,
    failedOrders,
  };
}
