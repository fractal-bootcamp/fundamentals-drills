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

//track current balance and coins types
//inventory
//track stock
//reciepts

type ActionType = "insert" | "select" | "cancel" | "noop";

type Action = {
	actionType: ActionType;
	coin?: number;
	selection?: string;
};

type Session = Action[];

type Coin = {
	denom: number;
	amount: number;
};

type Balance = Coin[];

type ChangeCoins = {
	[denom: number]: number;
};

type Receipt = {
	dispensed?: string;
	changeCoins?: Coins;
	changeTotal: number;
	spent: number;
	errors: string[];
};

function blankReceipt(): Receipt {
	const blankReceipt = {
		changeCoins: {},
		changeTotal: 0,
		spent: 0,
		errors: [],
	};
	return blankReceipt;
}

type SkuInfo = {
	price: string;
	stock: number;
};

type Inventory = {
	[sku: string]: SkuInfo;
};

type Input = {
	inventory: Inventory;
	sessions: Array<Session>;
};

type Output = {
	inventory: Inventory;
	receipts: Receipt[];
};

//read in input

// process sessions
//    process Action
//        process insert
//            allowed denomination
//            update balance
//        process select
//          check balance
//          update inventory
//          update output receipt
//        process cancel
//          refund balance

//for each action in sessions
//  check action
//  do what is required
//  update inventory and balance

function validDenomination(denomination: number): boolean {
	switch (denomination) {
		case 100:
			return true;
		case 50:
			return true;
		case 25:
			return true;
		case 10:
			return true;
		case 5:
			return true;
		case 1:
			return true;
		default:
			return false;
	}
}

function getChange(total: number): ChangeCoins {
	let change: ChangeCoins = {};
	for (const denom of [100, 50, 25, 10, 5, 1]) {
		if (total === 0) break;
		if (total >= denom) {
			const coinTotal = Math.floor(total / denom);
			change[denom] = coinTotal;
			total = total - coinTotal * denom;
		}
	}
	// console.log(change);
	return change;
}

export function processVendingSessions(input: Input): Output {
	const originalInventory = structuredClone(input.inventory);
	const sessions = input.sessions;
	let output: Output = {
		inventory: originalInventory,
		receipts: [],
	};
	for (const session of sessions) {
		const receipt = blankReceipt();
		// if (session.length === 0) {
		// 	output.receipts.push(receipt);
		// }
		let balance = 0;
		outer: for (const action of session) {
			switch (action[0]) {
				case "insert":
					const denomination = action[1];
					if (validDenomination(denomination)) {
						balance += denomination;
					} else {
						receipt.errors.push(
							`unsupported coin: ${denomination}`
						);
					}
					break;

				case "select":
					const selectedSku = action[1];
					if (!(selectedSku in output.inventory)) {
						receipt.errors.push(`invalid sku: ${selectedSku}`);
					} else if (output.inventory[selectedSku].stock <= 0) {
						receipt.errors.push(`out of stock: ${selectedSku}`);
					} else if (balance < output.inventory[selectedSku].price) {
						receipt.errors.push(
							`insufficient credit: have ${balance}, need ${output.inventory[selectedSku].price}`
						);
					} else {
						output.inventory[selectedSku].stock--;
						receipt.dispensed = selectedSku;
						receipt.spent = output.inventory[selectedSku].price;
						receipt.changeTotal = balance - receipt.spent;
						receipt.changeCoins = getChange(receipt.changeTotal);

						break outer;
					}
					break;

				case "cancel":
					receipt.changeTotal = balance - receipt.spent;
					receipt.changeCoins = getChange(receipt.changeTotal);
					output.receipts.push(receipt);
					break outer;

				case "noop":
					break;

				default:
					receipt.errors.push(`unknown action: ${action[0]}`);
			}
			output.receipts.push(receipt);
		}
	}

	return output;
}

const inv = { A: { price: 125, stock: 1 } };
const sess = [
	[
		["insert", 100],
		["insert", 25],
		["insert", 100],
		["cancel"],
		["select", "A"],
		["insert", 50],
	],
];

// const vended = processVendingSessions({ inventory: inv, sessions: sess });
// console.log(vended);
// console.log(vended.receipts[0].changeCoins);
// console.log(vended.receipts[0].errors);
