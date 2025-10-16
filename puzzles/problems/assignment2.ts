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

type Input = {
  inventory: Inventory
  sessions: Session[]
}

// type Inventory = Record<string, InventoryItem>;
type Inventory = { [sku: string]: InventoryItem };

type InventoryItem = {
  price: number;
  stock: number;
};

type Session = Action[];
type Action = InsertAction | SelectAction | CancelAction | NoopAction;

type InsertAction = ["insert", number];
type SelectAction = ["select", string];
type CancelAction = ["cancel"];
type NoopAction = ["noop"];

type Output = {
  inventory: Inventory
  receipts: Receipt[]
}

type Receipt = {
  dispensed?: string
  changeCoins: Change
  changeTotal: number
  spent: number
  errors: string[]
}

type Change = { [denom: number]: number }

export function processVendingSessions(input: Input) {
  // create an empty array for receipts
  let receipts = []


  const allowedDenominations = [100, 50, 25, 10, 5, 1];

  // INVENTORY
  const inventoryPrice = input.inventory.sku.price
  const inventoryStock = input.inventory.sku.stock

  // OUTER LOOP - iterates SESSION
  for (let sessionIndex = 0; sessionIndex < input.sessions.length; sessionIndex++) {
    let credit = 0;
    const insertedCoins = []
    console.log(`Processing session ${sessionIndex}`)

    // INNER LOOP - iterates ACTION within current session
    for (let actionIndex = 0; actionIndex < input.sessions[sessionIndex].length; actionIndex++) {
      const currentAction = input.sessions[sessionIndex][actionIndex]
      const actionType = currentAction[0]

      console.log('Action:', currentAction, 'Action Type:', actionType)

      // INSERT
      if (actionType === "insert") {
        const coinValue = currentAction[1]

        if (allowedDenominations.includes(coinValue)) {
          credit += coinValue
          insertedCoins.push(coinValue)

          console.log('Credit updated:', credit)
        }
      } else if (actionType === "select") {
        console.log(`Action:`, currentAction)
        const sku = currentAction[1]
        const product = input.inventory[sku]

        // is sku valid, is credit equal or greater than price, is item in stock
        if (product && credit >= product.price && product.stock > 0) {
          console.log(`Item: ${product} in stock! & wallet is green... Dispensing Item!`)
          product.stock--

          const spent = product.price // what machine keeps
          const change = credit - product.price // what to return

          const receipt: Receipt = {
            dispensed: sku,
            changeCoins: calculateChange(change),
            changeTotal: change,
            spent: product.price,
            errors: []
          }

          receipts.push(receipt)
          break
        }
      } else if (actionType === "cancel") {
        console.log(`Action:`, currentAction)
        // refund exactly what was inserted during the INSERT phase
        const receipt: Receipt = {
          dispensed: sku,
          changeCoins: calculateChange(change),
          changeTotal: change,
          spent: product.price,
          errors: []
        }

        receipts.push(receipt)
        break
      }
    }
  }

  return receipt;
}

function calculateChange(changeAmount: number): Record<number, number> {
  const changeCoins: Record<number, number> = {}
  let remaining = changeAmount

  for (let i = 0; i < allowedDenominations.length; i++) {
    const denomination = allowedDenominations[i]

    while (remaining >= denomination) {
      // add one of this coin to changeCoins
      if (changeCoins[denomination]) {
        changeCoins[denomination] += 1
      } else {
        // if it doesn't exist yet, start at 1
        changeCoins[denomination] = 1
      }

      // subtract from remaining
      remaining = remaining - denomination
    }
  }

  return changeCoins
}

// type Receipt = {
//   dispensed?: string
//   changeCoins: Change
//   changeTotal: number
//   spent: number
//   errors: string[]
// }