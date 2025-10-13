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

type Seat = string;
// "R" | "A" | "B";
type Request = { customerId: string; row: number; seatsNeeded: number };
type SuccessfulBooking = {
  customerId: string;
  row: number;
  startSeat: number;
  endSeat: number;
};
type Result = {
  successfulReservations: SuccessfulBooking[];
  finalTheater: Seat[][];
};

export function processReservations(
  initialTheater: Seat[][],
  requests: Request[],
): Result {
  function indexOfAvailableConsecutiveSeats(
    seatCount: number,
    theaterRow: Seat[],
  ): number {
    const findSeats = (value, index, obj) => {
      let seatsAvailable = true;
      for (let i = index; i < index + seatCount; i++) {
        if (obj[i] == "B") {
          seatsAvailable = false;
        }
      }
      return seatsAvailable;
    };
    return theaterRow.findIndex(findSeats);
  }

  function bookSeatsInRow(
    request: Request,
    row: Seat[],
  ): { newRow: Seat[]; startSeat: number } {
    const foundSeatSpace = indexOfAvailableConsecutiveSeats(
      request.seatsNeeded,
      initialTheater[request.row],
    );

    if (foundSeatSpace != -1) {
      return {
        newRow: [
          row.slice(0, request.row),
          "R".repeat(request.seatsNeeded).split(""),
          row.slice(request.row + request.seatsNeeded),
        ].flat(),
        startSeat: foundSeatSpace,
      };
    } else {
      return { newRow: row, startSeat: foundSeatSpace };
    }
  }

  // requests.copyWithin(target, start);
  // requests.splice(start);
  // requests.find()
  // requests.every()
  // requests.slice()
  // theater.fill()
  //
  // Array.from("foo") > ['f' 'o' 'o']
  // Array.from([1,2,3], (x) => x * x) > [2,4,9]

  let acceptedReservations: SuccessfulBooking[] = [];
  let finalTheater = requests.reduce(
    (
      currentTheater: Seat[][],
      curReq: Request,
      curInd: number,
      theArray: Request[],
    ) => {
      let { newRow, startSeat } = bookSeatsInRow(
        curReq,
        currentTheater[curReq.row],
      );

      acceptedReservations.push({
        customerId: curReq.customerId,
        row: curReq.row,
        startSeat,
        endSeat: startSeat + curReq.seatsNeeded - 1,
      });
      let newTheater = [...currentTheater];
      newTheater[curReq.row] = newRow;
      return newTheater;
    },
    initialTheater,
  );

  console.log("MY ATTEMPT", {
    finalTheater: finalTheater,
    successfulReservations: acceptedReservations,
  });

  return {
    finalTheater: finalTheater,
    successfulReservations: acceptedReservations,
  };
}
