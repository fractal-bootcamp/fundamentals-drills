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

interface Request {
  customerId: string;
  row: number;
  seatsNeeded: number;
}

export function processReservations(
  initialTheater: [],
  requests: Request
): any {
  // if row doesn't exist
  if (requests.row > initialTheater.length) {
    return "Request Denied";
  }

  // for each row in the theater
  for (let row = 0; row < initialTheater.length; row++) {
    // if the row matces
    if (requests.row === row) {
      for (let seat = 0; seat < initialTheater[row][seat]; seat++) {
        // if the seat is blocked or reserved
        if (initialTheater[row][seat] === "B" || "R") {
          // keep going
          continue;
        }
        // if the seat isn't blocked, we know it's next so fill it
        else if (initialTheater[row][seat] === "A") {
          // book it
          initialTheater[row][seat] === "R";
          return initialTheater;
        }
      }
    }
  }
}
