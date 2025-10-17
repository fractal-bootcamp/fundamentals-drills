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

type Active = Record<string, { enteredAt: string }>;

type Completed = {
  id: string
  from: string
  to: string
}

type Rejected = { //reason: "not in-system" or "already in-system"
  id: string
  action: "enter" | "exit";
  reason: string
}

type EnterExitStat = Record<string, number>;

type riderOutput = {
  active: Active
  completed: Completed[]
  rejected: Rejected[]
  stats: {
    entries: EnterExitStat
    exits: EnterExitStat
  }
}


//determine if a rider is active
function checkIfRiderActive(activeRides: Active, rider: string): boolean {
  if (activeRides[rider]) {
    return true;
  }
  else {
    return false;
  }
}




export function processTurnstileTrips(events: Event[]): riderOutput {

  let activeRides: Active = {}
  let rejectedRides: Rejected[] = []
  let completedRides: Completed[] = []
  let tempReject: Rejected = {} //temp rejected object
  let tempCompleted: Completed = {}
  let entryStats: EnterExitStat = {}
  let exitStats: EnterExitStat = {}


  let output: riderOutput = {
    activeRides,
    completedRides, rejectedRides,
    stats: { entryStats, exitStats }
  }



  for (let e of events) {
    console.log("current action:", e.action)
    if (e.action == "enter") { //if its enter, check if the rider is in the system
      if (!checkIfRiderActive(activeRides, e.id)) {
        //TODO: check if station is a non-empty string
        activeRides[e.id] = e.station //add active rider station to active property
        entryStats[e.id] += 1;

      }
      else {
        tempReject.id = e.id;
        tempReject.action = e.action;
        tempReject.reason = "not in system"
        rejectedRides.push(tempReject); //push the rejected object into rejected array

      }
      //if the rider isnt in the system, add entry into rejected array
    }
    else if (e.action == "exit") {
      //helper fn to determine if the rider is an active rider
      if (checkIfRiderActive(activeRides, e.id)) {

        // update completedRides
        tempCompleted.id = e.id;
        tempCompleted.from = activeRides[e.id] //starting location
        tempCompleted.to = e.station; //ending location
        completedRides.push(tempCompleted)
        //TODO update exitStats
        exitStats[e.id] += 1;
        //TODO remove from activeRides
        delete activeRides[e.id]
      }

    }
    else {
      console.log("invalid event, do nothing")
    }
  }

  console.log(output)



  return output // TODO
}