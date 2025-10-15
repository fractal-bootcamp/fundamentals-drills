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

const validCoins = [100,50,25,10,5,1]

export function processVendingSessions(input) {
  const inventory = input?.inventory ?? {}
  // normalize inventory with negative values
  for (const item of Object.values(inventory)) {
    item.price = (item.price < 0) ? 0 : Math.floor(item.price)
    item.stock = (item.stock < 0) ? 0 : Math.floor(item.stock)
  }
  
  const receipts = []
  for (const session of input?.sessions ?? []) {
    let centsInserted = 0
    // tracking this in case there's a cancel operation
    const coinsInserted = {}
    let receipt = {
      dispensed: undefined,
      changeCoins: {},
      changeTotal: 0,
      spent: 0,
      errors: []
    }
    for (const action of session) {
      const actionType = action[0] ?? null
      if (actionType === 'insert') {
        const insertAmount = action[1]
        if (validCoins.includes(insertAmount)) {
          centsInserted += insertAmount
          coinsInserted[insertAmount] = (coinsInserted[insertAmount]) ? (coinsInserted[insertAmount] + 1) : 1
        } else {
          // invalid coin error
          receipt.errors.push(`unsupported coin: ${insertAmount}`)
        }
      } else if (actionType === 'select') {
        const productName = action[1] ?? null
        if (inventory[productName]) {
          const product = inventory[productName]
          if (product.price <= centsInserted && product.stock > 0) {
            // we can buy the item
            centsInserted -= product.price
            receipt.spent += product.price
            product.stock -= 1
            receipt.dispensed = productName
            // whatever remains of centsInserted becomes the change
            receipt.changeTotal = centsInserted
            receipt.changeCoins = makeChange(centsInserted)
            // break out of for loop to end the session
            break
          } else if (product.stock === 0) { // we already got rid of any stock < 0
            receipt.errors.push(`out of stock: ${productName}`)
          } else { 
            // we can't afford the item!
            receipt.errors.push(`insufficient credit: have ${centsInserted}, need ${product.price}`)
          }
        } else {
          // invalid selection
          receipt.errors.push(`invalid sku: ${productName}`)
        }
      } else if (actionType === 'cancel') {
        receipt.changeTotal = centsInserted
        receipt.changeCoins = coinsInserted
        break
      } else if (actionType === 'noop') {
        // no operation
      } else {
        receipt.errors.push(`unknown action: ${actionType}`)
      }
    }
    receipts.push(receipt)
  }
  return {inventory: inventory, receipts: receipts}
}

function makeChange(changeTotal: number) {
  const changeCoins = {}
  for (const coinValue of validCoins) {
    while (changeTotal >= coinValue) {
      changeTotal -= coinValue
      changeCoins[coinValue] = (changeCoins[coinValue] ? (changeCoins[coinValue] + 1) : 1)
    }
    if (changeTotal === 0) {
      break
    }
  }
  return changeCoins
}