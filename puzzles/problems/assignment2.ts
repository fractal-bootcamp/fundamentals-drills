//
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

type Event = { id: string; action: Action; station: string }
type Action = 'enter' | 'exit'
type Reason = "not in-system" | "already in-system"
type Output = {
  active: Record<string, { enteredAt: string }>;
  completed: Array<{ id: string; from: string; to: string }>;
  rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
  stats: {
    entries: Record<string, number>;
    exits: Record<string, number>;
  }
}
const activeRiders = new Map()


  export function processTurnstileTrips(events: Event[]):Output {
    activeRiders.clear()
    let result:Output = {
      active:{},
      completed:[],
      rejected:[],
      stats:{entries:{},exits:{}}
    }

    for (const event of events){
      result = handleEvent(result, event)
    }
    return result
  }

  function handleEvent(result:Output, event:Event):Output {
    if (!event || !event.action || !event.id || !event.station) return result
    if (event.action == "enter") result = handleEnter(result, event)
    if (event.action == "exit") result = handleExit(result, event)


    return result
  }

  function handleEnter(result:Output, event:Event):Output {
    let rider = event.id

    if (activeRiders.get(rider)) {
      let rejectedRider = {id:rider,action:event.action,station:event.station, reason:"already in-system"}
      result.rejected.push(rejectedRider)  

    } else {
      result.active[rider] = {enteredAt:event.station}
      
      result.stats.entries[event.station]  = (result.stats.entries[event.station] ?? 0) + 1
      activeRiders.set(rider,event.station)
    }

    return result
  }

  function handleExit(result:Output, event:Event):Output {
    let exiter = event.id

    if (activeRiders.get(exiter)) {
      let exitRider = {id:exiter,from:activeRiders.get(exiter), to:event.station}
      result.completed.push(exitRider)

      delete result.active[exiter]

      result.stats.exits[event.station] = (result.stats.exits[event.station] ?? 0) + 1
      activeRiders.delete(exiter)

    } else {
      let rejectedRider = {id:exiter, action:event.action,station:event.station, reason:"not in-system"}
      result.rejected.push(rejectedRider)  
    }

    return result
  }
