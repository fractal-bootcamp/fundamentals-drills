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

let machineErrors: String[] = []
const possibleInserts = [100, 50, 25, 10, 5, 1]


type Item = {
  price: number;
  stock: number;
}

type Inventory = {
  [key: string]: Item;
}

type Receipt = {
  dispensed?: string;                        // sku if an item was dispensed
  changeCoins: { [denom: number]: number };  // change returned as a greedy breakdown in the allowed denominations
  changeTotal: number;                        // total change (cents)
  spent: number;                              // cents the machine kept this session
  errors: string[];                           // rule violations or unsupported ops
}

function getDenoms(change: number, receipt: Receipt) {
  let remainder = change
  while (remainder > 0) {
    for (let coin of possibleInserts) {
      if (remainder >= coin) {
        let lastRemainder = remainder
        remainder = remainder % coin
        receipt.changeCoins = { ...receipt.changeCoins, [coin]: (lastRemainder - remainder) / coin }

      }

    }


  }


}


function handleInventory(inventory: Inventory) {
  if (inventory) {

    for (const [key, value] of Object.entries(inventory) as [string, Item][]) {
      if (value.price < 0) {
        value.price = 0
      }

      if (value.stock < 0) {
        value.stock = 0
      }

      value.price = Math.trunc(value.price)
      value.stock = Math.trunc(value.stock)





    }
    console.log("MAAAAA", inventory)

    return inventory


  } else {
    return {}
  }



}


export function processVendingSessions(input) {

  let currentInventory: Inventory = {}

  let receipts: Receipt[] = []
  currentInventory = handleInventory(input.inventory)
  console.log("JJJJJJ", currentInventory)


  if (input.sessions) {


    for (let session of input.sessions) {
      let currentBalance = 0
      machineErrors = []





      let receipt: Receipt = {
        dispensed: undefined,
        changeCoins: {},
        changeTotal: 0,
        spent: 0,
        errors: []
      }

      let coinsInputed = {}

      for (let step of session) {
        const action = step[0]
        const item = step[1]

        if (action === "insert" && possibleInserts.includes(item)) {
          if (Object.keys(coinsInputed).includes(item.toString())) {
            coinsInputed = { ...coinsInputed, [item]: 1 + coinsInputed[item] }
          } else {
            coinsInputed = { ...coinsInputed, [item]: 1 }

          }



          currentBalance += item


        } else if (action === "insert" && !possibleInserts.includes(item)) {
          machineErrors.push(`unsupported coin: ${item}`)
          console.log("AAAAAAA", currentInventory)
        }


        else if (action === "select") {
          console.log("AAAAAAA", currentInventory)

          if (item in currentInventory) {
            console.log("CURR BAL", currentBalance, "PRICE", currentInventory[item].price)

            if (currentInventory[item].stock <= 0) {
              machineErrors.push(`out of stock: ${item}`)

            } else if (currentInventory[item].price > currentBalance) {
              console.log("UCHUCHUCH")
              machineErrors.push(`insufficient credit: have ${currentBalance}, need ${currentInventory[item].price}`)
            } else {
              receipt.dispensed = item
              currentInventory[item].stock -= 1
              receipt.spent = currentInventory[item].price
              receipt.changeTotal = currentBalance - currentInventory[item].price

              getDenoms(receipt.changeTotal, receipt)
            }
          } else {
            machineErrors.push(`invalid sku: ${item}`)
          }

          if (receipt.dispensed) {
            break
          }



        } else if (action === "cancel") {
          receipt.dispensed = undefined
          receipt.changeTotal = currentBalance
          receipt.changeCoins = coinsInputed
          receipt.spent = 0



        } else if (action != "noop") {
          machineErrors.push(`unknown action: ${action}`)
        }




      }


      receipt.errors = machineErrors

      receipts.push(receipt)






    }

  }

  return { inventory: currentInventory, receipts: receipts }


}


















