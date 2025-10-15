/**
 * Vending Machine Simulator
 * 
 * You are building a vending machine that tracks inventory and processes purchases.
 * The machine accepts coins (quarters=25, dimes=10, nickels=5, pennies=1) and must
 * calculate correct change when items are purchased.
 * 
 * Input:
 * - inventory: Record<string, { price: number; quantity: number }>
 *   Item names mapped to price (in cents) and available quantity
 * - transactions: Array of { item: string; coinsInserted: number }
 *   Sequential purchase attempts with total cents inserted
 * 
 * Output:
 * - For each transaction, return:
 *   { success: boolean; change?: number; reason?: string }
 *   success=true if purchase completed (with change in cents)
 *   success=false if failed (with reason: "out of stock", "insufficient funds", or "item not found")
 * 
 * Rules:
 * - Transactions are processed in order; inventory depletes permanently
 * - If item is out of stock (quantity=0), return failure with "out of stock"
 * - If coins < price, return failure with "insufficient funds"
 * - If item doesn't exist, return failure with "item not found"
 * - On success, decrement quantity by 1 and return change = coinsInserted - price
 * - Inventory state persists across transactions
 * 
 * Examples:
 * 
 * inventory = { "soda": { price: 125, quantity: 2 } }
 * transactions = [
 *   { item: "soda", coinsInserted: 150 },
 *   { item: "soda", coinsInserted: 100 }
 * ]
 * => [
 *   { success: true, change: 25 },
 *   { success: false, reason: "insufficient funds" }
 * ]
 * 
 * inventory = { "chips": { price: 100, quantity: 1 } }
 * transactions = [
 *   { item: "chips", coinsInserted: 100 },
 *   { item: "chips", coinsInserted: 100 }
 * ]
 * => [
 *   { success: true, change: 0 },
 *   { success: false, reason: "out of stock" }
 * ]
 */

const denoms = [25, 10, 5, 1]

export function processVendingMachine(inventory, transactions) {
}