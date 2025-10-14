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

//Sessions is an Array of Sessions -> each Session is an Array of Actions, each array of Actions contains a max of 4 objects
type Session = {
  Actions: Action[]
}

type Coin = 100 | 50 | 25 | 10 | 5 | 1;


type Action = {
  [type: "insert", value: Coin], [type: "select", value: string], [type: "cancel"], ["noop"]
}

type inventory = {
  [sku: string]: { price: number; stock: number }
}

type receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];

}

type vendorOutput = {
  updatedInventory: inventory
  receipts: receipt[]
}

//helper fn only to handle one action
//only runs for two types of actions
function processActions(singleAction: Action): vendorOutput {
  let dummyVariable: vendorOutput;
  //eventually switch statement


  //do something if insert
  if (actions[i].type == "insert") {
    //coin? add to the session credit:record an error and ignore
    if (Coins.find(actions[i].value)) {
      dummyVariable.receipts.changeTotal = actions[i].value;
    }
    else {
      dummyVariable.receipts.errors.push("incorrect denomination");
    }

  }
  else if (actions[i].type == "select") {
    //fails if: (1) sku is invalid (2) out of stock (3) credit < price
    if (vendingInventory.sku.some(actions[i].value)) {
      vendingInventory.sku(value).stock--; //decrement the stock of the item, after checking if its out of stock or the sku is invalid
    }
    else {

    }
  }
  else if (actions[i].type == "noop") {
    //its noop, so do nothing
  }
  else {
    //shouldn't come here
    console.log("something went wrong");
  }


  return dummyVariable;
}

//global vending machine inventory, will keep getting updated
let vendingInventory: inventory;

//using a global receipt
let finalReceipt: vendorOutput;


export function processVendingSessions(initInventory: inventory, sessions: Sessions[]): vendorOutput {
  //take in inventory + array of sessions

  let output: vendorOutput; //fill in output with information

  //for the sessions, do something, iterate over them 
  for (let i = 0; i < sessions.length; i++) {
    //helper fn? to deal with each session -> each session is an action array, so multiple to process 
    for (let j = 0; j < sessions.Actions.length; i++) {
      if (sessions.Actions[j].type != "cancel" && sessions.Actions[j].type != "noop") {
        output = processActions(sessions.Actions[j]) //sessions.Actions[j] contains an action, process each action and keep updating the inventory and the receipts
      }
      else if (sessions.Actions[j].type == "cancel") { //refund the coins inserted -> set receipt, exit the loop
        break;
      }
    }
  }

  //output inventory + array of receipts
  return {
    output
  }
}
