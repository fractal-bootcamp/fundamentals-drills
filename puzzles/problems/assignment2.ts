/*
Assignment 2: Actions & Orchestration
Domain: Warehouse Order Processing System

We are processing a timeline of warehouse events (placeOrder, restock, cancelOrder).

Main Action:
- Iterate through WarehouseEvents
- Maintain WarehouseState (inventory, orders, totalRevenue, eventLog)
- Use Assignment 1 to validate, check fulfillability, compute totals, and assess restock urgency

Rules:
1. placeOrder: validate items → check fulfillable → deduct inventory → record fulfilled order + revenue
2. restock: add units to inventory; log new stock urgency level (CRITICAL / LOW / HEALTHY)
3. cancelOrder: if order was fulfilled, restore inventory and deduct revenue; mark order cancelled

Example Input:
{
  initialInventory: [
    { productId: "p1", quantity: 100, reorderThreshold: 20 }
  ],
  events: [
    { type: "placeOrder", orderId: "o1", items: [{ productId: "p1", quantity: 30, unitPrice: 10 }] },
    { type: "cancelOrder", orderId: "o1" },
    { type: "restock", productId: "p1", quantity: 50 }
  ]
}

Example Output:
{
  inventory: Map { "p1" => { productId: "p1", quantity: 120, reorderThreshold: 20 } },
  orders: Map { "o1" => { orderId: "o1", items: [...], status: "cancelled", total: 285 } },
  totalRevenue: 0,
  eventLog: [
    "Order o1 fulfilled. Total: $285.00",
    "Order o1 cancelled. Inventory restored.",
    "Restocked p1 by 50 units. New quantity: 120. Stock: HEALTHY"
  ]
}
*/

import {
  validateOrderItems,
  isOrderFulfillable,
  calculateOrderTotal,
  calculateRestockPriority,
  type InventoryItem,
  type OrderedItem,
  type Order,
} from './assignment1';

// --- Event Types ---

export type WarehouseEvent =
  | { type: 'placeOrder'; orderId: string; items: Array<OrderedItem> }
  | { type: 'restock'; productId: string; quantity: number }
  | { type: 'cancelOrder'; orderId: string };

// --- State ---

export interface WarehouseState {
  inventory: Map<string, InventoryItem>;
  orders: Map<string, Order>;
  totalRevenue: number;
  eventLog: Array<string>;
}

export interface WarehouseResult {
  finalState: WarehouseState;
  eventsProcessed: number;
}

// --- Main Action ---

export function processWarehouseEvents(
  initialInventory: InventoryItem[],
  events: WarehouseEvent[],
): WarehouseResult {
  let state: WarehouseState = {
    inventory: new Map(initialInventory.map((item) => [item.productId, item])),
    orders: new Map(),
    totalRevenue: 0,
    eventLog: [],
  };

  for (const event of events) {
    if (event.type === 'placeOrder') {
      state = handlePlaceOrder(state, event.orderId, event.items);
    } else if (event.type === 'restock') {
      state = handleRestock(state, event.productId, event.quantity);
    } else if (event.type === 'cancelOrder') {
      state = handleCancelOrder(state, event.orderId);
    }
  }

  return { finalState: state, eventsProcessed: events.length };
}

// --- Private Action Handlers ---

