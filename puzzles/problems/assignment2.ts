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

type Receipts = Array<{
  dispensed?: string
  changeCoins: { [denom: number]: number }
  changeTotal: number
  spent: number
  errors: string[]
}>

function calculateChange(amount) {
  // splits change in coins
}

export function processVendingSessions(input) {
  let {inventory, sessions} = input

  console.log('inv:', inventory, '\n', 'sns:', sessions)
  console.log(Object.keys(inventory).length)

  let credit = 0
  let spent = 0
  let receipts: Receipts

  // for (let i = 0; i < sessions.length; i++) {
  //   for (let j = 0; j < i.length; j++) {
  //     if (sessions[i][j][0] === 'insert' && [100, 50, 25, 10, 5, 1].includes(sessions[i][j][1])) {
  //       credit += sessions[i][j][1]
  //     } else if (sessions[i][j][0] === 'select' && inventory.sessions[i][j][1]) {
  //       if (inventory.sessions[i][j][1].stock >= 1 && inventory.sessions[i][j][1].price <= credit) {
  //         inventory.sessions[i][j][1].price = inventory.sessions[i][j][1].price - credit
  //         inventory.sessions[i][j][1].stock = inventory.sessions[i][j][1].stock - 1
  //         receipts.dispensed = sessions[i][j][1]
          
  //       }
  //     }
  //   }
  // }

  sessions.map(session => {
    session.map(action => {

      if (action[0] === 'insert' && [100, 50, 25, 10, 5, 1].includes(action[1])) {
        credit += action[1]
      } else if (action[0] === 'select' && inventory.action[1]) {

        if (inventory.action[1].stock >= 1 && inventory.action[1].price <= credit) {
          credit -= inventory.action[1].price
          spent += inventory.action[1].price
          inventory.action[1].stock = inventory.action[1].stock - 1
          receipts.dispensed = action[1]
          
        }

      }

    })
  })

  receipts.changeCoins = calculateChange(credit)
  receipts.changeTotal = credit
  receipts.spent = spent

  return {inventory, receipts}
}
