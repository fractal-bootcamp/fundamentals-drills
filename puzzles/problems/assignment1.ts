// Assignment 2 — State Management Drills (Gap B)
// -------------------------------------------------------------
// Goal: build comfort tracking mutable state across events,
// sessions, and inventories. Each puzzle should be pure: 
// no global mutation, return new states explicitly.


// 🧩 B1. Single SKU Tracker
/**
 * You manage stock for a single item.
 * Each event is {type: 'order' | 'restock', qty: number}.
 * Orders reduce stock; restocks increase stock.
 *
 * Example:
 *   stock = 3
 *   events = [{type: 'order', qty: 2}, {type: 'restock', qty: 1}]
 *   => 2   (3 - 2 + 1)
 */
export function processSingleSKU(
  stock: number,
  events: { type: string; qty: number }[]
): number {
  let totalStock = stock;

  for (let event of events) {
    if (event.type === "order") {
      totalStock -= event.qty
    }
    if (event.type === "restock") {
      totalStock += event.qty
    }
  }

  return totalStock;
}


// 🧩 B2. Multi-SKU Tracker
/**
 * Manage inventory for multiple SKUs.
 * Input:
 *   stock = {A: 3, B: 2}
 *   events = [
 *     {type: 'order', sku: 'A', qty: 1},
 *     {type: 'restock', sku: 'B', qty: 5}
 *   ]
 * Output:
 *   {A: 2, B: 7}
 */
export function processMultiSKU(
  stock: Record<string, number>,
  events: { type: string; sku: string; qty: number }[]
): Record<string, number> {
  let result = { ...stock };

  for (let event of events) {
    let eventSku = event.sku;

    // this line of code I gotta understand
    result[eventSku] = result[eventSku] ?? 0;


    if (event.type === "order") {
      result[eventSku] -= event.qty;
    }
    if (event.type === "restock") {
      result[eventSku] += event.qty;
    }
  }

  return result;
}

// NOTE
// 1. clone so you don't mutate the input
// 2. nullish operator? super cool !!

// 🧩 B3. Session Reset
/**
 * You simulate a vending session.
 * Input is a list of actions: ["insert", amount] or ["cancel"].
 * Each "cancel" resets credit to 0.
 * Return an array showing credit after each action.
 *
 * Example:
 *   [["insert", 25], ["insert", 10], ["cancel"], ["insert", 5]]
 *   => [25, 35, 0, 5]
 */
export function simulateCredit(actions: [string, number?][]): number[] {
  let credits: number[] = [];
  let sum: number = 0;
  for (let [type, amount] of actions) {
    if (type === "insert") {
      sum += amount ?? 0;
    }
    if (type === "cancel") {
      sum = 0;
    }
    credits.push(sum);
  }

  return credits;
}


// 🧩 B4. Shared Inventory, Resetting Credit
/**
 * Combine the previous ideas:
 * - You have an inventory {A: {price, stock}}
 * - You process sessions; each session is ["insert", x], ["select", "A"], ["cancel"]
 * - Credit resets after each session.
 * - Stock decreases when item is successfully bought.
 * - Ignore invalid selections.
 * Return final inventory.
 *
 * Example:
 *   inventory = {A: {price: 100, stock: 2}}
 *   sessions = [
 *     [["insert", 100], ["select", "A"]],
 *     [["insert", 50], ["cancel"]]
 *   ]
 *   => {A: {price: 100, stock: 1}}
 */
export function processSessions(
  inventory: Record<string, { price: number; stock: number }>,
  sessions: [string, any][][]
): Record<string, { price: number; stock: number }> {
  // your code
  return {};
}


// 🧩 B5. (Stretch) Cumulative Sessions with Sales
/**
 * Add to B4:
 * - Maintain a "sales" object {sku: totalSoldQty}.
 * Return {inventory, sales}.
 *
 * Example:
 *   -> {inventory: {A:{price:100,stock:1}}, sales:{A:1}}
 */
export function processWithSales(
  inventory: Record<string, { price: number; stock: number }>,
  sessions: [string, any][][]
): { inventory: Record<string, { price: number; stock: number }>; sales: Record<string, number> } {
  // your code
  return { inventory: {}, sales: {} };
}


// -------------------------------------------------------------
// End of Assignment 2 (Gap B)
// When you complete this, you'll be ready for Assignment 3 (Gap C)
// — Abstraction and Composition drills.
