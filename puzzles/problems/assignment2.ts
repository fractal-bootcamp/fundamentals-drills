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

type Seat = "A" | "R" | "B";
type Theater = Seat[][];
type ReservationRequest = {
  customerId: string;
  row: number;
  seatsNeeded: number;
};
type SuccessfulReservation = {
  customerId: string;
  row: number;
  startSeat: number;
  endSeat: number;
};

export function processReservations(
  initialTheater: Theater,
  requests: ReservationRequest[]
): any {
  const successfulReservations: SuccessfulReservation[] = [];
  const theater = [...initialTheater];
  console.log(requests[0].row);

  for (let i = 0; i < requests.length; i++) {
    let temp: SuccessfulReservation = {
      customerId: requests[i].customerId,
      row: requests[i].row,
      startSeat: 0,
      endSeat: 0,
    };
    let row = requests[i].row;
    let needSeats = requests[i].seatsNeeded;
    let cannot = false;

    for (let i = 0; i < theater[row].length; i++) {
      if (theater[row][i] == "A" && needSeats > 0) {
        cannot = false;
        for (let n = 0; n < needSeats; n++) {
          if (theater[row][n] != "A") {
            cannot = true;
          }
        }
        if (!cannot) {
          temp.startSeat = i;
          temp.endSeat = i +needSeats-1;
          for (let n = 0; n < needSeats; n++) {
            if (theater[row][n] == "A") {
              theater[row][n] == "R";
              needSeats -= 1;

            }
          }
        }
      }
    }
  }

  return {finalTheater: theater, successfulReservations: successfulReservations};
}
