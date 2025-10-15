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