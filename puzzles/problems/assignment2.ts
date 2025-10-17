// @ts-nocheck
/**
 * Programming Puzzle — Vending Sessions
 *
 * You will implement a tiny vending machine that processes a list of user sessions.
 * Each session is a sequence of actions: inserting coins, selecting an item, or cancelling.
 * There is NO persistent coin bank: change is conceptual and unlimited; only inventory changes over time.
 * Sessions are independent except for inventory stock, which is shared and persists across sessions.
 *
 * Input:
 *   {
 *     inventory: { [sku: string]: { price: number; stock: number } } // price in whole cents (>=0), stock>=0
 *     sessions: Array<Session>                                        // Session = Action[]
 *   }
 *   Action is one of:
 *     ["insert", number]     // coin must be one of the allowed denominations [100,50,25,10,5,1]
 *     ["select", string]     // attempt to buy sku
 *     ["cancel"]             // abort session & refund inserted coins
 *     ["noop"]               // does nothing
 *
 * Output:
 *   {
 *     inventory: { ...updated inventory... },
 *     receipts: Array<{
 *       dispensed?: string;                        // sku if an item was dispensed
 *       changeCoins: { [denom: number]: number };  // change returned as a greedy breakdown in the allowed denominations
 *       changeTotal: number;                        // total change (cents)
 *       spent: number;                              // cents the machine kept this session
 *       errors: string[];                           // rule violations or unsupported ops
 *     }>
 *   }
 *
 * Rules & Notes:
 *   - Start each session with credit=0 and an empty "inserted" coin pouch.
 *   - "insert" adds to the session credit if the coin is in the allowed denominations; otherwise record an error and ignore it.
 *   - "select":
 *       * Fails if sku is invalid, out of stock, or credit < price (record an error; session continues).
 *       * On success: dispense the item, decrement inventory, keep exactly the price as spent, return change = credit - price
 *         using greedy breakdown (unlimited coins; no bank constraints), then the session ENDS (ignore further actions).
 *   - "cancel" refunds exactly the coins the user inserted this session (returned as a breakdown; session ENDS).
 *   - If a session ends without "select" success or "cancel", nothing is dispensed or refunded; it's just an idle session end.
 *   - Deterministic; integers only; no randomness or timing.
 *
 * Examples:
 *   Example A:
 *     inv={A:{price:125,stock:1}}, sessions=[
 *       [ ["insert",100],["insert",25],["select","A"] ]
 *     ]
 *     => dispensed A, spent 125, change 0, inventory A.stock=0
 *
 *   Example B:
 *     inv={B:{price:130,stock:1}}, sessions=[
 *       [ ["insert",100],["insert",25],["select","B"] ], // insufficient: error, session continues
 *       [ ["insert",100],["select","B"] ]                // success with change 70 = 50+10+10
 *     ]
 */

const ALLOWED_DENOMINATIONS = [100, 50, 25, 10, 5, 1];

type Receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];
};

export function processVendingSessions(input) {
  const { inventory, sessions } = input;

  // Deep clone and normalize inventory
  const currentInventory = JSON.parse(JSON.stringify(inventory || {}));

  // Normalize inventory: ensure price and stock are non-negative integers
  for (const sku in currentInventory) {
    const item = currentInventory[sku];
    item.price = Math.max(0, Math.trunc(item.price));
    item.stock = Math.max(0, Math.trunc(item.stock));
  }

  const receipts: Receipt[] = [];

  // Process each session
  for (const session of sessions || []) {
    const receipt: any = {
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: [],
    };

    let credit = 0;
    const insertedCoins: { [denom: number]: number } = {};
    let sessionEnded = false;

    // Process each action in the session
    for (const action of session || []) {
      if (sessionEnded) {
        // Session already ended, ignore remaining actions
        break;
      }

      const [actionType, actionValue] = action;

      if (actionType === "insert") {
        const coin = actionValue as number;
        if (ALLOWED_DENOMINATIONS.includes(coin)) {
          credit += coin;
          insertedCoins[coin] = (insertedCoins[coin] || 0) + 1;
        } else {
          receipt.errors.push(`unsupported coin: ${coin}`);
        }
      } else if (actionType === "select") {
        const sku = actionValue as string;

        // Check if SKU exists
        if (!(sku in currentInventory)) {
          receipt.errors.push(`invalid sku: ${sku}`);
          continue;
        }

        const item = currentInventory[sku];

        // Check if out of stock
        if (item.stock <= 0) {
          receipt.errors.push(`out of stock: ${sku}`);
          continue;
        }

        // Check if sufficient credit
        if (credit < item.price) {
          receipt.errors.push(`insufficient credit: have ${credit}, need ${item.price}`);
          continue;
        }

        // Success! Dispense item
        receipt.dispensed = sku;
        receipt.spent = item.price;
        currentInventory[sku].stock -= 1;

        // Calculate change
        const changeAmount = credit - item.price;
        receipt.changeTotal = changeAmount;
        receipt.changeCoins = calculateGreedyChange(changeAmount);

        // End session
        sessionEnded = true;
      } else if (actionType === "cancel") {
        // Refund inserted coins
        receipt.changeCoins = { ...insertedCoins };
        receipt.changeTotal = credit;
        receipt.spent = 0;

        // End session
        sessionEnded = true;
      } else if (actionType === "noop") {
        // Do nothing
        continue;
      } else {
        receipt.errors.push(`unknown action: ${actionType}`);
      }
    }

    receipts.push(receipt);
  }

  return {
    inventory: currentInventory,
    receipts,
  };
}

function calculateGreedyChange(amount: number): { [denom: number]: number } {
  const result: { [denom: number]: number } = {};
  let remaining = amount;

  for (const denom of ALLOWED_DENOMINATIONS) {
    if (remaining >= denom) {
      const count = Math.floor(remaining / denom);
      result[denom] = count;
      remaining -= count * denom;
    }
  }

  return result;
}
