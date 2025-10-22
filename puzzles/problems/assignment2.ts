/**
 * Single SKU — Stock Tracker Lite
 * - You start with "stock" units on hand.
 * - Each event is either {type:'order', qty} or {type:'restock', qty}.
 * - Orders first consume on-hand stock; any shortfall increases "backordered".
 * - Restocks increase on-hand stock; they do NOT auto-fulfill "backordered" here.
 * 
 * Input:
 *   stock: number (>= 0)
 *   events: Array<{type:'order'|'restock', qty:number}> (qty >= 1)
 * Output:
 *   { finalStock: number, totalBackordered: number }
 * 
 * Example:
 *   stock=2, events=[{type:'order',qty:5},{type:'restock',qty:3}]
 *   -> finalStock=0 (2-5 -> 0; then +3 -> 3), totalBackordered=3
 *      Explanation: the order was short by 3 at the moment it happened.
 */

type OneEvent = { type: 'order' | 'restock', qty: number }
type OneResult = { finalStock: number, totalBackordered: number }

export function trackSingleSKU(stock: number, events: OneEvent[]): OneResult {
  let onHand = stock
  let backordered = 0

  events.forEach(event => {
    if (event.type === "order") {
      if (onHand - event.qty < 0) {
        const short = event.qty - onHand
        onHand = 0
        backordered += short
      } else {
        onHand = onHand - event.qty
      }
    }

    if (event.type === "restock") {
      onHand += event.qty
    }
  })

  return { finalStock: onHand, totalBackordered: backordered }
}

console.log(trackSingleSKU(2, [{ type: 'order', qty: 5 }, { type: 'restock', qty: 3 }]))

console.log(trackSingleSKU(0, [{ type: 'order', qty: 1 }, { type: 'order', qty: 2 }]))

console.log(trackSingleSKU(5, [{ type: 'order', qty: 2 }, { type: 'order', qty: 2 }]))

// // Quick checks
// console.assert(
//   JSON.stringify(trackSingleSKU(2, [{ type: 'order', qty: 5 }, { type: 'restock', qty: 3 }])) ===
//   JSON.stringify({ finalStock: 3, totalBackordered: 3 }),
//   'A1'
// )
// console.assert(
//   JSON.stringify(trackSingleSKU(0, [{ type: 'order', qty: 1 }, { type: 'order', qty: 2 }])) ===
//   JSON.stringify({ finalStock: 0, totalBackordered: 3 }),
//   'A2'
// )
// console.assert(
//   JSON.stringify(trackSingleSKU(5, [{ type: 'order', qty: 2 }, { type: 'order', qty: 2 }])) ===
//   JSON.stringify({ finalStock: 1, totalBackordered: 0 }),
//   'A3'
// )

