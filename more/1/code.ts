export type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const SHIPPING_THRESHOLD = 50;

export type CheckoutSummary = {
  subtotal: number;
  discountedSubtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShipping: boolean;
};

export function computeCheckoutSummary(
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): CheckoutSummary {
    const rawSubtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

  const hasDiscount = discountCode?.toLowerCase() === "save10";
  // before:   const hasDiscount = discountCode === "save10";

  const discountRate = hasDiscount ? 0.1 : 0;

  const discountedSubtotal = rawSubtotal - rawSubtotal * discountRate;

  const tax = discountedSubtotal * taxRate;
  //before:   const tax = discountedSubtotal * (taxRate / 100);

  console.log('itms', items)
  console.log('dsc subttl', discountedSubtotal, 'rawsbttl', rawSubtotal, 'dscrt', discountRate, 'txrt', taxRate)
  
  const total = discountedSubtotal + tax;

  const itemCount = items.map(item => item.quantity).reduce((a, b) => a + b);
  // before:   const itemCount = items.length;

  const freeShipping = discountedSubtotal >= SHIPPING_THRESHOLD;
  // before: const freeShipping = discountedSubtotal > SHIPPING_THRESHOLD;

  return {
    subtotal: rawSubtotal,
    discountedSubtotal,
    tax,
    total,
    itemCount,
    freeShipping,
  };
}
