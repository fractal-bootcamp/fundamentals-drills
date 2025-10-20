// @ts-nocheck
/**
 * Programming Puzzle — Parking Lot Session Tracker
 *
 * Context:
 * You manage a gated parking lot with a limited number of spaces.
 * Cars "enter" and "exit" through a gate; each car is identified by a license plate.
 * Your task is to process a chronological list of events and track:
 *   - cars currently inside,
 *   - completed parking sessions,
 *   - rejected actions (e.g., exiting without entering, entering twice, or entering when full).
 *
 * Input:
 * - capacity: number (maximum simultaneous cars allowed)
 * - events: Array<{ plate: string; action: "enter" | "exit"; gate: string }>
 *
 * Rules:
 * 1) "enter":
 *     - allowed only if the car is NOT already inside AND the lot is not full.
 *     - if rejected, reason is "already inside" or "lot full".
 * 2) "exit":
 *     - allowed only if the car is currently inside.
 *     - if rejected, reason is "not inside".
 * 3) Invalid events (wrong types / missing fields) are ignored (not rejected).
 * 4) Accepted "enter"/"exit" increment stats for their gate.
 *
 * Output:
 * Return an object:
 * {
 *   active: Record<string, { enteredAtGate: string }>;
 *   completed: Array<{ plate: string; enteredAtGate: string; exitedAtGate: string }>;
 *   rejected: Array<{ plate: string; action: "enter" | "exit"; gate: string; reason: string }>;
 *   stats: {
 *     entries: Record<string, number>;
 *     exits: Record<string, number>;
 *   };
 * }
 *
 * Edge cases:
 * - Empty event list → all outputs empty.
 * - Enter → Enter again → second rejected ("already inside").
 * - Exit without prior enter → rejected ("not inside").
 * - Exceed capacity → "lot full" rejection; others unaffected.
 * - Gates are arbitrary strings, case-sensitive.
 *
 * Example:
 * capacity = 2
 * events = [
 *   { plate:"A1", action:"enter", gate:"North" },
 *   { plate:"B2", action:"enter", gate:"South" },
 *   { plate:"C3", action:"enter", gate:"East" },  // rejected: lot full
 *   { plate:"A1", action:"exit",  gate:"North" },
 *   { plate:"B2", action:"exit",  gate:"South" }
 * ]
 * ⇒
 * completed = [
 *   { plate:"A1", enteredAtGate:"North", exitedAtGate:"North" },
 *   { plate:"B2", enteredAtGate:"South", exitedAtGate:"South" }
 * ],
 * rejected = [{ plate:"C3", action:"enter", gate:"East", reason:"lot full" }],
 * active = {},
 * stats.entries = { North:1, South:1 }
 * stats.exits = { North:1, South:1 }
 */

type Event = { plate: string; action: "enter" | "exit"; gate: string };

export function processParkingSessions(capacity: number, events: Event[]) {
	// TODO: Implement me
}
