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

type Event = {
  id: string;
  action: "enter" | "exit";
  station: string
}

type Output = {
  active: Record<string, { enteredAt: string }>;
  // completed trips in the order they finished
  completed: Array<Completed>;
  // rejected events in input order
  // "reason" is "not in-system" or "already in-system"
  rejected: Array<Rejected>;
  // counts per station for accepted enters/exits only
  stats: {
    entries: Record<string, number>;
    exits: Record<string, number>;
  };
}

type Completed = {
  id: string;
  from: string;
  to: string
}

type Rejected = { id: string; action: "enter" | "exit"; station: string; reason: string; }

export function processTurnstileTrips(events: Event[]): Output {
  // const active = new Map<string, Entering>()
  // const completed = new Array<Completed>()
  // const rejected = new Array<Rejected>()
  if (!events || events.length == 0) {
    return {
      active: {},
      completed: [],
      rejected: [],
      stats: { entries: {}, exits: {} }
    }
  }

  const currentTrips = new Map<string, string>() // keep track of id to station! (1440)
  const completedTrips = []
  const rejected = []

  for (let event of events) {
    if (event.action == 'enter') {
      if (currentTrips.has(event.id)) {
        console.log('already insys reject')
        rejected.push({ ...event, reason: "already in-system" })
      } else {
        currentTrips.set(event.id, event.station)
      }
    } else if (event.action == 'exit') {
      if (!currentTrips.has(event.id)) {
        console.log('not in system reject')
        rejected.push({ ...event, reason: "not in-system" })
      } else {
        const completedTrip = {
          id: event.id,
          from: currentTrips.get(event.id),
          to: event.station
        }
        completedTrips.push(completedTrip)
        currentTrips.delete(event.id)
        console.log(completedTrips)
      }
    }
  }

  const active = Array.from(currentTrips.keys).map()
  const output: Output = {
    active: {},
    completed: completedTrips,
    rejected: rejected,
    stats: { entries: {}, exits: {} }
  }

}