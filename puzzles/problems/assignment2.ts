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

type Action = ['insert', number] | ['select', string] | ['noop'] | ['cancel']

type Session = Action[]

type Receipts = Array<{
  dispensed?: string
  changeCoins: { [denom: number]: number }
  changeTotal: number
  spent: number
  errors: string[]
}>

type Change = {
  100?: number,
  50?: number,
  25?: number,
  10?: number,
  5?: number,
  1?: number
}

type Receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number } | {};
  changeTotal: number;
  spent: number;
  errors: string[];
}

export function calculateChange(amount: number): Change {

  let result = {}
  const denominations = [100, 50, 25, 10, 5, 1]

  for (let i = 0; i < denominations.length; i++) {
    const coinsOfThisDenom = Math.floor(amount / denominations[i])
    amount -= coinsOfThisDenom * denominations[i]
    if (coinsOfThisDenom != 0) {
      result[denominations[i]] = coinsOfThisDenom
    }
  }

  return result

}

export function processVendingSessions(input) {

  let { inventory, sessions } = input
  let credit = 0
  let spent = 0
  let receipts: Receipts = []
  let currentSession: Session = []

  for (let key in inventory) {
    if (inventory[key].price < 0) inventory[key].price = 0
    if (inventory[key].stock < 0) inventory[key].stock = 0
    inventory[key].price = Math.floor(inventory[key].price)
    inventory[key].stock = Math.floor(inventory[key].stock)
  }

  if (Object.keys(inventory).length != 0) {

    sessions.map((session: Session) => {

      for (let i = 0; i < session.length; i++) {
        if (session[i][0] === 'cancel') {
          currentSession = session.slice(0, i)
          break
        }
      }
      currentSession.length === 0 ? currentSession = session : null

      let receipt: Receipt = {
        changeCoins: {},
        changeTotal: 0,
        spent: 0,
        errors: [] as string[],
      }

      currentSession.map(action => {

        if (action[0] === 'insert' && [100, 50, 25, 10, 5, 1].includes(action[1])) {
          credit += action[1]
        } else if (action[0] === 'select' && Object.keys(inventory).includes(action[1])) {

          if (inventory[action[1]].stock >= 1 && inventory[action[1]].price <= credit) {
            credit -= inventory[action[1]].price
            spent += inventory[action[1]].price
            inventory[action[1]].stock -= 1
            receipt.dispensed = action[1]
          } else if (inventory[action[1]].stock === 0) {
            receipt.errors.push(`out of stock: ${action[1]}`)
          } else if (inventory[action[1]].price < credit) {
            receipt.errors.push(`insufficient credit: have ${credit}, need ${inventory[action[1]].price}`)
          }

        }

      })

      console.log('INV', inventory)
      console.log('SNS', sessions)
      console.log('RCP', receipts)

      receipt.changeCoins = calculateChange(credit)
      receipt.changeTotal = credit
      receipt.spent = spent

      receipts.push(receipt)

    })

  } else {
    receipts = [{
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: ["invalid sku: ANYTHING"]
    }]
  }

  return { inventory, receipts }

}
