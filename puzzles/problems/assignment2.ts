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
  type Inventory = { [sku: string]: { price: number; stock: number } }
  type Action = ["insert", number] | ["select", string] | ["cancel"] | ["noop"]
  type Sessions = Session[]
  type Session = Action[]
  type Denomination = 1 | 5 | 10 | 25 | 50 | 100
  type Receipt = {
    dispensed?: string;                        // sku if an item was dispensed
    changeCoins: { [denom: Denomination]: number };  // change returned as a greedy breakdown in the allowed denominations
    changeTotal: number;                        // total change (cents)
    spent: number;                              // cents the machine kept this session
    errors: string[];                           // rule violations or unsupported ops
  }
  type Output = {
    inventory: Inventory,
    receipts: Receipt[]
  }

  let result: Output = {}
  let allReceipts: Receipt[] = []
  let curInventory: Inventory = input.inventory



  if (!input.inventory) return {inventory:{},receipts:[]}
  if (!input.sessions) return {inventory:{},receipts:[]}
    for (const session of input.sessions) {
      let sessionEnded: boolean = false
      let credit: number = 0
      let insert: { [key: Denomination]: number } = {}
      let curSession: Session = session
      let curReceipt: Receipt = {
        dispensed:undefined,
        changeCoins:{},
        changeTotal:0,
        spent:0,
        errors:[]
      }


      for (const userAction of session) {
        if (sessionEnded) break
        switch (userAction[0]) {
          case 'insert': ({credit,insert}=handleInsert(curReceipt, curInventory, userAction[1], credit, insert)); break;
          case 'select': ({credit,sessionEnded}=handleSelect(curReceipt, curInventory, userAction[1], credit, sessionEnded)); break;
          case 'cancel': ({sessionEnded}=handleCancel(curReceipt, curInventory, credit, insert, sessionEnded)); break;
          case 'noop': break;
          default: curReceipt.errors.push(`unknown action: ${userAction[0]}`)
        }
      }

      allReceipts.push(curReceipt)
      result.inventory = curInventory
    }

    result.receipts = allReceipts
    return result


  function handleInsert(receipt:Receipt, inventory:Inventory, denom:Denomination, credit:number, insert:Record<number,number>):{credit:number,insert:Record<number,number>} {
    if (![1,5,10,25,50,100].includes(denom)) {
      receipt.errors.push(`unsupported coin: ${denom}`)
    } else {
      credit += denom
      insert[denom] = (insert[denom] || 0) + 1
    }
    return {credit,insert}
  }

  function handleCancel(receipt:Receipt, inventory:Inventory, credit:number, insert:Record<number,number>, sessionEnded:boolean):{sessionEnded:boolean} {
    receipt.changeCoins = insert
    receipt.changeTotal = credit
    sessionEnded = true
    return {sessionEnded}
  }

  function handleSelect(receipt:Receipt, inventory:Inventory, item:string, credit:numnber, sessionEnded:boolean):{credit:number,sessionended:boolean} {
    inventory = normalizeIdontapproveofthisnonsensebutiguess(inventory)
    if (validItem(receipt,item,inventory,credit)) {
    inventory[item].stock --
    credit -= inventory[item].price
    receipt.dispensed = item
    receipt.spent = inventory[item].price
    sessionEnded = true
    makeChange(receipt,credit)
  }
  return {credit,sessionEnded}
}

  function validItem(receipt:Receipt,item:string,inventory:Inventory,credit):boolean {
    if (!(item in inventory)) {
      receipt.errors.push(`invalid sku: ${item}`)
      return false
    } else if (inventory[item].stock<=0) {
      receipt.errors.push(`out of stock: ${item}`)
      inventory[item].stock = 0
      return false
    } else if (inventory[item].price>credit) {
      receipt.errors.push(`insufficient credit: have ${credit}, need ${inventory[item].price}`)
      return false
    }
    return true
  }

  function makeChange(receipt:Receipt,credit:number):void {
    let acceptableDenom = [100,50,25,10,5,1]
    let remaining = credit
    let changeProvided = {}

    for (const denom of acceptableDenom) {
      while (remaining>=denom && remaining > 0) {
        changeProvided[denom] = (changeProvided[denom] || 0) + 1
        remaining -= denom
      }
    }
    receipt.changeCoins = changeProvided
    receipt.changeTotal = credit
  }

  function normalizeIdontapproveofthisnonsensebutiguess(inventory:Inventory):Inventory {
    for (const key of Object.keys(inventory)) {
      if (inventory[key].price<0) inventory[key].price = 0
      if (inventory[key].stock<0) inventory[key].stock = 0
      inventory[key].price=inventory[key].price - (inventory[key].price%1)
      inventory[key].stock=inventory[key].stock - (inventory[key].stock%1)
    }
    return inventory
    }
  }
  










