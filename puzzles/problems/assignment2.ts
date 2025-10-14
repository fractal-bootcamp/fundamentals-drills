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

let inventory = []

function getDenoms(change: number) {
  let hundreds = 0
  let tens = 0
  let fives = 0
  let remainder = change
  while (remainder > 0) {
    if (remainder >= 100) {
      remainder = change % 100
      hundreds += (change - remainder) / 100


    } else if (remainder > 5) {
      remainder = change % 100
      hundreds += (change - remainder) / 100

    }


  }
}


export function processVendingSessions(input) {
  inventory.push(input.inventory)
  console.log("GRBLAHH", inventory)

  let receipts = []




  type Session = {
    dispensed?: string;
    changeCoins: { [denom: number]: number };
    changeTotal: number;
    spent: number;
    errors: string[];
  }

  let session: Session = {
    dispensed: null,
    changeCoins: 0,
    changeTotal: 0,
    spent: 0,
    errors: []

  }




  for (let i = 0; i < input.sessions.length; i++) {
    let currentBalance = 0


    let sessions = []

    for (let j = 0; j < session.length; j++) {
      console.log("BLAH", session[j])
      let action = session[j]


      if (action[0] === "insert") {
        currentBalance += action[1]
      }

      if (action[0] === "select") {
        const item = action[1]
        const keys = Object.keys(inventory[0])
        if (keys.includes(item)) {
          const price = inventory[0][item].price
          const stock = inventory[0][item].stock
          if (currentBalance >= price) {
            inventory[0][item].stock -= 1
            session = { ...session, dispensed: true, changeTotal: currentBalance - price, spent: price }
            receipts.push(session)

          }


        }

      }





    }



  }










  console.log("LALALA", { inventory, receipts: receipts })



  return { inventory, receipts: receipts }
}
