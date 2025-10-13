/**
 * Movie Theater Seating System
 *
 * You are implementing a movie theater seating system. The theater has rows of seats,
 * and customers can request to reserve seats. You need to process reservation requests
 * and determine the final seating arrangement.
 *
 * The theater is represented as a grid where each seat can be "available", "reserved",
 * or "blocked" (unusable). Customers request seats by specifying their preferred row
 * and the number of consecutive seats they need.
 *
 * Rules:
 * - Seats must be consecutive in the same row
 * - Choose the leftmost available group of seats in the requested row
 * - If the requested row doesn't have enough consecutive seats, deny the request
 * - Blocked seats cannot be reserved and break consecutiveness
 *
 * Input: Theater layout (2D array) and list of reservation requests
 * Theater: "A" = available, "R" = reserved, "B" = blocked
 * Requests: { customerId: string, row: number, seatsNeeded: number }
 *
 * Return: Object with successful reservations and final theater state
 *
 * Example:
 * Initial theater: [["A", "A", "B", "A", "A"], ["A", "A", "A", "A", "A"]]
 * Request: { customerId: "customer1", row: 0, seatsNeeded: 2 }
 * Result: Seats 0-1 in row 0 reserved, seats 3-4 still available
 */

type Request = { customerId: string; row: number; seatsNeeded: number };
type Result = { finalTheater: Row[]; successfulReservations: Reservation[] };
type Reservation = {
  customerId: string;
  row: number;
  startSeat: number;
  endSeat: number;
};
type Seat = "A" | "B" | "R";
type Row = Seat[];
type Theater = Row[];

function findAvailableSeat(row: Seat[], request: Request): number {
  return row.findIndex((_seat, idx) =>
    row.slice(idx, idx + request.seatsNeeded).every((seat) => seat == "A"),
  );
}

export function processReservations(
  initialTheater: Theater,
  requests: Request[],
): Result {
  if (!initialTheater || !requests) {
    return {
      finalTheater: initialTheater,
      successfulReservations: [],
    };
  }

  const theater: Theater = structuredClone(initialTheater);
  const ok: Reservation[] = [];

  for (const { customerId, row, seatsNeeded } of requests) {
    if (seatsNeeded < 0) continue;
    if (row < 0) continue;

    const r = theater[row];
    if (!r) continue;

    const start = r.findIndex((_, i) =>
      r.slice(i, i + seatsNeeded).every((s) => s === "A"),
    );

    if (r.length - start < seatsNeeded) continue;
    if (start === -1) continue;

    r.fill("R", start, start + seatsNeeded);
    ok.push({
      customerId,
      row,
      startSeat: start,
      endSeat: start + seatsNeeded - 1,
    });
  }

  return {
    finalTheater: theater,
    successfulReservations: ok,
  };
}
