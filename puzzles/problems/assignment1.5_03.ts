/**
 * Assignment 1.5_03 — Warehouse Inventory Manager
 *
 * Context:
 * You are managing inventory across multiple warehouses. Each warehouse tracks different items
 * and their stock levels. You need to process a series of shipment events (items arriving or
 * leaving) and then report which items are running low on stock.
 *
 * Input:
 *   - initialInventory: Array<{ itemId: string; warehouse: string; stock: number }>
 *     The starting inventory. Each item can only exist once per warehouse.
 *   - shipments: Array<{ type: "in" | "out"; itemId: string; warehouse: string; quantity: number }>
 *     Shipments in chronological order. "in" adds stock, "out" removes stock.
 *   - threshold: number
 *     The minimum stock level. Items at or below this are considered "low stock".
 *
 * Output:
 *   - Array<{ itemId: string; warehouse: string; stock: number }>
 *     All items that are at or below the threshold, sorted by stock (lowest first).
 *     If stocks are equal, sort by itemId alphabetically, then by warehouse alphabetically.
 *
 * Rules:
 *   - Each (itemId, warehouse) pair is unique - an item can exist in multiple warehouses.
 *   - "in" shipments add to stock; "out" shipments subtract from stock.
 *   - Stock cannot go below 0. If an "out" shipment would make stock negative, set it to 0.
 *   - Ignore shipments for (itemId, warehouse) pairs that don't exist in initial inventory.
 *   - Only return items that are at or below the threshold (threshold is inclusive).
 *
 * Examples:
 *   lowStockItems(
 *     [
 *       { itemId: "widget", warehouse: "A", stock: 10 },
 *       { itemId: "gadget", warehouse: "A", stock: 5 }
 *     ],
 *     [
 *       { type: "out", itemId: "widget", warehouse: "A", quantity: 8 }
 *     ],
 *     3
 *   ) -> [
 *     { itemId: "widget", warehouse: "A", stock: 2 }
 *   ]
 *
 *   lowStockItems(
 *     [
 *       { itemId: "widget", warehouse: "A", stock: 10 },
 *       { itemId: "widget", warehouse: "B", stock: 2 }
 *     ],
 *     [],
 *     5
 *   ) -> [
 *     { itemId: "widget", warehouse: "B", stock: 2 }
 *   ]
 */

// input:
// initialInventory: Array<{ [itemId: string]; warehouse: string; stock: number }>
// shipments: Array<{ type: "in" | "out"; itemId: string; warehouse: string; quantity: number }>
// threshold: number



type InitInv = Array<
  itemId: Item
warehouse: Warehouse
stock: WarehouseQuantity
  >

  type Product = {
    type: string
  itemId: string
  warehouse: string
  quantity: number
  }

type Shipment = Product[]

type Item = string
type Warehouse = string
type WarehouseQuantity = number

type ShipmentType = "in" | "out"
type ShipmentQuant = number

type MinimumProdThreshold = number

type Output = Array<{
  itemId: Item
  warehouse: Warehouse
  stock: number
}>
// output:
// Array<{ itemId: string; warehouse: string; stock: number }>

export function lowStockItems(initialInventory, shipments, threshold) {



  return []
}
