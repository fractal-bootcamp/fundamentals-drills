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
type Request = {
  customerId: string,
  row: number,
  seatsNeeded: number
}

type Response = {
  customerId: string,
  row: number,
  startSeat: number
  endSeat: number,
}

type Result = {
  successfulReservations: Array<Response>,
  finalTheater: Array<Array<string>>
}

export function processReservations(initialTheater: Array<Array<string>>, requests: Array<Request>): Result {
  if (initialTheater.length === 0) {
    return {
      successfulReservations: [],
      finalTheater: []
    }
  }

  let theater: Array<Array<string>> = initialTheater
  let reservations: Array<Response> = []
  const rowLength: number = theater[0].length

  for (const request of requests) {
    if (!(0 <= request.row && request.row < rowLength)) continue

    // Find the leftmost available seat, if there is one
    let leftmostSeat = -1
    for (let col = 0; col < rowLength; col++) {
      let enoughSeats = true;
      for (let j = col; j < col + request.seatsNeeded; j++) {
        if (theater[request.row][j] !== "A") enoughSeats = false;
      }
      if (enoughSeats) {
        leftmostSeat = col
        break
      }
    }

    // are the seats available?
    if (leftmostSeat === - 1) continue

    // if seats are available, reserve them!
    for (let col = leftmostSeat; col < leftmostSeat + request.seatsNeeded; col++) 
      theater[request.row][col] = "R"

    // and add the reservation too!
    reservations.push({
      customerId: request.customerId,
      row: request.row,
      startSeat: leftmostSeat,
      endSeat: leftmostSeat + request.seatsNeeded -1,
    })
  }

  return {
    successfulReservations: reservations,
    finalTheater: theater
  }
}