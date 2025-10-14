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

type Inventory = { [sku: string]: { price: number; stock: number } };

type Input = {
  inventory: Inventory; // price in whole cents (>=0), stock>=0
  sessions: Array<Action[]>; // Session = Action[][]
};

type Action =
  | ["insert", number] // coin must be one of the allowed denominations [100,50,25,10,5,1]
  | ["select", string] // attempt to buy sku
  | ["cancel"] // abort session & refund inserted coins
  | ["noop"]; // does nothing

type Receipt = {
  dispensed?: string; // sku if an item was dispensed
  changeCoins: { [denom: number]: number }; // change returned as a greedy breakdown in the allowed denominations
  changeTotal: number; // total change (cents)
  spent: number; // cents the machine kept this session
  errors: string[]; // rule violations or unsupported ops
};

type Output = {
  inventory: Inventory;
  receipts: Array<Receipt>;
};

type Coin = 100 | 50 | 25 | 10 | 5 | 1;

function isCoin(amount: number) {
  const COINS = [100, 50, 25, 10, 5, 1];
  return COINS.includes(amount);
}

function purchaseItem(
  credit,
  sku: string,
  item: { price: number; stock: number },
): Receipt {
  if (credit < item.price) {
    return {
      status: "error",
      receipt: {
        dispensed: undefined,
        changeCoins: {},
        changeTotal: 0,
        spent: 0,
        errors: [`insufficient credit: have ${credit}, need ${item.price}`],
      },
    };
  }

  if (item.stock <= 0) {
    return {
      status: "error",
      receipt: {
        dispensed: undefined,
        changeCoins: {},
        changeTotal: 0,
        spent: 0,
        errors: [`out of stick: ${sku}`],
      },
    };
  }

  // else, successfully purchase
  return {
    status: "success",
    receipt: {
      dispensed: sku,
      changeCoins: {}, // TODO
      changeTotal: credit - item.price,
      spent: item.price,
      errors: [],
    },
  };
}

export function processVendingSessions(input: Input): Output {
  let inventory: Inventory = structuredClone(input.inventory);
  let receipts: Receipt[] = [];

  for (const session of input.sessions) {
    let credit = 0;
    let inserted = [];

    for (const action of session) {
      switch (action[0]) {
        case "insert":
          if (action[1] && isCoin(action[1])) {
            credit += action[1];
          }
          break;
        case "select":
          if (action[1] && inventory[action[1]]) {
            const sku = action[1];
            const attempt = purchaseItem(credit, sku, inventory[sku]);
            console.log("SELECTING ITEM", inventory[sku]);
            if (purchaseItem.status == "error") {
              receipts.push(purchaseItem.receipts);
            } else if (purchaseItem.status == "success") {
              // TODO Decrement stock
              inventory[sku].stock = inventory[sku].stock - 1;
              receipts.push(purchaseItem.receipts);
            }
            credit += action[1];
          }
          break;
        case "cancel":
          console.log("CANCEL CASE");
          break;
        case "noop":
          console.log("NOOP CASE");
          break;
        default:
          console.log("DEFAULT CASE");
          break;
      }
    }
  }

  return {
    inventory,
    receipts,
  };
}
