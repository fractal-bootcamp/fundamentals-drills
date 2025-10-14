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

    if (item.quantity < 0) {
      console.log('failed items:', failedItems)

      failedItems.push(`Invalid quantity for product ${product.name}`);

      console.log('failed items after push:', failedItems)
      continue;
    }

    if (product.stock < item.quantity) {
      failedItems.push(`Insufficient stock for product ${product.name}`);
      continue;
    }

    totalAmount = Math.round((totalAmount + product.price * item.quantity) * 100) / 100;
    processedItems.push({ product, quantity: item.quantity });
  }

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

  return {
    success: true,
    orderId: order.orderId,
    totalAmount: totalAmount,
    message: 'Order processed successfully',
    failedItems: undefined
  };
}
