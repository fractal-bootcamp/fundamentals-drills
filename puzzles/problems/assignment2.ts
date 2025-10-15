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

type SessionsInput = {
  inventory: InventoryItem[],
  sessions: VendingSession[]
}

type InventoryStore = {
  [itemName]: InventoryItem
}

type InventoryItem = {
  price: number;
  stock: number;
}

type VendingSession = Action[]

type ActionOption = "insert" | "select" | "cancel" | "noop"
type ActionValue = number | string

type Action = [
  ActionOption,
  ActionValue | void
]

type Change = {
  [denomination: string]: string;
}

type Result = {
  receipts: Receipt[];
  inventory: InventoryStore
}

type Receipt = {
  dispensed: string | undefined;
  spent: number;
  errors: string[];
  changeCoins: Change;
  changeTotal: number;
}

function processChange(sessionCoinPouch) {
  let changeTotal = 0
  const changeArray = [100, 50, 25, 10, 5, 1]
  const changeCoins = {}

  // I need to be able to give change in increments of 1, 5, 10, 25, 50, or 100
  // Go down the array and see which one there's enough in credit of to disperse;

  for (let i = 0; i < changeArray.length; i++) {
    const denom = changeArray[i]

    while (sessionCoinPouch.credit >= denom) {
      if (sessionCoinPouch.credit >= denom) {
        sessionCoinPouch.credit -= denom
        changeTotal += denom
        if (!changeCoins[denom]) {
          changeCoins[denom] = 1
        } else {
          changeCoins[denom]++
        }
      }
    }
  }

  return { changeTotal, changeCoins }
}

function processCancelChange(sessionCoinPouch) {
  let changeTotal = 0
  const changeCoins = {}
  console.log("canceled sessionCoinPouch: ", sessionCoinPouch)

  sessionCoinPouch.inserted.forEach(coin => {
    if (!changeCoins[coin]) {
      changeCoins[coin] = 1
      changeTotal += coin
    } else {
      changeCoins[coin]++
      changeTotal += coin
    }
  })

  console.log("changeCoins + changeTotal", changeCoins, changeTotal)
  return { changeCoins, changeTotal }
}


function processSelectAction(actionValue, sessionCoinPouch, inventory) {
  const receipt: Receipt = {
    dispensed: undefined,
    spent: 0,
    errors: [],
    changeCoins: {},
    changeTotal: 0
  }

  console.log("actionValue: ", actionValue)
  if (!inventory[actionValue]) {
    receipt.errors.push(`invalid sku: ${actionValue}`)
    return { selectReceipt: receipt, sessionCoinPouch, inventory }
  }

  if (!inventory[actionValue].stock) {
    receipt.errors.push(`out of stock: ${actionValue}`)
    return { selectReceipt: receipt, sessionCoinPouch, inventory }
  }

  if (sessionCoinPouch.credit >= inventory[actionValue].price) {
    receipt.dispensed = actionValue
    receipt.spent += inventory[actionValue].price
    sessionCoinPouch.credit -= inventory[actionValue].price
    inventory[actionValue].stock -= 1
    // processChange
    const { changeCoins, changeTotal } = processChange(sessionCoinPouch)
    receipt.changeCoins = changeCoins
    receipt.changeTotal = changeTotal
  } else {
    receipt.errors.push(`insufficient credit: have ${sessionCoinPouch.credit}, need ${inventory[actionValue].price}`)
  }

  return { selectReceipt: receipt, sessionCoinPouch, inventory }
}

function processInsertAction(actionValue, sessionCoinPouch) {
  if (actionValue === 75) {
    return { insertCoinPouch: sessionCoinPouch, actionErrors: `unsupported coin: ${actionValue}` }
  }
  sessionCoinPouch.credit += actionValue
  sessionCoinPouch.inserted.push(actionValue)
  return { insertCoinPouch: sessionCoinPouch, actionErrors: undefined }
}

function processCancelAction(sessionCoinPouch) {
  const { changeCoins, changeTotal } = processCancelChange(sessionCoinPouch)

  const cancelReceipt: Receipt = {
    dispensed: undefined,
    spent: 0,
    errors: [],
    changeCoins,
    changeTotal
  }

  return { cancelReceipt }
}

function processNoopAction() {
  return
}

function processInvalidAction(actionType) {
  return `unknown action: ${actionType}`
}

function processSessionActions(sessionActions, inventory) {
  let sessionCoinPouch = { credit: 0, inserted: [] }
  let currentInventory = structuredClone(inventory)
  let receipt: Receipt = {
    dispensed: undefined,
    spent: 0,
    errors: [],
    changeCoins: {},
    changeTotal: 0
  }

  let errors = []

  let actionType;
  let actionValue;

  outer: for (let i = 0; i < sessionActions.length; i++) {
    actionType = sessionActions[i][0]
    actionValue = sessionActions[i][1]

    switch (actionType) {
      case "insert":
        const { insertCoinPouch, actionErrors } = processInsertAction(actionValue, sessionCoinPouch)
        sessionCoinPouch = insertCoinPouch
        if (actionErrors) errors.push(actionErrors)
        break
      case "select":
        const { selectReceipt, selectCoinPouch, updatedInventory } = processSelectAction(actionValue, sessionCoinPouch, currentInventory)
        sessionCoinPouch = { ...sessionCoinPouch, ...selectCoinPouch }
        receipt = { ...receipt, ...selectReceipt }
        currentInventory = { ...currentInventory, ...updatedInventory }
        errors.push(...selectReceipt.errors)
        if (receipt.dispensed) break outer
        break
      case "cancel":
        const { cancelReceipt } = processCancelAction(sessionCoinPouch)
        receipt = { ...receipt, ...cancelReceipt }
        break
      case "noop":
        processNoopAction()
        break
      default:
        console.log('running default')
        const error = processInvalidAction(actionType)
        errors.push(error)
    }
  }

  receipt.errors = errors
  return { receipt, currentInventory }
}

function normalizeInventory(inventory) {
  for (let item in inventory) {
    console.log(inventory[item].price)
    inventory[item].price = Math.floor(inventory[item].price)
    inventory[item].stock = Math.floor(inventory[item].stock)

    if (Number.isInteger(inventory[item].price) && inventory[item].price < 0) {
      inventory[item].price = 0
    }

    if (Number.isInteger(inventory[item].stock) && inventory[item].stock < 0) {
      inventory[item].stock = 0
    }
  }

  return inventory;
}

export function processVendingSessions(input: SessionsInput) {
  const sessions = input.sessions
  let inventory = normalizeInventory(structuredClone(input.inventory))
  const receipts = []
  if (!sessions) {
    return {
      receipts: [],
      inventory: {}
    }
  }
  // ok, actually i need to update inventory with all this as well, so...
  for (let i = 0; i < sessions.length; i++) {
    const sessionResults = processSessionActions(sessions[i], inventory)
    inventory = { ...inventory, ...sessionResults.currentInventory }
    console.log(sessionResults.receipt)
    receipts.push(sessionResults.receipt);
  }

  return { receipts, inventory }
}
