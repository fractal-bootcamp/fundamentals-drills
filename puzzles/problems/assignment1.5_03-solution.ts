/**
 * Assignment 1.5_03 — Warehouse Inventory Manager (SOLUTION)
 *
 * This solution demonstrates:
 * 1. Using Map with composite keys (combining itemId + warehouse into a single string key)
 * 2. Storing complex objects as Map values
 * 3. Multi-level sorting with multiple criteria
 * 4. Converting Map back to array for filtering and sorting
 */

export function lowStockItems(
  initialInventory: Array<{ itemId: string; warehouse: string; stock: number }>,
  shipments: Array<{ type: "in" | "out"; itemId: string; warehouse: string; quantity: number }>,
  threshold: number
): Array<{ itemId: string; warehouse: string; stock: number }> {
  // Create a Map to track inventory by (itemId, warehouse) combination
  // Key: "itemId|warehouse" (composite key using a delimiter)
  // Value: { itemId, warehouse, stock }
  const inventory = new Map<string, { itemId: string; warehouse: string; stock: number }>();

  // Helper function to create a unique key for each (itemId, warehouse) pair
  const makeKey = (itemId: string, warehouse: string) => `${itemId}|${warehouse}`;

  // Initialize the inventory Map from the starting inventory
  for (const item of initialInventory) {
    const key = makeKey(item.itemId, item.warehouse);
    inventory.set(key, { ...item }); // Copy the object to avoid mutating input
  }

  // Process each shipment
  for (const shipment of shipments) {
    const key = makeKey(shipment.itemId, shipment.warehouse);
    const item = inventory.get(key);

    // Ignore shipments for items that don't exist in inventory
    if (!item) {
      continue;
    }

    // Update stock based on shipment type
    if (shipment.type === "in") {
      item.stock += shipment.quantity;
    } else {
      // "out" shipment - subtract but don't go below 0
      item.stock = Math.max(0, item.stock - shipment.quantity);
    }
  }

  // Convert Map to array, filter for low stock, and sort
  return Array.from(inventory.values())
    .filter(item => item.stock <= threshold)
    .sort((a, b) => {
      // Primary sort: by stock (ascending)
      if (a.stock !== b.stock) {
        return a.stock - b.stock;
      }
      // Secondary sort: by itemId (alphabetically)
      if (a.itemId !== b.itemId) {
        return a.itemId.localeCompare(b.itemId);
      }
      // Tertiary sort: by warehouse (alphabetically)
      return a.warehouse.localeCompare(b.warehouse);
    });
}

/**
 * Alternative solution using forEach for processing:
 */
export function lowStockItemsAlt(
  initialInventory: Array<{ itemId: string; warehouse: string; stock: number }>,
  shipments: Array<{ type: "in" | "out"; itemId: string; warehouse: string; quantity: number }>,
  threshold: number
): Array<{ itemId: string; warehouse: string; stock: number }> {
  const inventory = new Map<string, { itemId: string; warehouse: string; stock: number }>();
  const makeKey = (itemId: string, warehouse: string) => `${itemId}|${warehouse}`;

  // Initialize inventory
  initialInventory.forEach(item => {
    inventory.set(makeKey(item.itemId, item.warehouse), { ...item });
  });

  // Process shipments
  shipments.forEach(shipment => {
    const key = makeKey(shipment.itemId, shipment.warehouse);
    const item = inventory.get(key);

    if (item) {
      if (shipment.type === "in") {
        item.stock += shipment.quantity;
      } else {
        item.stock = Math.max(0, item.stock - shipment.quantity);
      }
    }
  });

  // Filter and sort
  return Array.from(inventory.values())
    .filter(item => item.stock <= threshold)
    .sort((a, b) => {
      if (a.stock !== b.stock) return a.stock - b.stock;
      if (a.itemId !== b.itemId) return a.itemId.localeCompare(b.itemId);
      return a.warehouse.localeCompare(b.warehouse);
    });
}

/**
 * Alternative solution using an object instead of Map:
 * This works but Map is more idiomatic for this use case.
 */
export function lowStockItemsWithObject(
  initialInventory: Array<{ itemId: string; warehouse: string; stock: number }>,
  shipments: Array<{ type: "in" | "out"; itemId: string; warehouse: string; quantity: number }>,
  threshold: number
): Array<{ itemId: string; warehouse: string; stock: number }> {
  const inventory: Record<string, { itemId: string; warehouse: string; stock: number }> = {};
  const makeKey = (itemId: string, warehouse: string) => `${itemId}|${warehouse}`;

  // Initialize
  for (const item of initialInventory) {
    inventory[makeKey(item.itemId, item.warehouse)] = { ...item };
  }

  // Process shipments
  for (const shipment of shipments) {
    const key = makeKey(shipment.itemId, shipment.warehouse);
    const item = inventory[key];

    if (item) {
      if (shipment.type === "in") {
        item.stock += shipment.quantity;
      } else {
        item.stock = Math.max(0, item.stock - shipment.quantity);
      }
    }
  }

  // Filter and sort
  return Object.values(inventory)
    .filter(item => item.stock <= threshold)
    .sort((a, b) => {
      if (a.stock !== b.stock) return a.stock - b.stock;
      if (a.itemId !== b.itemId) return a.itemId.localeCompare(b.itemId);
      return a.warehouse.localeCompare(b.warehouse);
    });
}
