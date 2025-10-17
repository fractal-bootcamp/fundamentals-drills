// @ts-nocheck

import { Stats } from "fs"

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
 * 
 *   // completed trips in the order they finished
 *   completed: Array<{ id: string; from: string; to: string }>;
 * 
 *   // rejected events in input order
 *   // "reason" is "not in-system" or "already in-system"
 *   rejected: Array<{ id: string; action: "enter" | "exit"; station: string; reason: string; }>;
 *   
 * // counts per station for accepted enters/exits only
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
type Event = [{
  id?: Id
  action?: ActionType
  station?: Station
}]

type Id = string
type ActionType = "enter" | "exit" | "null"
type Station = string

type Output = {
  active: Active
  completed: Completed
  rejected: Rejected
  stats: Stats
}

type Active = {
  enteredAt: string
}
type Rejected = [
  event: string
]

type Completed = [{
  id: Id
  from: Station
  to: Station
}]

type Stats = {
  entries: string
  exits: string
}


export function processTurnstileTrips(events: Event[]) {
  // id has to be non-empty
  // action has to be enter | exit
  // station is non-empty
  // missing fields/wrong types are ignored
  // rejection recorded only for exit and enter


  // { id: 123, action: enter, station: grand }
  // { id: 123, action: '', station: grand } -> all outputs []
  // "not in-system" | "already in system" -> rejected in input order
  // { id: 123, action 'enter' station: grand }
  // { id: 123, action 'enter' station: bedford } -> second enter is rejected, 


  // duplicate events array
  const eventsCopy = [...events]

  let output: Rejected = {
    active: {},
    completed: [],
    rejected: [],
    stats: {
      entries: {},
      exits: {}
    }
  }

  eventsCopy.forEach(event => {
    const eventId = event.id
    const action = event.action
    const station = event.station
    // console.log(eventId)
    // console.log(action)
    // console.log(station)
    if (!eventId) {
      return
    }

    if (!action) {
      output = {
        active: {},
        completed: [],
        rejected: [],
        stats: {
          entries: {},
          exits: {}
        }
      }

    }

    if (action === 'enter') {
      output = {
        from: station,
        id: eventId,
        to: ,
      }
    }

    if (action === 'exit') {
      // 
    }

  })

  return output // TODO
}