//
/**
 * Programming Puzzle — Turnstile Trip Processor
 *
 * Context:
 * You operate a subway system with tap-in (ENTER) and tap-out (EXIT) events for riders.
 * Each rider is identified by a card id string and taps at a named station. Your task
 * is to process a sequence of events, building completed trips, tracking currently
 * "in-system" riders, and rejecting invalid actions deterministically.
 *
 * Input:
 * - events: Array<{ id: string; action: "enter" | "exit"; station: string }>
 *   Invariants on a valid event:
 *     - id is a non-empty string
 *     - action is exactly "enter" or "exit"
 *     - station is a non-empty string
 *   Rules:
 *     1) "enter": allowed only if the rider is not already in-system.
 *     2) "exit": allowed only if the rider is currently in-system; the trip completes from
 *        the entry station to the exit station.
 *     3) Invalid events (missing fields / wrong types) are ignored (not rejected).
 *     4) Rejections are recorded only for rule violations (2) and (1) above, in event order.
 *
 * Output:
 * Return an object:
 * {
 *   // riders still in-system after processing (their entry station)
 *   active: Record<string, { enteredAt: string }>;
 *   // completed trips in the order they finished
 *   completed: Array<{ id: string; from: string; to: string }>;
 *   // rejected events in input order
 *   // "reason" is "not in-system" or "already in-system"
 *   rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
 *   // counts per station for accepted enters/exits only
 *   stats: {
 *     entries: Record<string, number>;
 *     exits: Record<string, number>;
 *   };
 * }
 *
 * Edge cases:
 * - Empty event list → all outputs empty.
 * - Duplicate enter without an exit → second enter is rejected; rider remains at original entry.
 * - Exit without a prior enter → rejected; no state change.
 * - Mixed stations are allowed; station names are case-sensitive strings.
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
  










