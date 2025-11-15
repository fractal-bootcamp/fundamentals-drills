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
  inventory: Inventory,
  sessions: Array<Session>
}

type Inventory = { [sku: string]: { price: number; stock: number } }

type Session = Action[]

type Action = ["insert", number] | ["select", string] | ["cancel"] | ["noop"]

type Receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];
}

type Output = {
  inventory: { [sku: string]: { price: number; stock: number } },
  receipts: Array<Receipt>
}

function calculateChangeCoins(changeTotal: number, denominations: Array<number>): Record<number, number> {
  const changeCoins: Record<number, number> = {}
  while (changeTotal > 0) {
    for (const coin of denominations) {
      if (coin <= changeTotal) {
        changeTotal -= coin
        if (!(coin in changeCoins))
          changeCoins[coin] = 0
        changeCoins[coin] += 1
        break
      }
    }
  }

  return changeCoins
}

function processVendingSession(inventory: Inventory, session: Session): Receipt {
  const denominations: Array<number> = [100, 50, 25, 10, 5, 1]
  const insertedCoins: Record<number, number> = {}
  let credit: number = 0
  let receipt: Receipt = {
    dispensed: undefined,
    changeCoins: {},
    changeTotal: 0,
    spent: 0,
    errors: []
  }

  for (const action of session) {
    const type = action[0]
    if (type === "insert") {
      const amount = action[1]
      if (!denominations.includes(amount)) {
        receipt.errors.push(`unsupported coin: ${amount}`)
      } else {
        credit += amount
        if (!(amount in insertedCoins))
          insertedCoins[amount] = 0
        insertedCoins[amount] += 1
      }
    } else if (type === "select") {
      const sku = action[1]
      if (!(sku in inventory)) {
        receipt.errors.push(`invalid sku: ${sku}`)
      } else if (inventory[sku].stock < 1) {
        receipt.errors.push(`out of stock: ${sku}`)
      } else if (credit < inventory[sku].price) {
        receipt.errors.push(`insufficient credit: have ${credit}, need ${inventory[sku].price}`)
      } else {
        inventory[sku].stock -= 1
        receipt.dispensed = sku
        receipt.spent = inventory[sku].price
        receipt.changeTotal = credit - inventory[sku].price
        receipt.changeCoins = calculateChangeCoins(receipt.changeTotal, denominations)
        break
      }
    } else if (type === "cancel") {
      receipt.changeCoins = insertedCoins
      receipt.changeTotal = credit
      break
    } else if (type !== "noop") {
      receipt.errors.push(`unknown action: ${type}`)
    }
  }

  return receipt
}

export function processVendingSessions(input: Input): Output {
  const sessions: Action[] = input.sessions
  const inventory: Inventory = input.inventory

  if (!sessions || !inventory)
    return {
      inventory: {},
      receipts: []
    }


  for (const sku in inventory) {
    inventory[sku].stock = inventory[sku].price >= 0 ? Math.floor(inventory[sku].stock) : 0
    inventory[sku].price = inventory[sku].price >= 0 ? Math.floor(inventory[sku].price) : 0
  }
  
  const receipts: Receipt[] = sessions.map(session => processVendingSession(inventory, session))
  
  return {
    inventory: inventory,
    receipts: receipts
  }

}
