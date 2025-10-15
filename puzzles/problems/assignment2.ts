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


type Inventory = { [sku: string]: { price: number; stock: number } }

type Action =
  ["insert", number] |
  ["select", string] |
  ["cancel"] |
  ["noop"]

type Output =
  {
    inventory: Inventory,
    receipts: Array<Receipt>
  }

type Receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];
}

export function validCoin(coin: number): boolean {
  const validDenominations = [100, 50, 25, 10, 5, 1];
  const isValid = validDenominations.includes(coin);
  return isValid;
}

export function getChangeOf(credit: number, changeCoins: { [denom: number]: number }) {
  //Can you tell i am not a big math guy lmao, don't have time for modular arithmetic
  let workingCredit = credit

  const validDenominations = [100, 50, 25, 10, 5]
  for (const denom of validDenominations) {
    while (workingCredit >= denom) {
      workingCredit -= denom;
      (changeCoins[denom]) ? changeCoins[denom]++ : changeCoins[denom] = 1;
    }
  }
  while (workingCredit > 0) {
    workingCredit -= 1;
    (changeCoins[1]) ? changeCoins[1]++ : changeCoins[1] = 1;
  }

  return (changeCoins)
}

export function processSession(session: Action[], inventory: Inventory): Output {
  const emptyRec: Receipt = {
    dispensed: undefined,
    changeCoins: {},
    changeTotal: 0,
    spent: 0,
    errors: []
  }
  let finalRecs: Receipt[] = []

  //These are here bc they persist between actions but not sessions
  let credit = 0
  let coinPouch: { [denom: number]: number } = {}
  let workingRec = emptyRec
  //deal with all the action types insert, select, cancel, noop
  sessionLoop: for (const action of session) {
    switch (action[0]) {
      case "insert":
        if (validCoin(action[1])) {
          credit += action[1];
          (coinPouch[action[1]]) ? coinPouch[action[1]]++ : coinPouch[action[1]] = 1;
        } else {
          workingRec.errors.push(`unsupported coin: ${action[1]}`)
        }
        break
      case "select":
        if (!Object.keys(inventory).includes(action[1])) {
          workingRec.errors.push(`invalid sku: ${action[1]}`)

        } else if (inventory[action[1]].price > credit) {
          workingRec.errors.push(`insufficient credit: have ${credit}, need ${inventory[action[1]].price}`)

        } else if (inventory[action[1]].stock === 0) {
          workingRec.errors.push(`out of stock: ${action[1]}`)

        } else {
          // actually vend this shit here!
          workingRec.dispensed = action[1];
          credit = credit - inventory[action[1]].price;
          inventory[action[1]].stock -= 1;
          workingRec.spent += inventory[action[1]].price
          workingRec.changeTotal = credit
          workingRec.changeCoins = getChangeOf(credit, workingRec.changeCoins)
          break sessionLoop
        }
        break
      case "cancel":
        workingRec.changeCoins = coinPouch
        workingRec.changeTotal = credit
        break sessionLoop
      case "noop":
        break
      default:
        workingRec.errors.push(`unknown action: ${action[0]}`);
    }
  }

  finalRecs.push(workingRec)

  return { inventory: inventory, receipts: finalRecs }
}

export function removeNegAndFrac(inventory: Inventory): Inventory {
  for (const item in inventory) {
    if (inventory[item].price < 0 || inventory[item].stock < 0) {
      inventory[item].price = 0;
      inventory[item].stock = 0;
    }

    if (inventory[item].price % 1 !== 0 || inventory[item].stock % 1 !== 0) {
      inventory[item].price = Math.trunc(inventory[item].price);
      inventory[item].stock = Math.trunc(inventory[item].stock);
    }
  }
  return inventory

}


export function processVendingSessions(input: { inventory: Inventory, sessions: Array<Action[]> }): Output {
  // deref to get inventory and sessions
  const { inventory, sessions } = input

  // deal with malformed input
  if (sessions == null || inventory == null) {
    return { inventory: {}, receipts: [] }
  }
  // deal with negatives and fractions in the inventory
  let workingInventory = removeNegAndFrac(structuredClone(inventory))

  let finalReceipts: Array<Receipt> = []

  //loop through the sessions in the array (remember inventory stock persists through sessions)
  for (const session of sessions) {
    // deal with each possible action here, remember that the credits reset after each session?
    // we will essentially return an entire output for each session, so lets make this a function!! OR NOT?
    // pass in the working inventory so we can mutate it as necessary

    const finishedSession = processSession(session, workingInventory)
    workingInventory = finishedSession.inventory
    finalReceipts = finalReceipts.concat(finishedSession.receipts)

  }

  return { inventory: workingInventory, receipts: finalReceipts }
}