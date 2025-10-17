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

type Action = "enter" | "exit"

type EntryTrip = {
  enteredAt: string;
}

type ExitTrip = {
  exitedAt: string;
}

type RejectedTrip = {
  id: string;
  action: Action;
  station: string;
  reason: string;
}

type CompletedTrip = {
  id: string;
  from: string;
  to: string;
}

type Event = {
  id: string;
  action: Action;
  station: string;
}

type SubwayRecord = {
  completed: CompletedTrip[];
  active: EntryTrip;
  rejected: RejectedTrip[];
  stats: {
    entries: EntryTrip;
    exits: ExitTrip;
  }
}

function isNotValidString(string) {
  return !string || string.length === 0 || typeof string !== "string"
}

function isValidEvent(event: Event): boolean {
  if (!event) {
    return false
  } else if (isNotValidString(event.id)) {
    return false
  } else if (isNotValidString(event.action)) {
    return false
  } else if (isNotValidString(event.station)) {
    return false
  } else {
    return true
  }
}

function processRejectedTrip(event: Event): RejectedTrip {
  const rejectedTrip: RejectedTrip = {
    id: event.id,
    action: event.action,
    station: event.station,
    reason: event.action === "enter" ? "already in-system" : "not in-system"
  }
  return rejectedTrip
}

function processEntryEvent(subwayRecord, event: Event) {
  if (subwayRecord.active[event.id]) {
    const rejectedTrip: RejectedTrip = processRejectedTrip(event)
    subwayRecord.rejected.push(rejectedTrip)
    return { ...subwayRecord }
  }

  const entryTrip: EntryTrip = { enteredAt: event.station }
  subwayRecord.active[event.id] = entryTrip
  if (subwayRecord.stats.entries[event.station]) {
    subwayRecord.stats.entries[event.station]++
  } else {
    subwayRecord.stats.entries[event.station] = 1
  }
  return { ...subwayRecord }
}

function processExitEvent(subwayRecord, event: Event) {
  if (!subwayRecord.active[event.id]) {
    const rejectedTrip: RejectedTrip = processRejectedTrip(event)
    subwayRecord.rejected.push(rejectedTrip)
    return { ...subwayRecord }
  }
  const activeTrip = subwayRecord.active[event.id]
  const exitTrip: ExitTrip = { exitedAt: event.station }
  if (subwayRecord.stats.exits[event.station]) {
    subwayRecord.stats.exits[event.station]++
  } else {
    subwayRecord.stats.exits[event.station] = 1
  }
  delete subwayRecord.active[event.id]
  const completedTrip: CompletedTrip = {
    id: event.id,
    from: activeTrip.enteredAt,
    to: exitTrip.exitedAt
  }
  subwayRecord.completed.push(completedTrip)
  return { ...subwayRecord }
}

export function processTurnstileTrips(events: Event[]): SubwayRecord {
  const subwayRecord = {
    completed: [],
    active: {},
    rejected: [],
    stats: {
      entries: {}, exits: {}
    }
  }
  if (events.length === 0) return subwayRecord

  for (let i = 0; i < events.length; i++) {
    const event: Event = events[i]
    if (!isValidEvent(event)) continue
    switch (event.action) {
      case "enter":
        const newSubwayRecord = processEntryEvent(subwayRecord, event)
        Object.assign({ subwayRecord, newSubwayRecord })
        break
      case "exit":
        // Ok, how do I factor all this?
        const newExitSubwayRecord = processExitEvent(subwayRecord, event)
        Object.assign({ subwayRecord, newExitSubwayRecord })
        break
    }
  }

  return subwayRecord
}