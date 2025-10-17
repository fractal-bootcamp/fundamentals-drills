
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


type Action = "enter" | "exit";




type Event = {
  id: string;
  action: Action;
  station: string;


}


export function processTurnstileTrips(events: Event[]) {

  let activeRiders: Record<string, { enteredAt: string }> = {}
  let entries: Record<string, number> = {};
  let exits: Record<string, number> = {};
  let rejections: Array<{ id: string; action: Action; station: string; reason: string; }> = [];
  let completedRides: Array<{ id: string; from: string; to: string }> = [];


  if (events.length > 0) {

    for (let event of events) {
      if (event.action != null && event.id != null && event.station != null) {
        if (event.action === "enter") {
          if (!checkIfActive(event.id, activeRiders)) {
            activeRiders = { ...activeRiders, [event.id]: { enteredAt: event.station } }
            if (Object.keys(entries).includes(event.station)) {
              entries = { ...entries, [event.station]: entries[event.station] + 1 }
            } else {
              entries = { ...entries, [event.station]: 1 }


            }





          } else {
            rejections.push({ id: event.id, action: event.action, station: event.station, reason: "already in-system" })


          }

        }

        else if (event.action === "exit") {
          if (checkIfActive(event.id, activeRiders)) {
            completedRides.push({ id: event.id, from: activeRiders[event.id].enteredAt, to: event.station })
            delete activeRiders[event.id]
            if (Object.keys(exits).includes(event.station)) {
              exits = { ...entrexitsies, [event.station]: exits[event.station] + 1 }
            } else {
              exits = { ...exits, [event.station]: 1 }


            }

          } else {
            rejections.push({ id: event.id, action: event.action, station: event.station, reason: "not in-system" })


          }


        }
      }

    }

  }




  return {
    active: activeRiders,
    completed: completedRides,
    rejected: rejections,
    stats: {
      entries: entries,
      exits: exits
    }
  }
}

function checkIfActive(id, activeRiders: Record<string, { enteredAt: string }>) {
  if (Object.keys(activeRiders).includes(id)) {
    return true
  }

  return false


}
