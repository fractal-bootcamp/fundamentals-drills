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
  id: string
  action: "enter" | "exit"
  station: string
}

type Output = {
  active: Record<string, { enteredAt: string }>
  completed: Array<{ id: string; from: string; to: string }>
  rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>
  stats: {
    entries: Record<string, number>
    exits: Record<string, number>
  }
}

function handleEnter(output, event) {
  console.log('BFENT', Object.keys(output.active).includes(event.id))
  if (!Object.keys(output.active).includes(event.id)) {
    output.active[event.id] = { enteredAt: event.station }
    output.stats.entries[event.id] ? output.stats.entries[event.id] += 1 : output.stats.entries[event.id]
  } else {
    event.rejected = 'already in-system'
    output.rejected.push(event)
    console.log('AFTENT', output.rejected)
  }
}

function handleExit(output, event) {
  if (Object.keys(output.active).includes(event.id)) {
    output.completed.push({ id: event.id, from: output.active[event.id].enteredAt, to: event.station })
    delete output.active[event.id]
    output.stats.exits[event.id] ? output.stats.exits[event.id] += 1 : output.stats.exits[event.id]
  } else {
    event.rejected = 'not in-system'
    output.rejected.push(event)
    console.log('AFTEXT', output.rejected)
  }
}

export function processTurnstileTrips(events: Event[]): Output {
  let output: Output = {
    active: {},
    completed: [],
    rejected: [],
    stats: {
      entries: {},
      exits: {}
    }
  }

  events.forEach(event => {
    if (event.action === 'enter') {
      handleEnter(output, event)
    } else {
      handleExit(output, event)
    }
  })

  return output
}