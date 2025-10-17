// @ts-nocheck
/**
 * Programming Puzzle — Turnstile Trip Processor
 *
 * Context:
 * You operate a subway system with tap-in (ENTER) and tap-out (EXIT) events for riders.
 * Each rider is identified by a card id string and taps at a named station. Your task
 * is to process a sequence of events, building completed trips, tracking currently
 * "in-system" riders, and rejecting invalid actions deterministically.
 *
 * Input:
 * - events: Array<{ id: string; action: "enter" | "exit"; station: string }>
 *   Invariants on a valid event:
 *     - id is a non-empty string
 *     - action is exactly "enter" or "exit"
 *     - station is a non-empty string
 *   Rules:
 *     1) "enter": allowed only if the rider is not already in-system.
 *     2) "exit": allowed only if the rider is currently in-system; the trip completes from
 *        the entry station to the exit station.
 *     3) Invalid events (missing fields / wrong types) are ignored (not rejected).
 *     4) Rejections are recorded only for rule violations (2) and (1) above, in event order.
 *
 * Output:
 * Return an object:
 * {
 *   // riders still in-system after processing (their entry station)
 *   active: Record<string, { enteredAt: string }>;
 *   // completed trips in the order they finished
 *   completed: Array<{ id: string; from: string; to: string }>;
 *   // rejected events in input order
 *   // "reason" is "not in-system" or "already in-system"
 *   rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
 *   // counts per station for accepted enters/exits only
 *   stats: {
 *     entries: Record<string, number>;
 *     exits: Record<string, number>;
 *   };
 * }
 *
 * Edge cases:
 * - Empty event list → all outputs empty.
 * - Duplicate enter without an exit → second enter is rejected; rider remains at original entry.
 * - Exit without a prior enter → rejected; no state change.
 * - Mixed stations are allowed; station names are case-sensitive strings.
 *
 * Examples:
 * 1) events = [
 *      { id:"a", action:"enter", station:"Alpha" },
 *      { id:"a", action:"exit",  station:"Beta"  }
 *    ]
 *    ⇒ completed: [{ id:"a", from:"Alpha", to:"Beta" }], active:{}, rejected:[]
 *
 * 2) events = [
 *      { id:"x", action:"enter", station:"A" },
 *      { id:"x", action:"enter", station:"B" }, // rejected: already in-system
 *      { id:"y", action:"exit",  station:"A" }  // rejected: not in-system
 *    ]
 *    ⇒ active: { x:{enteredAt:"A"} }
 */

type Record = Array<{ id: string; action: "enter" | "exit"; station: string }>

type Output = {
  active: Record<string, { enteredAt: string }>;
  completed: Array<{ id: string; from: string; to: string }>;
  rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
  stats: {
    entries: Record<string, number>;
    exits: Record<string, number>;
  };
}

export function processTurnstileTrips(events: Event[]) {

  let active = []
  let completed = []
  let rejected = []

  outer: for (let i = 0; i < events.length; i++) {
    const record = events[i]
    const action = events[i].action
    const station = events[i].station
    // ensure entry is valid
    for (field of record) {
      if (field == null) {
        break outer;
      }
    }

    // handle entry
    if (action = "entry") {
      for (let i = 0; i < active.length; i++) {
        if (active[i].record.id == record.id) {
          rejected.push({ ...record, reason: "already in-system" })
          break outer;
        }
      }
      record = { ...records[i], enteredAt: "${station}" }
      active.push(record)
    }
    // handle exit
    if (action = "exit") {
      for (let i = 0; i < active.length; i++) {
        if (active.find(record.id) == false) {
          rejected.push({ ...record, reason: "not in-system" })
          break outer;
        }
      }
      record = { ...records[i], exitedAt: "${station}" }
      completed.push(record)
      active = active.filter((rider) => record.id != record.id[i])
    }
    else break;
  }
  return {} // TODO
}


// riders still in-system after processing (their entry station)
//  *   active: Record<string, { enteredAt: string }>;
//  *   // completed trips in the order they finished
//  *   completed: Array<{ id: string; from: string; to: string }>;
//  *   // rejected events in input order
//  *   // "reason" is "not in-system" or "already in-system"
//  *   rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
//  *   // counts per station for accepted enters/exits only
//  *   stats: {
//  *     entries: Record<string, number>;
//  *     exits: Record<string, number>;
//  *   };
// sketch
// need to track active, completed, and rejected trips by rider id
// loop over array and add record+station to active for every entry, remove record from active and add record+station to
// completed for every subsequent exit. if enter follows enter, add record+reason to rejected. if exit with no preceding entry, 
// add record+reason to rejected. station names are case-sensitive, so use the regex in the check: /^[a-z]+$/
// if any field is null, break. if any field is the wrong type, ignore record(error handling?)

// pseudo
// type Output = {
//     active: Record<string, { enteredAt: string }>;
//     completed: Array<{ id: string; from: string; to: string }>;
//     rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
//     stats: {
//       entries: Record<string, number>;
//       exits: Record<string, number>;
//     };
// 
// active = []
// for (i=0; i < events.length; i++){
//  record = events[i]
//  action = events[i].action
//  station = events[i].station
//  if (action = "entry"){ 
//  for (i = 0; i < active.length; i++){
//    active[i].record.id == record.id? break;
//   }
//    record = {...records[i], enteredAt: "${station}"}
//    active.push(record)
//  }
//  if (action = "exit"){ 
//    record = {...records[i], exitedAt: "${station}"}
//    completed.push(record)
//    active = active.filter((rider)=> record.id != record.id[i])
//  }
//  else break;
// }