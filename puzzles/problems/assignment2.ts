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



type Action = {
  type: "insert" | "select" | "cancel" | "noop";
  coinInput?: number;
  choice?: string;
};

type Inventory = {
  [sku: string]: {
    price: number;
    stock: number;
  };
};

type coinSet = { [denom: number]: number }



type Session = Action[];

type VendingInput = {
  inventory: Inventory;
  sessions: Session[];
};

type Receipt = {
  dispensed?: string;
  changeCoins: { [denom: number]: number };
  changeTotal: number;
  spent: number;
  errors: string[];
};

type VendingOutput = {
  inventory: Inventory;
  receipts: Receipt[];
};

type Input = {
  inventory: Inventory;
  sessions: Session[];
};

export function processVendingSessions(input: Input) {
  const { inventory, sessions } = input;
  const receipts: Receipt[] = [];

  if(sessions == null ) return;

  for (const session of sessions) {
    console.log(session);
    let receipt: Receipt = {
      dispensed: null,
      spent: 0,
      changeCoins: {},
      changeTotal: 0,
      errors: []
    };
    let currentCredit = 0;


    for (const action of session) {
      if(action[0] == "cancel")
      {
        return;

      }
      if(action[0] == "insert")
      {
        receipt.spent += action[1];
        currentCredit += action[1];
      }

      if(action[0] == "select")
      {
        if(inventory[action[1]].stock == 0 )
        {
          receipt.errors.push("out of stock: " + action[1])
        }
        if(inventory[action[1]].price > currentCredit)
        {
          receipt.errors.push(`insufficient credit: have ${currentCredit}, need ${inventory[action[1]].price}`);
        }
        if(inventory[action[1]].price <= currentCredit)
        {
          inventory[action[1]].stock -= 1;

          let change = currentCredit-inventory[action[1]].price
          currentCredit -= inventory[action[1]].price;

          let coinSet: coinSet;
//[100,50,25,10,5,1]

          while(change != 0)
          {
            if(change >= 100)
            {
                coinSet[100] += 1;
            }
            if(change >= 50)
            {
                coinSet[50] += 1;
            }
            if(change >= 25)
            {
                coinSet[25] += 1;
            }
             if(change >= 10)
            {
                coinSet[10] += 1;
            }
            if(change >= 5)
            {
                coinSet[5] += 1;
            }
            if(change >= 1)
            {
                coinSet[1] += 1;
            }
          }

          receipt.dispensed = action[1]

        }
      } 
    }
    receipts.push(receipt);
  }

  console.log("------INVENTORY--------");
  console.log(inventory);
    console.log("------RECEIPTS--------");
  console.log(receipts);
  return {inventory :inventory, receipts: receipts};
}
