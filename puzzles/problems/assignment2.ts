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

/*

problem intuition:

riders are going in and out of a subway turnstile

*/



type Event = {
  id: string
  action: 'enter' | 'exit'
  station: string
}
type Active = {}
type Completed = Event[]
type Stats = {
  entries: {}
  exits: {}
}

type Result = {
}

export function processTurnstileTrips(events: Event[]) {


  let result = []
  let active = {}
  let completed = []
  let rejected = []
  let entries = {}
  let exits = {}
  
  // if no events return result
  if (events.length === 0) {
    result = {
      active: active,
      completed: completed,
      rejected: rejected,
      stats: {
        entries: entries,
        exits: exits
      }
    }
  }


  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    const { id, action, station } = event
    console.log('Event processing:', event)

    // if missing required entry field, skip
    if (!id || !action || station) {
      console.log('Invalid entry, missing entry field')
      // skip to the next event if undefined!
    }
    
    // if action is enter, then add to entries
    if (action === "enter") {
      // push the station to the entries object
      // if the property exists, add it
      const stationEntryExists = Object.hasOwn(entries, station)
      console.log('station entry exists:', stationEntryExists);
      
      // station doesn't exist add it + 1 entry
      if (!stationEntryExists) {
        console.log('adding station to entries')
        const addEntryValue = 1
        entries[station] = addEntryValue
        console.log('new entry object: ', entries)
      
      }

      // check if there is an active entry in the active object
      const activEntryExists = Object.hasOwn(active, id)
      console.log('active entry exists:', activEntryExists);
      
      // if active entry doesn't exist, then add it to the active object
      if (!activEntryExists) {
        active[id] = { enteredAt: station}
        console.log('new active object:', active)
      } else {
        let rejectObject = {
          id: id, 
          action: action, 
          station: station, 
          reason: "already in-system"
        }

        rejected.push(rejectObject)
      }

      
    }

    // if action is enter, then add to entries
    if (action === "exit") {
      // push the station to the entries object
      // if the property exists, add it
      const stationExitExists = Object.hasOwn(exits, station)
      console.log('station exit exists:', stationExitExists);
      
      // station doesn't exist add it + 1 entry
      if (!stationExitExists) {
        console.log('adding station to entries')
        const addExitValue = 1
        exits[station] = addExitValue
        console.log('new exit object: ', exits)
      }
      
      // if there is an active id, remove it from the active object
      const activEntryExists = Object.hasOwn(active, id)
      console.log('active entry found for exit event:', activEntryExists)
      

      if (activEntryExists) {
        const fromStation = active[id].enteredAt
        console.log('from station:', fromStation)
        const toStation = station
        delete active[id]
        console.log('new active object after an exit', active)

        let completedTrip = {
          id: id, 
          from: fromStation, 
          to: toStation
        }
        completed.push(completedTrip)
      } else {
        let rejectObject = {
          id: id, 
          action: action, 
          station: station, 
          reason: "not in-system"
        }
        rejected.push(rejectObject)
      }
    }

    result = {
      active: active, 
      completed: completed,
      rejected: rejected,
      stats: {
        entries: entries,
        exits: exits
      }
    }

    console.log('final result:', result)
  }

  return result
}