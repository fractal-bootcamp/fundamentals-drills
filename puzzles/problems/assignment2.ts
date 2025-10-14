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

// started at 16:55

// intuition about the problem
// person is putting in coins or selecting an item
// items have prices
// when they select the item, they either have enough or don't have enough
// dispensed undefined when they don't get an item dispensed
// a session is a sequence of user actions
// there is an inventory wiht prices




// get types


type Inventory = {
  price: number
  stock: number
}

type Session = [string, number] []

type Input = {
  inventory: Inventory
  sessions: session
}

type Receipt = {
  dispensed: string
  changeCoins: {}
  changeTotal: number
  spent: number
  errors: string[]
}

type Result = {

}

// hold a value to sum the insert events
// when a select event occurs, check the value of the Item selected
// lookup the price of the value selected
// compare the summed inserted value with the price of the selected item
// return the result


export function processVendingSessions(input) {

  let sumInsertedValue = 0
  let selectedItem = undefined
  let selectedItemValue = undefined
  let sessions = input.sessions
  let receipts = []
  let inventory = input.inventory
  let receipt = undefined
  
  // check all of the sessions
  for (let i = 0; i < sessions.length; i++) {
    
    let sessionEvents = sessions[i]
    console.log('input sessions', sessionEvents)
    let sessionInsertValue = 0

    // for each session, check the events
    for (let j = 0; j < sessionEvents.length; j++) {
      let sessionEvent = sessionEvents[j]
      let sessionEventType = sessionEvent[0]
      let sessionEventValue = sessionEvent[1]
      console.log('session event type:', sessionEventType)
      console.log('session event value:', sessionEventValue)

      // if it's an insert event, add to the sessionInsertValue
      
      if (sessionEventType === 'insert') {
        sessionInsertValue += sessionEventValue
        console.log('session insert value:', sessionInsertValue)
      
      } else if (sessionEventType === 'select') {
        // find the object in the inventory
        selectedItem = sessionEventValue
        console.log('selected item:', selectedItem)
        let selectedItemPrice = inventory[sessionEventValue].price
        console.log('selected item price:', selectedItemPrice)
        let selectedItemStock = inventory[sessionEventValue].stock
        console.log('selected item stock:', selectedItemStock)
        
        // check if the sessionInsertValue >= selectedItemValue and at least 1 stock
        if (sessionInsertValue >= selectedItemPrice && selectedItemStock >= 1) {
          let paidDifference = sessionInsertValue - selectedItemPrice
          
          receipt = {
            dispensed: selectedItem,
            changeCoins: {}, // need to calc
            changeTotal: paidDifference,
            spent: sessionInsertValue,
            errors: []
          }

          console.log('receipt:', receipt)
          
          receipts.push(receipt)
          console.log('receipts:', receipts)

          // decrement the item stock by 1
          inventory[selectedItem].stock = selectedItemStock - 1
          console.log('new item stock:', selectedItemStock)
          
        }
      }
    }
  }

  let result = {
    inventory: inventory, 
    receipts: receipts
  }

  console.log('result:', result)
  return result
}
