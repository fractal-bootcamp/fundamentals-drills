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

type Item = { price: number; stock: number }
type Inventory = { [sku: string]: Item }
type Action = string[]
// ["insert", number]     // coin must be one of the allowed denominations [100,50,25,10,5,1]
// ["select", string]     // attempt to buy sku
// ["cancel"]             // abort session & refund inserted coins
// ["noop"]               // does nothing
type Session = Action[]
type Sessions = Session[]
type Input = { inventory: Inventory, sessions: Sessions }
type Receipt = { dispensed?: string, changeCoins: { [denom: number], number: number }, changeTotal: number, spent: number, errors: string[] }
type Output = { inventory: Inventory, receipts: Receipt[] }
// receipts: Array<{
// dispensed?: string;                        // sku if an item was dispensed
// changeCoins: { [denom: number]: number };  // change returned as a greedy breakdown in the allowed denominations
// changeTotal: number;                        // total change (cents)
// spent: number;                              // cents the machine kept this session
// errors: string[];                           // rule violations or unsupported ops

export function processVendingSessions(input: Input): Output {
  const denoms = [100, 50, 25, 10, 5, 1]
  const inventory = input.inventory
  const skus = Object.keys(inventory)
  const sessions: Sessions = input.sessions
  const receipts: Receipt[] = []
  const newInventory = structuredClone(inventory)
  for (let i = 0; i < sessions.length; i++) {
    // Start each session with credit=0 and an empty "inserted" coin pouch.
    let credit = 0
    let changeCoins = {}
    const errors = []
    let receipt = {}
    let dispensed
    let changeTotal = 0
    const session = sessions[i]
    const insertedCoins = {}
    for (let j = 0; j < session.length; j++) {
      const action = session[j]
      let oGChangeTotal = 0
      let spent = 0
      if (action[0] === "insert") {
        // "insert" adds to the session credit if the coin is in the allowed denominations; otherwise record an error and ignore it.
        if (denoms.includes(action[1])) {
          credit += action[1]
          if (insertedCoins[action[1]]) {
            insertedCoins[action[1]]++
          } else {
            insertedCoins[action[1]] = 1
          }
        } else {
          errors.push(`unsupported coin: ${action[1]}`)
        }
        // *   - "select":
      } else if (action[0] === "select") {
        const sku = action[1]
        if (!skus.includes(sku)) {
          errors.push(`invalid sku: ${sku}`)
          break
        }
        const stock = newInventory[sku].stock
        const price = newInventory[sku].price
        // *       * Fails if sku is invalid, out of stock, or credit < price (record an error; session continues).
        if (stock < 1) {
          errors.push(`out of stock: ${sku}`)
        } else if (credit < price) {
          errors.push(`insufficient credit: have ${credit}, need ${price}`)
        } else {
          // *       * On success: dispense the item, decrement inventory, keep exactly the price as spent, return change = credit - price
          dispensed = sku
          newInventory[sku].stock--
          oGChangeTotal = credit - price
          changeTotal = oGChangeTotal
          spent = price
          let currentTotal = changeTotal
          denoms.forEach((denom) => {
            const remainder = currentTotal % denom
            const number = (currentTotal - remainder) / denom
            currentTotal = remainder
            if (number) { changeCoins[denom] = number }
          })
        }
        // *         using greedy breakdown (unlimited coins; no bank constraints), then the session ENDS (ignore further actions).
        receipt = { dispensed, changeCoins, changeTotal: oGChangeTotal, spent, errors }
        receipts.push(receipt)
      } else if (action[0] === "cancel") {
        // *   - "cancel" refunds exactly the coins the user inserted this session (returned as a breakdown; session ENDS).
        changeCoins = insertedCoins
        changeTotal = credit
        receipt = { dispensed, changeCoins, changeTotal: changeTotal, spent, errors }
        receipts.push(receipt)
        break
      }
      // *   - If a session ends without "select" success or "cancel", nothing is dispensed or refunded; it's just an idle session end.
      // *   - Deterministic; integers only; no randomness or timing.
    }
  }
  return { inventory: newInventory, receipts }
}

console.log(
  processVendingSessions({
    inventory: { G: { price: 50, stock: 1 } },
    sessions: [
      [["insert", 100], ["select", "INVALID"]]
    ]
  })
)

// const hundoRemainder = changeTotal % 100
// const hundos = (changeTotal - hundoRemainder) / 100
// if (hundos) { changeCoins[100] = hundos }
// const fiftyRemainder = hundoRemainder % 50
// const fifties = (hundoRemainder - fiftyRemainder) / 50
// if (fifties) { changeCoins[50] = fifties }
// const twentyFivesRemainder = fiftyRemainder % 50
// const twentyFives = (fiftyRemainder - twentyFivesRemainder) / 50
// if (twentyFives) { changeCoins[25] = twentyFives }
// const tensRemainder = twentyFivesRemainder % 50
// const tens = (twentyFivesRemainder - tensRemainder) / 50
// if (tens) { changeCoins[10] = tens }
// const ones = tensRemainder
// if (ones) { changeCoins[1] = ones }
