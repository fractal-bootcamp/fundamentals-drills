export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  timestamp: Date;
}

export interface OrderResult {
  success: boolean;
  orderId: string;
  totalAmount: number;
  message: string;
  failedItems?: string[];
}

/**
 * Processes a customer order by validating items, checking stock availability,
 * calculating the total amount, and updating inventory.
 *
 * @param order - The order to process containing customer and item information
 * @param inventory - The available products in the inventory
 * @returns An OrderResult object indicating success/failure and order details
 */
export function processOrder(order: Order, inventory: Product[]): OrderResult {
  if (!order || !order.items || order.items.length === 0) {
    return {
      success: false,
      orderId: order?.orderId || '',
      totalAmount: 0,
      message: 'Order must contain at least one item'
    };
  }

  const inventoryMap = new Map<string, Product>();
  for (const product of inventory) {
    inventoryMap.set(product.id, product);
  }

  let totalAmount = 0;
  const failedItems: string[] = [];
  const processedItems: Array<{ product: Product; quantity: number }> = [];

  for (const item of order.items) {
    const product = inventoryMap.get(item.productId);

    if (!product) {
      failedItems.push(`Product ${item.productId} not found`);
      continue;
    }

    // BUG FIX #1: Changed from `<= 0` to `< 0`
    // Zero quantity is a valid edge case (customer adding then removing from cart)
    // Only negative quantities should be rejected as invalid
    if (item.quantity < 0) {
      failedItems.push(`Invalid quantity for product ${product.name}`);
      continue;
    }

    // BUG FIX #2: Changed from `<=` to `<`
    // When stock equals quantity, the order should be allowed (e.g., buying last 10 items when stock is 10)
    // Only reject when stock is strictly less than the requested quantity
    if (product.stock < item.quantity) {
      failedItems.push(`Insufficient stock for product ${product.name}`);
      continue;
    }

    // BUG FIX #3: Removed Math.round() from accumulation step
    // Rounding on each iteration causes precision loss and incorrect totals
    // Instead, simply accumulate the values and let JavaScript handle floating point
    totalAmount += product.price * item.quantity;
    processedItems.push({ product, quantity: item.quantity });
  }

  // BUG FIX #4: Added check for `processedItems.length === 0`
  // Only return failure when ALL items failed, not when ANY items failed
  // Partial success (some items succeed, some fail) should still process successfully
  if (failedItems.length > 0 && processedItems.length === 0) {
    return {
      success: false,
      orderId: order.orderId,
      totalAmount: 0,
      message: 'Order processing failed',
      failedItems
    };
  }

  for (const processed of processedItems) {
    processed.product.stock -= processed.quantity;
  }

  // BUG FIX #5: Removed `failedItems: undefined` from the return object
  // When a field is optional (failedItems?), omit it entirely rather than setting to undefined
  // This keeps the response clean and follows TypeScript optional property conventions
  return {
    success: true,
    orderId: order.orderId,
    totalAmount: totalAmount,
    message: 'Order processed successfully'
  };
}
