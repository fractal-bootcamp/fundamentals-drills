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

type Event = { id: string; action: "enter" | "exit"; station: string };
type Active = Record<string, { enteredAt: string }>;
type Passenger = { id: string; from: string; to: string };
type Stats = {
	entries: Record<string, number>;
	exits: Record<string, number>;
};
type Reject = {
	id: string;
	action: "enter" | "exit";
	station: string;
	reason: string;
};

export function processTurnstileTrips(events: Event[]) {
	let completed: Passenger[] = [];
	let stats: Stats = {
		entries: {},
		exits: {},
	};
	let rejected: Reject[] = [];
	let subway: Active = {};

	for (const event of events) {
		if (!event) continue;
		if (!("action" in event) || !("id" in event) || !("station" in event))
			continue;
		if (event.id.length === 0) continue;
		if (event.station.length === 0) continue;
		if (event.action !== "enter" && event.action !== "exit") continue;

		if (event.action === "enter") {
			if (!(event.id in subway)) {
				//Accepted Entry
				subway[event.id] = { enteredAt: event.station };
				event.station in stats.entries
					? stats.entries[event.station]++
					: (stats.entries[event.station] = 1);
			} else {
				rejected.push({
					id: event.id,
					action: event.action,
					station: event.station,
					reason: "already in-system",
				});
			}
		} else if (event.action === "exit") {
			if (event.id in subway) {
				if (event.station !== subway[event.id].enteredAt) {
					//Accepted Exit
					completed.push({
						id: event.id,
						from: subway[event.id].enteredAt,
						to: event.station,
					});
					delete subway[event.id];
					event.station in stats.exits
						? stats.exits[event.station]++
						: (stats.exits[event.station] = 1);
				} else {
					rejected.push({
						id: event.id,
						action: event.action,
						station: event.station,
						reason: "cannot exit at station entered",
					});
				}
			} else {
				rejected.push({
					id: event.id,
					action: event.action,
					station: event.station,
					reason: "not in-system",
				});
			}
		}
	}
	return { active: subway, completed, rejected, stats }; // TODO
}

const events = [
	{ id: "a", action: "enter", station: "Alpha" },
	{ id: "a", action: "exit", station: "Beta" },
	{ id: "a", action: "exit", station: "Beta" },
	{ id: "a", action: "exit", station: "Beta" },
];

const events1 = [
	{ id: "alice", action: "enter", station: "Downtown" },
	{ id: "bob", action: "enter", station: "Airport" },
	{ id: "charlie", action: "enter", station: "Downtown" },
	{ id: "alice", action: "exit", station: "Mall" },
	{ id: "david", action: "exit", station: "Beach" }, // rejected: not in-system
	{ id: "bob", action: "enter", station: "Mall" }, // rejected: already in-system
	{ id: "bob", action: "exit", station: "Beach" },
	{ id: "eve", action: "enter", station: "University" },
	{ id: "charlie", action: "exit", station: "Airport" },
];

console.log(processTurnstileTrips(events1));
