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
 *     ["cancel"]        a     // abort session & refund inserted coins
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



  let inventory = structuredClone(input.inventory) ;


  if (inventory === null) {
    inventory = {};
  }

  for (const item of Object.values(inventory)) {
    // Normalize price: must be integer cents, non-negative
    if (item.price < 0) {
      item.price = 0;
    } else {
      item.price = Math.floor(item.price);
    }
    // Normalize stock: must be integer count, non-negative
    if ( item.stock < 0) {
      item.stock = 0;
    } else {
      item.stock = Math.floor(item.stock);
    }
  }

  console.log(inventory)

  let receipts = []



  if (input.sessions) {
  
  for (const session of input.sessions) {
    let total = 0
    let errors = []
    let coin_map = {}
    let session_end = false;

    if (session.length === 0) {
      receipts.push({
            dispensed: undefined,
            changeCoins: {},
            changeTotal: 0,
            spent: 0,
            errors: []
          })
    }



    for (const action of session) {
      if (session_end == false) {
      if (action[0] === "insert") {
        //insert : add to total 
        if ([1,5, 10, 25, 50, 100].includes(action[1])) {
          total += action[1]

          if (!coin_map[action[1]]) {
            coin_map[action[1]] = 1;
          } else {
            coin_map[action[1]]++;
          }
        } else {
          errors.push(`unsupported coin: ${action[1]}`)
        }
      } else if (action[0] === "select") {

        if (!inventory[action[1]]) {
          errors.push(`invalid sku: ${action[1]}`)
          // break;

          receipts.push({
            dispensed: undefined,
            changeCoins: {},
            changeTotal: 0,
            spent: 0,
            errors: errors
          })
          break;
        }

        let price = inventory[action[1]].price;
        let stock = inventory[action[1]].stock;

        
        if (total >= price  && stock > 0) {
           //figure out change
           let changeTotal = total - price;

           let changeCoins = {}; //1,5,10,25,50,100

           let remainder = changeTotal;



           ["100", "50", "25", "10", "5", "1"].forEach((change) => {
              // console.log(remainder)
              let changeHundred = Math.floor(remainder / Number(change))
              // console.log(changeHundred)

              if (changeHundred > 0) {
                changeCoins[change] = changeHundred
                 // console.log(changeCoins)
                remainder = remainder - changeHundred * Number(change);
              }

             
           })
           



          //deduct from total
          total -= price;
          //deduct quantity

          // console.log(inventory[action[1]])
          inventory[action[1]].stock--;

          // console.log(inventory[action[1]])

         

          //add to receipt
          receipts.push({
            dispensed: action[1],
            changeCoins: changeCoins,
            changeTotal: changeTotal,
            spent: price,
            errors: errors
          })


          session_end = true
          break;
        } else {

          console.log(total, price, stock)

          
          if (total < price) {
            errors.push(`insufficient credit: have ${total}, need ${price}`)
            
            
          } 

          if (stock == 0) {
            errors.push(`out of stock: ${action[1]}`)
          }
          
         

        receipts.push({
          dispensed: undefined,
          changeCoins: {},
          changeTotal: 0,
          spent: 0,
          errors: errors
        })

        

          
        }




        
      } else if (action[0] === "cancel") {
        receipts.push({
          dispensed: undefined,
          changeCoins: coin_map,
          changeTotal: total,
          spent: 0,
          errors: errors
        })
        session_end = true;
      } else if (action[0] === "noop") {

      } else {
        errors.push(`unknown action: ${action[0]}`)
      }
    }
    }

 


    
  }

}



  

  return {
    inventory: inventory,
    receipts: receipts
  }
}
