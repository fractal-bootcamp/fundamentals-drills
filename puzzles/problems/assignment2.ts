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

export function processVendingSessions(input) {
  let inventory = input.inventory || {};
  let sessions = input.sessions || [];

  if (inventory === {} || sessions === [])
    return { inventory: {}, sessions: [] };

  for (const sku in inventory) {
    const item = inventory[sku];
    item.price = Math.max(0, Math.floor(item.price));
    item.stock = Math.max(0, Math.floor(item.stock));
  }

  function makeChange(changeTotal) {
    let coins = {};
    let remaining = changeTotal;
    for (const coin of acceptedCoins) {
      const count = Math.floor(remaining / coin);
      if (count > 0) {
        coins[coin] = count;
        remaining -= coin * count;
      }
    }
    return coins;
  }
  let acceptedCoins = [100, 50, 25, 10, 5, 1];
  const result = { inventory, receipts: [] };

  for (const sesh of sessions) {
    let receipt = {
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: [],
    };

    let credit = 0;
    let sessionEnded = false;

    for (const action of sesh) {
      if (sessionEnded) break;

      const choice = action[0];
      const val = action[1];

      if (choice === "noop") continue;
      else if (choice === "cancel") {
        receipt.changeTotal = credit;
        if (credit > 0) receipt.changeCoins = makeChange(credit);
        sessionEnded = true;
      } else if (choice === "insert") {
        if (!acceptedCoins.includes(val)) {
          receipt.errors.push("unsupported coin: " + val);
          continue;
        }
        credit += val;
      } else if (choice === "select") {
        const sku = val;
        if (!inventory[sku]) {
          receipt.errors.push("invalid sku: " + sku);
          continue;
        }

        const item = inventory[sku];
        if (item.stock <= 0) {
          receipt.errors.push("out of stock: " + sku);
          continue;
        }

        if (credit < item.price) {
          receipt.errors.push(
            `insufficient credit: have ${credit}, need ${item.price}`
          );
          continue;
        }

        receipt.spent = item.price;
        item.stock -= 1;
        receipt.dispensed = sku;
        const change = credit - item.price;

        if (change > 0) {
          receipt.changeTotal = change;
          receipt.changeCoins = makeChange(change);
        }

        sessionEnded = true;
      } else {
        receipt.errors.push("unknown action: " + choice);
      }
    }

    result.receipts.push(receipt);
  }

  return result;
}
