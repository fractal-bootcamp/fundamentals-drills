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

// Defining types
type Seat = "A" | "B" | "R"
type Theater = Seat[][]
type Request = {
  customerId: string;
  row: number;
  seatsNeeded: number;
}
type SuccessfulReservations = {
  customerId: string;
  row: number;
  startSeat: number;
  endSeat: number;
}

// Check if the Theater is full
function theaterIsFull(theater: Theater): boolean {
  return theater.every((row: Seat[]) => {
    return row.every((seat: Seat) => (seat === "R") || (seat === "B"))
  })
}


export function processReservations(
  initialTheater: Theater, requests: Request[]): { successfulReservations: SuccessfulReservations[], finalTheater: Theater } {
  //TODO
  const finalTheater = structuredClone(initialTheater)
  // 1. Check for presence of requests
  if (!requests) {
    return { finalTheater, successfulReservations: requests }
  }
  // 2. Check if there's space in the theater at all
  if (theaterIsFull(initialTheater)) {
    return { finalTheater, successfulReservations: [] }
  }

  // 3. Check for available seats. I could make a map!!
  const theaterMap = initialTheater.map((row: Seat[], index) => {
    return [index, row.map((seat, index) => {
      return [index, seat];
    })]
  })
  const availableSeats = new Map(theaterMap)

  const successfulReservations: SuccessfulReservations[] = []

  // 4. Check requests against row
  // Huh, I need to check if there's consecutive seats available anywhere at all on the row, don't I?
  // so for ["A", "A", "B", "A", "A"] and seatsNeeded = 2
  // Count over the array, and when a "B" or "R" is reached start over until the next "A" is hit
  // Ok now this needs to happen in the requests loop

  requests.forEach(request => {
    const { seatsNeeded } = request
    let reservableSeats: number[][] = []
    // const theaterRow: Seat[] = availableSeats.get(request.row)
    // console.log(theaterRow)
    let consecutiveSeatsAvailable = 0;
    for (let i = 0; i < request.seatsNeeded; i++) {
      const currentSeat = initialTheater[request.row][i]
      if (currentSeat === "A") {
        consecutiveSeatsAvailable++
        reservableSeats.push([request.row, i])

      } else if (currentSeat === "B" || currentSeat === "R") {
        consecutiveSeatsAvailable = 0
        reservableSeats = []
      }
    }

    if (consecutiveSeatsAvailable < requests[0].seatsNeeded) {
      return
    }

    console.log("reservableSeats: ", reservableSeats)
    // 5. Update theater object
    reservableSeats.forEach(seat => {
      finalTheater[seat[0]][seat[1]] = "R"
    })

    console.log("finalTheater: ", finalTheater)

    const reservationSize = reservableSeats.length
    console.log("reservationSize, reservableSeats: ", reservationSize, reservableSeats)

    if (reservationSize == seatsNeeded) {
      successfulReservations.push({
        customerId: request.customerId,
        row: request.row,
        startSeat: reservableSeats[0][1],
        endSeat: reservableSeats[reservationSize - 1][1]
      })
    }

  })

  const result = { finalTheater, successfulReservations }
  return result
}