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
 * 
 */

export type Action = "enter" | "exit"

export type Event = {
  id: string,
  action: Action,
  station: string
}


export type Completed = {
  id: string,
  from: string,
  to: string
}

export type Rejected = {
  id: string,
  action: string,
  station: string,
  reason: string
}

export type Entries = Record<string, number>

export type Exits = Record<string, number>

export type Stats = {
  entries: Entries,
  exits: Exits
}
export type EnteredAt = string

  // @ts-expect-error
export type Active = Record<Event.id, EnteredAt>

export type Result = {
  active: Active,
  completed: Completed[],
  rejected: Rejected[],
  stats: Stats,
}


export function processTurnstileTrips(events: Event[]) {
  let active = {}
  let completed = []
  let rejected = []
  let stats = {entries: {}, exits: {}}
   let result: Result = {active, completed, rejected, stats}

   for (let i = 0; i < events.length; i++) {
       if (events.length < 0) {
    result = {active: {}, completed: [], rejected: [], stats: {entries: {}, exits: {}}}
   } 

    
    let targetId = events[i].id
  
   let matchingId = events.find(event => event.id === targetId)


   if (targetId === matchingId) {

    // completed.push({id: events[i].id, from: , to: })
   }
   }
   console.log(result)
  return result
}