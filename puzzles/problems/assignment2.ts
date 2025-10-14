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
  let currentInventory = structuredClone(input.inventory)
  console.log(currentInventory)

  let errorstr = []
  let credit = 0
  let insert = {
    1:0,
    5:0,
    10:0,
    25:0,
    50:0,
    100:0
  }
  let userActions = structuredClone(input.sessions[0])
  console.log(userActions)
  let receipts = []

  for (action of userActions) {

    //handle noop
    if (action[0] =='noop') continue

    //handle insert coins
    if (action[0]=='insert') {

      //only increment if allowed coin
      switch (action[1]) {
          case 1:
            credit += action[1]
            insert[1] ++
            break
          case 5:
            credit += action[1]
            insert[5] ++
            break
          case 10:
            credit += action[1]
            insert[10] ++
            break
          case 25:
            credit += action[1]
            insert[25] ++
            break
          case 50:
            credit += action[1]
            insert[50] ++
            break
          case 100:
            credit += action[1]
            insert[100] ++
            break
          default:
            errorstr.push(`unsupported coin: ${action[1]}`)
            
          
        
      }
    }

    //handle cancel
    if (action[0] =='cancel') {
      return receipts.push({
        inventory:currentInventory,
        changeCoins: insert,
        changeTotal: credit,
        spent:0,
        errors:errorstr
      })
    }

    //handle buy
    if (action[0] == 'select' ) {

      
      //sku exists
      if (!Object.keys(currentInventory).includes(action[1])) {
        errorstr.push(`Invalid sku: ${action[1]}`)
        continue
      }

      //out of stock
      if (currentInventory.action[1].stock <= 0) {
        errorstr.push(`outofstock: ${action[1]}`)
        continue
      }

      //credit < price
      if (currentInventory.action[i].price > credit) {
        errorstr.push(`insufficient credit: have ${creditt}, need ${currentInventory.action[1].price}`)
        continue
      }

      //vend it
        currentInventory.action[1].stock --
        credit =- currentInventory.action[1]
        const changeTotal = credit
        let change = {}
        while (credit > 0) {
          if (credit> 100) {
            change[100] ++
            credit -= 100
          }
          if (credit > 50) {
            change[50] ++
            credit -= 50
          }
          if (credit > 25) {
            change[25] ++
            credit -= 25
          }
          if (credit > 10) {
            change[10] ++
            credit -= 10
          }
          if (credit > 5) {
            change[5] ++
            credit -= 5
          }
          if (credit > 1) {
            change[1] ++
            credit -= 1
          }
        }

        receipts.push({dispense: action[1],
          changeCoins: change,
          changeTotal: changeTotal,
          spent: currentInventory.action[1].price,
          errors:errorstr
        })
    }
}
  return receipts
}