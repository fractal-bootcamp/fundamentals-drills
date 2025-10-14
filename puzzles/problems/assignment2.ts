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
  inventory: { [sku: string]: { price: number; stock: number } },
  sessions: Array<Session>
}

type Session = Action[]

type Action = ["insert", number] | ["select", string] | ["cancel"] | ["noop"]

type Output = {
  inventory: { [sku: string]: { price: number; stock: number } },
  receipts: Array<{
    dispensed?: string;
    changeCoins: { [denom: number]: number };
    changeTotal: number;
    spent: number;
    errors: string;
  }>
}

export function processVendingSessions(input: Input): Output {
  const denominations: Array<number> = [100, 50, 25, 10, 5, 1]
  let receipts: Array<{
    dispensed?: string;
    changeCoins: { [denom: number]: number };
    changeTotal: number;
    spent: number;
    errors: string;
  }> = []
  
  let inserted: Map<number, number> = {
    100: 0,
    50: 0,
    25: 0,
    10: 0,
    5: 0,
    1: 0
  }

  let credit: number = 0;
  let spent: number = 0;
  let errors: Array<string> = []
  
  for (const session of input.sessions) {
    if (session[0] === "insert") {
      if (denominations.contains(session[1])) {
        credit += session[1]
        inserted.set(session[1], inserted.get(session[1]) + 1)
      } else {
        errors.push(`unsupported coin: ${session[1]}`)
      }
    } else if (session[0] === "select") {
      if (!input.inventory.keys().contains(session[1])) {
        errors.push(`invalid sku: ${session[1]}`)
      } else if (input.inventory.get(session[1]).stock <= 0) {
        errors.push(`out of stock: ${session[1]}`)
      } else if (credit < input.inventory.get(session[1]).price) {
        errors.push(`insufficient credit: have ${credit}, need ${input.inventory.get(session[1]).price}`)
      } else {
        input.inventory.get(session[1]).stock -= 1
        spent += input.inventory.get(session[1]).price
        let changeTotal: number = credit - price
        // handle change
        let changeCoins: Map<number, number> = {
          100: 0,
          50: 0,
          25: 0,
          10: 0,
          5: 0,
          1: 0
        }

        while (changeTotal > 0) {
          let coinToRemove: number = 1
          for (const coin of denominations) {
            if (coin < changeTotal) {
              coinToRemove = coin
              break
            }
          }
          changeTotal -= coinToRemove

          if (changeCoins.get(coinToRemove)) {
            changeCoins.set(coinToRemove, changeCoins.get(coinToRemove) + 1)
          } else {
            changeCoins.set(coinToRemove, 1)
          }
        }

        receipts.push({
          dispensed: session[1],
          changeCoins: changeCoins,
          changeTotal: changeTotal,
          spent: spent,
          errors: errors
        })
      }
    } else if (session[0] === "cancel") {
      let changeCoins: Map<number, number> = {}
      let changeTotal: number = 0
      for (const coin in inserted) {
        if (inserted.get(coin) > 0) {
          changeCoins.set(coin, inserted.get(coin))
          changeTotal += coin * inserted.get(coin)
        }
      }
      return {
        inventory: input.inventory,
        receipts: [{
          dispensed: undefined,
          changeCoins: changeCoins,
          changeTotal: changeTotal,
          spent: spent,
          errors: errors
        }]
      }
    } else if (session[0] === "noop") {
      // nothing ever happens
    }
  }  
  if (receipts.length === 0) {
    return {
      inventory: input.inventory,
      receipts: {
        dispensed: undefined,
        changeCoins: {},
        changeTotal: 0,
        spent: spent,
        errors: errors
      }
  }
  } else {
    return {
      inventory: input.inventory,
      receipts: receipts
    }
  }
}
