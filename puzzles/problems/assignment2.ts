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
  // get all known productIds from current inventory
  const knownProductIds = new Set(state.inventory.keys());

  const errors = validateOrderItems(items, knownProductIds);

  if (errors.length > 0) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order ${orderId} rejected: ${errors.join('; ')}`],
    };
  }

  if (!isOrderFulfillable(items, state.inventory)) {
    return {
      ...state,
      eventLog: [...state.eventLog, `Order ${orderId} rejected: insufficient stock`],
    };
  }

  // deduct inventory
  const updatedInventory = items.reduce((inventory, item) => {
    const newInventory = new Map(inventory);
    const currentItem = newInventory.get(item.productId)!;

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

  const updatedOrders = new Map(state.orders);
  updatedOrders.set(orderId, order);

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
  // TODO
  return state;
}

// Action: cancels a previously fulfilled order.
// - On missing order → log failure
// - On order not fulfilled → log failure
// - On success → restore inventory per line, deduct revenue, mark order cancelled
function handleCancelOrder(state: WarehouseState, orderId: string): WarehouseState {
  // TODO
  return state;
}
