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
type Action =
  ["insert", number]     // coin must be one of the allowed denominations [100,50,25,10,5,1]
  | ["select", string]     // attempt to buy sku
  | ["cancel"]             // abort session & refund inserted coins
  | ["noop"]               // does nothing
type Session = Action[]
type Sessions = Session[]
type Input = { inventory: Inventory, sessions: Sessions }
type Receipt = { dispensed?: string, changeCoins: { [denom: number]: number }, changeTotal: number, spent: number, errors: string[] }
type Output = { inventory: Inventory, receipts: Receipt[] }
// receipts: Array<{
// dispensed?: string;                        // sku if an item was dispensed
// changeCoins: { [denom: number]: number };  // change returned as a greedy breakdown in the allowed denominations
// changeTotal: number;                        // total change (cents)
// spent: number;                              // cents the machine kept this session
// errors: string[];                           // rule violations or unsupported ops
type SessionState = {
  credit: number;
  insertedCoins: { [denom: number]: number };
  errors: string[];
  dispensed?: string;
  spent: number;
  changeTotal: number;
  changeCoins: { [denom: number]: number };
  sessionEnded: boolean;
}

const createInitialSessionState = (): SessionState => {
  return {
    credit: 0,
    insertedCoins: {},
    errors: [],
    dispensed: undefined,
    spent: 0,
    changeTotal: 0,
    changeCoins: {},
    sessionEnded: false
  };
}

const denoms = [100, 50, 25, 10, 5, 1];

const getChange = (amount: number): { [denom: number]: number } => {
  const changeCoins = {}
  let currentTotal = amount
  denoms.forEach((denom) => {
    const remainder = currentTotal % denom
    const number = (currentTotal - remainder) / denom
    currentTotal = remainder
    if (number) { changeCoins[denom] = number }
  })
  return changeCoins
}

const processInsert = (
  insertedCoins: { [denom: number]: number },
  credit: number,
  coin: number,
  errors: string[]
): {
  insertedCoins: { [denom: number]: number },
  credit: number, errors: string[]
} => {
  // *   - "insert" adds to the session credit if the coin is in the allowed denominations; otherwise record an error and ignore it.
  // if bullshit coin
  if (!denoms.includes(coin)) {
    return {
      insertedCoins,
      credit,
      errors: [...errors, `unsupported coin: ${coin}`]
    };
  }

  // update insertedCoins
  return {
    insertedCoins: {
      ...insertedCoins,
      [coin]: (insertedCoins[coin] || 0) + 1
    },
    credit: credit + coin,
    errors
  };
}

const processSelect = (
  state: SessionState,
  sku: string,
  inventory: Inventory
): SessionState => {
  // *       * Fails if sku is invalid, out of stock, or credit < price (record an error; session continues).
  // bad sku
  if (!inventory[sku]) {
    return {
      ...state,
      errors: [...state.errors, `invalid sku: ${sku}`]
    };
  }

  const item = inventory[sku];

  // no stock
  if (item.stock < 1) {
    return {
      ...state,
      errors: [...state.errors, `out of stock: ${sku}`]
    };
  }

  // credit < price
  if (state.credit < item.price) {
    return {
      ...state,
      errors: [...state.errors, `insufficient credit: have ${state.credit}, need ${item.price}`]
    };
  }
  //  *       * On success: dispense the item, decrement inventory, keep exactly the price as spent, return change = credit - price
  // *         using greedy breakdown (unlimited coins; no bank constraints), then the session ENDS (ignore further actions).
  // good sale:
  // calc change
  const change = state.credit - item.price;

  // adjust inventory stock
  inventory[sku].stock--;

  // conver change to coins
  const changeCoins = getChange(change)
  return {
    ...state,
    dispensed: sku,
    spent: item.price,
    changeTotal: change,
    changeCoins: changeCoins,
    sessionEnded: true
  };
}

const processCancel = (state: SessionState): SessionState => {
  //  *   - "cancel" refunds exactly the coins the user inserted this session (returned as a breakdown; session ENDS).
  return {
    ...state,
    changeCoins: state.insertedCoins,
    changeTotal: state.credit,
    sessionEnded: true
  };
}

const processOther = (state: SessionState, action: string): SessionState => {
  return {
    ...state,
    errors: [...state.errors, `unknown action: ${action}`]
  };
}

function validateInput(input: Input): Input {
  if (!input || !input.inventory || !input.sessions) {
    return { inventory: {}, sessions: [] };
  }

  const normalizedInventory: Inventory = {};
  for (const [sku, item] of Object.entries(input.inventory)) {
    normalizedInventory[sku] = {
      price: Math.max(0, Math.floor(item.price)),
      stock: Math.max(0, Math.floor(item.stock))
    };
  }

  return {
    inventory: normalizedInventory,
    sessions: input.sessions
  };
}

export const processVendingSessions = (input: Input): Output => {
  const normalisedInput = validateInput(input);

  // clone inventory (shared mutable state across sessions)
  const inventory = structuredClone(normalisedInput.inventory);
  const receipts: Receipt[] = [];

  // process each session
  for (const session of normalisedInput.sessions) {
    // initial state
    // *   - Start each session with credit=0 and an empty "inserted" coin pouch.
    let state = createInitialSessionState();

    // process each action
    for (const action of session) {
      // if an action has ended the session, break the loop
      if (state.sessionEnded) break;

      const actionType = action[0];

      switch (actionType) {
        case "insert": {
          const coin = action[1];
          const result = processInsert(
            state.insertedCoins,
            state.credit,
            coin,
            state.errors
          );
          // insertedCoins, credit, errors
          state = { ...state, ...result };
          break;
        }

        case "select": {
          const sku = action[1];
          state = processSelect(state, sku, inventory);
          break;
        }

        case "cancel": {
          state = processCancel(state);
          break;
        }

        //  *   - If a session ends without "select" success or "cancel", nothing is dispensed or refunded; it's just an idle session end.
        case "noop": {
          break;
        }

        default: {
          state = processOther(state, actionType);
          break;
        }
      }
    }

    // receeipt
    receipts.push({
      dispensed: state.dispensed,
      changeCoins: state.changeCoins,
      changeTotal: state.changeTotal,
      spent: state.spent,
      errors: state.errors
    });
  }

  return { inventory, receipts };
}

// LESSONS
// pure functions: no extenral changes
// use "..." to create new shit, do not update old shit
// types types types
// narrow down functions, and make them follow patterns (identical inputs and outputs)
// state makes the whole thing organised and centralised