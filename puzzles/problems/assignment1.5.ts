/**
 * Assignment 1.5 — Parking Lot Tracker
 *
 * Context:
 * You are tracking vehicles entering and leaving a parking lot throughout the day.
 * Each event is either an entry (vehicle arrives) or an exit (vehicle leaves).
 * Given a log of events, determine which vehicles are still in the lot at the end of the day,
 * and return them sorted by their most recent entry order (earliest first).
 *
 * Input:
 *   - events: Array<{ type: "entry" | "exit"; plateNumber: string; order: number }>
 *     order is a sequential number indicating when the event happened (1, 2, 3...).
 *     Events are not necessarily given in order.
 *
 * Output:
 *   - string[] — plate numbers of vehicles still in the lot, sorted by their most recent entry order (ascending).
 *
 * Rules:
 *   - A vehicle can enter and exit multiple times.
 *   - If a vehicle exits without entering, ignore that exit event.
 *   - If a vehicle enters multiple times without exiting, only the most recent entry counts.
 *   - The same vehicle cannot be in the lot more than once simultaneously.
 *
 * Examples:
 *   vehiclesInLot([
 *     { type: "entry", plateNumber: "ABC123", order: 1 },
 *     { type: "entry", plateNumber: "XYZ789", order: 2 },
 *     { type: "exit", plateNumber: "ABC123", order: 3 }
 *   ]) -> ["XYZ789"]
 *
 *   vehiclesInLot([
 *     { type: "entry", plateNumber: "ABC123", order: 1 },
 *     { type: "exit", plateNumber: "ABC123", order: 2 },
 *     { type: "entry", plateNumber: "ABC123", order: 3 }
 *   ]) -> ["ABC123"]
 */

type Input = Array<ParkingEvent>;

type ParkingEvent = {
  type: EventType;
  plateNumber: string;
  order: number;
};

type EventType = "entry" | "exit";

export function vehiclesInLot(events: Input): string[] {
  const inLot = new Map<string, number>();

  const sortedEvents = events.sort((a, b) => a.order - b.order);

  sortedEvents.forEach((event) => {
    if (event.type === "entry") {
      inLot.set(event.plateNumber, event.order);
    } else {
      inLot.delete(event.plateNumber);
    }
  });

  // convert Map array to [plateNumber, order] pairs and sort by order
  const sortedPlates = events.map((event) => ({
    plateNumber: event.plateNumber,
    order: event.order,
  }));

  return [];
}
