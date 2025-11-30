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
  Product,
  Box,
  OrderItem,
  checkStock,
  calculateTotalWeight,
  findSmallestBox,
  reduceInventory,
} from "./assignment1";

type Order = {
  id: string;
  items: Array<OrderItem>;
};

export type Inventory = Record<string, Product>;

type Shipment = {
  orderId: string;
  boxId: string;
  totalWeight: number;
};

type FulfillmentInput = {
  orders: Array<Order>;
  inventory: Record<string, Product>;
  boxes: Array<Box>;
};

type FulfillmentOutput = {
  inventory: Record<string, Product>;
  shipments: Array<Shipment>;
  failedOrders: Array<FailedOrder>;
};

type FailedOrder = {
  orderId: string;
  reason: string;
};

export function processOrders(input: FulfillmentInput): FulfillmentOutput {
  const { orders, boxes } = input;
  const currentInventory = { ...input.inventory };
  const failedOrders: Array<FailedOrder> = [];
  const shipments: Array<Shipment> = [];

  // are all items in stock?
  for (const order of orders) {
    let isStockOk = true;

    for (const item of order.items) {
      const pId = item.productId;

      // if item not in inventory fail: "Item ... invalid"
      if (!currentInventory[pId]) {
        failedOrders.push({
          orderId: pId,
          reason: "Item ... invalid",
        });
        isStockOk = false;
        break;
      }
      // if item out of stock fail: "Item ... out of stock"
      else if (!checkStock(currentInventory, pId, item.quantity)) {
        failedOrders.push({
          orderId: pId,
          reason: "Item ... out of stock",
        });
        isStockOk = false;
        break;
      }
    }

    if (!isStockOk) {
      continue;
    }

    // calculate total weight of order
    const orderWeight = calculateTotalWeight(order.items, currentInventory);

    // find smallest box that fits order
    const box = findSmallestBox(boxes, orderWeight);

    // if order too heavy fail: "Too heavy"
    if (!box) {
      failedOrders.push({
        orderId: order.id,
        reason: "Too heavy",
      });
      continue;
    }

    // update inventory for every item in order
    for (const item of order.items) {
      const pId = item.productId;
      const updatedProduct = reduceInventory(currentInventory[pId], item.quantity);
      currentInventory[pId] = updatedProduct;
    }

    // create a shipment record
    shipments.push({
      orderId: order.id,
      boxId: box.id,
      totalWeight: orderWeight,
    });
  }

  return {
    inventory: currentInventory,
    shipments,
    failedOrders,
  };
}