// Action: validates and fulfills an order.
// - On validation error → log rejection, do not create order
// - On insufficient stock → log rejection, do not create order
// - On success → deduct inventory per line, create fulfilled order, add to revenue
function handlePlaceOrder(
  state: WarehouseState,
  orderId: string,
  items: OrderedItem[],
): WarehouseState {
  // validation layer
  // get all known productIds from current inventory
  const knownProductIds = new Set(state.inventory.keys()); // Set keys b/c the inventory's a Map

  // capture any errors from helper fn testing if our item's productId exist in our inventory of knownProductIds
  const errors = validateOrderItems(items, knownProductIds);

  // helper fn returns an array, if our array has any entries, log errors to state.eventLog
  if (errors.length > 0) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order ${orderId} rejected: ${errors.join('; ')}`],
    };
  }

  // if isOrderFulfillable helper fn returns a falsey value, log errors to state.eventLog
  if (!isOrderFulfillable(items, state.inventory)) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order ${orderId} rejected: insufficient stock`],
    };
  }

  // deduct inventory
  // use reduce to iterate over each item in items array
  const updatedInventory = items.reduce((inventory, item) => {
    // save a new Map using state.inventory as accumulator
    const newInventory = new Map(inventory);
    // get InventoryItem at key of item.productId, save to currentItem
    const currentItem = newInventory.get(item.productId)!;

    // save new quantity to newInventory and spread currentItem's other props
    newInventory.set(item.productId, {
      ...currentItem,
      quantity: currentItem.quantity - item.quantity,
    });

    return newInventory;
  }, state.inventory);

  // derive updatedTotal
  const updatedTotal = calculateOrderTotal(items);

  // create order
  const order: Order = {
    orderId,
    items,
    status: 'fulfilled',
    total: updatedTotal,
  };

  // create a new Map from state.orders
  const updatedOrders = new Map(state.orders);
  updatedOrders.set(orderId, order); // save newly created order as value for key of orderId

  return {
    ...state,
    inventory: updatedInventory,
    orders: updatedOrders,
    totalRevenue: state.totalRevenue + updatedTotal,
    eventLog: [...state.eventLog, `Order ${orderId} fulfilled for $${updatedTotal}`],
  };
}

// Action: adds units to a product's inventory.
// - On unknown productId → log failure
// - On success → update quantity, log new quantity and stock status (CRITICAL/LOW/HEALTHY)
//   Use calculateRestockPriority to determine the status label.
function handleRestock(state: WarehouseState, productId: string, quantity: number): WarehouseState {
  // validate if productId is in state
  const isProductInInventory = state.inventory.has(productId);

  // early return for false
  if (!isProductInInventory) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Restock failed, Product ${productId} not in inventory`],
    };
  }

  // get productId from inventory & type narrow
  const updatedItem = state.inventory.get(productId)!;
  // create new Map to store updatedInventory state
  const updatedInventory = new Map(state.inventory);
  // store new quantity
  const newQuantity = updatedItem.quantity + quantity;

  const newItem = {
    ...updatedItem,
    quantity: newQuantity,
  };

  // save updated item quantity to new state.inventory
  updatedInventory.set(productId, newItem);

  let urgencyLevel = '';
  const restockPriorityRating = calculateRestockPriority(newItem);

  if (restockPriorityRating === 100) {
    urgencyLevel = 'CRITICAL';
  } else if (restockPriorityRating === 50) {
    urgencyLevel = 'LOW';
  } else {
    urgencyLevel = 'HEALTHY';
  }

  return {
    ...state,
    inventory: updatedInventory,
    eventLog: [
      ...state.eventLog,
      `Restocked ${productId} by ${quantity} units. New quantity: ${newQuantity} Stock: ${urgencyLevel}`,
    ],
  };
}

// Action: cancels a previously fulfilled order.
// - On missing order → log failure
// - On order not fulfilled → log failure
// - On success → restore inventory per line, deduct revenue, mark order cancelled
function handleCancelOrder(state: WarehouseState, orderId: string): WarehouseState {
  const order = state.orders.get(orderId);

  if (!order) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order: ${orderId} not found`],
    };
  }

  if (order.status !== 'fulfilled') {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order: ${orderId} not fulfilled - cannot cancel`],
    };
  }

  // add inventory back to available stock
  const updatedInventory = order.items.reduce((inventory, item) => {
    // create new Map
    const newInventory = new Map(inventory);
    // get current item
    const currentItem = newInventory.get(item.productId)!;
    // save new quantity to newInventory
    newInventory.set(item.productId, {
      ...currentItem,
      quantity: currentItem.quantity + item.quantity,
    });

    return newInventory;
  }, state.inventory);

  const updatedOrders = new Map(state.orders);
  updatedOrders.set(orderId, {
    ...order,
    status: 'cancelled',
  });

  return {
    ...state,
    inventory: updatedInventory,
    orders: updatedOrders,
    totalRevenue: state.totalRevenue - order.total,
    eventLog: [...state.eventLog, `Order: ${orderId} cancelled`],
  };
}
